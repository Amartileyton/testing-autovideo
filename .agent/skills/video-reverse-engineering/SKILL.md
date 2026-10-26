---
name: video-reverse-engineering
description: Ingesta visual de vídeos de referencia (.mp4), detección de cortes de escena con FFmpeg, extracción multimodal con Gemini 2.5 Flash, mapeo a primitivas de ResultaaqueeBlueprints y bucle Ralph Loop de comparación clon vs original.
version: 1.0.0
---

# Video Reverse Engineering Engine (Dunctk / Ralph Loop Architecture)

Esta skill permite a los agentes analizar cualquier vídeo `.mp4` de referencia (Reel de Instagram, TikTok, Short de YouTube o render previo), desglosar su estructura visual escena por escena, mapear sus elementos a nuestras primitivas vectoriales y clonarlo o re-tematizarlo sin escribir código desde cero.

---

## 1. Comandos CLI Disponibles

```bash
# 1. Ingeniería Inversa Completa (Cortes FFmpeg + Stills + Audio + Gemini Multimodal + Hook Score)
npm run video:reverse -- <ruta-al-video.mp4>

# 2. Desglose Rápido de Timeline Escena por Escena
npm run video:describe -- <ruta-al-video.mp4> --out src/data/scenes.reverse.json

# 3. Comparación Lado a Lado (Ralph Loop: Original vs Clon Renderizado)
npm run video:compare -- --original <ref.mp4> --rendered out/video.mp4

# 4. Auditoría de Retención del Hook (Primeros 3 segundos / 90 frames)
npm run video:hook -- <ruta-al-video.mp4>
```

---

## 2. Flujo de Trabajo en 4 Pasos para Clonar un Vídeo

### Paso 1: Ingesta y Detección de Escenas
El subagent ejecuta:
```bash
node scripts/video-reverse.mjs reverse public/assets/referencia.mp4
```
Esto genera:
- Fotogramas clave en `public/assets/reverse/<slug>/scene_X.jpg`.
- Pista de audio aislada en `public/assets/reverse/<slug>/reference_audio.mp3`.
- Arquitectura JSON en `src/data/scenes.reverse.json`.

### Paso 2: Verificación de Mapeo a Primitivas
Cada escena en `scenes.reverse.json` se asocia automáticamente a uno de nuestros blueprints técnicos:
- `Book3DStage`: para libros, portadas o empaques físicos.
- `EditorialExcerptHighlighter`: para citas textuales sobre papel técnico.
- `LiveTelemetryGraph`: para gráficas matemáticas, curvas de crecimiento u osciloscopios.
- `ExplodedLayerStack`: para vistas explosionadas en 2.5D y hardware.
- `HypothesisScoreboard`: para marcadores de hipótesis con tachados.
- `KenBurnsContainer`: para imágenes estáticas con paneo y zoom no lineal.
- `VectorSelectionBox`: para pastillas y nodos de selección azul CAD.

### Paso 3: Sincronización Audio-First
Para aplicar la voz oficial de Leo con ElevenLabs o edge-tts sobre la arquitectura inversa:
```bash
cp src/data/scenes.reverse.json src/data/scenes.json
npm run sync:audio
```

### Paso 4: Renderizado y Ralph Loop de Comparación
```bash
npm run build
npm run video:compare -- --original public/assets/referencia.mp4 --rendered out/video.mp4
```
El reporte emitirá discrepancias visuales de escala, posición, márgenes de seguridad (`SAFE_ZONE.maxSafeY = 1632px`) y ritmo temporal para aplicar parches inmediatos en `src/scenes/`.
