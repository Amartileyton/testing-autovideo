import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  CLAMP_EXTRAPOLATION,
  PALETTE,
  SPRING_SNAPPY,
  staggerDelay,
} from '../../theme/motion';

export interface CascadeStepItem {
  number: string;
  title: string;
  subtitle?: string;
  accentColor?: string;
}

export interface StepCascadeListProps {
  enterFrame?: number;
  steps?: CascadeStepItem[];
}

const DEFAULT_STEPS: CascadeStepItem[] = [
  {
    number: '1',
    title: 'Ritualiza tu bloque profundo',
    subtitle: 'Fija hora y lugar innegociables en tu calendario',
    accentColor: '#D94E34',
  },
  {
    number: '2',
    title: 'Abraza el aburrimiento',
    subtitle: 'Entrena a tu mente a resistir sin mirar el móvil',
    accentColor: '#E08E26',
  },
  {
    number: '3',
    title: 'Filtro 80/20 digital',
    subtitle: 'Conserva solo herramientas que multipliquen tu impacto',
    accentColor: '#3D6352',
  },
  {
    number: '4',
    title: 'Drena lo superficial',
    subtitle: 'Agrupa correos y recados en menos de 1 hora al día',
    accentColor: '#D94E34',
  },
];

/**
 * Arquetipo #04 — StepCascadeList
 * Escalera / Cascada de 4 Reglas con formas suavizadas, sangría progresiva orgánica
 * y colores corporativos (@en1minuto.es).
 */
export const StepCascadeList: React.FC<StepCascadeListProps> = ({
  enterFrame = 0,
  steps = DEFAULT_STEPS,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - enterFrame);

  const containerSpring = spring({
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
        padding: '28px 32px',
        boxShadow: '0 18px 44px rgba(20, 20, 19, 0.07)',
        boxSizing: 'border-box',
        opacity: containerSpring,
        transform: `translateY(${(1 - containerSpring) * 28}px)`,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {steps.map((step, idx) => {
          const delay = 6 + staggerDelay(idx, 10);
          const itemSpring = spring({
            frame: Math.max(0, localFrame - delay),
            fps,
            config: SPRING_SNAPPY,
          });
          const indentPx = idx * 22;
          const color = step.accentColor || '#D94E34';

          return (
            <div
              key={step.number}
              style={{
                marginLeft: indentPx,
                backgroundColor: '#FFFDF7',
                border: `2px solid ${color}`,
                borderLeft: `10px solid ${color}`,
                borderRadius: 22,
                padding: '16px 22px',
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                boxShadow: '0 8px 22px rgba(20, 20, 19, 0.04)',
                opacity: itemSpring,
                transform: `translateX(${(1 - itemSpring) * -28}px) scale(${interpolate(
                  itemSpring,
                  [0, 1],
                  [0.94, 1],
                  CLAMP_EXTRAPOLATION
                )})`,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: color,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 22,
                  fontWeight: 900,
                  flexShrink: 0,
                  boxShadow: `0 6px 14px ${color}33`,
                }}
              >
                {step.number}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 23,
                    fontWeight: 800,
                    color: '#141413',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.15,
                  }}
                >
                  {step.title}
                </span>
                {step.subtitle && (
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 16,
                      fontWeight: 600,
                      color: '#575550',
                      lineHeight: 1.25,
                    }}
                  >
                    {step.subtitle}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
