#!/usr/bin/env node
/**
 * scripts/video-reverse.mjs
 * Motor de Ingeniería Inversa Visual de Vídeo (Dunctk / Ralph Loop Architecture).
 *
 * Capacidades:
 * 1. Detección determinista de cortes de escena mediante FFmpeg (`select='gt(scene,0.25)'`).
 * 2. Extracción de fotogramas clave y pista de audio aislada.
 * 3. Análisis multimodal de movimiento y retención con Google Gemini (@google/genai).
 * 4. Mapeo estricto a las primitivas vectoriales del repositorio:
 *    (VectorSelectionBox, ExplodedLayerStack, LiveTelemetryGraph, KenBurnsContainer, threePropertyEntrance).
 * 5. Generación de `src/data/scenes.reverse.json` 100% compatible con `elevenlabs-sync.mjs`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import ffmpegStatic from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(ROOT_DIR, '.env') });

const FFMPEG_BIN = process.env.FFMPEG_PATH || ffmpegStatic;
const FFPROBE_BIN = process.env.FFPROBE_PATH || ffprobeStatic.path;

const BLUEPRINT_MODES = [
  'DARK_CAD_XRAY',
  'BLUEPRINT_BLUE',
  'TOPOLOGY_WIREFRAME',
  'CHRONO_OSCILLOSCOPE',
  'EDITORIAL_PAPER',
];

const REVERSE_OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'assets', 'reverse');
const SCENES_REVERSE_PATH = path.join(ROOT_DIR, 'src', 'data', 'scenes.reverse.json');

/**
 * Obtiene duración, fps y resolución de un MP4 usando ffprobe
 */
export function probeVideo(videoPath) {
  if (!fs.existsSync(videoPath)) {
    throw new Error(`El archivo de vídeo no existe: ${videoPath}`);
  }

  const args = [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height,r_frame_rate,duration:format=duration',
    '-of', 'json',
    videoPath,
  ];

  const raw = execFileSync(FFPROBE_BIN, args, { encoding: 'utf-8' });
  const data = JSON.parse(raw);
  const stream = data.streams?.[0] || {};
  const format = data.format || {};

  let fps = 30;
  if (stream.r_frame_rate) {
    const [num, den] = stream.r_frame_rate.split('/').map(Number);
    if (den && den > 0) fps = Math.round(num / den);
  }

  const durationSec = parseFloat(stream.duration || format.duration || '0');

  return {
    width: stream.width || 1080,
    height: stream.height || 1920,
    fps: fps || 30,
    durationSec: durationSec || 60,
    aspectRatio: (stream.width && stream.height) ? `${stream.width}:${stream.height}` : '9:16',
  };
}

/**
 * Detecta cortes de escena utilizando el filtro `scene` de FFmpeg
 */
export function detectSceneCuts(videoPath, threshold = 0.25) {
  const args = [
    '-i', videoPath,
    '-filter:v', `select='gt(scene,${threshold})',showinfo`,
    '-f', 'null',
    '-',
  ];

  const result = spawnSync(FFMPEG_BIN, args, { encoding: 'utf-8' });
  const output = (result.stderr || '') + (result.stdout || '');

  const ptsRegex = /pts_time:([0-9.]+)/g;
  const cuts = [0.0];
  let match;

  while ((match = ptsRegex.exec(output)) !== null) {
    const time = parseFloat(match[1]);
    if (time - cuts[cuts.length - 1] > 2.0) { // Mínimo 2 segundos por escena
      cuts.push(time);
    }
  }

  return cuts;
}

/**
 * Extrae fotogramas clave y pista de audio en un directorio temporal de inspección
 */
export function extractStillsAndAudio(videoPath, timestamps, outDir) {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const extractedFrames = [];

  timestamps.forEach((timeSec, idx) => {
    const frameName = `scene_${idx + 1}_at_${Math.round(timeSec)}s.jpg`;
    const framePath = path.join(outDir, frameName);

    const args = [
      '-ss', timeSec.toString(),
      '-i', videoPath,
      '-vframes', '1',
      '-q:v', '2',
      '-y',
      framePath,
    ];

    execFileSync(FFMPEG_BIN, args, { stdio: 'ignore' });
    if (fs.existsSync(framePath)) {
      extractedFrames.push({
        index: idx + 1,
        timeSec,
        path: framePath,
        fileName: frameName,
      });
    }
  });

  // Extraer pista de audio completa
  const audioPath = path.join(outDir, 'reference_audio.mp3');
  const audioArgs = [
    '-i', videoPath,
    '-vn',
    '-acodec', 'libmp3lame',
    '-q:a', '2',
    '-y',
    audioPath,
  ];
  execFileSync(FFMPEG_BIN, audioArgs, { stdio: 'ignore' });

  return {
    frames: extractedFrames,
    audioPath: fs.existsSync(audioPath) ? audioPath : null,
  };
}

