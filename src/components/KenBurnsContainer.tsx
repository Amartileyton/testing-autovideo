import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { CLAMP_EXTRAPOLATION, MOTION_EASING } from '../theme/motion';

export type KenBurnsPanDirection =
  | 'zoom-in'
  | 'zoom-out'
  | 'pan-up'
  | 'pan-down'
  | 'pan-left'
  | 'pan-right'
  | 'subtle-drift';

export interface KenBurnsContainerProps {
  children: React.ReactNode;
  durationInFrames: number;
  startScale?: number;
  endScale?: number;
  panDirection?: KenBurnsPanDirection;
  panDistancePx?: number;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * KenBurnsContainer — Animador Cinemático de Assets Estáticos (Haidrrrry Motion Rules)
 * Prohíbe que cualquier portada, ilustración o captura permanezca estática en pantalla.
 * Aplica un micro-paneo continuo y zoom no lineal determinista.
 */
export const KenBurnsContainer: React.FC<KenBurnsContainerProps> = ({
  children,
  durationInFrames,
  startScale = 1.0,
  endScale = 1.07,
  panDirection = 'subtle-drift',
  panDistancePx = 16,
  style = {},
  className = '',
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [0, Math.max(1, durationInFrames)],
    [0, 1],
    {
      ...CLAMP_EXTRAPOLATION,
      easing: MOTION_EASING.quartOut,
    }
  );

  const scale = interpolate(
    progress,
    [0, 1],
    [startScale, endScale],
    CLAMP_EXTRAPOLATION
  );

  let translateX = 0;
  let translateY = 0;

  switch (panDirection) {
    case 'pan-up':
      translateY = interpolate(progress, [0, 1], [0, -panDistancePx], CLAMP_EXTRAPOLATION);
      break;
    case 'pan-down':
      translateY = interpolate(progress, [0, 1], [0, panDistancePx], CLAMP_EXTRAPOLATION);
      break;
    case 'pan-left':
      translateX = interpolate(progress, [0, 1], [0, -panDistancePx], CLAMP_EXTRAPOLATION);
      break;
    case 'pan-right':
      translateX = interpolate(progress, [0, 1], [0, panDistancePx], CLAMP_EXTRAPOLATION);
      break;
    case 'subtle-drift':
      translateX = interpolate(progress, [0, 1], [0, panDistancePx * 0.7], CLAMP_EXTRAPOLATION);
      translateY = interpolate(progress, [0, 1], [0, -panDistancePx * 0.5], CLAMP_EXTRAPOLATION);
      break;
    case 'zoom-out':
      // El scale ya maneja zoom-out si endScale < startScale, o invertimos
      break;
    case 'zoom-in':
    default:
      break;
  }

  return (
    <div
      className={className}
      style={{
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
};
