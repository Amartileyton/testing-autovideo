#!/usr/bin/env node
/**
 * scripts/elevenlabs-sync.mjs
 * Motor Exclusivo ElevenLabs y Sincronización Audio-First para Remotion.
 *
 * Flujo:
 * 1. Lee .env (ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID) y src/data/scenes.json.
 * 2. Mapea presets (narrator, expert, dramatic, conversational, calm) a voice_settings.
 * 3. Llama a POST https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128
 *    con Request Stitching (previous_text, next_text y previous_request_ids).
 * 4. Decodifica audio_base64 en public/audio/${scene.id}.mp3.
 * 5. Convierte alignment (characters, character_start_times_seconds, character_end_times_seconds)
 *    en wordTimestamps: [{ word, startMs, endMs, startFrame, endFrame }].
 * 6. Ejecuta ffprobe sobre cada MP3 para medir actualDuration y audita ritmo (2.0-4.5 palabras/s)
 *    y silencios (leadingSilence > 200ms, trailingSilence > 500ms), recortando o ajustando trimOffsetMs.
 * 7. Escribe el manifiesto maestro public/audio/info.json.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(ROOT_DIR, '.env') });

const SCENES_PATH = path.join(ROOT_DIR, 'src', 'data', 'scenes.json');
const AUDIO_DIR = path.join(ROOT_DIR, 'public', 'audio');
const INFO_JSON_PATH = path.join(AUDIO_DIR, 'info.json');

/**
 * Mapa oficial de Presets de Carácter -> voice_settings de ElevenLabs
 */
export const CHARACTER_PRESETS = {
  narrator: {
    stability: 0.58,
    similarity_boost: 0.78,
    style: 0.22,
    use_speaker_boost: true,
  },
  expert: {
    stability: 0.65,
    similarity_boost: 0.82,
    style: 0.15,
    use_speaker_boost: true,
  },
  dramatic: {
    stability: 0.38,
    similarity_boost: 0.85,
    style: 0.62,
    use_speaker_boost: true,
  },
  conversational: {
    stability: 0.48,
    similarity_boost: 0.75,
    style: 0.35,
    use_speaker_boost: true,
  },
  calm: {
    stability: 0.78,
    similarity_boost: 0.72,
    style: 0.08,
    use_speaker_boost: true,
  },
};

/**
 * Convierte el objeto alignment por carácter de ElevenLabs en wordTimestamps palabra por palabra.
 */
export function buildWordTimestamps(alignment, fps, trimOffsetMs = 0) {
  if (
    !alignment ||
    !Array.isArray(alignment.characters) ||
    !Array.isArray(alignment.character_start_times_seconds) ||
    !Array.isArray(alignment.character_end_times_seconds)
  ) {
    return {
      wordTimestamps: [],
      leadingSilenceMs: 0,
      lastCharEndSec: 0,
    };
  }

  const chars = alignment.characters;
  const starts = alignment.character_start_times_seconds;
  const ends = alignment.character_end_times_seconds;

  const words = [];
  let currentWord = '';
  let wordStartSec = null;
  let wordEndSec = null;
  let firstNonSpaceStartSec = null;
  let lastNonSpaceEndSec = 0;

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const s = Number(starts[i] ?? 0);
    const e = Number(ends[i] ?? s);

    if (/\s/.test(ch)) {
      if (currentWord.length > 0 && wordStartSec !== null && wordEndSec !== null) {
        const startMs = Math.max(0, Math.round(wordStartSec * 1000 - trimOffsetMs));
        const endMs = Math.max(startMs + 20, Math.round(wordEndSec * 1000 - trimOffsetMs));
        words.push({
          word: currentWord,
          startMs,
          endMs,
          startFrame: Math.floor((startMs / 1000) * fps),
          endFrame: Math.ceil((endMs / 1000) * fps),
        });
        currentWord = '';
        wordStartSec = null;
        wordEndSec = null;
      }
    } else {
      if (firstNonSpaceStartSec === null) {
        firstNonSpaceStartSec = s;
      }
      if (wordStartSec === null) {
        wordStartSec = s;
      }
      currentWord += ch;
      wordEndSec = e;
      lastNonSpaceEndSec = e;
    }
  }

  if (currentWord.length > 0 && wordStartSec !== null && wordEndSec !== null) {
    const startMs = Math.max(0, Math.round(wordStartSec * 1000 - trimOffsetMs));
    const endMs = Math.max(startMs + 20, Math.round(wordEndSec * 1000 - trimOffsetMs));
    words.push({
      word: currentWord,
      startMs,
      endMs,
      startFrame: Math.floor((startMs / 1000) * fps),
      endFrame: Math.ceil((endMs / 1000) * fps),
    });
  }

  const leadingSilenceMs =
    firstNonSpaceStartSec !== null ? Math.round(firstNonSpaceStartSec * 1000) : 0;

  return {
    wordTimestamps: words,
    leadingSilenceMs,
    lastCharEndSec: lastNonSpaceEndSec,
  };
}

