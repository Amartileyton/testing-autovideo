import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CLAMP_EXTRAPOLATION, PALETTE, SPRING_SNAPPY } from '../../theme/motion';

export interface ParetoBarChartProps {
  enterFrame?: number;
  highImpactTitle?: string;
  highImpactPercent?: number;
  highImpactPoints?: string[];
  lowImpactTitle?: string;
  lowImpactPercent?: number;
  lowImpactPoints?: string[];
}

/**
 * Arquetipo #05 — ParetoBarChart
 * Visualiza la Ley 80/20 (Desproporción de Impacto) con barras orgánicas redondeadas,
 * crecimiento elástico determinista y contadores numéricos sincronizados.
 */
export const ParetoBarChart: React.FC<ParetoBarChartProps> = ({
  enterFrame = 0,
  highImpactTitle = 'TAREAS CRÍTICAS (20%)',
  highImpactPercent = 80,
  highImpactPoints = [
    '1 o 2 bloques profundos',
    'Cero notificaciones',
    'Mueve la aguja real',
  ],
  lowImpactTitle = 'RUIDO OPERATIVO (80%)',
  lowImpactPercent = 20,
  lowImpactPoints = [
    'Correos y urgencias ajenas',
    'Reuniones sin agenda',
    'Bajo retorno cognitivo',
  ],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - enterFrame);

  const cardSpring = spring({
    frame: localFrame,
    fps,
    config: SPRING_SNAPPY,
  });

  const leftBarProgress = spring({
    frame: Math.max(0, localFrame - 10),
    fps,
    config: { damping: 18, stiffness: 140, mass: 0.9 },
  });

  const rightBarProgress = spring({
    frame: Math.max(0, localFrame - 20),
    fps,
    config: SPRING_SNAPPY,
  });

  const currentHighPct = Math.round(
    interpolate(leftBarProgress, [0, 1], [0, highImpactPercent], CLAMP_EXTRAPOLATION)
  );
  const currentLowPct = Math.round(
    interpolate(rightBarProgress, [0, 1], [0, lowImpactPercent], CLAMP_EXTRAPOLATION)
  );

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
        transform: `translateY(${(1 - cardSpring) * 30}px) scale(${interpolate(
          cardSpring,
          [0, 1],
          [0.94, 1],
          CLAMP_EXTRAPOLATION
        )})`,
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
        {/* Columna Izquierda: 20% Esfuerzo -> 80% Impacto */}
        <div
          style={{
            backgroundColor: '#FFFDF7',
            border: '2.5px solid #D94E34',
            borderRadius: 24,
            padding: '22px 22px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 12px 30px rgba(217, 78, 52, 0.10)',
          }}
        >
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 21,
              fontWeight: 900,
              color: '#D94E34',
              letterSpacing: '-0.01em',
              marginBottom: 16,
            }}
          >
            {highImpactTitle}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 18,
              height: 290,
            }}
          >
            {/* Barra 80% con bordes redondeados suaves */}
            <div
              style={{
                width: 128,
                height: `${Math.max(18, leftBarProgress * 100)}%`,
                background: 'linear-gradient(180deg, #E25B42 0%, #D94E34 100%)',
                borderRadius: 22,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 24px rgba(217, 78, 52, 0.26)',
              }}
            >
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 38,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  letterSpacing: '-0.03em',
                }}
              >
                {currentHighPct}%
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: 800,
                  color: 'rgba(255,255,255,0.9)',
                }}
              >
                RESULTADOS
              </span>
            </div>

            <div style={{ flex: 1, paddingBottom: 12 }}>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 19,
                  fontWeight: 800,
                  color: '#141413',
                  marginBottom: 10,
                }}
              >
                IMPACTO REAL
              </div>
              {highImpactPoints.map((pt, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 15.5,
                    fontWeight: 600,
                    color: '#3F3D39',
                    marginBottom: 8,
                    lineHeight: 1.25,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span style={{ color: '#D94E34', fontWeight: 900 }}>•</span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha: 80% Ruido -> 20% Retorno */}
        <div
          style={{
            backgroundColor: '#F5EFE0',
            border: `2px solid ${PALETTE.cardBorder}`,
            borderRadius: 24,
            padding: '22px 22px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 21,
              fontWeight: 800,
              color: '#575550',
              letterSpacing: '-0.01em',
              marginBottom: 16,
            }}
          >
            {lowImpactTitle}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 18,
              height: 290,
            }}
          >
            {/* Barra 20% comprimida */}
            <div
              style={{
                width: 128,
                height: `${Math.max(16, rightBarProgress * 34)}%`,
                background: 'linear-gradient(180deg, #E89B38 0%, #E08E26 100%)',
                borderRadius: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 16px rgba(224, 142, 38, 0.22)',
              }}
            >
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 32,
                  fontWeight: 900,
                  color: '#FFFFFF',
                }}
              >
                {currentLowPct}%
              </span>
            </div>

            <div style={{ flex: 1, paddingBottom: 8 }}>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 19,
                  fontWeight: 800,
                  color: '#575550',
                  marginBottom: 10,
                }}
              >
                BAJO RETORNO
              </div>
              {lowImpactPoints.map((pt, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 15.5,
                    fontWeight: 600,
                    color: '#686662',
                    marginBottom: 8,
                    lineHeight: 1.25,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span style={{ color: '#E08E26', fontWeight: 900 }}>•</span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
