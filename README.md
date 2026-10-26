# AutoVideo Book Studio (`@en1minuto.es`) — Motor Programático de Resúmenes de Libros en 60 Segundos

Estudio automatizado para la creación de vídeos verticales (**9:16 · 1080×1920 @ 30 fps · 60 segundos**) para **Instagram Reels, TikTok y YouTube Shorts**, bajo la identidad corporativa de **`@en1minuto.es`**. Construido sobre **Remotion 4**, **Google Gemini**, **ElevenLabs Audio-First Sync** y el **Catálogo Modular de 12 Arquetipos Visuales**.

---

## 1. Identidad Visual Corporativa (`@en1minuto.es`)

- **Superficie de Papel Técnico**: Papel cálido `#F6F2E8` con cuadrícula de ingeniería doble visible (`gridMajor` al 42% y `gridMinor` al 20%). Cero partículas de ruido flotante.
- **Tarjetas Efecto Bloc de Notas**: Todas las tarjetas usan fondo ocre/amarillo muy pálido `#FDF6DF` (`PALETTE.cardNotepad`), borde `#DECBA4` (`PALETTE.cardBorder`) y vértices suavizados (`borderRadius: 24px–28px`, `strokeLinejoin="round"`).
- **Paleta de Acentos de Marca**:
  - **Tinta Principal**: `#141413` | **Texto Secundario**: `#575550`
  - **Acento Primario (Terracota)**: `#D94E34`
  - **Acento Secundario (Ámbar)**: `#E08E26`
  - **Acento Terciario (Verde Salvia)**: `#3D6352`
- **Portada y Pop-ups (Escena 1)**: Portada flanqueada por 2 píldoras flotantes inclinadas:
  1. Izquierda (`-4deg`): Ventas y bestseller (`🔥 +XM COPIAS · Nº 1 New York Times`).
  2. Derecha (`+3deg`): Valoración real de Goodreads con su logo oficial (`★ X.XX · XXXK reseñas`).
- **Cronómetro Inferior y Píldora de Cierre**:
  - **Escenas 1 a 4**: Únicamente el reloj cronómetro analógico limpio (`<OneMinuteStopwatch size={86} />`) centrado en `bottom: 36px` sin faldón ni texto de relleno.
  - **Escena 5 (`CtaEndCard.tsx`)**: Píldora dinámica en **color blanco (`#FFFFFF` con borde `#D94E34`)** que despliega el logo del reloj + `@en1minuto.es` con animación elástica.

---

## 2. Catálogo Modular de 12 Arquetipos Visuales (`src/components/kinetic/`)

Para dotar a la IA de **criterio propio y variabilidad visual** sin romper la imagen de marca, las escenas se seleccionan entre 12 arquetipos parametrizables:

