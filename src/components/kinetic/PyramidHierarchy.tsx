import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  CLAMP_EXTRAPOLATION,
  PALETTE,
  SPRING_SNAPPY,
} from '../../theme/motion';

export interface PyramidHierarchyProps {
  enterFrame?: number;
  baseLabel?: string;
  midLabel?: string;
  apexLabel?: string;
}

/**
 * Arquetipo #08 — PyramidHierarchy
 * Pirámide Jerárquica de 3 niveles que se construye desde los cimientos (Verde Salvia)
 * pasando por el bloque central (Ámbar) hasta coronar la cúspide (Terracota) con bordes suaves.
 */
export const PyramidHierarchy: React.FC<PyramidHierarchyProps> = ({
  enterFrame = 0,
  baseLabel = '1. DESCANSO, ENTORNO Y CERO DISTRACCIONES',
  midLabel = '2. BLOQUES DE TRABAJO PROFUNDO',
  apexLabel = '3. MAESTRÍA',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - enterFrame);

  const cardSpring = spring({
    frame: localFrame,
    fps,
    config: SPRING_SNAPPY,
  });

  // Se construye de abajo (base) hacia arriba (cúspide)
  const baseSpring = spring({
    frame: Math.max(0, localFrame - 6),
    fps,
    config: SPRING_SNAPPY,
  });
  const midSpring = spring({
    frame: Math.max(0, localFrame - 16),
    fps,
    config: SPRING_SNAPPY,
  });
  const apexSpring = spring({
    frame: Math.max(0, localFrame - 26),
    fps,
    config: { damping: 15, stiffness: 190, mass: 0.8 },
  });

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
          {/* Nivel 1: Base Cimientos (Verde Salvia) */}
          <g
            style={{
              opacity: baseSpring,
              transform: `translateY(${(1 - baseSpring) * 24}px)`,
              transformOrigin: '412px 320px',
            }}
          >
            <path
              d="M 192 252 L 632 252 L 722 362 L 102 362 Z"
              fill="rgba(61, 99, 82, 0.16)"
              stroke="#3D6352"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <text
              x="412"
              y="314"
              textAnchor="middle"
              fill="#141413"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontSize="20"
              fontWeight="800"
            >
              {baseLabel}
            </text>
          </g>

          {/* Nivel 2: Estrato Medio (Ámbar) */}
          <g
            style={{
              opacity: midSpring,
              transform: `translateY(${(1 - midSpring) * 24}px)`,
              transformOrigin: '412px 190px',
            }}
          >
            <path
              d="M 294 134 L 530 134 L 618 238 L 206 238 Z"
              fill="rgba(224, 142, 38, 0.18)"
              stroke="#E08E26"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <text
              x="412"
              y="194"
              textAnchor="middle"
              fill="#141413"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontSize="20"
              fontWeight="800"
            >
              {midLabel}
            </text>
          </g>

          {/* Nivel 3: Cúspide (Terracota) */}
          <g
            style={{
              opacity: apexSpring,
              transform: `scale(${interpolate(apexSpring, [0, 1], [0.78, 1], CLAMP_EXTRAPOLATION)})`,
              transformOrigin: '412px 75px',
            }}
          >
            <path
              d="M 412 14 L 518 120 L 306 120 Z"
              fill="#D94E34"
              stroke="#141413"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <text
              x="412"
              y="96"
              textAnchor="middle"
              fill="#FFFFFF"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontSize="19"
              fontWeight="900"
            >
              {apexLabel}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
