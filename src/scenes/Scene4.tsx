import React from 'react';
import { LockOpen, ShieldCheck, Zap } from 'lucide-react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { RoughCard } from '../components/RoughCard';
import {
  CLAMP_EXTRAPOLATION,
  PALETTE,
  SAFE_ZONE,
  SPRING_SNAPPY,
} from '../theme/motion';

export interface Scene4Props {
  headline?: string;
  metricValue?: number;
  metricUnit?: string;
  metricLabel?: string;
  canvasOffsetX?: number;
  canvasOffsetY?: number;
  enterFrame?: number;
}

/**
 * Scene4 — Escena Par (Slot 4)
 * Comparativa causal de latencia (Sensor Ultrasónico 3D 25 ms vs Óptico 2D 180 ms),
 * reconstrucción de nodos biométricos verificados y estado HASH 3D VERIFICADO.
 */
export const Scene4: React.FC<Scene4Props> = ({
  headline = 'DESBLOQUEO EN MILISEGUNDOS',
  metricValue = 25,
  metricUnit = 'ms',
  metricLabel = 'TIEMPO DE RESPUESTA',
  canvasOffsetX = 0,
  canvasOffsetY = 1980,
  enterFrame = 571,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - enterFrame);

  const headerSpring = spring({
    frame: localFrame,
    fps,
    config: SPRING_SNAPPY,
  });

  const barSpring = spring({
    frame: Math.max(0, localFrame - 10),
    fps,
    config: SPRING_SNAPPY,
  });

  const nodeSpring = spring({
    frame: Math.max(0, localFrame - 20),
    fps,
    config: SPRING_SNAPPY,
  });

  const animatedLatency = Math.round(
    interpolate(localFrame, [0, 36], [0, metricValue], CLAMP_EXTRAPOLATION)
  );

  const animatedOptical = Math.round(
    interpolate(localFrame, [0, 42], [0, 180], CLAMP_EXTRAPOLATION)
  );

  const animatedPrecision = interpolate(
    localFrame,
    [8, 48],
    [0, 99.9],
    CLAMP_EXTRAPOLATION
  ).toFixed(1);

  const ultrasonicBarWidth = interpolate(
    barSpring,
    [0, 1],
    [40, 160],
    CLAMP_EXTRAPOLATION
  );

  const opticalBarWidth = interpolate(
    barSpring,
    [0, 1],
    [40, 520],
    CLAMP_EXTRAPOLATION
  );

  const nodeScale = interpolate(nodeSpring, [0, 1], [0.5, 1], CLAMP_EXTRAPOLATION);
  const nodeOpacity = interpolate(nodeSpring, [0, 1], [0, 1], CLAMP_EXTRAPOLATION);

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
        <ShieldCheck size={30} color={PALETTE.accentSuccess} strokeWidth={2.5} />
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 28,
            fontWeight: 700,
            color: PALETTE.ink,
            letterSpacing: '0.06em',
          }}
        >
          HASH 3D VERIFICADO · ENCLAVE SEGURO
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
        accentColor={PALETTE.accentSuccess}
        seed={404}
      >
        {/* Cabecera interna */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Zap size={36} color={PALETTE.accentPrimary} strokeWidth={2.5} />
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 28,
                fontWeight: 700,
                color: PALETTE.inkMuted,
              }}
            >
              COMPARATIVA DE LATENCIA Y NODOS
            </span>
          </div>
          <LockOpen size={38} color={PALETTE.accentSuccess} strokeWidth={2.5} />
        </div>

        {/* Diagrama comparativo de latencia + malla de nodos biométricos verificados */}
        <svg width={816} height={380} viewBox="0 0 816 380">
          {/* Fila 1: Sensor Ultrasónico 3D (25 ms) */}
          <text
            x={20}
            y={46}
            fill={PALETTE.ink}
            fontFamily="monospace"
            fontSize="28"
            fontWeight="700"
          >
            ULTRASÓNICO 3D
          </text>
          <rect
            x={20}
            y={62}
            width={ultrasonicBarWidth}
            height={44}
            rx={8}
            fill={PALETTE.accentSuccess}
            stroke={PALETTE.border}
            strokeWidth={3}
          />
          <text
            x={ultrasonicBarWidth + 38}
            y={94}
            fill={PALETTE.accentSuccess}
            fontFamily="monospace"
            fontSize="32"
            fontWeight="700"
          >
            {animatedLatency} ms
          </text>

          {/* Fila 2: Sensor Óptico 2D (180 ms) */}
          <text
            x={20}
            y={152}
            fill={PALETTE.inkMuted}
            fontFamily="monospace"
            fontSize="28"
            fontWeight="700"
          >
            ÓPTICO 2D CONVENCIONAL
          </text>
          <rect
            x={20}
            y={168}
            width={opticalBarWidth}
            height={44}
            rx={8}
            fill={PALETTE.surfaceMuted}
            stroke={PALETTE.border}
            strokeWidth={3}
          />
          <text
            x={opticalBarWidth + 38}
            y={200}
            fill={PALETTE.inkMuted}
            fontFamily="monospace"
            fontSize="32"
            fontWeight="700"
          >
            {animatedOptical} ms
          </text>

          {/* Panel inferior de reconstrucción de nodos biométricos y HASH 3D */}
          <rect
            x={20}
            y={238}
            width={776}
            height={126}
            rx={14}
            fill={PALETTE.surface}
            stroke={PALETTE.border}
            strokeWidth={3}
          />

          {/* Malla de nodos biométricos verificados */}
          <g opacity={nodeOpacity}>
            <line
              x1={74}
              y1={276}
              x2={146}
              y2={322}
              stroke={PALETTE.accentSuccess}
              strokeWidth={3.5}
            />
            <line
              x1={146}
              y1={322}
              x2={218}
              y2={272}
              stroke={PALETTE.accentSuccess}
              strokeWidth={3.5}
            />
            <line
              x1={218}
              y1={272}
              x2={286}
              y2={318}
              stroke={PALETTE.accentSuccess}
              strokeWidth={3.5}
            />
            <line
              x1={74}
              y1={276}
              x2={218}
              y2={272}
              stroke={PALETTE.gridLine}
              strokeWidth={2.5}
            />
            <circle
              cx={74}
              cy={276}
              r={12 * nodeScale}
              fill={PALETTE.accentSuccess}
              stroke={PALETTE.border}
              strokeWidth={2.5}
            />
            <circle
              cx={146}
              cy={322}
              r={12 * nodeScale}
              fill={PALETTE.accentSuccess}
              stroke={PALETTE.border}
              strokeWidth={2.5}
            />
            <circle
              cx={218}
              cy={272}
              r={12 * nodeScale}
              fill={PALETTE.accentPrimary}
              stroke={PALETTE.border}
              strokeWidth={2.5}
            />
            <circle
              cx={286}
              cy={318}
              r={12 * nodeScale}
              fill={PALETTE.accentSuccess}
              stroke={PALETTE.border}
              strokeWidth={2.5}
            />
          </g>

          <text
            x={336}
            y={292}
            fill={PALETTE.ink}
            fontFamily="monospace"
            fontSize="28"
            fontWeight="700"
          >
            ESTADO: HASH 3D VERIFICADO
          </text>
          <text
            x={336}
            y={332}
            fill={PALETTE.accentSuccess}
            fontFamily="monospace"
            fontSize="28"
            fontWeight="700"
          >
            MINUCIAS DÉRMICAS VALIDADAS
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
              {animatedLatency} {metricUnit}
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
              PRECISIÓN BIOMÉTRICA
            </div>
            <div
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 64,
                fontWeight: 900,
                color: PALETTE.accentSuccess,
                lineHeight: 1,
              }}
            >
              {animatedPrecision}%
            </div>
          </div>
        </div>
      </RoughCard>
    </div>
  );
};