| # | ID del Arquetipo | Componente React | Cuándo elegirlo (Criterio del Manual de Estilo) |
| :-: | :--- | :--- | :--- |
| **01** | `ComparisonBattle` | [`ComparisonBattle.tsx`](src/components/kinetic/ComparisonBattle.tsx) | Choque directo entre el error común (izquierda) y el método del libro (derecha terracota). |
| **02** | `ExponentialGrowthChart` | [`ExponentialGrowthChart.tsx`](src/components/kinetic/ExponentialGrowthChart.tsx) | Interés compuesto, Valle de la Decepción y despegue exponencial tras el umbral. |
| **03** | `VectorLoopCircuit` | [`VectorLoopCircuit.tsx`](src/components/kinetic/VectorLoopCircuit.tsx) | Bucle cerrado de 3 nodos con arco de retroalimentación continua (*Señal → Rutina → Recompensa*). |
| **04** | `StepCascadeList` | [`StepCascadeList.tsx`](src/components/kinetic/StepCascadeList.tsx) | Cascada de 3 a 4 mandamientos accionables con sangría escalonada. |
| **05** | `ParetoBarChart` | [`ParetoBarChart.tsx`](src/components/kinetic/ParetoBarChart.tsx) | Ley de Pareto 80/20 (20% de acciones críticas generan el 80% de los resultados). |
| **06** | `IcebergDepthDiagram` | [`IcebergDepthDiagram.tsx`](src/components/kinetic/IcebergDepthDiagram.tsx) | Modelo Iceberg: 15% de éxito visible en superficie vs. 85% de sistema sumergido en verde salvia. |
| **07** | `FunnelFilter` | [`FunnelFilter.tsx`](src/components/kinetic/FunnelFilter.tsx) | Embudo esencialista: descartar 100 estímulos triviales para destilar 1 meta única de alto impacto. |
| **08** | `PyramidHierarchy` | [`PyramidHierarchy.tsx`](src/components/kinetic/PyramidHierarchy.tsx) | Pirámide de 3 niveles construida desde los cimientos hasta la cúspide. |
| **09** | `VennConvergence` | [`VennConvergence.tsx`](src/components/kinetic/VennConvergence.tsx) | Punto dulce nacido de la convergencia de 3 fuerzas complementarias (*Ikigai*, *Talento + Foco + Mercado*). |
| **10** | `EisenhowerMatrix2x2` | [`EisenhowerMatrix2x2.tsx`](src/components/kinetic/EisenhowerMatrix2x2.tsx) | Matriz 2×2 de decisión estratégica con zoom en el cuadrante ganador. |
| **11** | `CognitiveBatteryMeter` | [`CognitiveBatteryMeter.tsx`](src/components/kinetic/CognitiveBatteryMeter.tsx) | Batería cognitiva: drenaje por interrupciones vs. potencia del bloque blindado al 100%. |
| **12** | `BalanceScaleTradeoff` | [`BalanceScaleTradeoff.tsx`](src/components/kinetic/BalanceScaleTradeoff.tsx) | Palanca de Arquímedes donde 1 hora de foco puro levanta 8 horas de trabajo mecánico. |

---

## 3. Workflow Canónico de Fabricación (Norma ASME)

El flujo de trabajo sigue estrictamente el estándar **ASME (Standard for Process Flowcharts)** para garantizar cero desperdicio de créditos en ElevenLabs y dar control creativo total al usuario en 5 segundos:

```
(Enlace Goodreads) ──> [Fase 1: Guion 5 Escenas] ──> [Fase 2: Cuestionario ask_question]
                                                                  │
                                 ┌────────────────────────────────┘
                                 ▼
                     [Fase 3: ElevenLabs Audio] ──> [Fase 4: Render MP4 Final]
```

### Protocolo de 4 Fases en Cada Nuevo Chat:

1. **Fase 1 — Extracción de Goodreads y Redacción del Guion (Sin audio aún)**:
   - El usuario proporciona el enlace de Goodreads.
   - El agente extrae los datos de valoración (`★ X.XX`), número de reseñas, portada y ventas, y redacta el guion de **5 escenas** (sin consumir créditos de ElevenLabs).
2. **Fase 2 — Cuestionario Interactivo (`ask_question`)**:
   - Antes de sintetizar audio, el agente abre el modal interactivo: *«¿Qué tipo de animaciones quieres ver?»*.
   - Presenta **4 opciones del Catálogo de 12 Arquetipos** por escena, marcando en primer lugar con el prefijo `(Recommended)` la metáfora visual más potente elegida con criterio por la IA.
3. **Fase 3 — Síntesis de Audio en ElevenLabs y Ensamblado**:
   - Con las decisiones tomadas por el usuario, se actualiza `src/data/scenes.json`, se llama a `node scripts/elevenlabs-sync.mjs` con la voz de Leo (*Gabriel Blanco*) y se sincroniza palabra por palabra con subtítulos `editorial-clean`.
4. **Fase 4 — Renderizado del MP4 Final**:
   - Se exporta el vídeo en `out/<slug>-en1minuto.mp4` listo para publicar.

---

## 4. Comandos de Renderizado y Verificación

```bash
# 1. Comprobar tipos TypeScript (0 errores obligatorios)
npm run typecheck

# 2. Renderizar el vídeo final del libro (@en1minuto.es)
npx remotion render src/index.ts MainVideo out/centrate-en1minuto.mp4

# 3. Renderizar el vídeo de demostración del Catálogo Modular (transiciones suaves)
npx remotion render src/index.ts CatalogShowcase out/catalog-showcase-en1minuto.mp4

# 4. Generar fotograma estático de previsualización (JPG)
npx remotion still src/index.ts MainVideo out/preview.jpg --frame=290
```
