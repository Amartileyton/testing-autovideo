# AGENTS.md — Constitución Técnica y Protocolo Multiagente (Niveles 0 a 4)

> **Carga Obligatoria en Cada Sesión**: Este documento define las reglas inquebrantables de diseño, física de movimiento, sincronización Audio-First con ElevenLabs, el sistema de Blueprints `@resultaaquee` y el protocolo de aislamiento de escritura de 5 Slots para la Manager View (`invoke_subagent`) en Google Antigravity.

---

## 1. Reglas Inquebrantables del Estudio Vectorial (`@resultaaquee` + `TrendForge` — Nivel 2)

### 1.1 Sistema de Movimiento Cerrado y paquetes oficiales
- **Prohibido CSS `transition` o `@keyframes`**: Ningún componente puede animarse mediante hojas de estilo o clases utilitarias de transición.
- **Determinismo por Fotograma**: Todo movimiento depende exclusivamente de `useCurrentFrame()`, `@remotion/paths` (`evolvePath`, `interpolatePath`), `@remotion/noise` (`noise2D` para micropartículas en suspensión) y `d3-delaunay` (para mallas y regiones de impacto dinámicas).
- **Extrapolación Acotada**: Toda llamada a `interpolate()` debe incluir obligatoriamente `{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }` (constante `CLAMP_EXTRAPOLATION` en `src/theme/motion.ts`).

### 1.2 Dos Únicas Físicas `spring()` Permitidas + Rack-Focus Óptico
Importadas exclusivamente desde `src/theme/motion.ts`:
1. **`SPRING_SNAPPY = { damping: 20, stiffness: 200, mass: 0.8 }`**
   - Uso exclusivo: Entradas de UI, marcos de selección vectorial (`VectorSelectionBox`), cotas (`DimensionRuler`, `LeaderLineCallout`), contadores numéricos y tachados de hipótesis.
2. **`SPRING_CAMERA = { damping: 30, stiffness: 90, mass: 1.2 }`**
   - Uso exclusivo: Movimientos panorámicos, zooms fractales y transiciones del `CameraRig` sobre el lienzo continuo, acompañados opcionalmente del desenfoque óptico breve de cambio de foco (`rackFocusBlur` de 10 fotogramas en `CameraRig.tsx`).

### 1.3 Regla "Zero-Box" y los 5 Modos de Superficie (`BLUEPRINT_THEMES`)
- **Prohibido encerrar las escenas en cajas `RoughCard` genéricas**: Los vectores y experimentos flotan directamente sobre la cuadrícula técnica milimetrada con amplio espacio negativo ($\ge 45\%$ del lienzo libre) y continuidad de objeto (el mismo objeto se inclina en 2.5D, se abre en capas, pasa a modo Rayos X o hace zoom fractal).
- **5 Modos de Laboratorio Visual (`src/theme/motion.ts` y `BlueprintSurface`)**:
  1. `BLUEPRINT_BLUE` (*Ref 1 — 1.000 botellas*): Azul ingeniería `#15457A`, cuadrícula milimetrada doble, telemetría en esquinas (`CornerHudTelemetry`) y acentos ocre `#FBBF24`.
  2. `DARK_CAD_XRAY` (*Ref 2 Teclado iPhone & Ref 3 Gancho del Metro*): Gris carbón `#111111`, vista explosionada 2.5D (`ExplodedLayerStack`), corte Rayos X cian `#38BDF8`, cotas ámbar `#F59E0B` (`DimensionRuler`, `LeaderLineCallout`), cajón de dataset (`DatasetTerminalDrawer`) y marco de selección vectorial azul `#3B82F6` (`VectorSelectionBox`).
  3. `TOPOLOGY_WIREFRAME` (*Ref 4 — Topología de la pajita*): Negro petróleo `#0A0E12`, marcador superior de hipótesis (`HypothesisScoreboard`: `[2] [1] [0]`), mallas translúcidas con bocas en verde `#22C55E` y huecos/tachados en rosa `#EC4899`.
  4. `CHRONO_OSCILLOSCOPE` (*Ref 5 — Cronofotografía de las palomas*): Papel carbón `#1E1D1B` con bordes laterales de papel rasgado, estroboscopio (*onion-skinning*) con dianas rojas (`TargetReticle`) arriba y gráfica posición-tiempo en vivo (`LiveTelemetryGraph`) abajo conectada por línea punteada vertical.
  5. `EDITORIAL_PAPER` (`#F8F7F4`): Papel técnico cálido para recortes editoriales y citas históricas.

