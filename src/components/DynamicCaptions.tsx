import React, { useMemo } from 'react';
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
  /** Offset global en fotogramas donde arranca esta secuencia */
  sceneStartFrame?: number;
  /** Número de palabras por ventana deslizante (por defecto 3, cadencia TrendForge) */
  wordsPerWindow?: number;
}

/**
 * DynamicCaptions — Subtítulos en directo portados de TrendForge (SubtitleLayer.tsx):
 * 1. Ventana deslizante fija de 3 palabras (wordsPerWindow = 3) + tolerancia de retención de 0.45s (450ms)
 *    para eliminar cualquier parpadeo o corte entre palabras.
 * 2. Eliminación total de vibraciones:
 *    - Cero rebote vertical en el contenedor (solo fundido suave chunkFadeIn de 80ms).
 *    - Padding, margen y peso tipográfico idénticos entre palabra activa e inactiva (cero reflujo horizontal).
 *    - Escala sobre-amortiguada (SPRING_SNAPPY) que parte estrictamente de 1.0 -> 1.08 desde el centro.
 * 3. Texto sin fondo (backgroundColor: 'transparent') y tipografía editorial seria ('IBM Plex Sans', 'Inter').
 */
export const DynamicCaptions: React.FC<DynamicCaptionsProps> = ({
  wordTimestamps = [],
  sceneStartFrame = 0,
  wordsPerWindow = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - sceneStartFrame;
  const currentSec = localFrame / fps;
  const currentMs = currentSec * 1000;

  // Localizar palabra activa con margen de tolerancia de 0.45s (450ms) idéntico a TrendForge
  const activeWordIdx = useMemo(() => {
    if (!wordTimestamps.length) return -1;
    // 1. Búsqueda exacta de timestamp
    const exact = wordTimestamps.findIndex(
      (w) => currentMs >= w.startMs && currentMs < w.endMs
    );
    if (exact !== -1) return exact;

    // 2. Margen de tolerancia (450ms / 0.45s) para pausas naturales de dicción
    for (let i = wordTimestamps.length - 1; i >= 0; i--) {
      if (
        currentMs >= wordTimestamps[i].endMs &&
        currentMs < wordTimestamps[i].endMs + 450
      ) {
        return i;
      }
    }
    return -1;
  }, [wordTimestamps, currentMs]);

  if (wordTimestamps.length === 0 || activeWordIdx === -1) {
    return null;
  }

  // Agrupar en ventanas deslizantes fijas de 3 palabras (cadencia TrendForge)
  const windowStart =
    Math.floor(activeWordIdx / wordsPerWindow) * wordsPerWindow;
  const windowEnd = Math.min(wordTimestamps.length, windowStart + wordsPerWindow);
  const currentChunk = wordTimestamps.slice(windowStart, windowEnd);

  // Animación de entrada suave del grupo (0.08s / 80ms) sin sacudidas verticales
  const chunkStartMs = currentChunk[0]?.startMs ?? 0;
  const chunkFadeIn = interpolate(
    currentMs - chunkStartMs,
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
        top: SAFE_ZONE.maxSafeY - 172,
        height: 128,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 80,
        opacity: chunkFadeIn,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px 18px',
          maxWidth: SAFE_ZONE.maxSafeX - SAFE_ZONE.minSafeX,
          padding: '10px 20px',
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
        }}
      >
        {currentChunk.map((item, idx) => {
          const globalIdx = windowStart + idx;
          const isActive = globalIdx === activeWordIdx;

          // Animación spring suave sin oscilación resonante (partiendo de 1.0 como en TrendForge)
          const wordStartFrames = (item.startMs / 1000) * fps;
          const wordFrameOffset = Math.max(0, localFrame - wordStartFrames);
          const popSpring = spring({
            frame: isActive ? wordFrameOffset : 0,
            fps,
            config: SPRING_SNAPPY,
          });

          const activeScale = isActive
            ? interpolate(popSpring, [0, 1], [1.0, 1.08], CLAMP_EXTRAPOLATION)
            : 1.0;

          return (
            <span
              key={`${globalIdx}-${item.word}-${item.startMs}`}
              style={{
                fontFamily:
                  "'IBM Plex Sans', 'Inter', 'Helvetica Neue', -apple-system, system-ui, sans-serif",
                fontSize: 50,
                fontWeight: 700,
                letterSpacing: '-0.015em',
                lineHeight: 1.16,
                color: isActive ? PALETTE.accentPrimary : PALETTE.ink,
                backgroundColor: 'transparent',
                // Halo nítido del color del papel técnico (#F8F7F4) para lectura limpia sin fondo ni neón
                textShadow:
                  '0 2px 0 #F8F7F4, 0 -2px 0 #F8F7F4, 2px 0 0 #F8F7F4, -2px 0 0 #F8F7F4, 0 4px 12px rgba(248, 247, 244, 0.95)',
                transform: `scale(${activeScale})`,
                transformOrigin: 'center center',
                display: 'inline-block',
                willChange: 'transform',
                margin: '0 3px',
              }}
            >
              {item.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
