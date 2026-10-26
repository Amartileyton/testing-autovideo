---
name: broll-motion-aesthetic
description: Sistema de diseño y animación de blueprints vectoriales @resultaaquee + TrendForge (BlueprintSurface, VectorSelectionBox, ExplodedLayerStack, LeaderLineCallout, DimensionRuler, HypothesisScoreboard, ChronoStrobe, LiveTelemetryGraph) sincronizado con subtítulos en directo sin vibraciones.
---

# B-Roll Motion Aesthetic & @resultaaquee Visual Blueprints

Esta skill codifica la gramática visual, física de cámara y mecánicas causales extraídas fotograma a fotograma de los 5 vídeos de referencia de `@resultaaquee` (`DeqsgFWIXwU`, `DekLxHqxen5`, `Dege5ORIPxv`, `Den2-R8oUNQ`, `DemzJqioZTv`), combinada con la voz canónica y la sincronización palabra por palabra de `TrendForge`.

---

## 1. Regla de Oro: Escenario Persistente "Zero-Box" (Prohibido Encerrar en Tarjetas)

1. **Prohibido encerrar las ilustraciones en cajas `RoughCard` genéricas**:
   - En `@resultaaquee`, el objeto técnico o experimento flota directamente sobre la cuadrícula milimetrada ocupando el centro del lienzo (`1080x1920`) con al menos un **45% de espacio negativo limpio**.
2. **Continuidad de Objeto (Stateful Object Transformation)**:
   - En lugar de cambiar de diapositiva, **el mismo objeto se transforma en vivo** al compás de la voz:
     - Se inclina en perspectiva 2.5D y se separa en capas (`ExplodedLayerStack`).
     - Se vuelve translúcido en modo Rayos X para mostrar piezas internas (`xrayFill` + `xrayStroke`).
     - Hace zoom fractal de $1 \rightarrow 1.000 \rightarrow 1.048.576$ unidades.
     - Se deforma topológicamente o deja una estela estroboscópica (*onion-skinning*) mientras traza una gráfica en tiempo real.

---

## 2. Los 5 Modos de Superficie (`BLUEPRINT_THEMES` en `src/theme/motion.ts`)

Cada vídeo selecciona un modo de laboratorio visual mediante `<BlueprintSurface mode="..." />`:

1. **`BLUEPRINT_BLUE` (Ref 1 — *1.000 botellas y 10 catadores*)**:
   - Fondo azul ingeniería (`#15457A`) con halo radial (`#1E5A9C`) y cuadrícula milimetrada de doble nivel (`96px` mayor / `24px` menor).
   - Telemetría de esquina (`CornerHudTelemetry`: `BOTELLAS 1.000`, `FIESTA EN 24 H`), matrices binarias de estado (`○ -> ●`) y acentos amarillo ocre (`#FBBF24`).
2. **`DARK_CAD_XRAY` (Ref 2 — *Teclado invisible del iPhone* & Ref 3 — *Gancho del metro*)**:
   - Fondo gris carbón mate (`#111111`) con cuadrícula técnica oscura, halo cálido (`#24201C`) y micropartículas flotantes (`@remotion/noise`).
   - Vista explosionada en capas (`ExplodedLayerStack`: *«lo que ves»* vs *«lo que tocas»*), modo Rayos X cian (`#38BDF8`), cotas de ingeniería ámbar (`DimensionRuler`, `LeaderLineCallout`) y cajón monoespaciado de corpus (`DatasetTerminalDrawer`).
3. **`TOPOLOGY_WIREFRAME` (Ref 4 — *¿Cuántos agujeros tiene una pajita?*)**:
   - Fondo negro petróleo (`#0A0E12`) con marcador persistente de hipótesis arriba (`HypothesisScoreboard`: `[2] [1] [0]`) donde las opciones falsas se tachan en rosa (`#EC4899`) y la ganadora se ilumina en verde (`#22C55E`).
   - Mallas translúcidas con bocas iluminadas y ecuaciones construidas en vivo (`bocas - 1 = ?`).
4. **`CHRONO_OSCILLOSCOPE` (Ref 5 — *Por qué las palomas cabecean*)**:
   - Fondo papel carbón (`#1E1D1B`) con bordes laterales de papel rasgado y cuadrícula rojiza.
   - Mitad superior: estroboscopio con copias fantasma (`opacity: 0.18, 0.35, 0.55`), dianas de puntería rojas (`TargetReticle`) y cronómetro analógico.
   - Mitad inferior: gráfica posición-tiempo en vivo (`LiveTelemetryGraph` con `evolvePath` de `@remotion/paths`) unida al objeto mediante una línea punteada vertical roja.
