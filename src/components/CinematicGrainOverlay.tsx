import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface CinematicGrainOverlayProps {
  opacity?: number;
  blendMode?: 'overlay' | 'soft-light' | 'screen' | 'color-dodge';
  animated?: boolean;
}

/**
 * CinematicGrainOverlay — Capa de Grano Fílmico Procedural (Haidrrrry Rule)
 * Evita el aspecto digital plano ("vector estéril") introduciendo una textura analógica
 * sutil mediante SVG procedural sin costo de assets externos.
 */
export const CinematicGrainOverlay: React.FC<CinematicGrainOverlayProps> = ({
  opacity = 0.055,
  blendMode = 'overlay',
  animated = true,
}) => {
  const frame = useCurrentFrame();
  const seed = animated ? (frame % 24) * 3 + 1 : 1;
  const filterId = `cinematic-grain-${seed}`;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 900,
        opacity,
        mixBlendMode: blendMode,
      }}
    >
      <svg
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={3}
            stitchTiles="stitch"
            seed={seed}
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} />
      </svg>
    </div>
  );
};
