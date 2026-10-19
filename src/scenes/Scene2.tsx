import React from 'react';
import { Compass, Layers, ShieldCheck } from 'lucide-react';
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
  canvasOffsetY?: number;
  enterFrame?: number;
}

/**
 * Scene2 — Escena Par (Slot 4)
 * Ubicada en el segundo cuadrante del lienzo continuo (offsetY = 980px)
 * para demostrar el movimiento panorámico con SPRING_CAMERA del CameraRig.
 */
export const Scene2: React.FC<Scene2Props> = ({
  headline = 'LIENZO CONTINUO 9:16',
  canvasOffsetY = 980,
  enterFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - enterFrame);

  const headerSpring = spring({
    frame: localFrame,
    fps,
    config: SPRING_SNAPPY,
  });

  const safeRatio = Math.round(
    interpolate(localFrame, [0, 45], [0, 85], CLAMP_EXTRAPOLATION)
  );
  const dampingMetric = Math.round(
    interpolate(localFrame, [5, 50], [0, 30], CLAMP_EXTRAPOLATION)
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
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
        <Compass size={30} color={PALETTE.accentSecondary} strokeWidth={2.5} />
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 28,
            fontWeight: 700,
            color: PALETTE.ink,
            letterSpacing: '0.06em',
          }}
        >
          RIG DE CÁMARA · SPRING_CAMERA
        </span>
      </div>

      {/* Titular Editorial (>= 64px, <= 7 palabras) */}
      <h2
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 74,
          fontWeight: 900,
          lineHeight: 1.04,
          letterSpacing: '-0.03em',
          color: PALETTE.ink,
          margin: '0 0 42px 0',
          opacity: interpolate(headerSpring, [0, 1], [0, 1], CLAMP_EXTRAPOLATION),
        }}
      >
        {headline}
      </h2>

      <RoughCard
        width={888}
        height={640}
        enterFrame={enterFrame + 6}
        accentColor={PALETTE.accentSecondary}
        seed={202}
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
            GEOMETRÍA DE ZONA SEGURA
          </span>
          <Layers size={38} color={PALETTE.accentPrimary} strokeWidth={2.4} />
        </div>

        {/* Diagrama de proporción 85% / 15% y curva de resorte */}
        <svg width={810} height={270} viewBox="0 0 810 270">
          <rect
            x={24}
            y={24}
            width={762}
            height={160}
            rx={14}
            fill={PALETTE.surfaceMuted}
            stroke={PALETTE.border}
            strokeWidth={3}
          />
          <rect
            x={24}
            y={24}
            width={interpolate(localFrame, [0, 45], [80, 648], CLAMP_EXTRAPOLATION)}
            height={160}
            rx={14}
            fill={PALETTE.accentSecondary}
            opacity={0.18}
          />
          <text
            x={54}
            y={116}
            fill={PALETTE.ink}
            fontFamily="monospace"
            fontSize="34"
            fontWeight="700"
          >
            85% LIENZO ACTIVO · 288PX RESERVADOS
          </text>
          <line
            x1={672}
            y1={16}
            x2={672}
            y2={200}
            stroke={PALETTE.accentPrimary}
            strokeWidth={4}
            strokeDasharray="10 8"
          />
        </svg>

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
              ÁREA SEGURA VERTICAL
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
              {safeRatio}%
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
              AMORTIGUACIÓN RIG
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: 'system-ui, sans-serif',
                fontSize: 64,
                fontWeight: 900,
                color: PALETTE.accentSuccess,
                lineHeight: 1,
              }}
            >
              <ShieldCheck size={44} color={PALETTE.accentSuccess} />
              D={dampingMetric}
            </div>
          </div>
        </div>
      </RoughCard>
    </div>
  );
};
