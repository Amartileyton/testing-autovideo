import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  CLAMP_EXTRAPOLATION,
  PALETTE,
  SPRING_SNAPPY,
  staggerDelay,
} from '../../theme/motion';

export interface FunnelFilterProps {
  enterFrame?: number;
  topStageLabel?: string;
  midStageLabel?: string;
  bottomStageLabel?: string;
  outputOutcomeLabel?: string;
}

/**
 * Arquetipo #07 — FunnelFilter
 * Embudo de Filtro Esencialista con trapecios de bordes redondeados suaves (strokeLinejoin="round")
 * que destilan 100 estímulos ruidosos en 1 prioridad esencial.
 */
export const FunnelFilter: React.FC<FunnelFilterProps> = ({
  enterFrame = 0,
  topStageLabel = '100 ESTÍMULOS Y URGENCIAS DEL DÍA',
  midStageLabel = 'FILTRO DE IMPACTO A LARGO PLAZO',
  bottomStageLabel = 'EL 1% ESENCIAL',
  outputOutcomeLabel = '1 META ÚNICA EJECUTADA HOY',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - enterFrame);

  const cardSpring = spring({
    frame: localFrame,
    fps,
    config: SPRING_SNAPPY,
  });

  const s1 = spring({
    frame: Math.max(0, localFrame - 6),
    fps,
    config: SPRING_SNAPPY,
  });
  const s2 = spring({
    frame: Math.max(0, localFrame - 6 - staggerDelay(1, 9)),
    fps,
    config: SPRING_SNAPPY,
  });
  const s3 = spring({
    frame: Math.max(0, localFrame - 6 - staggerDelay(2, 9)),
    fps,
    config: SPRING_SNAPPY,
  });
  const outSpring = spring({
    frame: Math.max(0, localFrame - 34),
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
          position: 'relative',
          width: '100%',
          height: 390,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <svg
          width="824"
          height="305"
          viewBox="0 0 824 305"
          style={{ overflow: 'visible' }}
        >
          {/* Etapa 1: Superior Ancha */}
          <g
            style={{
              opacity: s1,
              transform: `translateY(${(1 - s1) * -18}px)`,
              transformOrigin: '412px 50px',
            }}
          >
            <path
              d="M 84 12 L 740 12 L 644 96 L 180 96 Z"
              fill="#F3ECE0"
              stroke={PALETTE.cardBorder}
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <text
              x="412"
              y="62"
              textAnchor="middle"
              fill="#575550"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontSize="20"
              fontWeight="800"
            >
              {topStageLabel}
            </text>
          </g>

          {/* Etapa 2: Media Ámbar */}
          <g
            style={{
              opacity: s2,
              transform: `translateY(${(1 - s2) * -18}px)`,
              transformOrigin: '412px 150px',
            }}
          >
            <path
              d="M 192 110 L 632 110 L 542 194 L 282 194 Z"
              fill="rgba(224, 142, 38, 0.16)"
              stroke="#E08E26"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <text
              x="412"
              y="159"
              textAnchor="middle"
              fill="#141413"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontSize="19"
              fontWeight="800"
            >
              {midStageLabel}
            </text>
          </g>

          {/* Etapa 3: Cuello Terracota */}
          <g
            style={{
              opacity: s3,
              transform: `translateY(${(1 - s3) * -18}px)`,
              transformOrigin: '412px 245px',
            }}
          >
            <path
              d="M 296 208 L 528 208 L 484 288 L 340 288 Z"
              fill="#D94E34"
              stroke="#141413"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <text
              x="412"
              y="256"
              textAnchor="middle"
              fill="#FFFFFF"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontSize="19"
              fontWeight="900"
            >
              {bottomStageLabel}
            </text>
          </g>
        </svg>

        {/* Píldora Inferior de Meta Destilada */}
        <div
          style={{
            marginTop: 12,
            backgroundColor: '#FFFDF7',
            border: '3px solid #D94E34',
            borderRadius: 999,
            padding: '14px 34px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: '0 12px 28px rgba(217, 78, 52, 0.18)',
            opacity: outSpring,
            transform: `scale(${interpolate(outSpring, [0, 1], [0.82, 1], CLAMP_EXTRAPOLATION)})`,
          }}
        >
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              backgroundColor: '#D94E34',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 21,
              fontWeight: 900,
              color: '#141413',
              letterSpacing: '-0.02em',
            }}
          >
            {outputOutcomeLabel}
          </span>
        </div>
      </div>
    </div>
  );
};
