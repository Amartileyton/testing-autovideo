import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CLAMP_EXTRAPOLATION, PALETTE, SPRING_SNAPPY } from '../../theme/motion';
import { LiveCounter } from './LiveCounter';

export interface ComparisonBattleProps {
  titleA: string;
  subtitleA: string;
  metricA?: { value: number; suffix?: string; prefix?: string; decimals?: number };
  tagA?: string;

  titleB: string;
  subtitleB: string;
  metricB?: { value: number; suffix?: string; prefix?: string; decimals?: number };
  tagB?: string;

  /** Fotograma local en el que entra la tarjeta A */
  enterFrameA?: number;
  /** Fotograma local en el que entra la tarjeta B */
  enterFrameB?: number;
  /** Fotograma local en el que se produce la 'batalla' (A pierde, B gana) */
  battleFrame?: number;

  accentColor?: string;
}

/**
 * ComparisonBattle — Tarjeta Dinámica de Confrontación A vs B
 * Fondo bloc de notas ocre pálido (#FDF6DF) y diseño limpio sin píldoras pequeñas superfluas.
 */
export const ComparisonBattle: React.FC<ComparisonBattleProps> = ({
  titleA,
  subtitleA,
  metricA,
  titleB,
  subtitleB,
  metricB,
  enterFrameA = 0,
  enterFrameB = 30,
  battleFrame = 90,
  accentColor = '#D94E34',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entradas escalonadas con spring
  const springA = spring({
    frame: Math.max(0, frame - enterFrameA),
    fps,
    config: SPRING_SNAPPY,
  });

  const springB = spring({
    frame: Math.max(0, frame - enterFrameB),
    fps,
    config: SPRING_SNAPPY,
  });

  // Estado de la batalla (resolución)
  const isBattled = frame >= battleFrame;
  const battleSpring = spring({
    frame: Math.max(0, frame - battleFrame),
    fps,
    config: SPRING_SNAPPY,
  });

  // Animación de la barra de progreso de B
  const progressB = spring({
    frame: Math.max(0, frame - battleFrame - 10),
    fps,
    config: { damping: 20, stiffness: 120, mass: 0.8 },
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        width: '100%',
        perspective: 1200,
      }}
    >
      {/* 1. Opción A (Perdedora / Tachada limpiamente) */}
      <div
        style={{
          backgroundColor: PALETTE.cardNotepad,
          border: isBattled
            ? `1.5px solid ${PALETTE.cardBorder}`
            : '1.5px solid rgba(45, 43, 40, 0.22)',
          borderRadius: 18,
          padding: '22px 28px',
          boxShadow: isBattled
            ? '0 4px 12px rgba(0, 0, 0, 0.03)'
            : '0 10px 30px rgba(45, 43, 40, 0.06)',
          opacity: interpolate(
            battleSpring,
            [0, 1],
            [springA, 0.52],
            CLAMP_EXTRAPOLATION
          ),
          transform: `scale(${interpolate(
            battleSpring,
            [0, 1],
            [springA, 0.97],
            CLAMP_EXTRAPOLATION
          )}) translateY(${(1 - springA) * 30}px)`,
          transformOrigin: 'center center',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                fontSize: 34,
                fontWeight: 900,
                color: isBattled ? '#78716C' : '#141413',
                letterSpacing: '-0.02em',
                textDecoration: isBattled ? 'line-through' : 'none',
              }}
            >
              {titleA}
            </div>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 16,
                fontWeight: 600,
                color: '#575550',
                marginTop: 4,
              }}
            >
              {subtitleA}
            </div>
          </div>

          {metricA && (
            <div style={{ textAlign: 'right' }}>
              <LiveCounter
                from={0}
                to={metricA.value}
                startFrame={enterFrameA}
                decimals={metricA.decimals ?? 0}
                prefix={metricA.prefix ?? ''}
                suffix={metricA.suffix ?? ''}
                fontSize={34}
                color={isBattled ? '#78716C' : '#141413'}
              />
            </div>
          )}
        </div>
      </div>

      {/* 2. Opción B (Ganadora / Solución de Alto Rendimiento) */}
      <div
        style={{
          backgroundColor: PALETTE.cardNotepad,
          border: isBattled
            ? `3px solid ${accentColor}`
            : `1.5px solid ${PALETTE.cardBorder}`,
          borderRadius: 20,
          padding: '26px 32px',
          boxShadow: isBattled
            ? `0 20px 45px rgba(217, 78, 52, 0.16), 0 2px 8px rgba(0, 0, 0, 0.04)`
            : '0 10px 30px rgba(45, 43, 40, 0.06)',
          opacity: springB,
          transform: `scale(${interpolate(
            battleSpring,
            [0, 1],
            [springB, 1.03],
            CLAMP_EXTRAPOLATION
          )}) translateY(${(1 - springB) * 35}px)`,
          transformOrigin: 'center center',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                fontSize: 40,
                fontWeight: 900,
                color: '#141413',
                letterSpacing: '-0.03em',
              }}
            >
              {titleB}
            </div>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 17,
                color: '#575550',
                marginTop: 4,
                fontWeight: 600,
              }}
            >
              {subtitleB}
            </div>
          </div>

          {metricB && (
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <LiveCounter
                from={1}
                to={metricB.value}
                startFrame={battleFrame + 5}
                decimals={metricB.decimals ?? 0}
                prefix={metricB.prefix ?? ''}
                suffix={metricB.suffix ?? ''}
                fontSize={46}
                color={accentColor}
              />
            </div>
          )}
        </div>

        {/* Barra de progreso / aceleración reactiva */}
        <div
          style={{
            marginTop: 18,
            width: '100%',
            height: 10,
            backgroundColor: 'rgba(217, 78, 52, 0.15)',
            borderRadius: 5,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${interpolate(progressB, [0, 1], [15, 100], CLAMP_EXTRAPOLATION)}%`,
              height: '100%',
              backgroundColor: accentColor,
              borderRadius: 5,
            }}
          />
        </div>
      </div>
    </div>
  );
};
