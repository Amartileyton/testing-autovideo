# BRANDING.md — Manual de Identidad Visual Corporativa (Canal @en1minuto.es)

> **Constitución Visual del Canal**: Este documento define las directrices estéticas, paleta cromática, tipografías y componentes fijos acordados para todos los vídeos generados por AutoVideo Studio.

---

## 1. Atmósfera y Superficie Base
- **Modo Predeterminado**: `EDITORIAL_PAPER`
- **Color de Fondo**: `#F8F7F4` (papel cálido de biblioteca / marfil técnico).
- **Textura**: Papel técnico con micro-cuadrícula de ingeniería sutil (`#E6E4DD`) que transmite rigor literario y cercanía física.
- **Tinta Principal**: `#141413` (negro carbón cálido de alta legibilidad).
- **Tinta Secundaria**: `#575550` (gris editorial para metadatos, autor y subtítulos de apoyo).

---

## 2. Paleta Cromática de Marca
- **Acento Primario (Brand Signature)**: `#D94E34` (Rojo Terracota / Coral Editorial — estilo Penguin Classics / Harvard University Press).
  - Usos: Subrayador físico de citas, barra de progreso superior, área interior del reloj cronómetro, nodos de selección y sellos de veredicto.
- **Acento Secundario (Datos / Rating)**: `#D97706` (Ámbar cálido para estrellas de Goodreads y cifras analíticas).
- **Acento Positivo**: `#15803D` (Verde esmeralda sobrio para leyes aprobadas y victorias de hábitos).

---

## 3. Tipografía y Jerarquía Visual
- **Titulares y Tarjetas Cinéticas**: `'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif` (Peso `900` Black).
- **Cuerpo y Subtítulos Descriptivos**: `'Inter', system-ui, sans-serif` (Pesos `500`–`800`).
- **Subtítulos Dinámicos Sin Fondo**: `'Nunito', 'Outfit', sans-serif` (Peso `800`, `52px`, sin caja de fondo, palabra activa en terracota `#D94E34` y halo `#F8F7F4`).
- **Datos Técnicos y Cifras de Impacto**: `'JetBrains Mono', 'IBM Plex Mono', monospace`
  - Para porcentajes, etiquetas de sección y telemetría (`1 MINUTO`, `+37.78x`, `PASO 01`).

---

## 4. Componentes Corporativos Clave (`@en1minuto.es`)
1. **Isotipo Cronómetro (`OneMinuteStopwatch.tsx`)**:
   - Esfera circular minimalista sin pitorrillo superior (`#FFFFFF`, borde `#141413`, 12 marcas horarias).
   - Quesito interior terracota (`#D94E34`) que arranca en las 2:00 (`60°`) y barre en tiempo real hasta completar los `360°` al finalizar el minuto.
2. **Dock Corporativo Inferior (`140px`) + Barra de Tiempo Pasado**:
   - Barra superior de `6px` en terracota (`#D94E34`) + Dock inferior blanco con línea de progreso de `4px` en su borde superior, `<OneMinuteStopwatch size={56} mode="header" />`, `@en1minuto.es` (`1 MINUTO`) y lema `"Ideas clave de libros explicadas en 60 segundos"`.
3. **Tarjeta Final de Conversión (`CtaEndCard.tsx`)**:
   - El reloj se expande al centro (`size={110}`, `mode="hero"`, esfera `360°` completada), badge `"TIEMPO CUMPLIDO · 1 MINUTO DESTILADO"`, titular `"Aprende 1 libro al día en 60 segundos"`, botón pulsante `"🔔 SÍGUENOS EN @EN1MINUTO.ES"`, caja de pregunta a la comunidad y botones de guardar/compartir.
