# AGENTS.md — Constitución Técnica y Protocolo Multiagente (Niveles 0 a 4)

> **Carga Obligatoria en Cada Sesión**: Este documento define las reglas inquebrantables de diseño, física de movimiento, sincronización Audio-First con ElevenLabs y el protocolo de aislamiento de escritura de 5 Slots para la Manager View (`invoke_subagent`) en Google Antigravity.

---

## 1. Reglas Inquebrantables del Estudio Vectorial (Nivel 2)

### 1.1 Sistema de Movimiento Cerrado
- **Prohibido CSS `transition` o `@keyframes`**: Ningún componente puede animarse mediante hojas de estilo o clases utilitarias de transición.
- **Determinismo por Fotograma**: Todo movimiento depende exclusivamente de `useCurrentFrame()`.
- **Extrapolación Acotada**: Toda llamada a `interpolate()` debe incluir obligatoriamente `{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }` (constante `CLAMP_EXTRAPOLATION` en `src/theme/motion.ts`).

### 1.2 Dos Únicas Físicas `spring()` Permitidas
Importadas exclusivamente desde `src/theme/motion.ts`:
1. **`SPRING_SNAPPY = { damping: 20, stiffness: 200, mass: 0.8 }`**
   - Uso exclusivo: Entradas de UI, tarjetas `RoughCard`, iconos `lucide-react`, contadores numéricos y trazos `roughjs`.
2. **`SPRING_CAMERA = { damping: 30, stiffness: 90, mass: 1.2 }`**
   - Uso exclusivo: Movimientos panorámicos, traslaciones `translate3d` y zooms del `CameraRig` sobre el lienzo continuo.

### 1.3 Política Estricta Zero-Neon
- **Superficie Base**: `#F8F7F4` (papel técnico cálido con cuadrícula sutil `#E5E2DC`).
- **Cero Resplandores**: Prohibido `box-shadow` luminiscente, `drop-shadow` de neón, gradientes cian-púrpura o estética cyberpunk genérica.

### 1.4 Zona Segura Vertical (9:16 — 1080x1920 @ 30fps)
- **85% Superior Activo**: Todo texto, subtítulo y vector clave debe situarse por encima de `y = 1632px`.
- **Reserva Inferior de 288px**: Los `288px` inferiores (`1632px` a `1920px`) están estrictamente reservados para la interfaz nativa de Reels / TikTok / Shorts.
- **Padding Lateral**: Mínimo `96px` a izquierda y derecha (`x` dentro del rango `[96, 984]`).
- **Jerarquía Tipográfica**:
  - **Titulares**: $\ge 64\text{px}$ y máximo **7 palabras** por plano.
  - **Etiquetas y Metadatos**: $\ge 28\text{px}$ y máximo **15–20 palabras** por plano.

### 1.5 Regla de Locución, Voz Canónica y Subtítulos Sin Fondo (TrendForge Sync)
- **Voz Canónica Reciclada de TrendForge**: `ELEVENLABS_VOICE_ID = "RwzBDEn5f6FIgpAjH9YN"` (*"Gabriel Blanco — Voz Canónica de Leo"*), calibrada con `stability: 0.70`, `similarity_boost: 0.75`, `style: 0.05`, `use_speaker_boost: true`, modelo `eleven_multilingual_v2` y preprocesador `preprocessForTts`.
- **Cadencia y Anti-Vibración de Subtítulos (`DynamicCaptions.tsx`)**:
  - Ventana deslizante fija de **3 palabras** (`wordsPerWindow = 3`) y **tolerancia de retención de `0.45s` (`450ms`)** en pausas naturales.
  - **Texto sin fondo (`backgroundColor: 'transparent'`)** y **fuente editorial seria** (`'IBM Plex Sans', 'Inter', 'Helvetica Neue', system-ui, sans-serif`, `fontWeight: 700`, `48px`).
  - **Cero vibración**: Prohibido rebote vertical en el contenedor y prohibido cambiar el `padding`, `margin` o `fontWeight` entre la palabra activa y las inactivas; la escala de la palabra activa parte de `1.0` a `1.06` con `SPRING_SNAPPY`.
