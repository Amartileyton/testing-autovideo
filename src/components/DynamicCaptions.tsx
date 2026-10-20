import React, { useMemo } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { WordTimestamp } from '../data/schema';
import {
  CLAMP_EXTRAPOLATION,
  PALETTE,
  SAFE_ZONE,
  SPRING_SNAPPY,
} from '../theme/motion';
import { VectorSelectionBox } from './blueprints/ResultaaqueeBlueprints';

export type CaptionVariant =
  | 'vector-box'      // Ref 2 & Ref 3: Marco de selección vectorial azul Figma (#3B82F6) con 4 nodos
  | 'ochre-blueprint' // Ref 1: Texto blanco con acento ocre (#FBBF24) sobre azul ingeniería
  | 'red-pill'        // Ref 5: Pastilla rectangular roja (#DC2626) sobre laboratorio oscuro
  | 'editorial-clean'; // Modo papel técnico claro (#F8F7F4)

export type CaptionPlacement = 'upper' | 'middle' | 'lower';

export interface DynamicCaptionsProps {
  wordTimestamps: WordTimestamp[];
  /** Offset global en fotogramas donde arranca esta secuencia */
  sceneStartFrame?: number;
  /** Número de palabras por ventana deslizante (por defecto 5 en vector-box/ochre, 3 en red-pill/editorial) */
  wordsPerWindow?: number;
  /** Variante estética extraída de los vídeos de referencia de @resultaaquee */
  variant?: CaptionVariant;
  /** Ubicación vertical en el lienzo 9:16 (upper = tercio superior Ref 2/3, middle = bajo raíl Ref 5, lower = tercio inferior Ref 1) */
  placement?: CaptionPlacement;
}

/**
 * Detecta si una palabra es un término clave semántico (sustantivo/cifra/concepto)
 * para aplicarle el marco de selección vectorial o acento ocre al estilo @resultaaquee.
 */