### 1.4 Zona Segura Vertical (9:16 — 1080x1920 @ 30fps)
- **85% Superior Activo**: Todo texto, subtítulo y vector clave debe situarse por encima de `y = 1632px`.
- **Reserva Inferior de 288px**: Los `288px` inferiores (`1632px` a `1920px`) están estrictamente reservados para la interfaz nativa de Reels / TikTok / Shorts.
- **Padding Lateral**: Mínimo `96px` a izquierda y derecha (`x` dentro del rango `[96, 984]`).

### 1.5 Regla de Locución, Voz Canónica y Subtítulos `@resultaaquee` (`DynamicCaptions.tsx`)
- **Voz Canónica Reciclada de TrendForge**: `ELEVENLABS_VOICE_ID = "RwzBDEn5f6FIgpAjH9YN"` (*"Gabriel Blanco — Voz Canónica de Leo"*), calibrada con `stability: 0.70`, `similarity_boost: 0.75`, `style: 0.05`, `use_speaker_boost: true`, modelo `eleven_multilingual_v2` y preprocesador `preprocessForTts`.
- **4 Variantes de Subtítulos Sin Vibración (`DynamicCaptions.tsx`)**:
  - `variant="vector-box"` (*Ref 2 & Ref 3*): Ventana progresiva de 5 palabras en el tercio superior (`placement="upper"`) o inferior; palabras de contexto en gris `#8E8E93`, activas en blanco `#FFFFFF` y palabras clave enmarcadas con `VectorSelectionBox` (`#3B82F6` con 4 nodos cuadrados en las esquinas y mástil superior).
  - `variant="ochre-blueprint"` (*Ref 1*): Texto blanco con palabras clave en amarillo ocre `#FBBF24`.
  - `variant="red-pill"` (*Ref 5*): Ventana de 3 palabras bajo el raíl central (`placement="middle"`) con pastilla roja `#DC2626` en la palabra activa.
  - `variant="editorial-clean"`: Texto oscuro `#141413` sobre papel `#F8F7F4`.
  - **Cero vibración / cero reflujo**: Prohibido cambiar `padding`, `borderWidth` o `fontWeight` entre la palabra activa y las inactivas; retención de `450ms` en pausas naturales.
- **Dicción en ElevenLabs**: En `src/data/scenes.json`, los números dentro del campo `text` se escriben en letra (p. ej., `"veinticinco milisegundos"`) mientras que en el gráfico vectorial se renderiza el valor numérico (`"25 ms"`).

### 1.6 Procedimiento "Art-First" Obligatorio para los Dibujos (`HeroPropStage` + 15 Blueprints + 27 Reglas)
- **Prohibido dibujar objetos físicos complejos a mano con `<rect>` y `<ellipse>` crudos**: El código React/SVG se usa exclusivamente para **telemetría, cotas (`DimensionRuler`, `LeaderLineCallout`), gráficas en vivo (`LiveTelemetryGraph`), selección vectorial (`VectorSelectionBox`), morphing con `flubber` y cámara**.
- **Pipeline de 4 Fases para Ilustraciones ("Los Dibujos")**:
  1. **Fase 1 — Generación de Hero Props 3D CAD (`image-generator`)**: Antes de programar las escenas, se generan las ilustraciones principales de cada escena (vistas explosionadas isométricas, cortes Rayos X de hardware, secciones macro científicas) sin ningún texto incrustado y sobre fondo uniforme `#111111`.
  2. **Fase 2 — Extracción de Canal Alfa Limpio (`public/assets/props/*.png`)**: Se procesan las ilustraciones con Python (`Pillow` + `numpy`) para convertir el fondo `#111111` en transparencia alfa suave con viñeteado radial en los bordes, de modo que la cuadrícula milimetrada de `BlueprintSurface` se vea a través del objeto sin cortes rectangulares.
  3. **Fase 3 — Rigging en `HeroPropStage` (`ResultaaqueeBlueprints.tsx`)**: Cada ilustración se monta en `<HeroPropStage>` con levitación orgánica determinista (`noise2D` de `@remotion/noise`), contorno técnico que muta con `flubber`, barrido láser de Rayos X (`scanBeam`), anillos acústicos concéntricos y curvas de entrada `MOTION_EASING.quartOut` (`LottieFiles/motion-design-skill`).
  4. **Fase 4 — Artboard Gate antes del MP4**: Se renderizan los fotogramas estáticos (`npx remotion still`) de las 4 escenas y se inspeccionan visualmente antes de lanzar el renderizado completo del vídeo MP4.