- **Prohibido duplicar la voz en off**: Nunca repitas en los gráficos de pantalla las frases literales que pronuncia la locución (esa función ya la cumple `DynamicCaptions.tsx`).
- **Mecanismo Causal**: Los vectores en pantalla deben representar diagramas de flujo, física causal, comparativas estructurales o contadores numéricos reales (`MHz`, `ms`, `%`, `FPS`).
- **Dicción en ElevenLabs**: En `src/data/scenes.json`, los números dentro del campo `text` se escriben en letra (p. ej., `"veinticinco milisegundos"`) mientras que en el gráfico vectorial se renderiza el valor numérico (`"25 ms"`).

---

## 2. Protocolo Multiagente de 5 Slots (`invoke_subagent` — Niveles 3 y 4)

> [!IMPORTANT]
> **Prevención de Colisiones de Escritura**: Google Antigravity no ejecuta *auto-merge* entre agentes que editan el mismo archivo simultáneamente; la última escritura sobrescribe en silencio. Cada Slot tiene **propiedad exclusiva de escritura** sobre su partición de archivos.

| Slot | Tipo de Subagente | Modo Workspace | Responsabilidad Principal | Archivos con Permiso de Escritura Exclusivo |
| :--- | :--- | :--- | :--- | :--- |
| **SLOT 1** | `research` | `inherit` | Verifica datos técnicos reales, busca SVGs transparentes oficiales y estructura el guion base. | `public/assets/*`<br>`src/data/scenes.json` |
| **SLOT 2** | `video-director` (`self`) | `inherit` | Ejecuta `remotion-video-director` + `node scripts/elevenlabs-sync.mjs`, genera los MP3 en ElevenLabs, calcula el *Frame Budget* real desde `public/audio/info.json` y ensambla el timeline maestro. | `public/audio/*`<br>`public/audio/info.json`<br>`src/Root.tsx`<br>`src/Video.tsx` |
| **SLOT 3** | `self` (*Builder Impar*) | `share` | Programa exclusivamente las escenas impares y las tarjetas vectoriales `RoughCard`. | `src/scenes/Scene1.tsx`<br>`src/scenes/Scene3.tsx`<br>`src/scenes/Scene5.tsx`<br>`src/components/RoughCard.tsx` |
| **SLOT 4** | `self` (*Builder Par*) | `share` | Programa exclusivamente las escenas pares, el aparejo de cámara continua y los subtítulos dinámicos palabra por palabra. | `src/scenes/Scene2.tsx`<br>`src/scenes/Scene4.tsx`<br>`src/components/CameraRig.tsx`<br>`src/components/DynamicCaptions.tsx` |
| **SLOT 5** | `browser` | `/browser` | Abre `http://localhost:3000`, inspecciona los fotogramas clave de cada escena, captura evidencias como Artefactos, audita los 16 puntos de calidad y ejecuta el **Critic Gate** ($\ge 8.0$ por dimensión, $\ge 8.5$ de media antes de emitir `DELIVERY AUTHORIZED`). | `references/LESSONS.md`<br>Artefactos de QA / Capturas |

---

## 3. Secuencia de Orquestación en Producción

1. **Fase A (Slot 1 — Research & Guion)**: Redacta `src/data/scenes.json` y deposita activos SVG verificados en `public/assets/`.
2. **Fase B (Slot 2 — Audio-First Sync)**: Ejecuta `node scripts/elevenlabs-sync.mjs` para generar `public/audio/${scene.id}.mp3` y `public/audio/info.json` con `actualDuration`, `durationInFrames` y `wordTimestamps`.
3. **Fase C (Slots 3 y 4 en Paralelo — Construcción Vectorial)**:
   - **Slot 3** construye `Scene1.tsx`, `Scene3.tsx` y `RoughCard.tsx`.
   - **Slot 4** construye `Scene2.tsx`, `Scene4.tsx`, `CameraRig.tsx` y `DynamicCaptions.tsx`.
   - **Slot 2** conecta todas las escenas y keyframes de cámara en `src/Video.tsx` y `src/Root.tsx`.
4. **Fase D (Slot 5 — Critic Gate & Render)**:
   - Ejecuta `node scripts/promptible-gate.mjs` y audita visualmente `http://localhost:3000`.
   - Si todas las dimensiones superan $\ge 8.0$ y la media es $\ge 8.5$, emite `DELIVERY AUTHORIZED` y registra aprendizajes en `references/LESSONS.md`.
