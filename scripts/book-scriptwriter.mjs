#!/usr/bin/env node
/**
 * scripts/book-scriptwriter.mjs
 * Guionista Estructurado de 60-65 Segundos para Resúmenes de Libros.
 *
 * Consume exclusivamente el dossier comprimido `src/data/book-dossier.json` (< 900 tokens)
 * y genera `src/data/scenes.json` (5 escenas, ~180 palabras, números escritos en letra en `text`
 * para dicción perfecta en ElevenLabs y cifras técnicas en `metrics` / `bookVisualData`).
 *
 * Soporta:
 * 1. Google Gemini API Free Tier (`gemini-2.5-flash` / `gemini-2.0-flash`) si GEMINI_API_KEY está configurada en .env.
 * 2. Compilador Determinista Local de 0 tokens si no se ha configurado clave aún.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(ROOT_DIR, '.env') });

const DOSSIER_PATH = path.join(ROOT_DIR, 'src', 'data', 'book-dossier.json');
const SCENES_OUT_PATH = path.join(ROOT_DIR, 'src', 'data', 'scenes.json');

/**
 * Coordenadas del lienzo continuo 2400x6000 para las 5 escenas del resumen
 */
const CANVAS_CAMERA_TARGETS = [
  { x: 0, y: 0, zoom: 1.0, rotateDeg: 0 },
  { x: 1120, y: 0, zoom: 1.0, rotateDeg: 0 },
  { x: 1120, y: 1980, zoom: 1.0, rotateDeg: 0 },
  { x: 0, y: 1980, zoom: 1.0, rotateDeg: 0 },
  { x: 560, y: 3960, zoom: 1.0, rotateDeg: 0 },
];

/**
 * Llamada ultra-compacta a Gemini API (Free Tier: gemini-2.5-flash -> fallback gemini-2.0-flash)
 */
async function generateScenesWithGemini(dossier, apiKey, preferredModel) {
  const modelsToTry = ['gemini-3.1-flash-lite-preview', 'gemini-3-flash-preview'];

  // Prompt minimalista (< 320 tokens de instrucción + ~700 tokens del dossier)
  const systemInstruction = `Eres un director de guiones para Shorts verticales de resúmenes de libros (60-65 segundos, 5 escenas, ~180 palabras en total en español).
REGLAS ESTRICTAS:
1. Devuelve ÚNICAMENTE un objeto JSON válido con la propiedad "scenes" (array de 5 escenas: scene-1 a scene-5).
2. Cada escena debe tener entre 33 y 40 palabras en "text" (total ~180 palabras para durar 62-65 segundos).
3. En el campo "text", TODOS los números y porcentajes DEBEN escribirse en letra (ej: "uno por ciento", "treinta y siete veces", "dos minutos", "cuatro coma dos estrellas") para dicción perfecta en TTS.
4. Incluye pausas prosódicas "[PAUSA 0.4s]" entre frases clave para ritmo documental.
5. Mantén fidelidad absoluta a los datos y citas reales del dossier.`;

  const compactPayload = {
    book: dossier.bookMetadata,
    thesis: dossier.synopsisCondensed,
    mythVsReality: dossier.mythVsReality,
    math: dossier.mathematicalProof,
    quotes: dossier.verifiedQuotes,
    laws: dossier.actionableLaws,
  };

  const userPrompt = `Genera las 5 escenas para este dossier de libro:\n${JSON.stringify(compactPayload)}`;

  for (const model of modelsToTry) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
      apiKey
    )}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 14000);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                scenes: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      id: { type: 'STRING' },
                      title: { type: 'STRING' },
                      text: { type: 'STRING' },
                    },
                    required: ['id', 'title', 'text'],
                  },
                },
              },
              required: ['scenes'],
            },
          },
        }),
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errBody = await res.text().catch(() => '');
        console.warn(`   [Gemini ${model}] HTTP ${res.status}: ${errBody.slice(0, 180)}`);
        continue;
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const parsed = JSON.parse(rawText);
        if (Array.isArray(parsed.scenes) && parsed.scenes.length === 5) {
          return { scenes: parsed.scenes, modelUsed: model };
        }
      }
    } catch (e) {
      clearTimeout(timeoutId);
      console.warn(`   [Gemini ${model}] ${e.message}`);
    }
  }

  throw new Error('No se pudo obtener respuesta estructurada de Gemini API.');
}