### 1.7 Reglas Estrictas de Motion Design (Haidrrrry Integration)
- **Entrada de 3 Propiedades Simultáneas (`threePropertyEntrance`)**: Todo elemento que entra en escena debe coordinar Opacidad ($0 \rightarrow 1$), Elevación vertical ($36\text{px} \rightarrow 0$) y Micro-escala ($0.92 \rightarrow 1.0$) con `SPRING_SNAPPY` o `quartOut`.
- **Coreografía Escalonada (Stagger) de 3 a 6 frames**: Obligatorio aplicar `staggerDelay(index, 4)` en listas y componentes anidados; ningún bloque entra en bloque unísono.
- **Prohibición de Elementos Estáticos Inertes (`<KenBurnsContainer />`)**: Todo asset visual estático (portadas de libros, capturas, esquemas fijos) se anima con micro-paneo continuo y zoom suave ($1.0 \rightarrow 1.07$).
- **Acabado Cinemático Procedural (`<CinematicGrainOverlay />` + `<VignetteOverlay />`)**: Integrados por defecto en `src/Video.tsx` para textura de grano orgánico en suspensión y viñeteado óptico.

---

## 2. Protocolo Multiagente de 5 Slots (`invoke_subagent` — Niveles 3 y 4)

> [!IMPORTANT]
> **Prevención de Colisiones de Escritura**: Google Antigravity no ejecuta *auto-merge* entre agentes que editan el mismo archivo simultáneamente; la última escritura sobrescribe en silencio. Cada Slot tiene **propiedad exclusiva de escritura** sobre su partición de archivos.

| Slot | Tipo de Subagente | Modo Workspace | Responsabilidad Principal | Archivos con Permiso de Escritura Exclusivo |
| :--- | :--- | :--- | :--- | :--- |
| **SLOT 1** | `research` | `inherit` | Verifica datos técnicos reales, patentes, citas históricas y estructura el guion base. | `public/assets/*`<br>`src/data/scenes.json` |
| **SLOT 2** | `video-director` (`self`) | `inherit` | Ejecuta `remotion-video-director` + `node scripts/elevenlabs-sync.mjs`, genera los MP3 en ElevenLabs, calcula el *Frame Budget* real desde `public/audio/info.json` y ensambla el timeline maestro. | `public/audio/*`<br>`public/audio/info.json`<br>`src/Root.tsx`<br>`src/Video.tsx` |
| **SLOT 3** | `self` (*Builder Impar*) | `share` | Programa exclusivamente las escenas impares usando las primitivas de `ResultaaqueeBlueprints.tsx`. | `src/scenes/Scene1.tsx`<br>`src/scenes/Scene3.tsx`<br>`src/scenes/Scene5.tsx`<br>`src/components/RoughCard.tsx` |
| **SLOT 4** | `self` (*Builder Par*) | `share` | Programa exclusivamente las escenas pares, el aparejo de cámara continua y los subtítulos dinámicos. | `src/scenes/Scene2.tsx`<br>`src/scenes/Scene4.tsx`<br>`src/components/CameraRig.tsx`<br>`src/components/DynamicCaptions.tsx`<br>`src/components/blueprints/ResultaaqueeBlueprints.tsx` |
| **SLOT 5** | `browser` | `/browser` | Abre `http://localhost:3000`, inspecciona los fotogramas clave de cada escena, captura evidencias como Artefactos, audita los 16 puntos de calidad y ejecuta el **Critic Gate** ($\ge 8.0$ por dimensión, $\ge 8.5$ de media antes de emitir `DELIVERY AUTHORIZED`). | `references/LESSONS.md`<br>Artefactos de QA / Capturas |