5. **`EDITORIAL_PAPER` (`#F8F7F4`)**:
   - Papel técnico cálido para piezas editoriales claras o recortes de hemeroteca.

---

## 3. Los 4 Modos de Subtítulos Sin Vibración (`src/components/DynamicCaptions.tsx`)

- **`variant="vector-box"` (Ref 2 & Ref 3)**:
  - Frase progresiva de 5 palabras en el tercio superior (`placement="upper"`) o inferior.
  - Palabras de contexto en gris (`#8E8E93`), palabra activa en blanco (`#FFFFFF`) y palabras clave enmarcadas por `<VectorSelectionBox />` (rectángulo azul `#3B82F6` con 4 nodos cuadrados blancos en las esquinas y mástil superior de rotación).
- **`variant="ochre-blueprint"` (Ref 1)**:
  - Texto blanco sobre azul ingeniería con palabras clave iluminadas en amarillo ocre (`#FBBF24`).
- **`variant="red-pill"` (Ref 5)**:
  - Línea compacta bajo el raíl divisorio (`placement="middle"`) con la palabra activa envuelta en pastilla roja (`#DC2626`) con borde `#FCA5A5`.
- **`variant="editorial-clean"`**:
  - Texto oscuro `#141413` con acento terracota `#D94E34` sobre papel `#F8F7F4`.
- **Garantía Cero Vibración**: Todas las palabras (activas e inactivas) mantienen exactamente el mismo `padding`, `border` (`transparent` cuando está inactivo) y `fontWeight: 700` para impedir cualquier reflujo horizontal.

---

## 4. Procedimiento "Art-First" Obligatorio para los Dibujos (`HeroPropStage` + `flubber` + 15 Blueprints + 27 Reglas)

1. **Separación Estricta entre Ilustración ("El Dibujo") y Telemetría ("El Código")**:
   - **Prohibido dibujar objetos físicos complejos a mano con `<rect>` y `<ellipse>` crudos**.
   - Los objetos protagonistas de cada escena se generan primero con `image-generator` como **Hero Props 3D CAD de alta dirección de arte** (vistas explosionadas 2.5D, cortes Rayos X cian/ámbar, secciones macro científicas, chips de hardware) sin texto incrustado y sobre fondo uniforme `#111111`.
2. **Extracción de Canal Alfa Limpio (`public/assets/props/*.png`)**:
   - Mediante Python (`Pillow` + `numpy`), se convierte el fondo `#111111` en transparencia alfa suave con viñeteado radial, permitiendo que la cuadrícula milimetrada de `BlueprintSurface` se vea a través del objeto sin bordes rectangulares.
3. **Rigging en `<HeroPropStage />` (`src/components/blueprints/ResultaaqueeBlueprints.tsx`)**:
   - Anima la entrada con `SPRING_SNAPPY` + `MOTION_EASING.quartOut` (`LottieFiles/motion-design-skill`).
   - Aplica levitación orgánica determinista (`noise2D` de `@remotion/noise`), contorno CAD que muta continuamente con `flubber`, anillos acústicos concéntricos y barrido láser de Rayos X (`scanBeam`).
   - Alrededor del `HeroPropStage` se conectan las primitivas vectoriales en vivo: `LeaderLineCallout`, `DimensionRuler`, `HypothesisScoreboard`, `TargetReticle`, `LiveTelemetryGraph` y `DatasetTerminalDrawer`.



---

## 5. Reglas Estrictas de Motion Design (Haidrrrry Integration)

1. **Entrada de 3 Propiedades Simultáneas (`threePropertyEntrance`)**:
   - Prohibido entrar elementos visuales con una sola propiedad (solo opacidad o solo traslación).
   - Todo titular, badge, tarjeta o vector secundario debe sincronizar:
     - **Opacidad**: $0 \rightarrow 1$ (en 8–10 frames).
     - **Elevación (Rise)**: `translateY: 36px` $\rightarrow$ `0px` con `SPRING_SNAPPY` o `MOTION_EASING.quartOut`.
     - **Micro-Escala**: `scale: 0.92` $\rightarrow$ `1.0`.
   - Helper en `src/theme/motion.ts`: `const { style } = threePropertyEntrance(frame, fps, { delayFrames: staggerDelay(index, 4) });`

2. **Coreografía Escalonada (Stagger) de 3 a 6 Frames**:
   - Las listas de leyes, chips métricos o nodos jamás aparecen en el mismo fotograma.
   - Aplica `staggerDelay(i, 4)` sobre el inicio de la animación de cada hijo.