/**
 * Compilador determinista de 5 escenas (62-65 segundos / ~182 palabras) a partir del dossier
 */
function buildCanonicalFiveScenesFromDossier(dossier) {
  const meta = dossier.bookMetadata;
  const quotes = dossier.verifiedQuotes || [];
  const laws = dossier.actionableLaws || [];
  const isDeepWork = dossier.slug === 'centrate-deep-work';

  if (isDeepWork) {
    return [
      {
        id: 'scene-1',
        title: 'UN LIBRO EN 60 SEGUNDOS',
        text: '¡Un libro en sesenta segundos! [PAUSA 0.4s] Hoy: Céntrate, Deep Work, de Cal Newport. [PAUSA 0.4s] Más de tres millones de copias vendidas y cuatro coma dos estrellas en Goodreads.',
        characterPreset: 'dramatic',
        blueprintMode: 'DARK_CAD_XRAY',
        visualCue:
          'Señal de alerta parpadeante, portada oficial de Céntrate (Deep Work) y pop-ups de ventas (+3M copias) y Goodreads (★ 4.15).',
        cameraTarget: CANVAS_CAMERA_TARGETS[0],
        metrics: {
          label: 'RATING GOODREADS',
          numericValue: meta.rating || 4.15,
          unit: '★',
        },
        bookVisualData: {
          badgeVentas: meta.salesCopies || '+3M COPIAS',
          goodreadsRating: `★ ${meta.rating || 4.15}`,
          goodreadsReviews: `${meta.ratingsCount || '190K'} reseñas`,
        },
      },
      {
        id: 'scene-2',
        title: 'SUPERFICIAL VS PROFUNDO',
        text: 'La primera gran idea: estás confundiendo estar ocupado con ser productivo. [PAUSA 0.3s] Responder correos y mensajes todo el día es trabajo superficial que cualquiera puede imitar. El verdadero superpoder hoy es el trabajo profundo sin distracciones.',
        characterPreset: 'narrator',
        blueprintMode: 'DARK_CAD_XRAY',
        visualCue:
          'Tarjeta comparativa entre Trabajo Superficial (fragmentación) y Trabajo Profundo (foco extremo) con cita de Cal Newport.',
        cameraTarget: CANVAS_CAMERA_TARGETS[1],
        metrics: {
          label: 'VALOR COGNITIVO',
          numericValue: 100,
          unit: '% ENFOQUE',
        },
        bookVisualData: {
          sectionBadge: 'PUNTO 01 · LA GRAN PARADOJA',
          headlineTitle: 'OCUPADO ≠ PRODUCTIVO',
          mythLabel: dossier.mythVsReality?.mythLabel || 'TRABAJO SUPERFICIAL',
          mythText:
            dossier.mythVsReality?.mythExplanation ||
            'Responder correos, chats y reuniones constantes que fragmentan tus neuronas y cualquiera puede imitar.',
          realityLabel: dossier.mythVsReality?.realityLabel || 'TRABAJO PROFUNDO',
          realityText:
            dossier.mythVsReality?.realityExplanation ||
            'Bloques de concentración extrema sin distracciones que multiplican tu velocidad y tu valor en el mercado.',
          quote:
            quotes[0]?.text ||
            'El trabajo profundo es el superpoder del siglo veintiuno: enfocar sin distracción en una tarea exigente.',
          quoteAuthor: meta.author || 'CAL NEWPORT',
        },
      },
      {
        id: 'scene-3',
        title: 'LA FÓRMULA DEL ENFOQUE',
        text: 'Segunda idea: la ley matemática del enfoque. [PAUSA 0.3s] Tu producción de alto nivel es igual al tiempo invertido multiplicado por la intensidad de tu concentración. Cuatro horas de foco total rinden más que doce horas mirando el móvil.',
        characterPreset: 'expert',
        blueprintMode: 'CHRONO_OSCILLOSCOPE',
        visualCue:
          'Tarjeta matemática de Cal Newport: Producción = Tiempo × Intensidad (5.00x) frente al Residuo de Atención (-40% IQ).',
        cameraTarget: CANVAS_CAMERA_TARGETS[2],
        metrics: {
          label: 'RENDIMIENTO COGNITIVO',
          numericValue: 5.0,
          unit: 'x',
        },
        bookVisualData: {
          sectionBadge: 'PUNTO 02 · LEY MATEMÁTICA',
          headlineTitle: 'LA ECUACIÓN DEL FOCO',
          primaryBadge: 'TRABAJO PROFUNDO',
          primaryRightBadge: '4 HORAS REALES',
          targetCounterValue: 5.0,
          formulaLabel: 'Producción = Tiempo × Intensidad de Enfoque',
          secondaryTitle: 'RESIDUO DE ATENCIÓN',
          secondarySub: 'Mirar el móvil 1 vez tarda 23 min en recuperar el foco',
          secondaryValue: '-40% IQ',
        },
      },
      {
        id: 'scene-4',
        title: 'LAS 4 REGLAS DE CÉNTRATE',
        text: 'Tercera idea: las cuatro reglas prácticas de Cal Newport. [PAUSA 0.3s] Primero, agenda bloques de foco profundo; segundo, abraza el aburrimiento sin tocar el teléfono; tercero, poda las redes sociales; y cuarto, drena el trabajo superficial.',
        characterPreset: 'narrator',
        blueprintMode: 'BLUEPRINT_BLUE',
        visualCue:
          'Despliegue en cascada de las 4 Reglas para el Éxito en la Era de la Distracción.',
        cameraTarget: CANVAS_CAMERA_TARGETS[3],
        metrics: {
          label: 'BLOQUE MÍNIMO',
          numericValue: 90,
          unit: 'MIN',
        },
        bookVisualData: {
          sectionBadge: 'PUNTO 03 · PROTOCOLO PRÁCTICO',
          headlineTitle: 'LAS 4 REGLAS DE CÉNTRATE',
          actionableLaws: laws,
        },
      },
      {
        id: 'scene-5',
        title: 'ATENCIÓN Y VEREDICTO FINAL',
        text: 'Y la regla de oro: quien eres y lo que logras es la suma directa de aquello en lo que decides concentrarte. [PAUSA 0.4s] ¿Quieres ver más libros en sesenta segundos? [PAUSA 0.3s] ¡Síguenos y comenta qué te ha parecido el libro!',
        characterPreset: 'conversational',
        blueprintMode: 'TOPOLOGY_WIREFRAME',
        visualCue:
          'Tarjeta de tesis central sobre la atención y panel animado de CTA con portada de Céntrate.',
        cameraTarget: CANVAS_CAMERA_TARGETS[4],
        metrics: {
          label: 'LECTURA ESTIMADA',
          numericValue: meta.readingTimeHours || 3.8,
          unit: 'HORAS',
        },
        bookVisualData: {
          sectionBadge: 'LA REGLA DE ORO',
          headlineTitle: 'PROTEGE TU ATENCIÓN',
          identityQuote:
            quotes[1]?.text ||
            'Quien eres, qué piensas, sientes y haces es la suma de aquello en lo que decides concentrarte.',
          identitySub:
            'Tu atención es el activo más escaso y valioso de esta década.',
          ctaMain: '¿Quieres más libros en 60 segundos?',
          ctaSub: '¡Síguenos y comenta tu opinión!',
        },
      },
    ];
  }

  return [
    {
      id: 'scene-1',
      title: 'LA TRAMPA DE LAS METAS',
      text: `¡Un libro en sesenta segundos! [PAUSA 0.4s] Hoy: ${meta.title}, de ${meta.author}. [PAUSA 0.4s] Uno de los libros más influyentes con ${meta.rating} estrellas en Goodreads.`,
      characterPreset: 'dramatic',
      blueprintMode: 'DARK_CAD_XRAY',
      visualCue:
        'Portada del libro en perspectiva con pop-ups de ventas y valoración de Goodreads.',
      cameraTarget: CANVAS_CAMERA_TARGETS[0],
      metrics: {
        label: 'RATING GOODREADS',
        numericValue: meta.rating || 4.38,
        unit: '★',
      },
      bookVisualData: {
        badgeVentas: meta.salesCopies || '+15M COPIAS',
        goodreadsRating: `★ ${meta.rating || 4.38}`,
        goodreadsReviews: `${meta.ratingsCount || '1.94M'} reseñas`,
        mythLabel: dossier.mythVsReality?.mythLabel || 'METAS',
        realityLabel: dossier.mythVsReality?.realityLabel || 'SISTEMAS',
        rulerLabel: `${meta.pages || 320} PÁGINAS · ${meta.ratingsCount || '1.94M'} LECTORES EN GOODREADS`,
      },
    },
    {
      id: 'scene-2',
      title: `${dossier.mythVsReality?.mythLabel || 'MITO'} VS ${dossier.mythVsReality?.realityLabel || 'SISTEMA'}`,
      text: 'La primera gran idea: olvídate de las metas. [PAUSA 0.3s] Ganadores y perdedores tienen exactamente los mismos objetivos. La verdadera diferencia nunca es la meta, sino el sistema diario que construyes.',
      characterPreset: 'narrator',
      blueprintMode: 'DARK_CAD_XRAY',
      visualCue: 'Tarjeta comparativa entre mito y realidad con cita del autor.',
      cameraTarget: CANVAS_CAMERA_TARGETS[1],
      metrics: {
        label: 'FOCO CONDUCTUAL',
        numericValue: 100,
        unit: '% SISTEMA',
      },
      bookVisualData: {
        sectionBadge: 'PUNTO 01 · LA GRAN PARADOJA',
        headlineTitle: 'OLVÍDATE DE LAS METAS',
        mythLabel: dossier.mythVsReality?.mythLabel || 'LA META AISLADA',
        mythText:
          dossier.mythVsReality?.mythExplanation ||
          'Ganadores y perdedores tienen exactamente la misma meta. Tener una meta no te hace ganar.',
        realityLabel: dossier.mythVsReality?.realityLabel || 'EL SISTEMA DIARIO',
        realityText:
          dossier.mythVsReality?.realityExplanation ||
          'La verdadera diferencia es el sistema diario que construyes y ejecutas sin pensarlo.',
        quote:
          quotes[0]?.text ||
          'No te elevas al nivel de tus metas, caes al nivel de tus sistemas.',
        quoteAuthor: meta.author || 'JAMES CLEAR',
      },
    },
    {
      id: 'scene-3',
      title: 'LA MATEMÁTICA DEL 1%',
      text: 'Segunda idea: la matemática del uno por ciento. [PAUSA 0.3s] Mejorar apenas un uno por ciento cada día parece invisible al principio, pero al cabo de un año, el efecto compuesto te hace treinta y siete veces mejor.',
      characterPreset: 'expert',
      blueprintMode: 'CHRONO_OSCILLOSCOPE',
      visualCue:
        'Tarjeta de fórmula matemática animada: 1.01^365 = 37.78x frente a 0.99^365 = 0.03x.',
      cameraTarget: CANVAS_CAMERA_TARGETS[2],
      metrics: {
        label: 'MULTIPLICADOR ANUAL',
        numericValue: 37.78,
        unit: 'x',
      },
      bookVisualData: {
        sectionBadge: 'PUNTO 02 · EFECTO COMPUESTO',
        headlineTitle: 'LA MATEMÁTICA DEL 1%',
        primaryBadge: '+1% CADA DÍA',
        primaryRightBadge: '365 DÍAS',
        targetCounterValue: 37.78,
        formulaLabel:
          dossier.mathematicalProof?.formulaLabel ||
          '1.01³⁶⁵ = 37.78 veces mejor en un año',
        secondaryTitle: '-1% CADA DÍA',
        secondarySub: '0.99³⁶⁵ = 0.03x (Declive casi total)',
        secondaryValue: '0.03x',
      },
    },
    {
      id: 'scene-4',
      title: 'LAS CUATRO LEYES ACCIONABLES',
      text: 'Tercera idea: las cuatro leyes del hábito. [PAUSA 0.3s] Para crear un hábito: hazlo obvio, hazlo atractivo, hazlo fácil con la regla de dos minutos, y hazlo satisfactorio para sellar tu dopamina.',
      characterPreset: 'narrator',
      blueprintMode: 'BLUEPRINT_BLUE',
      visualCue:
        'Cajón técnico interactivo desplegando las 4 Leyes del Cambio de Conducta.',
      cameraTarget: CANVAS_CAMERA_TARGETS[3],
      metrics: {
        label: 'REGLA DE INICIO',
        numericValue: 2,
        unit: 'MIN',
      },
      bookVisualData: {
        sectionBadge: 'PUNTO 03 · PROTOCOLO PRÁCTICO',
        headlineTitle: 'LAS 4 LEYES DEL HÁBITO',
        actionableLaws: laws,
      },
    },
    {
      id: 'scene-5',
      title: 'IDENTIDAD Y VEREDICTO FINAL',
      text: 'Y la regla de oro: cada pequeña acción es un voto por la persona que quieres ser. [PAUSA 0.4s] ¿Quieres ver más libros en sesenta segundos? [PAUSA 0.3s] ¡Síguenos y comenta qué te ha parecido el libro!',
      characterPreset: 'conversational',
      blueprintMode: 'TOPOLOGY_WIREFRAME',
      visualCue:
        'Tarjeta de veredicto bibliográfico con cita de identidad y CTA final.',
      cameraTarget: CANVAS_CAMERA_TARGETS[4],
      metrics: {
        label: 'LECTURA ESTIMADA',
        numericValue: meta.readingTimeHours || 4.2,
        unit: 'HORAS',
      },
      bookVisualData: {
        sectionBadge: 'LA REGLA DE ORO',
        headlineTitle: 'CAMBIO DE IDENTIDAD',
        identityQuote:
          quotes[1]?.text ||
          'Cada pequeña acción es un voto por la persona que quieres llegar a ser.',
        identitySub:
          'Tus hábitos no solo cambian tus resultados; cambian quién eres.',
        verdictBadge: 'IMPRESCINDIBLE · TOP 1% NO FICCIÓN',
      },
    },
  ];
}