function isSemanticKeyword(word: string): boolean {
  const clean = word.replace(/[.,;:¡!¿?«»"']/g, '').toLowerCase();
  if (clean.length >= 6) return true;
  if (/\d/.test(clean)) return true;
  const hooks = new Set([
    'cero',
    'uno',
    'dos',
    'tres',
    'cuatro',
    'diez',
    'mil',
    'millón',
    'luz',
    'eco',
    'poro',
    'piel',
    'chip',
    'mapa',
    'onda',
    'aire',
    'ojo',
  ]);
  return hooks.has(clean);
}

/**
 * DynamicCaptions — Motor de Subtítulos @resultaaquee + TrendForge Sync:
 * 1. Tolerancia de retención de 450ms (0.45s) en pausas naturales.
 * 2. Cero vibraciones y cero reflujo horizontal:
 *    - Todas las palabras (activas e inactivas) comparten exactamente el mismo box-model
 *      (padding: '2px 10px', border: '2.5px solid ...', fontWeight: 700).
 *    - Escala sobre-amortiguada (SPRING_SNAPPY) acotada de 1.0 a 1.05.
 * 3. Soporta los 4 modos visuales: 'vector-box' (Ref 2/3), 'ochre-blueprint' (Ref 1),
 *    'red-pill' (Ref 5) y 'editorial-clean'.
 */
export const DynamicCaptions: React.FC<DynamicCaptionsProps> = ({
  wordTimestamps = [],
  sceneStartFrame = 0,
  wordsPerWindow,
  variant = 'vector-box',
  placement = 'lower',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - sceneStartFrame;
  const currentSec = localFrame / fps;
  const currentMs = currentSec * 1000;

  const effectiveWindowSize =
    wordsPerWindow ??
    (variant === 'vector-box' || variant === 'ochre-blueprint' ? 5 : 3);

  // Localizar palabra activa con margen de tolerancia de 450ms (0.45s)
  const activeWordIdx = useMemo(() => {
    if (!wordTimestamps.length) return -1;
    const exact = wordTimestamps.findIndex(
      (w) => currentMs >= w.startMs && currentMs < w.endMs
    );
    if (exact !== -1) return exact;

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

  const windowStart =
    Math.floor(activeWordIdx / effectiveWindowSize) * effectiveWindowSize;
  const windowEnd = Math.min(
    wordTimestamps.length,
    windowStart + effectiveWindowSize
  );
  const currentChunk = wordTimestamps.slice(windowStart, windowEnd);

  const chunkStartMs = currentChunk[0]?.startMs ?? 0;
  const chunkFadeIn = interpolate(
    currentMs - chunkStartMs,
    [0, 80],
    [0, 1],
    CLAMP_EXTRAPOLATION
  );

  // Determinar qué palabra del bloque lleva el VectorSelectionBox (nunca conectores/artículos)
  const boxedGlobalIdx = useMemo(() => {
    let candidate = -1;
    for (let i = windowStart; i <= activeWordIdx && i < windowEnd; i++) {
      if (isSemanticKeyword(wordTimestamps[i].word)) {
        candidate = i;
      }
    }
    if (candidate !== -1) return candidate;
    for (let i = windowStart; i < windowEnd; i++) {
      if (isSemanticKeyword(wordTimestamps[i].word)) {
        return i;
      }
    }
    return activeWordIdx;
  }, [wordTimestamps, windowStart, windowEnd, activeWordIdx]);

  // Posición vertical según placement (siempre dentro de SAFE_ZONE 85% superior)
  const topPosition =
    placement === 'upper'
      ? SAFE_ZONE.upperThirdCaptionY
      : placement === 'middle'
        ? 1140
        : SAFE_ZONE.maxSafeY - 180;

  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE_ZONE.horizontalPaddingPx,
        right: SAFE_ZONE.horizontalPaddingPx,
        top: topPosition,
        minHeight: 132,
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
          gap: '10px 8px',
          maxWidth: SAFE_ZONE.maxSafeX - SAFE_ZONE.minSafeX,
          padding: '8px 16px',
          backgroundColor: 'transparent',
        }}
      >
        {currentChunk.map((item, idx) => {
          const globalIdx = windowStart + idx;
          const isActive = globalIdx === activeWordIdx;
          const isPastOrCurrent = globalIdx <= activeWordIdx;
          const isKeyword = isSemanticKeyword(item.word);

          const wordStartFrames = (item.startMs / 1000) * fps;
          const wordFrameOffset = Math.max(0, localFrame - wordStartFrames);
          const popSpring = spring({
            frame: isActive ? wordFrameOffset : 0,
            fps,
            config: SPRING_SNAPPY,
          });

          const activeScale = isActive
            ? interpolate(popSpring, [0, 1], [1.0, 1.05], CLAMP_EXTRAPOLATION)
            : 1.0;

          // MODO 1: Vector Selection Box (Ref 2 Teclado iPhone & Ref 3 Gancho del Metro)
          // Exactamente 1 marco de selección vectorial activo a la vez sobre la palabra clave pronunciada
          if (variant === 'vector-box') {
            const showBox = globalIdx === boxedGlobalIdx;
            return (
              <span
                key={`${globalIdx}-${item.word}-${item.startMs}`}
                style={{
                  transform: `scale(${activeScale})`,
                  transformOrigin: 'center center',
                  display: 'inline-block',
                }}
              >
                <VectorSelectionBox
                  active={showBox}
                  color="#3B82F6"
                  showRotationStem={true}
                >
                  <span
                    style={{
                      fontFamily:
                        "'IBM Plex Sans', 'Inter', 'Helvetica Neue', system-ui, sans-serif",
                      fontSize: 48,
                      fontWeight: 700,
                      letterSpacing: '-0.015em',
                      lineHeight: 1.18,
                      color: isActive
                        ? '#FFFFFF'
                        : isPastOrCurrent && isKeyword
                          ? '#F8FAFC'
                          : isPastOrCurrent
                            ? '#CBD5E1'
                            : '#8E8E93',
                      textShadow: '0 2px 10px rgba(0, 0, 0, 0.65)',
                    }}
                  >
                    {item.word}
                  </span>
                </VectorSelectionBox>
              </span>
            );
          }

          // MODO 2: Ochre Blueprint (Ref 1 — 1.000 botellas y 10 catadores)
          if (variant === 'ochre-blueprint') {
            const highlightOchre = isActive || (isPastOrCurrent && isKeyword);
            return (
              <span
                key={`${globalIdx}-${item.word}-${item.startMs}`}
                style={{
                  fontFamily:
                    "'IBM Plex Sans', 'Inter', 'Helvetica Neue', system-ui, sans-serif",
                  fontSize: 48,
                  fontWeight: 700,
                  letterSpacing: '-0.015em',
                  lineHeight: 1.18,
                  padding: '2px 8px',
                  color: highlightOchre
                    ? '#FBBF24'
                    : isPastOrCurrent
                      ? '#FFFFFF'
                      : 'rgba(255, 255, 255, 0.55)',
                  textShadow: '0 2px 8px rgba(15, 53, 94, 0.75)',
                  transform: `scale(${activeScale})`,
                  transformOrigin: 'center center',
                  display: 'inline-block',
                }}
              >
                {item.word}
              </span>
            );
          }

          // MODO 3: Red Pill (Ref 5 — Las palomas y la cronofotografía)
          if (variant === 'red-pill') {
            return (
              <span
                key={`${globalIdx}-${item.word}-${item.startMs}`}
                style={{
                  fontFamily:
                    "'IBM Plex Sans', 'Inter', 'Helvetica Neue', system-ui, sans-serif",
                  fontSize: 48,
                  fontWeight: 700,
                  letterSpacing: '-0.015em',
                  lineHeight: 1.15,
                  padding: '2px 10px',
                  borderRadius: 4,
                  backgroundColor: isActive ? '#DC2626' : 'transparent',
                  border: isActive
                    ? '1.5px solid #FCA5A5'
                    : '1.5px solid transparent',
                  color: '#FFFFFF',
                  transform: `scale(${activeScale})`,
                  transformOrigin: 'center center',
                  display: 'inline-block',
                  boxSizing: 'border-box',
                }}
              >
                {item.word}
              </span>
            );
          }

          // MODO 4: Editorial Clean (Papel técnico claro #F8F7F4)
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
                textShadow:
                  '0 2px 0 #F8F7F4, 0 -2px 0 #F8F7F4, 2px 0 0 #F8F7F4, -2px 0 0 #F8F7F4, 0 4px 12px rgba(248, 247, 244, 0.95)',
                transform: `scale(${activeScale})`,
                transformOrigin: 'center center',
                display: 'inline-block',
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
