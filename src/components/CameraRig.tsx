import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  CLAMP_EXTRAPOLATION,
  PALETTE,
  SPRING_CAMERA,
} from '../theme/motion';

export interface CameraKeyframe {
  frame: number;
  x: number;
  y: number;
  zoom: number;
  rotateDeg?: number;
}

export interface CameraRigProps {
  keyframes: CameraKeyframe[];
  surfaceColor?: string;
  children: React.ReactNode;
}

/**
 * CameraRig — Aparejo de Cámara Continua sobre Lienzo Único
 * Impulsado exclusivamente por SPRING_CAMERA ({ damping: 30, stiffness: 90, mass: 1.2 })
 * y useCurrentFrame(). Cero CSS transitions.
 */
export const CameraRig: React.FC<CameraRigProps> = ({
  keyframes,
  surfaceColor = PALETTE.surface,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  let currentX = keyframes[0]?.x ?? 0;
  let currentY = keyframes[0]?.y ?? 0;
  let currentZoom = keyframes[0]?.zoom ?? 1;
  let currentRotate = keyframes[0]?.rotateDeg ?? 0;

  for (let i = 1; i < keyframes.length; i++) {
    const prev = keyframes[i - 1];
    const next = keyframes[i];
    if (frame >= prev.frame) {
      const progress = spring({
        frame: frame - prev.frame,
        fps,
        config: SPRING_CAMERA,
      });

      currentX = interpolate(progress, [0, 1], [currentX, next.x], CLAMP_EXTRAPOLATION);
      currentY = interpolate(progress, [0, 1], [currentY, next.y], CLAMP_EXTRAPOLATION);
      currentZoom = interpolate(
        progress,
        [0, 1],
        [currentZoom, next.zoom],
        CLAMP_EXTRAPOLATION
      );
      currentRotate = interpolate(
        progress,
        [0, 1],
        [currentRotate, next.rotateDeg ?? 0],
        CLAMP_EXTRAPOLATION
      );
    }
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: surfaceColor,
        overflow: 'hidden',
      }}
    >
      {/* Cuadrícula técnica editorial sutil (Zero-Neon) */}
      <svg
        width={width}
        height={height}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <pattern
            id="editorial-grid"
            width={72}
            height={72}
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${-currentX * 0.25}, ${-currentY * 0.25})`}
          >
            <path
              d="M 72 0 L 0 0 0 72"
              fill="none"
              stroke={PALETTE.gridLine}
              strokeWidth={1.5}
            />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#editorial-grid)" />
      </svg>

      {/* Lienzo continuo transformado matemáticamente */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          transformOrigin: `${width / 2}px ${height / 2}px`,
          transform: `translate3d(${-currentX}px, ${-currentY}px, 0) scale(${currentZoom}) rotate(${currentRotate}deg)`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