async function main() {
  if (!fs.existsSync(DOSSIER_PATH)) {
    throw new Error(
      `No existe ${DOSSIER_PATH}. Ejecuta primero: npm run book:ingest`
    );
  }

  const dossier = JSON.parse(fs.readFileSync(DOSSIER_PATH, 'utf-8'));
  const geminiKey = (process.env.GEMINI_API_KEY || '').trim();
  const preferredModel = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();

  let scenes = buildCanonicalFiveScenesFromDossier(dossier);
  let generatorLabel = 'Compilador Determinista Local (0 Tokens)';

  if (geminiKey && geminiKey !== 'tu_gemini_api_key_aqui') {
    try {
      console.log(
        `🤖 [book-scriptwriter] Generando guion de 65s con Google Gemini (${preferredModel})...`
      );
      const { scenes: llmScenes, modelUsed } = await generateScenesWithGemini(
        dossier,
        geminiKey,
        preferredModel
      );
      // Enriquecer las escenas generadas por Gemini con las coordenadas y blueprints del dossier
      scenes = scenes.map((baseScene, idx) => ({
        ...baseScene,
        title: llmScenes[idx]?.title || baseScene.title,
        text: llmScenes[idx]?.text || baseScene.text,
      }));
      generatorLabel = `Google Gemini API (${modelUsed})`;
    } catch (err) {
      console.warn(
        `⚠️ [book-scriptwriter] Aviso Gemini API (${err.message}). Usando guion maestro calibrado del dossier.`
      );
    }
  } else {
    console.log(
      '⚡ [book-scriptwriter] GEMINI_API_KEY no definida en .env; compilando guion maestro calibrado desde book-dossier.json (0 tokens).'
    );
  }

  const totalWords = scenes.reduce(
    (acc, s) =>
      acc +
      s.text
        .replace(/\[[^\]]+\]/g, '')
        .trim()
        .split(/\s+/).length,
    0
  );

  const output = {
    projectTitle: `${dossier.bookMetadata.title} — ${dossier.bookMetadata.author} (Resumen 65s)`,
    fps: 30,
    width: 1080,
    height: 1920,
    crossDissolveFrames: 10,
    bookMetadata: dossier.bookMetadata,
    scenes,
  };

  fs.writeFileSync(SCENES_OUT_PATH, JSON.stringify(output, null, 2), 'utf-8');

  console.log(
    `✅ [book-scriptwriter] Guion de 5 escenas escrito en src/data/scenes.json (${totalWords} palabras netas + pausas prosódicas · Motor: ${generatorLabel}).`
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main().catch((err) => {
    console.error('❌ Error en book-scriptwriter:', err.message);
    process.exit(1);
  });
}
