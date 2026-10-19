# LESSONS.md — Memoria Persistente de Producción (Remotion + ElevenLabs)

> **Propósito**: Registro acumulativo de auditorías de layout, sincronización audio-first, presupuestos de fotogramas (*Frame Budget*) y correcciones del Critic Gate tras cada renderizado. Todo subagente constructor (Slots 2, 3, 4 y 5) debe consultar este archivo antes de escribir código.

---

## 1. Reglas Base de Verificación Pre-Render
- **Zona Segura Vertical (9:16 - 1080x1920)**: Ningún titular, subtítulo o vector principal puede invadir los `288px` inferiores (`y > 1632px`).
- **Padding Lateral**: Mínimo `96px` a izquierda y derecha (`x` dentro de `[96, 984]`).
- **Tipografía Mínima**: Titulares $\ge 64\text{px}$ ($\le 7$ palabras); etiquetas $\ge 28\text{px}$ ($\le 15\text{-}20$ palabras por plano).
- **Física de Movimiento**: Prohibido CSS `transition` o `@keyframes`. Solo `SPRING_SNAPPY` y `SPRING_CAMERA` con `extrapolateLeft: "clamp"` y `extrapolateRight: "clamp"`.
- **Sincronización ElevenLabs**: El `durationInFrames` de cada `<Sequence>` debe coincidir al fotograma con `public/audio/info.json`.

---

## 2. Registro Histórico de Lecciones y Correcciones

| Fecha | Escena / Componente | Categoría (`Layout` / `Timing` / `Audio` / `Camera`) | Incidencia Detectada | Causa Raíz | Solución Aplicada / Regla Derivada |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 2026-10-19 | `Setup Inicial (Nivel 0)` | `Arquitectura` | Inicialización del estudio vectorial | N/A | Se establece baseline: `FPS=30`, `1080x1920`, superficie `#F8F7F4`, cross-dissolve de `10` fotogramas y auditoría `ffprobe` obligatoria. |

---

## 3. Plantilla para Nuevas Entradas (Post-Render)

```markdown
### [YYYY-MM-DD] Render ID / Producción: <Nombre del Vídeo>
- **Puntuación Critic Gate**: Media X.X / 10 (Layout: X.X | Timing: X.X | Tipografía: X.X | Audio-Sync: X.X)
- **Errores de Layout Corregidos**:
  - [Escena X, Frame Y]: <Descripción del solapamiento o desborde y ajuste de coordenadas>
- **Desviaciones de Timing / ElevenLabs**:
  - [Escena X]: <Ritmo en palabras/s, leading/trailing silence detectado por ffprobe y ajuste de offset>
- **Regla Permanente Añadida**:
  - <Directriz accionable para evitar recurrencia en próximos renders>
```