---

## 3. Manual de Estilo Corporativo `@en1minuto.es` y Catálogo de 12 Arquetipos Visuales

### 3.1 Identidad Visual Inquebrantable (`EDITORIAL_PAPER`)
- **Superficie de Fondo**: Papel cálido `#F6F2E8` con cuadrícula de ingeniería marcada (`gridMajor: 'rgba(135, 118, 92, 0.42)'` a `1.85px`, `gridMinor: 'rgba(135, 118, 92, 0.20)'` a `1.15px`) y cero partículas de ruido gris flotante.
- **Tarjetas Efecto Bloc de Notas**: Todas las tarjetas usan fondo ocre/amarillo muy pálido `#FDF6DF` (`PALETTE.cardNotepad`), borde `#DECBA4` (`PALETTE.cardBorder`) y formas suavizadas (`borderRadius: 24px–28px`, `strokeLinejoin="round"`, `strokeLinecap="round"`).
- **Paleta de Acentos Corporativos**:
  - Tinta principal: `#141413` | Texto secundario: `#575550`
  - Acento primario (Terracota): `#D94E34`
  - Acento secundario (Ámbar): `#E08E26`
  - Acento terciario (Verde Salvia): `#3D6352`
- **Prohibición de Píldoras Pequeñas de Relleno**: Prohibido incluir etiquetas superfluas sobre los títulos (`01 / ...`) o dentro de las tarjetas (`ENFOQUE DE ALTO RENDIMIENTO`, `EFECTO VERIFICADO ✓`, `PASO 1`, `REGLA #1`).
- **Portada del Libro (Escena 1)**: Debe incluir siempre las **2 píldoras flotantes inclinadas** a los lados de la portada:
  1. Izquierda (`-4deg`): Ventas y bestseller (`🔥 +XM COPIAS · Nº 1 New York Times`).
  2. Derecha (`+3deg`): Valoración real en Goodreads con su logo oficial (`public/assets/goodreads-logo.png` + `★ X.XX (XXXK reseñas)`).
- **Cronómetro Inferior y Píldora Final**:
  - En las **Escenas 1 a 4**, en la parte inferior solo aparece el **reloj cronómetro limpio (`<OneMinuteStopwatch size={86} />`)** centrado en `bottom: 36px` (sin faldón blanco ni texto de relleno).
  - En la **Escena 5 (`CtaEndCard.tsx`)**, aparece la **píldora dinámica en color blanco (`#FFFFFF` con borde `#D94E34`)** que une el logo del reloj animado + `@en1minuto.es`.
- **Audio y Subtítulos**:
  - Subtítulos limpios en la parte inferior (`variant="editorial-clean"`) sin caja de fondo.
  - Locución sin pitido inicial ni alerta de lectura, cerrando siempre con un CTA potente invitando a seguir a `en1minuto.es` (`"en un minuto punto es"` en el texto para TTS).

### 3.2 Catálogo Modular de 12 Arquetipos Visuales (`src/components/kinetic/ArchetypeRenderer.tsx`)
Para dotar de variabilidad visual a cada vídeo manteniendo el 100% de la imagen corporativa, las escenas seleccionan sus gráficos entre estos **12 Arquetipos Corporativos**:

