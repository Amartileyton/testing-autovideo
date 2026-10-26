import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  CLAMP_EXTRAPOLATION,
  PALETTE,
  SPRING_SNAPPY,
  staggerDelay,
} from '../../theme/motion';

export interface IcebergDepthDiagramProps {
  enterFrame?: number;
  tipTitle?: string;
  tipSubtitle?: string;
  deepLayers?: string[];
}

/**
 * Arquetipo #06 — IcebergDepthDiagram
 * Modelo Iceberg con silueta SVG de vértices suavizados (strokeLinejoin="round"),
 * línea de flotación con ondulación orgánica determinista y capas profundas en verde salvia.
 */
export const IcebergDepthDiagram: React.FC<IcebergDepthDiagramProps> = ({
  enterFrame = 0,
  tipTitle = 'RESULTADOS / ÉXITO',
  tipSubtitle = '15% Visible en la superficie',
  deepLayers = [
    'Sistemas y rituales diarios en bloque',
    'Práctica deliberada sin distracciones',
    'Entorno blindado contra el ruido',
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

  const tipSpring = spring({
    frame: Math.max(0, localFrame - 8),
    fps,
    config: SPRING_SNAPPY,
  });

  const baseSpring = spring({
    frame: Math.max(0, localFrame - 16),
    fps,
    config: { damping: 22, stiffness: 150, mass: 0.9 },
  });

  // Oscilación suave del nivel del agua
  const waveOffset = Math.sin(localFrame * 0.08) * 4;

  return (
    <div
      style={{
        width: 888,
        backgroundColor: PALETTE.cardNotepad,
        border: `2.5px solid ${PALETTE.cardBorder}`,
        borderRadius: 28,
        padding: '26px 30px',
        boxShadow: '0 18px 44px rgba(20, 20, 19, 0.07)',
        boxSizing: 'border-box',
        opacity: cardSpring,
        transform: `translateY(${(1 - cardSpring) * 28}px)`,
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: 420 }}>
        {/* SVG de fondo con el agua orgánica y las siluetas redondeadas del iceberg */}
        <svg
          width="828"
          height="420"
          viewBox="0 0 828 420"
          style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
        >
          {/* Zona sumergida (Verde Salvia Suave con bordes redondeados) */}
          <rect
            x="8"
            y="146"
            width="812"
            height="268"
            rx="24"
            fill="rgba(61, 99, 82, 0.12)"
            stroke="rgba(61, 99, 82, 0.35)"
            strokeWidth="2"
          />

          {/* Punta Superior del Iceberg (15% Visible) con esquinas redondeadas */}
          <g
            style={{
              opacity: tipSpring,
              transform: `translateY(${(1 - tipSpring) * 18}px)`,
              transformOrigin: '414px 140px',
            }}
          >
            <path
              d="M 310 24 Q 414 16 518 24 L 556 142 L 272 142 Z"
              fill="#FFFDF7"
              stroke="#D94E34"
              strokeWidth="4"
              strokeLinejoin="round"
            />
          </g>

          {/* Base Sumergida del Iceberg (85% Invisible) con vértices suavizados */}
          <g
            style={{
              opacity: baseSpring,
              transform: `scale(${interpolate(baseSpring, [0, 1], [0.94, 1], CLAMP_EXTRAPOLATION)})`,
              transformOrigin: '414px 260px',
            }}
          >
            <path
              d="M 268 150 L 560 150 L 642 396 Q 414 404 186 396 Z"
              fill="#FFFDF7"
              stroke="#3D6352"
              strokeWidth="4"
              strokeLinejoin="round"
            />
          </g>

          {/* Línea de flotación ondulada suave */}
          <path
            d={`M 16 ${146 + waveOffset} Q 215 ${138 - waveOffset}, 414 ${146 + waveOffset} T 812 ${146 - waveOffset}`}
            fill="none"
            stroke="#3D6352"
            strokeWidth="3.5"
            strokeDasharray="12 8"
            strokeLinecap="round"
          />
        </svg>

        {/* Etiquetas laterales de superficie vs fondo */}
        <div
          style={{
            position: 'absolute',
            left: 24,
            top: 108,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 14,
            fontWeight: 800,
            color: '#D94E34',
          }}
        >
          15% VISIBLE
        </div>
        <div
          style={{
            position: 'absolute',
            left: 24,
            top: 162,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 14,
            fontWeight: 800,
            color: '#3D6352',
          }}
        >
          85% OCULTO
        </div>

        {/* Texto de la Punta Superior */}
        <div
          style={{
            position: 'absolute',
            top: 52,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: tipSpring,
          }}
        >
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 21,
              fontWeight: 900,
              color: '#D94E34',
              letterSpacing: '-0.02em',
            }}
          >
            {tipTitle}
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: '#575550',
              marginTop: 2,
            }}
          >
            {tipSubtitle}
          </div>
        </div>

        {/* 3 Estratos Sumergidos en Cascada */}
        <div
          style={{
            position: 'absolute',
            top: 174,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 356,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {deepLayers.map((layer, idx) => {
            const layerSpring = spring({
              frame: Math.max(0, localFrame - 20 - staggerDelay(idx, 8)),
              fps,
              config: SPRING_SNAPPY,
            });
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: 'rgba(61, 99, 82, 0.12)',
                  border: '2px solid #3D6352',
                  borderRadius: 16,
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 16.5,
                  fontWeight: 800,
                  color: '#141413',
                  opacity: layerSpring,
                  transform: `translateY(${(1 - layerSpring) * 16}px)`,
                }}
              >
                {layer}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
