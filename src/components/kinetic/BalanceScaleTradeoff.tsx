import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CLAMP_EXTRAPOLATION, PALETTE, SPRING_SNAPPY } from '../../theme/motion';

export interface BalanceScaleTradeoffProps {
  enterFrame?: number;
  heavyLeftTitle?: string;
  heavyLeftSubtitle?: string;
  lightRightTitle?: string;
  lightRightSubtitle?: string;
}

/**
 * Arquetipo #12 — BalanceScaleTradeoff
 * Palanca de Arquímedes / Coste de Oportunidad con rotación elástica determinista,
 * fulcro redondeado y bloques de peso con esquinas suaves.
 */
export const BalanceScaleTradeoff: React.FC<BalanceScaleTradeoffProps> = ({
  enterFrame = 0,
  heavyLeftTitle = '1 HORA DE FOCO PURO',
  heavyLeftSubtitle = 'Alto apalancamiento cognitivo',
  lightRightTitle = '8 HORAS DE MULTITAREA',
  lightRightSubtitle = 'Atención fragmentada',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - enterFrame);

  const cardSpring = spring({
    frame: localFrame,
    fps,
    config: SPRING_SNAPPY,
  });

  // Inclinación de la viga cuando cae el peso de alto valor
  const tiltSpring = spring({
    frame: Math.max(0, localFrame - 12),
    fps,
    config: { damping: 14, stiffness: 120, mass: 1.0 },
  });

  const angleDeg = interpolate(tiltSpring, [0, 1], [8, -12], CLAMP_EXTRAPOLATION);

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
          height: 360,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Viga basculante con los dos pesos */}
        <div
          style={{
            position: 'absolute',
            top: 150,
            width: 720,
            height: 12,
            backgroundColor: '#141413',
            borderRadius: 999,
            transform: `rotate(${angleDeg}deg)`,
            transformOrigin: 'center center',
          }}
        >
          {/* Bloque Pesado Izquierdo (Terracota) */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 16,
              width: 268,
              backgroundColor: '#D94E34',
              border: '3px solid #141413',
              borderRadius: 22,
              padding: '20px 18px',
              textAlign: 'center',
              boxShadow: '0 14px 28px rgba(217, 78, 52, 0.25)',
              transform: `rotate(${-angleDeg}deg)`,
            }}
          >
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 21,
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.15,
              }}
            >
              {heavyLeftTitle}
            </div>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.9)',
                marginTop: 4,
              }}
            >
              {heavyLeftSubtitle}
            </div>
          </div>

          {/* Bloque Ligero Derecho (Atenuado) */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 16,
              width: 268,
              backgroundColor: '#FFFDF7',
              border: `2.5px solid ${PALETTE.cardBorder}`,
              borderRadius: 22,
              padding: '18px 16px',
              textAlign: 'center',
              transform: `rotate(${-angleDeg}deg)`,
            }}
          >
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 19,
                fontWeight: 800,
                color: '#575550',
                lineHeight: 1.15,
              }}
            >
              {lightRightTitle}
            </div>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: '#686662',
                marginTop: 4,
              }}
            >
              {lightRightSubtitle}
            </div>
          </div>
        </div>

        {/* Fulcro Central con Vértices Suavizados */}
        <svg
          width="140"
          height="130"
          viewBox="0 0 140 130"
          style={{ position: 'absolute', top: 158 }}
        >
          <path
            d="M 70 8 L 126 118 L 14 118 Z"
            fill="#141413"
            stroke="#141413"
            strokeWidth="12"
            strokeLinejoin="round"
          />
          <circle cx="70" cy="14" r="8" fill="#D94E34" />
        </svg>
      </div>
    </div>
  );
};
