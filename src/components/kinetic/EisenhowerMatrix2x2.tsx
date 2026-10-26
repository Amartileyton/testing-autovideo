import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  CLAMP_EXTRAPOLATION,
  PALETTE,
  SPRING_SNAPPY,
  staggerDelay,
} from '../../theme/motion';

export interface MatrixQuadrantItem {
  title: string;
  subtitle: string;
  isWinner?: boolean;
  tone?: 'terracotta' | 'amber' | 'muted';
}

export interface EisenhowerMatrix2x2Props {
  enterFrame?: number;
  quadrants?: [
    MatrixQuadrantItem,
    MatrixQuadrantItem,
    MatrixQuadrantItem,
    MatrixQuadrantItem,
  ];
}

const DEFAULT_QUADRANTS: [
  MatrixQuadrantItem,
  MatrixQuadrantItem,
  MatrixQuadrantItem,
  MatrixQuadrantItem,
] = [
  {
    title: 'ALTO IMPACTO · NO URGENTE',
    subtitle: 'Zona de Trabajo Profundo y activos',
    isWinner: true,
    tone: 'terracotta',
  },
  {
    title: 'ALTO IMPACTO · URGENTE',
    subtitle: 'Entregas críticas e incendios reales',
    tone: 'amber',
  },
  {
    title: 'BAJO IMPACTO · NO URGENTE',
    subtitle: 'Redes sociales y navegación pasiva',
    tone: 'muted',
  },
  {
    title: 'BAJO IMPACTO · URGENTE',
    subtitle: 'Interrupciones y recados ajenos',
    tone: 'muted',
  },
];

/**
 * Arquetipo #10 — EisenhowerMatrix2x2
 * Matriz 2x2 de Decisión Estratégica con tarjetas internas suavizadas y elevación elástica
 * en el cuadrante ganador.
 */
export const EisenhowerMatrix2x2: React.FC<EisenhowerMatrix2x2Props> = ({
  enterFrame = 0,
  quadrants = DEFAULT_QUADRANTS,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - enterFrame);

  const cardSpring = spring({
    frame: localFrame,
    fps,
    config: SPRING_SNAPPY,
  });

  return (
    <div
      style={{
        width: 888,
        backgroundColor: PALETTE.cardNotepad,
        border: `2.5px solid ${PALETTE.cardBorder}`,
        borderRadius: 28,
        padding: '28px 30px',
        boxShadow: '0 18px 44px rgba(20, 20, 19, 0.07)',
        boxSizing: 'border-box',
        opacity: cardSpring,
        transform: `translateY(${(1 - cardSpring) * 28}px)`,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 18,
        }}
      >
        {quadrants.map((q, idx) => {
          const qSpring = spring({
            frame: Math.max(0, localFrame - 6 - staggerDelay(idx, 7)),
            fps,
            config: SPRING_SNAPPY,
          });

          const isWinner = Boolean(q.isWinner);
          const bg = isWinner
            ? 'rgba(217, 78, 52, 0.11)'
            : q.tone === 'amber'
              ? 'rgba(224, 142, 38, 0.12)'
              : '#F5EFE0';
          const border = isWinner
            ? '3px solid #D94E34'
            : q.tone === 'amber'
              ? '2.5px solid #E08E26'
              : `2px solid ${PALETTE.cardBorder}`;

          return (
            <div
              key={idx}
              style={{
                backgroundColor: bg,
                border,
                borderRadius: 22,
                padding: '26px 24px',
                minHeight: 162,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 10,
                boxShadow: isWinner
                  ? '0 12px 28px rgba(217, 78, 52, 0.14)'
                  : 'none',
                opacity: qSpring,
                transform: `scale(${interpolate(
                  qSpring,
                  [0, 1],
                  [0.92, isWinner ? 1.02 : 1],
                  CLAMP_EXTRAPOLATION
                )})`,
              }}
            >
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 18.5,
                  fontWeight: 900,
                  color: isWinner ? '#D94E34' : '#141413',
                  letterSpacing: '-0.01em',
                }}
              >
                {q.title}
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 16.5,
                  fontWeight: isWinner ? 800 : 600,
                  color: isWinner ? '#141413' : '#575550',
                  lineHeight: 1.3,
                }}
              >
                {q.subtitle}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
