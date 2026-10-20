import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { WordTimestamp } from '../data/schema';
import {
  CLAMP_EXTRAPOLATION,
  PALETTE,
  SAFE_ZONE,
  SPRING_SNAPPY,
} from '../theme/motion';

export interface DynamicCaptionsProps {
  wordTimestamps: WordTimestamp[];
  /** Offset global en fotogramas donde arranca esta escena */
  sceneStartFrame?: number;
  /** Número de palabras por ventana deslizante (por defecto 3, cadencia TrendForge) */
  wordsPerWindow?: number;
}

/**
 * Localiza el índice de la palabra activa con la ventana de tolerancia de 450ms (0.45s)
 * reciclada de TrendForge (SubtitleLayer.tsx) para evitar parpadeos o desapariciones
 * en pausas prosódicas naturales entre palabras.
 */
function findActiveWordIndex(words: WordTimestamp[], currentMs: number): number {
  const exact = words.findIndex(
    (w) => currentMs >= w.startMs && currentMs < w.endMs
  );
  if (exact !== -1) return exact;

  // Ventana de tolerancia de 0.45s (450ms) tras el final de cada palabra
  for (let i = words.length - 1; i >= 0; i--) {
    if (currentMs >= words[i].endMs && currentMs < words[i].endMs + 450) {
      return i;
    }
  }
  return -1;
}

/**
 * DynamicCaptions — Subtítulos en directo con cadencia y anti-vibración recicladas de TrendForge:
 * 1. Ventana deslizante fija de 3 palabras (wordsPerWindow = 3) + tolerancia de 0.45s en pausas.
 * 2. Cero vibraciones de layout: sin rebote vertical en el contenedor, métricas de padding/fontWeight
 *    constantes entre estados activo/inactivo y escala sobre-amortiguada desde 1.0 -> 1.06 (nunca < 1.0).
 * 3. Texto sin fondo (backgroundless) y tipografía editorial seria ('IBM Plex Sans', 'Inter').
 * 4. Posicionado dentro del 85% superior activo (por encima de SAFE_ZONE.maxSafeY = 1632px).
 */
export const DynamicCaptions: React.FC<DynamicCaptionsProps> = ({
  wordTimestamps,
  sceneStartFrame = 0,
  wordsPerWindow = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - sceneStartFrame;
  const currentTimeMs = (localFrame / fps) * 1000;

  if (!wordTimestamps || wordTimestamps.length === 0) {
    return null;
  }

  const activeWordIdx = findActiveWordIndex(wordTimestamps, currentTimeMs);
  if (activeWordIdx === -1) {
    return null;
  }

  // Ventana deslizante fija de 3 palabras (cadencia TrendForge)
  const windowStart =
    Math.floor(activeWordIdx / wordsPerWindow) * wordsPerWindow;
  const visibleWords = wordTimestamps.slice(
    windowStart,
    windowStart + wordsPerWindow
  );

  // Transición suave de opacidad de grupo (80ms) sin rebote vertical para eliminar vibraciones
  const chunkStartMs = visibleWords[0]?.startMs ?? 0;
  const groupOpacity = interpolate(
    currentTimeMs - chunkStartMs,
    [0, 80],
    [0, 1],
    CLAMP_EXTRAPOLATION
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE_ZONE.horizontalPaddingPx,
        right: SAFE_ZONE.horizontalPaddingPx,
        top: SAFE_ZONE.maxSafeY - 168,
        height: 124,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
        opacity: groupOpacity,
        transform: 'translate3d(0, 0, 0)',
      }}
    >
      <div
        style={{
          backgroundColor: 'transparent',
          display: 'flex',
          flexWrap: 'nowrap',
          justifyContent: 'center',
          alignItems: 'baseline',
          maxWidth: SAFE_ZONE.maxSafeX - SAFE_ZONE.minSafeX,
        }}
      >
        {visibleWords.map((w, idx) => {
          const globalIdx = windowStart + idx;
          const isCurrent = globalIdx === activeWordIdx;
          const isPast = globalIdx < activeWordIdx;

          const wordStartFrame = Math.round((w.startMs / 1000) * fps);
          const framesSinceStart = Math.max(0, localFrame - wordStartFrame);

          const popSpring = spring({
            frame: isCurrent ? framesSinceStart : 0,
            fps,
            config: SPRING_SNAPPY,
          });

          // Escala que parte estrictamente de 1.0 (nunca < 1.0) para evitar micro-sacudidas
          const activeScale = isCurrent
            ? interpolate(popSpring, [0, 1], [1.0, 1.06], CLAMP_EXTRAPOLATION)
            : 1.0;

          const underlineScaleX = isCurrent
            ? interpolate(popSpring, [0, 1], [0.2, 1.0], CLAMP_EXTRAPOLATION)
            : 0;

          const wordColor = isCurrent
            ? PALETTE.accentPrimary
            : isPast
              ? PALETTE.ink
              : '#44423E';

          return (
            <span
              key={`${globalIdx}-${w.word}`}
              style={{
                position: 'relative',
                display: 'inline-block',
                margin: '0 10px',
                padding: '0 2px',
                fontFamily:
                  "'IBM Plex Sans', 'Inter', 'Helvetica Neue', 'Arial', system-ui, sans-serif",
                fontSize: 48,
                fontWeight: 700,
                lineHeight: 1.18,
                letterSpacing: '-0.015em',
                color: wordColor,
                backgroundColor: 'transparent',
                // Halo editorial cálido del color del papel (#F8F7F4) para legibilidad limpia sin fondo ni neón
                textShadow:
                  '0 2px 0 #F8F7F4, 0 -2px 0 #F8F7F4, 2px 0 0 #F8F7F4, -2px 0 0 #F8F7F4, 0 4px 10px rgba(248, 247, 244, 0.92)',
                transform: `scale(${activeScale})`,
                transformOrigin: 'center bottom',
                willChange: 'transform',
              }}
            >
              {w.word}
              {/* Subrayado arquitectónico fuera del flujo de layout (cero desplazamiento lateral) */}
              <span
                style={{
                  position: 'absolute',
                  left: 2,
                  right: 2,
                  bottom: -6,
                  height: 3.5,
                  borderRadius: 2,
                  backgroundColor: PALETTE.accentPrimary,
                  opacity: isCurrent ? 1 : 0,
                  transform: `scaleX(${underlineScaleX})`,
                  transformOrigin: 'left center',
                }}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
};