| # | ID (`VisualArchetypeId`) | Nombre del Arquetipo | Cuándo elegirlo (Criterio de Decisión del Manual de Estilo) |
| :--- | :--- | :--- | :--- |
| **01** | `ComparisonBattle` | **Batalla Comparativa (A vs. B)** | Cuando el autor contrasta el error común (izquierda atenuada) con el principio clave del libro (derecha destacada en terracota). |
| **02** | `ExponentialGrowthChart` | **Curva Exponencial y Umbral** | Cuando los hábitos o inversiones tardan en dar fruto (Valle de la Decepción) antes de dispararse exponencialmente. |
| **03** | `VectorLoopCircuit` | **Circuito de Bucle de 3 Nodos** | Cuando el concepto es un sistema cíclico repetitivo (*Señal → Rutina → Recompensa*). |
| **04** | `StepCascadeList` | **Escalera / Cascada de 4 Reglas** | Para enumerar de 3 a 4 mandamientos accionables con sangría escalonada. |
| **05** | `ParetoBarChart` | **Ley de Pareto (80/20)** | Cuando una minoría selecta de acciones (20%) genera la gran mayoría del impacto real (80%). |
| **06** | `IcebergDepthDiagram` | **Diagrama Iceberg (Visible vs. Oculto)** | Cuando el éxito visible (15% en superficie) se sostiene sobre sistemas, mentalidad o preparación oculta (85% sumergido). |
| **07** | `FunnelFilter` | **Embudo de Filtro Esencialista** | Cuando la lección consiste en filtrar 100 estímulos o tareas triviales para quedarse con 1 única prioridad esencial. |
| **08** | `PyramidHierarchy` | **Pirámide Jerárquica de 3 Niveles** | Cuando el concepto superior exige construir antes una base sólida (de los cimientos en verde salvia a la cúspide terracota). |
| **09** | `VennConvergence` | **Convergencia de Venn (Punto Dulce)** | Cuando el resultado óptimo nace en la intersección de 3 fuerzas complementarias (ej. *Ikigai*, *Talento + Foco + Mercado*). |
| **10** | `EisenhowerMatrix2x2` | **Matriz 2×2 de Decisión Estratégica** | Cuando se cruzan 2 variables (*Impacto vs. Urgencia*, *Riesgo vs. Retorno*) iluminando el cuadrante ganador. |
| **11** | `CognitiveBatteryMeter` | **Medidor de Batería Cognitiva y Fugas** | Cuando el libro aborda la gestión de la energía mental, el descanso o el drenaje por interrupciones y dopamina. |
| **12** | `BalanceScaleTradeoff` | **Palanca de Arquímedes / Coste de Oportunidad** | Cuando una pequeña acción de alto apalancamiento inclina la balanza frente a muchas horas de trabajo mecánico. |

---

## 4. Workflow Interactivo Obligatorio para Nuevos Vídeos (Goodreads → Guion → Cuestionario → Audio + Render)

Cada vez que se inicie un chat nuevo y el usuario solicite crear un vídeo proporcionando un libro o su **enlace de Goodreads**, debes seguir estrictamente estas **4 fases en orden**:

1. **Fase 1 — Extracción de Datos de Goodreads y Redacción del Guion (Sin Audio aún)**:
   - Extrae del enlace de Goodreads el título oficial, autor, puntuación media (`★ X.XX`), volumen de reseñas y datos de ventas/bestseller, y descarga la portada oficial a `public/assets/`.
   - Estructura y muestra al usuario el **Guion de las 5 Escenas** (Escena 1: Gancho + Portada; Escenas 2–4: Ideas clave; Escena 5: Cierre reflexivo + CTA a `@en1minuto.es`).
   - **IMPORTANTE**: No ejecutes ElevenLabs todavía en este paso para no consumir créditos antes de que el usuario valide las animaciones.

2. **Fase 2 — Cuestionario Interactivo de Selección de Animaciones (`ask_question`)**:
   - Inmediatamente después de presentar el guion y **antes de generar el audio**, invoca la herramienta `ask_question` preguntando para las escenas de contenido: **«¿Qué tipo de animaciones quieres ver?»**.
   - Para cada escena, ofrece **4 opciones del Catálogo Modular de 12 Arquetipos**, colocando en **primer lugar con el prefijo `(Recommended)`** la opción que tú consideres más acertada según la metáfora cognitiva de esa escena y aplicando rotación respecto al vídeo anterior para garantizar variabilidad visual.

3. **Fase 3 — Síntesis de Audio en ElevenLabs + Ensamblado Visual**:
   - Una vez el usuario confirma o elige sus animaciones en el cuestionario, actualiza `src/data/scenes.json`, ejecuta `node scripts/elevenlabs-sync.mjs` para generar los MP3 y `public/audio/info.json`, y monta las escenas en Remotion con los arquetipos seleccionados y sus transiciones suaves.

4. **Fase 4 — Renderizado del Producto Final y Revisión**:
   - Renderiza el vídeo MP4 final (`npx remotion render src/index.ts MainVideo out/<slug>-en1minuto.mp4`) y entrégalo al usuario listo para cualquier ajuste fino.