/**
 * Mide la duración exacta del archivo MP3 mediante ffprobe (con fallback a estimación CBR 128kbps o alignment).
 */
function probeAudioDurationSeconds(mp3Path, fallbackSeconds) {
  try {
    const stdout = execFileSync(
      'ffprobe',
      [
        '-v',
        'error',
        '-show_entries',
        'format=duration',
        '-of',
        'default=noprint_wrappers=1:nokey=1',
        mp3Path,
      ],
      { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }
    ).trim();
    const parsed = parseFloat(stdout);
    if (!Number.isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  } catch {
    // Fallback si ffprobe no está en PATH: cálculo por bitrate (128kbps = 16000 bytes/s) o alignment
    try {
      const stats = fs.statSync(mp3Path);
      if (stats.size > 0) {
        return Number((stats.size / 16000).toFixed(3));
      }
    } catch {
      // ignore
    }
  }
  return fallbackSeconds;
}

/**
 * Recorta silencios excesivos en el MP3 con ffmpeg si está disponible, o devuelve el trimOffsetMs.
 */
function trimSilenceIfPossible(mp3Path, leadingTrimSec, maxEndSec) {
  const tempOut = `${mp3Path}.trimmed.mp3`;
  try {
    const args = ['-y', '-i', mp3Path];
    if (leadingTrimSec > 0) {
      args.push('-ss', leadingTrimSec.toFixed(3));
    }
    if (maxEndSec > 0) {
      args.push('-to', maxEndSec.toFixed(3));
    }
    args.push('-c', 'copy', tempOut);
    execFileSync('ffmpeg', args, { stdio: 'ignore' });
    fs.renameSync(tempOut, mp3Path);
    return true;
  } catch {
    if (fs.existsSync(tempOut)) {
      fs.unlinkSync(tempOut);
    }
    return false;
  }
}

async function synthesizeSceneWithTimestamps({
  apiKey,
  voiceId,
  modelId,
  scene,
  previousText,
  nextText,
  previousRequestIds,
}) {
  const voiceSettings =
    CHARACTER_PRESETS[scene.characterPreset] || CHARACTER_PRESETS.narrator;

  const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(
    voiceId
  )}/with-timestamps?output_format=mp3_44100_128`;

  const body = {
    text: scene.text,
    model_id: modelId,
    voice_settings: voiceSettings,
    previous_text: previousText || undefined,
    next_text: nextText || undefined,
    previous_request_ids:
      previousRequestIds.length > 0 ? previousRequestIds.slice(-3) : undefined,
    apply_text_normalization: 'on',
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `ElevenLabs API error (${response.status}) en escena "${scene.id}": ${errorText}`
    );
  }

  const requestId =
    response.headers.get('request-id') ||
    response.headers.get('x-request-id') ||
    null;
  const payload = await response.json();

  return { payload, requestId };
}

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb';
  const modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';

  if (!fs.existsSync(SCENES_PATH)) {
    throw new Error(`No se encontró el archivo de escenas en: ${SCENES_PATH}`);
  }

  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  const scenesData = JSON.parse(fs.readFileSync(SCENES_PATH, 'utf-8'));
  const fps = Number(scenesData.fps || 30);
  const crossDissolveFrames = Number(scenesData.crossDissolveFrames || 10);
  const scenes = scenesData.scenes || [];

  if (!apiKey || apiKey === 'tu_api_key_aqui') {
    console.error(
      '⚠️ [elevenlabs-sync] ELEVENLABS_API_KEY no configurada o usa el valor de ejemplo en .env.'
    );
    console.error(
      '   Copia .env.example a .env e introduce tu API Key real de ElevenLabs antes de disparar la producción.'
    );
    process.exit(1);
  }

  const previousRequestIds = [];
  const manifestScenes = [];

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const previousText = i > 0 ? scenes[i - 1].text : null;
    const nextText = i < scenes.length - 1 ? scenes[i + 1].text : null;

    console.log(
      `🎙️ [${i + 1}/${scenes.length}] Sintetizando "${scene.id}" (preset: ${scene.characterPreset})...`
    );

    const { payload, requestId } = await synthesizeSceneWithTimestamps({
      apiKey,
      voiceId,
      modelId,
      scene,
      previousText,
      nextText,
      previousRequestIds,
    });

    if (requestId) {
      previousRequestIds.push(requestId);
    }

    const mp3Filename = `${scene.id}.mp3`;
    const mp3Path = path.join(AUDIO_DIR, mp3Filename);
    const audioBuffer = Buffer.from(payload.audio_base64, 'base64');
    fs.writeFileSync(mp3Path, audioBuffer);

    const alignmentSource = payload.alignment || payload.normalized_alignment;
    const initialPass = buildWordTimestamps(alignmentSource, fps, 0);

    let actualDuration = probeAudioDurationSeconds(
      mp3Path,
      initialPass.lastCharEndSec + 0.15
    );
    const leadingSilenceMs = initialPass.leadingSilenceMs;
    const trailingSilenceMs = Math.max(
      0,
      Math.round((actualDuration - initialPass.lastCharEndSec) * 1000)
    );

    const warnings = [];
    let trimOffsetMs = 0;

    if (leadingSilenceMs > 200 || trailingSilenceMs > 500) {
      const leadTrimSec = leadingSilenceMs > 200 ? (leadingSilenceMs - 80) / 1000 : 0;
      const maxEndSec =
        trailingSilenceMs > 500
          ? initialPass.lastCharEndSec + 0.25
          : actualDuration;

      warnings.push(
        `Silencio fuera de umbral (leading=${leadingSilenceMs}ms, trailing=${trailingSilenceMs}ms). Aplicando ajuste de offset/recorte.`
      );

      const trimmedByFfmpeg = trimSilenceIfPossible(
        mp3Path,
        leadTrimSec,
        maxEndSec
      );
      trimOffsetMs = Math.round(leadTrimSec * 1000);

      if (trimmedByFfmpeg) {
        actualDuration = probeAudioDurationSeconds(
          mp3Path,
          Math.max(0.5, maxEndSec - leadTrimSec)
        );
      } else {
        actualDuration = Math.max(
          0.5,
          Number((maxEndSec - leadTrimSec).toFixed(3))
        );
      }
    }

    const { wordTimestamps } = buildWordTimestamps(
      alignmentSource,
      fps,
      trimOffsetMs
    );

    const wordCount = wordTimestamps.length;
    const wordsPerSecond =
      actualDuration > 0 ? Number((wordCount / actualDuration).toFixed(2)) : 0;

    if (wordsPerSecond < 2.0 || wordsPerSecond > 4.5) {
      const rateWarning = `⚠️ Ritmo de habla en "${scene.id}": ${wordsPerSecond} palabras/s (fuera del rango óptimo 2.0 - 4.5 palabras/s).`;
      console.warn(rateWarning);
      warnings.push(rateWarning);
    }

    const durationInFrames =
      Math.ceil(actualDuration * fps) + crossDissolveFrames;

    manifestScenes.push({
      id: scene.id,
      audioFile: `audio/${mp3Filename}`,
      characterPreset: scene.characterPreset,
      actualDuration: Number(actualDuration.toFixed(3)),
      durationInFrames,
      wordsPerSecond,
      leadingSilenceMs,
      trailingSilenceMs,
      trimOffsetMs,
      warnings,
      wordTimestamps,
    });
  }

  const sumSceneFrames = manifestScenes.reduce(
    (acc, s) => acc + s.durationInFrames,
    0
  );
  const totalOverlapFrames =
    Math.max(0, manifestScenes.length - 1) * crossDissolveFrames;
  const totalDurationInFrames = Math.max(
    30,
    sumSceneFrames - totalOverlapFrames
  );
  const totalDurationSeconds = Number((totalDurationInFrames / fps).toFixed(3));

  const manifest = {
    generatedAt: new Date().toISOString(),
    fps,
    crossDissolveFrames,
    totalDurationInFrames,
    totalDurationSeconds,
    backgroundMusicFile: fs.existsSync(path.join(AUDIO_DIR, 'bgm.mp3'))
      ? 'audio/bgm.mp3'
      : null,
    scenes: manifestScenes,
  };

  fs.writeFileSync(INFO_JSON_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(
    `✅ [elevenlabs-sync] Manifiesto escrito en public/audio/info.json (${totalDurationInFrames} frames / ${totalDurationSeconds}s).`
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main().catch((err) => {
    console.error('❌ Error en elevenlabs-sync:', err.message);
    process.exit(1);
  });
}
