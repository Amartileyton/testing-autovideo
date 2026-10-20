---
name: broll-motion-aesthetic
description: Sistema de diseño y animación de arquetipos visuales vectoriales reciclado de TrendForge (KineticDeck, MilestoneSpine, BentoMatrix, HudTelemetry) sincronizado con subtítulos en directo sin fondo ni vibraciones.
---

# B-Roll Motion Aesthetic & Visual Archetypes (TrendForge Integration)

Esta skill integra la arquitectura visual y de sincronización en directo de `TrendForge` con las reglas inquebrantables de nuestro estudio vectorial (`AGENTS.md`).

## 1. Voz Canónica y Preprocesado TTS (`scripts/elevenlabs-sync.mjs`)

- **Voz Canónica de Leo (Gabriel Blanco)**:
  - `ELEVENLABS_VOICE_ID = "RwzBDEn5f6FIgpAjH9YN"`
  - Calibración oficial: `stability: 0.70`, `similarity_boost: 0.75`, `style: 0.05`, `use_speaker_boost: true`, `model_id: "eleven_multilingual_v2"`.
- **Preprocesado automático (`preprocessForTts`)**:
  - Elimina acotaciones escénicas (`[LEO BUSTO]`, `[SCREENCAST]`, `[CORTE]`, `[ZOOM]`, `[PANTALLA]`, `[PLANO]`), líneas meta (`> ...`) y backticks de código.
  - Convierte `[PAUSA X.Xs]` en puntuación prosódica natural (`... ` si $\ge 0.5\text{s}$, `, ` si $< 0.5\text{s}$).
- **Alineación continua (`buildWordTimestamps` / `parseAlignment`)**:
  - El límite final (`endSec` / `endMs`) de cada palabra se enlaza con el `tStart` del carácter de espacio siguiente para evitar micro-huecos entre palabras consecutivas.

## 2. Subtítulos en Directo Sin Fondo y Sin Vibración (`src/components/DynamicCaptions.tsx`)

1. **Cadencia de 3 palabras (`wordsPerWindow = 3`)**:
   - Ventana deslizante fija de 3 palabras (`windowStart = Math.floor(activeWordIdx / 3) * 3`).
2. **Tolerancia de retención de 0.45s (`450ms`)**:
   - Durante pausas naturales entre palabras de hasta `450ms`, la ventana de subtítulos permanece anclada en pantalla sin parpadear ni desaparecer.
3. **Eliminación total de vibraciones**:
   - **Cero rebote vertical** en el contenedor al cambiar de ventana (solo un fundido suave de opacidad de `80ms`).
   - **Métricas horizontales constantes**: `padding`, `margin`, `fontWeight` y `letterSpacing` idénticos para palabras activas e inactivas (evita el reflujo horizontal del flexbox).
   - **Escala desde `1.0`**: La palabra activa escala suavemente de `1.0` a `1.06` con `SPRING_SNAPPY` (nunca arranca por debajo de `1.0`).
4. **Texto sin fondo y fuente editorial seria**:
   - Sin caja ni pastilla de fondo (`backgroundColor: 'transparent'`).
   - Tipografía seria de alta legibilidad (`'IBM Plex Sans', 'Inter', 'Helvetica Neue', system-ui, sans-serif`, `fontWeight: 700`, `48px`) con halo cálido del color del papel (`#F8F7F4`) y subrayado arquitectónico de `3.5px` en `PALETTE.accentPrimary` (`#D94E34`).

## 3. Los 4 Arquetipos Visuales de Escena (Adaptados a Zero-Neon)

1. **`KineticDeck` (Mazo Cinético 3D)**:
   - Tarjetas vectoriales apiladas con rotación suave gobernada por `SPRING_SNAPPY`, ideales para secuencias paso a paso de 3 a 5 fases.
2. **`MilestoneSpine` (Espina Dorsal de Hitos)**:
   - Eje vertical izquierdo con nodos numerados (`01`, `02`, `03`) y conectores progresivos que se rellenan al compás de `wordTimestamps`.
3. **`BentoMatrix` (Cuadrícula Modular Bento 2x2)**:
   - Cuadrícula asimétrica con celda hero superior y tarjetas técnicas inferiores acompañadas de iconos `TechIcon`.
4. **`HudTelemetry` (Telemetría de Ingeniería / Comparativa)**:
   - Panel de diagnóstico con barras de progreso reales (`ms`, `MHz`, `µm`, `%`), estado verificado y comparativa estructural.
