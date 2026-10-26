#!/usr/bin/env node
/**
 * scripts/video-compare.mjs
 * Motor del Ralph Loop: Comparador Visual Lado a Lado (Original vs Renderizado Remotion).
 *
 * Características:
 * 1. Muestrea fotogramas en timestamps idénticos de ambos vídeos.
 * 2. Compone montajes lado a lado con FFmpeg `hstack` (540x960 cada mitad = 1080x960 total).
 * 3. Analiza discrepancias de layout, timing, escala y zona segura con Gemini Multimodal.
 * 4. Genera informe con parches accionables directos sobre `src/scenes/`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
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

const COMPARE_OUT_DIR = path.join(ROOT_DIR, 'out', 'compare');

function probeDuration(filePath) {
  const args = [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'json',
    filePath,
  ];
  const raw = execFileSync(FFPROBE_BIN, args, { encoding: 'utf-8' });
  const data = JSON.parse(raw);
  return parseFloat(data.format?.duration || '0');
}

function extractFrame(videoPath, timeSec, outPath) {
  const args = [
    '-ss', timeSec.toString(),
    '-i', videoPath,
    '-vframes', '1',
    '-q:v', '2',
    '-y',
    outPath,
  ];
  execFileSync(FFMPEG_BIN, args, { stdio: 'ignore' });
}

function createSideBySideComposite(origFramePath, rendFramePath, outCompositePath) {
  // Escala ambas a 540x960 y las une horizontalmente (1080x960)
  const filter = '[0:v]scale=540:960:force_original_aspect_ratio=decrease,pad=540:960:(ow-iw)/2:(oh-ih)/2[l];[1:v]scale=540:960:force_original_aspect_ratio=decrease,pad=540:960:(ow-iw)/2:(oh-ih)/2[r];[l][r]hstack=inputs=2[out]';

  const args = [
    '-i', origFramePath,
    '-i', rendFramePath,
    '-filter_complex', filter,
    '-map', '[out]',
    '-y',
    outCompositePath,
  ];
  execFileSync(FFMPEG_BIN, args, { stdio: 'ignore' });
}

async function analyzeSideBySidesWithGemini(sideBySideList) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY no configurada. Generando reporte de comparación estático.');
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite-preview';

  console.log(`🤖 Evaluando diferencias lado a lado con Gemini Multimodal (${model})...`);

  const parts = [
    {
      text: `Actúa como Supervisor de Iteración de Vídeo Programático en el "Ralph Loop".
A continuación tienes montajes comparativos lado a lado:
- LADO IZQUIERDO: Vídeo Original de Referencia.
- LADO DERECHO: Clon Renderizado en Remotion.

Tu objetivo es emitir un diagnóstico estricto de discrepancias visuales y proponer parches accionables de código (React/Remotion) para que el clon coincida en fidelidad con el original.

EVALÚA:
1. Composición y Escala: ¿Los objetos principales tienen el mismo peso visual?
2. Jerarquía Tipográfica y Zona Segura: ¿El clon respeta el margen superior e inferior (288px libres)?
3. Paleta y Atmósfera: ¿Coincide el fondo, modo de cuadrícula y acabado?
4. Timing de Animación: ¿Algún elemento entra antes o después de tiempo?

Devuelve un JSON con:`,
    },
  ];

  for (const sbs of sideBySideList) {
    const data = fs.readFileSync(sbs.compositePath).toString('base64');
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data,
      },
    });
  }

  const responseSchema = {
    type: 'object',
    properties: {
      matchPercentage: { type: 'number', description: 'Porcentaje de coincidencia global (0 a 100)' },
      fidelityVerdict: { type: 'string', enum: ['EXCELLENT_MATCH', 'MINOR_ADJUSTMENTS_NEEDED', 'SIGNIFICANT_REWORK_NEEDED'] },
      discrepancies: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            timestampSec: { type: 'number' },
            dimension: { type: 'string' },
            observation: { type: 'string' },
            suggestedFix: { type: 'string' },
            targetComponent: { type: 'string' }
          },
          required: ['timestampSec', 'dimension', 'observation', 'suggestedFix', 'targetComponent']
        }
      },
      actionablePatches: {
        type: 'array',
        items: { type: 'string' }
      }
    },
    required: ['matchPercentage', 'fidelityVerdict', 'discrepancies', 'actionablePatches']
  };

  try {
    const res = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts }],
      config: {
        responseMimeType: 'application/json',
        responseSchema,
        temperature: 0.1,
      },
    });
    return JSON.parse(res.text.trim());
  } catch (err) {
    console.warn('⚠️ Error en evaluación multimodal de comparación:', err.message);
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  let originalPath = null;
  let renderedPath = path.join(ROOT_DIR, 'out', 'video.mp4');
  let outDir = COMPARE_OUT_DIR;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--original' && args[i + 1]) {
      originalPath = path.resolve(args[i + 1]);
      i++;
    } else if (args[i] === '--rendered' && args[i + 1]) {
      renderedPath = path.resolve(args[i + 1]);
      i++;
    } else if (args[i] === '--out' && args[i + 1]) {
      outDir = path.resolve(args[i + 1]);
      i++;
    }
  }

  if (!originalPath || !fs.existsSync(originalPath)) {
    // Si no se especifica --original, busca un archivo en assets o muestra ayuda
    const candidate = path.join(ROOT_DIR, 'public', 'assets', 'reference.mp4');
    if (fs.existsSync(candidate)) {
      originalPath = candidate;
    } else {
      console.log(`
Uso del Ralph Loop (Video Compare):
  npm run video:compare -- --original <ruta-al-video-original.mp4> [--rendered out/video.mp4]

Ejemplo:
  node scripts/video-compare.mjs --original public/assets/referencia.mp4 --rendered out/video.mp4
`);
      process.exit(1);
    }
  }

  if (!fs.existsSync(renderedPath)) {
    console.error(`❌ No existe el vídeo renderizado: ${renderedPath}. Ejecuta primero 'npm run build'.`);
    process.exit(1);
  }

  console.log(`\n======================================================`);
  console.log(`🔄 RALPH LOOP: COMPARADOR VISUAL DE FIDELIDAD`);
  console.log(`======================================================`);
  console.log(`  - Original:   ${path.relative(ROOT_DIR, originalPath)}`);
  console.log(`  - Renderizado: ${path.relative(ROOT_DIR, renderedPath)}`);

  const origDur = probeDuration(originalPath);
  const rendDur = probeDuration(renderedPath);
  console.log(`⏱️ Duraciones: Original = ${origDur.toFixed(1)}s | Render = ${rendDur.toFixed(1)}s (Dif: ${Math.abs(origDur - rendDur).toFixed(1)}s)`);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Puntos de muestreo temporal (5 timestamps representativos)
  const maxDur = Math.min(origDur || 60, rendDur || 60);
  const sampleTimes = [
    2.0,                               // Hook inicial
    Math.round(maxDur * 0.25),         // Escena 2
    Math.round(maxDur * 0.50),         // Escena 3
    Math.round(maxDur * 0.75),         // Escena 4
    Math.max(5.0, maxDur - 3.0),       // Cierre
  ];

  console.log(`📸 Generando montajes lado a lado en ${sampleTimes.length} timestamps: ${sampleTimes.join('s, ')}s...`);
  const compositeList = [];

  for (let idx = 0; idx < sampleTimes.length; idx++) {
    const t = sampleTimes[idx];
    const origFrame = path.join(outDir, `orig_${idx + 1}_at_${t}s.jpg`);
    const rendFrame = path.join(outDir, `rend_${idx + 1}_at_${t}s.jpg`);
    const sideBySide = path.join(outDir, `compare_${idx + 1}_at_${t}s.jpg`);

    extractFrame(originalPath, t, origFrame);
    extractFrame(renderedPath, t, rendFrame);
    createSideBySideComposite(origFrame, rendFrame, sideBySide);

    compositeList.push({
      timestampSec: t,
      compositePath: sideBySide,
      fileName: path.basename(sideBySide),
    });
    console.log(`  - [T=${t}s] Creado ${path.basename(sideBySide)} (Original | Render)`);
  }

  // Análisis multimodal
  const diffReport = await analyzeSideBySidesWithGemini(compositeList);

  const reportOutPath = path.join(outDir, 'diff_report.json');
  if (diffReport) {
    fs.writeFileSync(reportOutPath, JSON.stringify(diffReport, null, 2), 'utf-8');
    console.log(`\n📊 INFORME DEL RALPH LOOP:`);
    console.log(`  - Fidelidad Global: ${diffReport.matchPercentage}% [${diffReport.fidelityVerdict}]`);
    console.log(`\n🔍 Discrepancias Identificadas:`);
    diffReport.discrepancies.forEach(d => {
      console.log(`  • [${d.timestampSec}s · ${d.dimension}] ${d.observation}`);
      console.log(`    -> Sugerencia: ${d.suggestedFix} (en: ${d.targetComponent})`);
    });

    console.log(`\n🛠️ Parches Accionables Recomendados:`);
    diffReport.actionablePatches.forEach((patch, i) => console.log(`  ${i + 1}. ${patch}`));
  } else {
    console.log(`\n✅ Montajes lado a lado completados sin LLM.`);
    console.log(`📁 Revisa los fotogramas comparativos en: ${path.relative(ROOT_DIR, outDir)}`);
  }

  console.log(`\n======================================================\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(err => {
    console.error('❌ Error fatal en Ralph Loop:', err);
    process.exit(1);
  });
}