3. **Prohibición de Elementos Estáticos Inertes (`<KenBurnsContainer />`)**:
   - Todo asset estático (portadas de libros, capturas de pantalla, esquemas fijos) debe montarse dentro de `<KenBurnsContainer durationInFrames={dur} panDirection="subtle-drift">`.
   - Aplica micro-paneo no lineal y zoom suave ($1.0 \rightarrow 1.07$) para mantener la escena visualmente viva sin distraer.

4. **Acabado Analógico Cinemático (`<CinematicGrainOverlay />` y `<VignetteOverlay />`)**:
   - Activados por defecto en `Video.tsx`. Proporcionan textura de grano procedural de 3 octavas (evitando la esterilidad del vector puro) y viñeteado periférico para enfocar la vista en el área activa superior.

---

## 6. Manual de Estilo Corporativo `@en1minuto.es` y Catálogo de 12 Arquetipos (`src/components/kinetic/`)

Cuando el proyecto opera bajo la identidad corporativa de **`@en1minuto.es`** (`EDITORIAL_PAPER`), rigen las siguientes normas de estilo y selección de componentes:

### 6.1 Reglas de Color, Superficie y Geometría Suavizada
- **Fondo**: Papel técnico `#F6F2E8` con cuadrícula de ingeniería visible (`rgba(135, 118, 92, 0.42)` a `1.85px` / `rgba(135, 118, 92, 0.20)` a `1.15px`).
- **Tarjetas Bloc de Notas**: Fondo ocre pálido `#FDF6DF` (`PALETTE.cardNotepad`), borde `#DECBA4` (`PALETTE.cardBorder`) y esquinas redondeadas suaves (`borderRadius: 24px–28px`, `strokeLinejoin="round"`, `strokeLinecap="round"`).
- **Acentos Corporativos**: Terracota `#D94E34` (principal), Ámbar `#E08E26` (secundario), Verde Salvia `#3D6352` (terciario) y Tinta `#141413`.
- **Cero Micro-Píldoras de Relleno**: Prohibido añadir píldoras sobre los titulares (`01 / ...`) o micro-etiquetas superfluas dentro de las tarjetas (`PASO 1`, `EFECTO VERIFICADO ✓`).
- **Portada (Escena 1)**: Flanqueada por las 2 píldoras inclinadas (Ventas `🔥 +XM COPIAS` a `-4deg` y Goodreads con `public/assets/goodreads-logo.png` a `+3deg`).
- **Reloj Inferior y Cierre**:
  - Escenas 1–4: Solo `<OneMinuteStopwatch size={86} />` centrado abajo (`bottom: 36px`), sin faldón de texto.
  - Escena 5 (`CtaEndCard.tsx`): Píldora dinámica **blanca (`#FFFFFF` con borde `#D94E34`)** con el reloj animado + `@en1minuto.es`.

### 6.2 Tabla de Decisión de los 12 Arquetipos Visuales (`ArchetypeRenderer.tsx`)
1. **`ComparisonBattle`** (*#01*): Contraste directo entre el error habitual (izquierda atenuada) y el método del libro (derecha terracota).
2. **`ExponentialGrowthChart`** (*#02*): Interés compuesto, Valle de la Decepción y despegue exponencial.
3. **`VectorLoopCircuit`** (*#03*): Sistema cíclico de 3 nodos con arco de retroalimentación inferior.
4. **`StepCascadeList`** (*#04*): Escalera de 3 a 4 reglas prácticas con sangría progresiva.
5. **`ParetoBarChart`** (*#05*): Desproporción 80/20 (20% de acciones críticas → 80% de resultados).
6. **`IcebergDepthDiagram`** (*#06*): 15% de éxito visible en superficie vs. 85% de sistema sumergido en verde salvia.
7. **`FunnelFilter`** (*#07*): Embudo esencialista que filtra 100 estímulos triviales hacia 1 meta única.
8. **`PyramidHierarchy`** (*#08*): Pirámide de 3 niveles construida desde los cimientos hasta la cúspide.
9. **`VennConvergence`** (*#09*): Intersección de 3 círculos que convergen en el núcleo de valor único.
10. **`EisenhowerMatrix2x2`** (*#10*): Cuadrícula 2×2 de decisión estratégica con foco en el cuadrante ganador.
11. **`CognitiveBatteryMeter`** (*#11*): Comparativa entre una batería mental drenada por interrupciones y un bloque blindado al 100%.
12. **`BalanceScaleTradeoff`** (*#12*): Palanca de Arquímedes donde 1 hora de foco puro levanta 8 horas de multitarea.