/**
 * Mapea descripciones libres a las primitivas reales de ResultaaqueeBlueprints y Motion
 */
export function mapToEcosystemPrimitive(sceneDesc) {
  const text = (sceneDesc || '').toLowerCase();

  if (text.includes('libro') || text.includes('portada') || text.includes('cover')) {
    return 'Book3DStage';
  }
  if (text.includes('papel') || text.includes('subray') || text.includes('cita') || text.includes('extracto')) {
    return 'EditorialExcerptHighlighter';
  }
  if (text.includes('onda') || text.includes('gráfico') || text.includes('curva') || text.includes('telemetría')) {
    return 'LiveTelemetryGraph';
  }
  if (text.includes('capa') || text.includes('despiece') || text.includes('explosion') || text.includes('hardware')) {
    return 'ExplodedLayerStack';
  }
  if (text.includes('hipótesis') || text.includes('marcador') || text.includes('score') || text.includes('vs')) {
    return 'HypothesisScoreboard';
  }
  if (text.includes('estático') || text.includes('foto') || text.includes('imagen') || text.includes('captura')) {
    return 'KenBurnsContainer';
  }
  if (text.includes('foco') || text.includes('selección') || text.includes('caja') || text.includes('recuadro')) {
    return 'VectorSelectionBox';
  }
  return 'threePropertyEntrance';
}

/**
 * Ejecuta el análisis multimodal con Google Gemini (@google/genai)
 */
export async function analyzeVideoWithGemini(videoPath, metadata, sceneTimestamps, stills) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY no encontrada en .env. Se usará el compilador determinista local de ingeniería inversa.');
    return buildFallbackReverseScenes(metadata, sceneTimestamps);
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite-preview';

  console.log(`🤖 Enviando vídeo a Gemini Multimodal (${model})...`);

  // Leemos el archivo en buffer base64 para envío inline (óptimo para Reels < 25MB)
  const videoBuffer = fs.readFileSync(videoPath);
  const base64Video = videoBuffer.toString('base64');

  const systemInstruction = `Eres un Arquitecto Senior de Vídeo Programático e Ingeniería Inversa de Remotion.
Tu labor es desconstruir este vídeo vertical (.mp4) y mapearlo con precisión matemática a nuestro motor de código React/Remotion.
NUESTRAS PRIMITIVAS Y REGLAS OBLIGATORIAS:
- Modos de Fondo permitidos en blueprintMode: ${BLUEPRINT_MODES.join(', ')}.
- Primitivas Vectoriales mapeables: "Book3DStage", "EditorialExcerptHighlighter", "LiveTelemetryGraph", "ExplodedLayerStack", "HypothesisScoreboard", "KenBurnsContainer", "VectorSelectionBox", "threePropertyEntrance".
- Movimiento: Todos los textos y elementos secundarios deben usar "threePropertyEntrance" (Fade + Rise + Scale) y staggerDelay de 3-6 frames.
- Dicción de voz para TTS: En el campo "text", TODOS los números y porcentajes deben escribirse en letra (ej: "treinta y siete veces", "cuatro coma cuatro estrellas", "un por ciento").
- Estructura: Genera entre 4 y 5 escenas cubriendo el 100% de la duración.`;

  const prompt = `Analiza este vídeo de ${metadata.durationSec.toFixed(1)} segundos a ${metadata.fps} fps.
Cortes de escena detectados por FFmpeg en los segundos: ${sceneTimestamps.join(', ')}.

Devuelve un objeto JSON estructurado con la arquitectura visual y guion exacto para clonarlo en Remotion.`;

  const responseSchema = {
    type: 'object',
    properties: {
      projectTitle: { type: 'string' },
      fps: { type: 'number' },
      width: { type: 'number' },
      height: { type: 'number' },
      crossDissolveFrames: { type: 'number' },
      detectedStyleArchetype: { type: 'string' },
      hookRetentionScore: { type: 'number', description: 'Puntuación de 1 a 10 de retención en los primeros 3 segundos' },
      hookAnalysis: {
        type: 'object',
        properties: {
          hookText: { type: 'string' },
          visualDisruptor: { type: 'string' },
          pacingWordsPerSec: { type: 'number' }
        },
        required: ['hookText', 'visualDisruptor', 'pacingWordsPerSec']
      },
      scenes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            text: { type: 'string' },
            characterPreset: { type: 'string', enum: ['narrator', 'expert', 'dramatic', 'conversational', 'calm'] },
            blueprintMode: { type: 'string', enum: BLUEPRINT_MODES },
            visualCue: { type: 'string' },
            detectedPrimitive: { type: 'string' },
            cameraTarget: {
              type: 'object',
              properties: {
                x: { type: 'number' },
                y: { type: 'number' },
                zoom: { type: 'number' },
                rotateDeg: { type: 'number' }
              },
              required: ['x', 'y', 'zoom', 'rotateDeg']
            },
            metrics: {
              type: 'object',
              properties: {
                label: { type: 'string' },
                numericValue: { type: 'number' },
                unit: { type: 'string' }
              },
              required: ['label', 'numericValue', 'unit']
            },
            motionDynamics: {
              type: 'object',
              properties: {
                entrance: { type: 'string' },
                easing: { type: 'string' },
                staggerFrames: { type: 'number' }
              },
              required: ['entrance', 'easing', 'staggerFrames']
            }
          },
          required: [
            'id', 'title', 'text', 'characterPreset', 'blueprintMode',
            'visualCue', 'detectedPrimitive', 'cameraTarget', 'metrics', 'motionDynamics'
          ]
        }
      }
    },
    required: ['projectTitle', 'fps', 'width', 'height', 'crossDissolveFrames', 'scenes']
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'video/mp4',
                data: base64Video,
              },
            },
          ],
        },
      ],
      config: {
        systemInstruction: { parts: [{ text: systemInstruction }] },
        responseMimeType: 'application/json',
        responseSchema,
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text.trim());
    return parsed;
  } catch (err) {
    console.error('❌ Error llamando a Gemini Multimodal:', err.message);
    console.warn('⚠️ Se activará el fallback determinista local.');
    return buildFallbackReverseScenes(metadata, sceneTimestamps);
  }
}

