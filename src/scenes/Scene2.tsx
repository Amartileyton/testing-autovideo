import React from 'react';
import { Cpu, Radio, Waves } from 'lucide-react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { RoughCard } from '../components/RoughCard';
import {
  CLAMP_EXTRAPOLATION,
  PALETTE,
  SAFE_ZONE,
  SPRING_SNAPPY,
} from '../theme/motion';

export interface Scene2Props {
  headline?: string;
  metricValue?: number;
  metricUnit?: string;
  metricLabel?: string;
  canvasOffsetX?: number;
  canvasOffsetY?: number;
  enterFrame?: number;
}

/**
 * Scene2 — Escena Par (Slot 4)
 * Diagrama causal del módulo transductor piezoeléctrico (PMUT) bajo las capas
 * de cristal y panel OLED emitiendo frentes de onda acústica a 20 MHz (1540 m/s).
 */
export const Scene2: React.FC<Scene2Props> = ({
  headline = 'PULSO ACÚSTICO ULTRASÓNICO',
  metricValue = 20,
  metricUnit = 'MHz',
  metricLabel = 'FRECUENCIA ACÚSTICA',
  canvasOffsetX = 1100,
  canvasOffsetY = 0,
  enterFrame = 189,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - enterFrame);

  const headerSpring = spring({
    frame: localFrame,
    fps,
    config: SPRING_SNAPPY,
  });

  const waveSpring1 = spring({
    frame: Math.max(0, localFrame - 10),
    fps,
    config: SPRING_SNAPPY,
  });

  const waveSpring2 = spring({
    frame: Math.max(0, localFrame - 18),
    fps,
    config: SPRING_SNAPPY,
  });

  const waveSpring3 = spring({
    frame: Math.max(0, localFrame - 26),
    fps,
    config: SPRING_SNAPPY,
  });

  const animatedFreq = Math.round(
    interpolate(localFrame, [0, 42], [0, metricValue], CLAMP_EXTRAPOLATION)
  );

  const animatedSpeed = Math.round(
    interpolate(localFrame, [6, 48], [0, 1540], CLAMP_EXTRAPOLATION)
  );

  const pulseProgress = interpolate(
    localFrame,
    [8, 55],
    [0, 1],
    CLAMP_EXTRAPOLATION
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: canvasOffsetX,
        top: canvasOffsetY,
        width: 1080,
        height: 1920,
        paddingLeft: SAFE_ZONE.horizontalPaddingPx,
        paddingRight: SAFE_ZONE.horizontalPaddingPx,
        paddingTop: 110,
        boxSizing: 'border-box',
      }}
    >
      {/* Etiqueta técnica superior (>= 28px) */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 14,
          backgroundColor: PALETTE.surfaceMuted,
          border: `2px solid ${PALETTE.border}`,
          borderRadius: 999,
          padding: '10px 24px',
          marginBottom: 24,
          transform: `scale(${interpolate(headerSpring, [0, 1], [0.9, 1], CLAMP_EXTRAPOLATION)})`,
        }}
      >
        <Radio size={30} color={PALETTE.accentSecondary} strokeWidth={2.5} />
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 28,
            fontWeight: 700,
            color: PALETTE.ink,
            letterSpacing: '0.06em',
          }}
        >
          TRANSDUCTOR PMUT · CAPA SUB-OLED
        </span>
      </div>

      {/* Titular Editorial (>= 64px, <= 7 palabras) */}
      <h2
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 72,
          fontWeight: 900,
          lineHeight: 1.04,
          letterSpacing: '-0.03em',
          color: PALETTE.ink,
          margin: '0 0 36px 0',
          opacity: interpolate(headerSpring, [0, 1], [0, 1], CLAMP_EXTRAPOLATION),
        }}
      >
        {headline}
      </h2>

      <RoughCard
        width={888}
        height={720}
        enterFrame={enterFrame + 6}
        accentColor={PALETTE.accentSecondary}
        seed={202}
      >
        {/* Cabecera interna del diagrama */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Waves size={36} color={PALETTE.accentSecondary} strokeWidth={2.5} />
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 28,
                fontWeight: 700,
                color: PALETTE.inkMuted,
              }}
            >
              ARQUITECTURA PIEZOELÉCTRICA
            </span>
          </div>
          <Cpu size={38} color={PALETTE.accentPrimary} strokeWidth={2.4} />
        </div>

        {/* Diagrama causal vectorial: Capas Cristal + OLED + Emisor PMUT y ondas concéntricas */}
        <svg width={816} height={380} viewBox="0 0 816 380">
          {/* Capa 1: Cristal Protector */}
          <rect
            x={24}
            y={16}
            width={768}
            height={64}
            rx={10}
            fill={PALETTE.surfaceMuted}
            stroke={PALETTE.border}
            strokeWidth={3}
          />
          <text
            x={48}
            y={58}
            fill={PALETTE.ink}
            fontFamily="monospace"
            fontSize="28"
            fontWeight="700"
          >
            CAPA 01 · CRISTAL TEMPLADO
          </text>

          {/* Capa 2: Panel OLED */}
          <rect
            x={24}
            y={94}
            width={768}
            height={64}
            rx={10}
            fill={PALETTE.surface}
            stroke={PALETTE.border}
            strokeWidth={3}
            strokeDasharray="10 6"
          />
          <text
            x={48}
            y={136}
            fill={PALETTE.inkMuted}
            fontFamily="monospace"
            fontSize="28"
            fontWeight="700"
          >
            CAPA 02 · MATRIZ OLED EMISIVA
          </text>

          {/* Zona de propagación de frentes de onda acústicos concéntricos hacia arriba */}
          <path
            d="M 278 272 A 140 95 0 0 1 538 272"
            fill="none"
            stroke={PALETTE.accentSecondary}
            strokeWidth={4.5}
            opacity={interpolate(waveSpring1, [0, 1], [0, 0.95], CLAMP_EXTRAPOLATION)}
            transform={`translate(0, ${interpolate(waveSpring1, [0, 1], [24, 0], CLAMP_EXTRAPOLATION)})`}
          />
          <path
            d="M 218 242 A 210 145 0 0 1 598 242"
            fill="none"
            stroke={PALETTE.accentSecondary}
            strokeWidth={4}
            strokeDasharray="12 8"
            opacity={interpolate(waveSpring2, [0, 1], [0, 0.85], CLAMP_EXTRAPOLATION)}
            transform={`translate(0, ${interpolate(waveSpring2, [0, 1], [30, 0], CLAMP_EXTRAPOLATION)})`}
          />
          <path
            d="M 158 210 A 280 190 0 0 1 658 210"
            fill="none"
            stroke={PALETTE.accentPrimary}
            strokeWidth={4}
            opacity={interpolate(waveSpring3, [0, 1], [0, 0.9], CLAMP_EXTRAPOLATION)}
            transform={`translate(0, ${interpolate(waveSpring3, [0, 1], [36, 0], CLAMP_EXTRAPOLATION)})`}
          />

          {/* Vectores de dirección axial hacia arriba */}
          <line
            x1={408}
            y1={288}
            x2={408}
            y2={interpolate(pulseProgress, [0, 1], [260, 32], CLAMP_EXTRAPOLATION)}
            stroke={PALETTE.accentPrimary}
            strokeWidth={4}
          />
          <polygon
            points={`408,${interpolate(pulseProgress, [0, 1], [248, 20], CLAMP_EXTRAPOLATION)} 394,${interpolate(pulseProgress, [0, 1], [270, 42], CLAMP_EXTRAPOLATION)} 422,${interpolate(pulseProgress, [0, 1], [270, 42], CLAMP_EXTRAPOLATION)}`}
            fill={PALETTE.accentPrimary}
            opacity={interpolate(pulseProgress, [0, 0.2, 1], [0, 1, 1], CLAMP_EXTRAPOLATION)}
          />

          {/* Capa 3: Módulo Transductor Piezoeléctrico PMUT */}
          <rect
            x={138}
            y={294}
            width={540}
            height={72}
            rx={12}
            fill={PALETTE.surfaceMuted}
            stroke={PALETTE.accentSecondary}
            strokeWidth={4}
          />
          <text
            x={408}
            y={340}
            textAnchor="middle"
            fill={PALETTE.ink}
            fontFamily="monospace"
            fontSize="28"
            fontWeight="700"
          >
            ARRAY PMUT · EMISOR PIEZOELÉCTRICO
          </text>
        </svg>

        {/* Contadores numéricos inferiores */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: `2px solid ${PALETTE.gridLine}`,
            paddingTop: 20,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: 28,
                fontWeight: 700,
                color: PALETTE.inkMuted,
                marginBottom: 4,
              }}
            >
              {metricLabel}
            </div>
            <div
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 78,
                fontWeight: 900,
                color: PALETTE.ink,
                lineHeight: 1,
              }}
            >
              {animatedFreq} {metricUnit}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: 28,
                fontWeight: 700,
                color: PALETTE.inkMuted,
                marginBottom: 4,
              }}
            >
              VELOCIDAD ACÚSTICA
            </div>
            <div
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 64,
                fontWeight: 900,
                color: PALETTE.accentSecondary,
                lineHeight: 1,
              }}
            >
              {animatedSpeed} m/s
            </div>
          </div>
        </div>
      </RoughCard>
    </div>
  );
};
