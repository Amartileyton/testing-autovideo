import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  CLAMP_EXTRAPOLATION,
  PALETTE,
  SPRING_CAMERA,
  SPRING_SNAPPY,
} from '../../theme/motion';

export interface VennConvergenceProps {
  enterFrame?: number;
  leftCircleLabel?: string;
  rightCircleLabel?: string;
  bottomCircleLabel?: string;
  centerCoreLabel?: string;
}

/**
 * Arquetipo #09 — VennConvergence
 * Convergencia de 3 anillos orgánicos translúcidos que deslizan suavemente con SPRING_CAMERA
 * hacia el centro e iluminan el núcleo de valor único con SPRING_SNAPPY.
 */
export const VennConvergence: React.FC<VennConvergenceProps> = ({
  enterFrame = 0,
  leftCircleLabel = 'HABILIDAD ESPECIAL',
  rightCircleLabel = 'ENFOQUE INTENSIVO',
  bottomCircleLabel = 'ALTA DEMANDA',
  centerCoreLabel = 'VALOR ÚNICO',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - enterFrame);

  const cardSpring = spring({
    frame: localFrame,
    fps,
    config: SPRING_SNAPPY,
  });

  const convergeSpring = spring({
    frame: Math.max(0, localFrame - 6),
    fps,
    config: SPRING_CAMERA,
  });

  const coreSpring = spring({
    frame: Math.max(0, localFrame - 24),
    fps,
    config: SPRING_SNAPPY,
  });

  const spread = interpolate(convergeSpring, [0, 1], [54, 0], CLAMP_EXTRAPOLATION);

  return (
    <div
      style={{
        width: 888,
        backgroundColor: PALETTE.cardNotepad,
        border: `2.5px solid ${PALETTE.cardBorder}`,
        borderRadius: 28,
        padding: '28px 32px',
        boxShadow: '0 18px 44px rgba(20, 20, 19, 0.07)',
        boxSizing: 'border-box',
        opacity: cardSpring,
        transform: `translateY(${(1 - cardSpring) * 28}px)`,
      }}
    >
      <div
        style={{
          width: '100%',
          height: 390,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="824"
          height="380"
          viewBox="0 0 824 380"
          style={{ overflow: 'visible' }}
        >
          {/* Círculo Izquierdo: Terracota */}
          <g transform={`translate(${-spread}, ${-spread * 0.4})`}>
            <circle
              cx="326"
              cy="148"
              r="118"
              fill="rgba(217, 78, 52, 0.14)"
              stroke="#D94E34"
              strokeWidth="4"
            />
            <text
              x="262"
              y="128"
              textAnchor="middle"
              fill="#D94E34"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontSize="16.5"
              fontWeight="900"
            >
              {leftCircleLabel}
            </text>
          </g>

          {/* Círculo Derecho: Ámbar */}
          <g transform={`translate(${spread}, ${-spread * 0.4})`}>
            <circle
              cx="498"
              cy="148"
              r="118"
              fill="rgba(224, 142, 38, 0.15)"
              stroke="#E08E26"
              strokeWidth="4"
            />
            <text
              x="562"
              y="128"
              textAnchor="middle"
              fill="#B45309"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontSize="16.5"
              fontWeight="900"
            >
              {rightCircleLabel}
            </text>
          </g>

          {/* Círculo Inferior: Verde Salvia */}
          <g transform={`translate(0, ${spread * 0.7})`}>
            <circle
              cx="412"
              cy="252"
              r="118"
              fill="rgba(61, 99, 82, 0.14)"
              stroke="#3D6352"
              strokeWidth="4"
            />
            <text
              x="412"
              y="324"
              textAnchor="middle"
              fill="#3D6352"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontSize="16.5"
              fontWeight="900"
            >
              {bottomCircleLabel}
            </text>
          </g>

          {/* Núcleo Central de Convergencia */}
          <g
            style={{
              opacity: coreSpring,
              transform: `scale(${interpolate(coreSpring, [0, 1], [0.5, 1], CLAMP_EXTRAPOLATION)})`,
              transformOrigin: '412px 186px',
            }}
          >
            <circle
              cx="412"
              cy="186"
              r="58"
              fill="#D94E34"
              stroke="#141413"
              strokeWidth="3.5"
            />
            <text
              x="412"
              y="192"
              textAnchor="middle"
              fill="#FFFFFF"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontSize="16.5"
              fontWeight="900"
            >
              {centerCoreLabel}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
