import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  CLAMP_EXTRAPOLATION,
  PALETTE,
  SPRING_SNAPPY,
  staggerDelay,
} from '../../theme/motion';

export interface CognitiveBatteryMeterProps {
  enterFrame?: number;
  drainedHeader?: string;
  drainedFooter?: string;
  deepHeader?: string;
  deepFooter?: string;
}

/**
 * Arquetipo #11 — CognitiveBatteryMeter
 * Medidor de Batería Cognitiva y Fugas de Atención con cápsulas redondeadas suaves
 * y carga segmentada progresiva.
 */
export const CognitiveBatteryMeter: React.FC<CognitiveBatteryMeterProps> = ({
  enterFrame = 0,
  drainedHeader = 'CON INTERRUPCIONES CADA 15 MIN (RESIDUO DE ATENCIÓN)',
  drainedFooter = '22% Capacidad Mental Útil · 78% Perdido en Reconectar',
  deepHeader = 'BLOQUE BLINDADO SIN NOTIFICACIONES (FLUJO CONTINUO)',
  deepFooter = '100% Potencia Cognitiva Sostenida durante 90 Minutos',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - enterFrame);

  const cardSpring = spring({
    frame: localFrame,
    fps,
    config: SPRING_SNAPPY,
  });

  const topBatterySpring = spring({
    frame: Math.max(0, localFrame - 8),
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
        padding: '28px 34px',
        boxShadow: '0 18px 44px rgba(20, 20, 19, 0.07)',
        boxSizing: 'border-box',
        opacity: cardSpring,
        transform: `translateY(${(1 - cardSpring) * 28}px)`,
      }}
    >
      {/* Batería Superior Drenada */}
      <div style={{ marginBottom: 28, opacity: topBatterySpring }}>
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 16,
            fontWeight: 800,
            color: '#575550',
            marginBottom: 10,
          }}
        >
          {drainedHeader}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              flex: 1,
              height: 92,
              backgroundColor: '#FFFDF7',
              border: `2.5px solid ${PALETTE.cardBorder}`,
              borderRadius: 22,
              padding: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                width: `${interpolate(topBatterySpring, [0, 1], [5, 22], CLAMP_EXTRAPOLATION)}%`,
                height: '100%',
                backgroundColor: '#E08E26',
                borderRadius: 14,
              }}
            />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 16.5,
                fontWeight: 700,
                color: '#575550',
              }}
            >
              {drainedFooter}
            </span>
          </div>
          <div
            style={{
              width: 14,
              height: 40,
              backgroundColor: PALETTE.cardBorder,
              borderRadius: '0 8px 8px 0',
            }}
          />
        </div>
      </div>

      {/* Batería Inferior Blindada al 100% */}
      <div>
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 16,
            fontWeight: 900,
            color: '#D94E34',
            marginBottom: 10,
          }}
        >
          {deepHeader}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              flex: 1,
              height: 104,
              backgroundColor: '#FFFDF7',
              border: '3px solid #D94E34',
              borderRadius: 24,
              padding: 10,
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 10,
              boxSizing: 'border-box',
              boxShadow: '0 12px 28px rgba(217, 78, 52, 0.14)',
            }}
          >
            {[0, 1, 2, 3, 4].map((segIdx) => {
              const segSpring = spring({
                frame: Math.max(0, localFrame - 16 - staggerDelay(segIdx, 5)),
                fps,
                config: SPRING_SNAPPY,
              });
              const isLast = segIdx === 4;
              return (
                <div
                  key={segIdx}
                  style={{
                    height: '100%',
                    borderRadius: 14,
                    backgroundColor: isLast ? '#3D6352' : '#D94E34',
                    opacity: segSpring,
                    transform: `scale(${interpolate(segSpring, [0, 1], [0.75, 1], CLAMP_EXTRAPOLATION)})`,
                  }}
                />
              );
            })}
          </div>
          <div
            style={{
              width: 14,
              height: 44,
              backgroundColor: '#D94E34',
              borderRadius: '0 8px 8px 0',
            }}
          />
        </div>
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 17,
            fontWeight: 800,
            color: '#141413',
            marginTop: 12,
          }}
        >
          {deepFooter}
        </div>
      </div>
    </div>
  );
};