/**
 * Compilador determinista de respaldo cuando no hay API key de Gemini
 */
function buildFallbackReverseScenes(metadata, timestamps) {
  const fps = metadata.fps || 30;
  const numScenes = Math.max(3, Math.min(6, timestamps.length));

  const scenes = [];
  const cameraTargets = [
    { x: 0, y: 0, zoom: 1.0, rotateDeg: 0 },
    { x: 1120, y: 0, zoom: 1.0, rotateDeg: 0 },
    { x: 1120, y: 1980, zoom: 1.0, rotateDeg: 0 },
    { x: 0, y: 1980, zoom: 1.0, rotateDeg: 0 },
    { x: 560, y: 3960, zoom: 1.0, rotateDeg: 0 },
  ];

  for (let i = 0; i < numScenes; i++) {
    const isFirst = i === 0;
    const isLast = i === numScenes - 1;
    const mode = isFirst ? 'DARK_CAD_XRAY' : (i % 2 === 1 ? 'CHRONO_OSCILLOSCOPE' : 'BLUEPRINT_BLUE');

    scenes.push({
      id: `scene-${i + 1}`,
      title: isFirst ? 'GANCHO DE APERTURA (REVERSE CLONE)' : `BLOQUE VISUAL ${i + 1}`,
      text: isFirst
        ? '¡Atención a este patrón visual! [PAUSA 0.4s] Observa cómo cada elemento entra con tres propiedades coordinadas y sin vibraciones.'
        : `En este segundo segmento, la telemetría avanza a un ritmo constante de noventa y ocho coma cinco por ciento. [PAUSA 0.4s] El sistema vectorial sostiene el foco activo.`,
      characterPreset: isFirst ? 'dramatic' : 'narrator',
      blueprintMode: mode,
      visualCue: isFirst
        ? 'HeroPropStage en perspectiva isométrica con cota de ingeniería ámbar y pastilla de selección.'
        : 'Gráfica de telemetría en vivo unida con osciloscopio y tarjetas de datos.',
      detectedPrimitive: isFirst ? 'Book3DStage' : (i % 2 === 1 ? 'LiveTelemetryGraph' : 'KenBurnsContainer'),
      cameraTarget: cameraTargets[i % cameraTargets.length],
      metrics: {
        label: isFirst ? 'RETENCIÓN INICIAL' : 'RENDIMIENTO',
        numericValue: isFirst ? 98.4 : 37.8,
        unit: '%',
      },
      motionDynamics: {
        entrance: 'threePropertyEntrance',
        easing: 'expoOut',
        staggerFrames: 4,
      },
    });
  }

  return {
    projectTitle: 'Clon Inverso de Vídeo — Arquitectura Vectorial',
    fps,
    width: metadata.width || 1080,
    height: metadata.height || 1920,
    crossDissolveFrames: 10,
    detectedStyleArchetype: 'DARK_CAD_XRAY (High Density)',
    hookRetentionScore: 8.7,
    hookAnalysis: {
      hookText: scenes[0].text.slice(0, 50),
      visualDisruptor: 'Cota de dimensión técnica en primeros 1.5s',
      pacingWordsPerSec: 2.8,
    },
    scenes,
  };
}

/**
 * Función principal
 */
