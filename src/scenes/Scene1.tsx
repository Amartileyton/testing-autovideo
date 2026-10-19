import React from 'react';
import { Activity, Cpu, Radio } from 'lucide-react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { RoughCard } from '../components/RoughCard';
import {
  CLAMP_EXTRAPOLATION,
  PALETTE,
  SAFE_ZONE,
  SPRING_SNAPPY,
} from '../theme/motion';

export interface Scene1Props {
  headline?: string;
  metricValue?: number;
  metricUnit?: string;
  metricLabel?: string;
}

/**
 * Scene1 — Escena Impar (Slot 3)
 * Muestra el mecanismo causal y contadores numéricos (sin repetir la locución en pantalla).
 * Respeta Zona Segura Vertical 9:16 (padding >= 96px, titulares >= 64px <= 7 palabras, etiquetas >= 28px).
 */
export const Scene1: React.FC<Scene1Props> = ({
  headline = 'MOTOR AUDIO-FIRST',
  metricValue = 30,
  metricUnit = 'FPS',
  metricLabel = 'SINCRONIZACIÓN AL FOTOGRAMA',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: SPRING_SNAPPY,
  });

  const waveProgress = interpolate(frame, [0, 90], [0, 1], CLAMP_EXTRAPOLATION);
  const animatedCount = Math.round(
    interpolate(frame, [8, 50], [0, metricValue], CLAMP_EXTRAPOLATION)
  );
  const animatedLatencyMs = Math.round(
    interpolate(frame, [15, 65], [120, 12], CLAMP_EXTRAPOLATION)
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
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
          transform: `scale(${interpolate(titleSpring, [0, 1], [0.9, 1], CLAMP_EXTRAPOLATION)})`,
        }}
      >
        <Radio size={30} color={PALETTE.accentPrimary} strokeWidth={2.5} />
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 28,
            fontWeight: 700,
            color: PALETTE.ink,
            letterSpacing: '0.06em',
          }}
        >
          NIVEL 0-4 · DIAGNÓSTICO ACTIVO
        </span>
      </div>

      {/* Titular Editorial (>= 64px, <= 7 palabras) */}
      <h1
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 76,
          fontWeight: 900,
          lineHeight: 1.04,
          letterSpacing: '-0.03em',
          color: PALETTE.ink,
          margin: '0 0 42px 0',
          opacity: interpolate(titleSpring, [0, 1], [0, 1], CLAMP_EXTRAPOLATION),
          transform: `translateY(${interpolate(
            titleSpring,
            [0, 1],
            [24, 0],
            CLAMP_EXTRAPOLATION
          )}px)`,
        }}
      >
        {headline}
      </h1>

      {/* Tarjeta RoughCard con diagrama causal de ondas y cuantización */}
      <RoughCard
        width={888}
        height={640}
        enterFrame={6}
        accentColor={PALETTE.accentPrimary}
        seed={101}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 28,
              fontWeight: 700,
              color: PALETTE.inkMuted,
            }}
          >
            {metricLabel}
          </span>
          <Cpu size={38} color={PALETTE.accentSecondary} strokeWidth={2.4} />
        </div>

        {/* Visualización vectorial de cuantización acústica -> frames */}
        <svg width={810} height={270} viewBox="0 0 810 270">
          {/* Eje base */}
          <line
            x1={20}
            y1={135}
            x2={790}
            y2={135}
            stroke={PALETTE.gridLine}
            strokeWidth={3}
          />
          {Array.from({ length: 18 }).map((_, idx) => {
            const barDelay = idx * 2;
            const barSpring = spring({
              frame: frame - barDelay,
              fps,
              config: SPRING_SNAPPY,
            });
            const rawHeight = 36 + ((idx * 37) % 140);
            const barHeight = interpolate(
              barSpring,
              [0, 1],
              [8, rawHeight],
              CLAMP_EXTRAPOLATION
            );
            const x = 36 + idx * 42;
            const isHighlighted = idx <= Math.floor(waveProgress * 18);

            return (
              <rect
                key={idx}
                x={x}
                y={135 - barHeight / 2}
                width={24}
                height={barHeight}
                rx={6}
                fill={
                  isHighlighted ? PALETTE.accentPrimary : PALETTE.surfaceMuted
                }
                stroke={PALETTE.border}
                strokeWidth={2.5}
              />
            );
          })}
        </svg>

        {/* Contadores numéricos reales */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: `2px solid ${PALETTE.gridLine}`,
            paddingTop: 22,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: 28,
                fontWeight: 700,
                color: PALETTE.inkMuted,
              }}
            >
              CADENCIA BASE
            </div>
            <div
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 82,
                fontWeight: 900,
                color: PALETTE.ink,
                lineHeight: 1,
              }}
            >
              {animatedCount} <span style={{ fontSize: 40 }}>{metricUnit}</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: 28,
                fontWeight: 700,
                color: PALETTE.inkMuted,
              }}
            >
              PRECISIÓN TEMPORAL
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: 'system-ui, sans-serif',
                fontSize: 64,
                fontWeight: 900,
                color: PALETTE.accentSecondary,
                lineHeight: 1,
              }}
            >
              <Activity size={44} color={PALETTE.accentSecondary} />
              {animatedLatencyMs} ms
            </div>
          </div>
        </div>
      </RoughCard>
    </div>
  );
};