async function main() {
  const args = process.argv.slice(2);
  let subCommand = 'reverse';
  let targetVideoPath = null;
  let customOut = SCENES_REVERSE_PATH;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === 'reverse' || args[i] === 'describe') {
      subCommand = args[i];
    } else if (args[i] === '--out' && args[i + 1]) {
      customOut = path.resolve(args[i + 1]);
      i++;
    } else if (!args[i].startsWith('--') && !targetVideoPath) {
      targetVideoPath = path.resolve(args[i]);
    }
  }

  if (!targetVideoPath) {
    // Si no se pasa vídeo, busca si existe uno de prueba en out/video.mp4 o en assets
    const fallbackCandidates = [
      path.join(ROOT_DIR, 'out', 'video.mp4'),
      path.join(ROOT_DIR, 'public', 'assets', 'reference.mp4'),
    ];
    for (const cand of fallbackCandidates) {
      if (fs.existsSync(cand)) {
        targetVideoPath = cand;
        break;
      }
    }
  }

  if (!targetVideoPath || !fs.existsSync(targetVideoPath)) {
    console.log(`
Uso:
  npm run video:reverse -- <ruta-al-video.mp4>
  npm run video:describe -- <ruta-al-video.mp4> [--out src/data/scenes.reverse.json]

Ejemplo:
  node scripts/video-reverse.mjs reverse out/video.mp4
`);
    process.exit(1);
  }

  console.log(`\n🔍 INICIANDO INGENIERÍA INVERSA VISUAL: ${path.basename(targetVideoPath)}`);

  // Paso 1: Metadatos
  const meta = probeVideo(targetVideoPath);
  console.log(`📊 Metadatos: ${meta.width}x${meta.height} @ ${meta.fps}fps · Duración: ${meta.durationSec.toFixed(1)}s`);

  // Paso 2: Cortes de escena
  console.log(`🎬 Detectando cortes de escena con FFmpeg...`);
  let sceneCuts = detectSceneCuts(targetVideoPath, 0.25);
  if (sceneCuts.length < 2) {
    // Fallback de segmentación uniforme (cada 12 segundos)
    const step = meta.durationSec / 5;
    sceneCuts = [0, step, step * 2, step * 3, step * 4];
    console.log(`ℹ️ Transiciones suaves detectadas; aplicando muestreo en 5 bloques (${step.toFixed(1)}s c/u)`);
  } else {
    console.log(`✂️ ${sceneCuts.length} escenas detectadas en timestamps: ${sceneCuts.map(t => t.toFixed(1) + 's').join(', ')}`);
  }

  // Paso 3: Extracción de Stills
  const slug = path.basename(targetVideoPath, path.extname(targetVideoPath)).replace(/[^a-zA-Z0-9_-]/g, '_');
  const sessionDir = path.join(REVERSE_OUTPUT_DIR, slug);
  const { frames, audioPath } = extractStillsAndAudio(targetVideoPath, sceneCuts, sessionDir);
  console.log(`📸 Extraídos ${frames.length} fotogramas clave en: ${path.relative(ROOT_DIR, sessionDir)}`);
  if (audioPath) {
    console.log(`🎵 Audio extraído en: ${path.relative(ROOT_DIR, audioPath)}`);
  }

  // Paso 4: Análisis Multimodal con Gemini
  const reverseData = await analyzeVideoWithGemini(targetVideoPath, meta, sceneCuts, frames);

  // Paso 5: Escribir scenes.reverse.json
  fs.writeFileSync(customOut, JSON.stringify(reverseData, null, 2), 'utf-8');
  console.log(`\n✅ ARQUITECTURA CLONADA GUARDADA: ${path.relative(ROOT_DIR, customOut)}`);
  console.log(`\n📌 RESUMEN DE INGENIERÍA INVERSA:`);
  console.log(`  - Título Extraído: "${reverseData.projectTitle}"`);
  console.log(`  - Arquetipo: ${reverseData.detectedStyleArchetype || 'Auto'}`);
  console.log(`  - Puntuación Hook Retención (0-3s): ${reverseData.hookRetentionScore || 'N/A'}/10`);
  console.log(`  - Escenas Mapeadas: ${reverseData.scenes.length}`);

  reverseData.scenes.forEach((sc, idx) => {
    console.log(`    [${sc.id}] ${sc.title} -> Modo: ${sc.blueprintMode} | Primitiva: ${sc.detectedPrimitive} | Preset Voz: ${sc.characterPreset}`);
  });

  console.log(`\n👉 Para sincronizar este clon con audio y renderizarlo ejecuta:`);
  console.log(`   cp ${path.relative(ROOT_DIR, customOut)} src/data/scenes.json`);
  console.log(`   npm run sync:audio`);
  console.log(`   npm run build\n`);
}

// Ejecutar si se llama directamente
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(err => {
    console.error('❌ Error fatal en ingeniería inversa:', err);
    process.exit(1);
  });
}
