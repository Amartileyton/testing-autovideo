import React from 'react';
import { AlertTriangle, Camera, EyeOff } from 'lucide-react';
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
  canvasOffsetX?: number;
  canvasOffsetY?: number;
  enterFrame?: number;
}

/**
 * Scene1 — Escena Impar (Slot 3)
 * Diagrama causal: Lector Óptico Antiguo (Luz 2D) vs. profundidad epidérmica real no detectada.
 * Respeta Zona Segura Vertical 9:16 (padding >= 96px, titulares >= 64px <= 7 palabras, etiquetas >= 28px, y < 1400px).
 */
export const Scene1: React.FC<Scene1Props> = ({
  headline = 'EL FALLO DEL SENSOR ÓPTICO',
  metricValue = 2,
  metricUnit = 'D',
  metricLabel = 'CAPTURA ÓPTICA PLANA',
  canvasOffsetX = 0,
  canvasOffsetY = 0,
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

  const beamProgress = interpolate(
    localFrame,
    [6, 55],
    [0, 1],
    CLAMP_EXTRAPOLATION
  );

  const animatedDim = Math.round(
    interpolate(localFrame, [8, 36], [0, metricValue], CLAMP_EXTRAPOLATION)
  );

  const animatedExposureMs = Math.round(
    interpolate(localFrame, [10, 58], [0, 180], CLAMP_EXTRAPOLATION)
  );

  const statusPillSpring = spring({
    frame: Math.max(0, localFrame - 16),
    fps,
    config: SPRING_SNAPPY,
  });

  const rayPositions = [130, 265, 400, 535, 670];

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
        paddingTop: 96,
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
          border: `2.5px solid ${PALETTE.border}`,
          borderRadius: 999,
          padding: '10px 24px',
          marginBottom: 22,
          opacity: interpolate(headerSpring, [0, 1], [0, 1], CLAMP_EXTRAPOLATION),
          transform: `scale(${interpolate(
            headerSpring,
            [0, 1],
            [0.92, 1],
            CLAMP_EXTRAPOLATION
          )})`,
        }}
      >
        <AlertTriangle size={32} color={PALETTE.accentPrimary} strokeWidth={2.5} />
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 28,
            fontWeight: 700,
            color: PALETTE.ink,
            letterSpacing: '0.05em',
          }}
        >
          VULNERABILIDAD BIOMÉTRICA · LUZ 2D
        </span>
      </div>

      {/* Titular Editorial (>= 64px, <= 7 palabras) */}
      <h1
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 72,
          fontWeight: 900,
          lineHeight: 1.04,
          letterSpacing: '-0.03em',
          color: PALETTE.ink,
          margin: '0 0 32px 0',
          opacity: interpolate(headerSpring, [0, 1], [0, 1], CLAMP_EXTRAPOLATION),
          transform: `translateY(${interpolate(
            headerSpring,
            [0, 1],
            [24, 0],
            CLAMP_EXTRAPOLATION
          )}px)`,
        }}
      >
        {headline}
      </h1>

      {/* Tarjeta principal RoughCard (888x720) con diagrama causal 2D vs relieve oculto */}
      <RoughCard
        width={888}
        height={720}
        enterFrame={enterFrame + 4}
        accentColor={PALETTE.accentPrimary}
        seed={101}
      >
        {/* Cabecera interna de la tarjeta */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `2px solid ${PALETTE.gridLine}`,
            paddingBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Camera size={36} color={PALETTE.accentPrimary} strokeWidth={2.4} />
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 28,
                fontWeight: 700,
                color: PALETTE.ink,
              }}
            >
              LECTOR ÓPTICO ANTIGUO (LUZ 2D)
            </span>
          </div>
          <EyeOff size={36} color={PALETTE.inkMuted} strokeWidth={2.4} />
        </div>

        {/* Diagrama vectorial causal: Relieve real ignorado vs rebote óptico plano */}
        <svg width={816} height={370} viewBox="0 0 816 370">
          {/* Fondo de zona ciega superior (Profundidad Z no detectada) */}
          <rect
            x={16}
            y={12}
            width={784}
            height={148}
            rx={12}
            fill={PALETTE.surfaceMuted}
            stroke={PALETTE.border}
            strokeWidth={2}
            strokeDasharray="8 6"
          />

          {/* Etiqueta de zona superior ciega (>= 28px) */}
          <text
            x={40}
            y={52}
            fill={PALETTE.inkMuted}
            fontFamily="monospace"
            fontSize={28}
            fontWeight={700}
          >
            RELIEVE 3D IGNORADO (EJE Z = 0 µm)
          </text>

          {/* Perfil epidérmico real con crestas y valles profundos sin leer */}
          <path
            d="M 48 158 L 95 92 L 145 158 L 210 88 L 265 158 L 335 90 L 395 158 L 465 86 L 525 158 L 595 92 L 655 158 L 720 90 L 768 158"
            fill="none"
            stroke={PALETTE.inkMuted}
            strokeWidth={4}
            strokeDasharray="6 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Superficie plana de contacto 2D (Cristal óptico) */}
          <rect
            x={16}
            y={162}
            width={784}
            height={28}
            rx={6}
            fill={PALETTE.surface}
            stroke={PALETTE.border}
            strokeWidth={3}
          />
          <line
            x1={24}
            y1={190}
            x2={792}
            y2={190}
            stroke={PALETTE.accentPrimary}
            strokeWidth={4}
          />

          {/* Haces de luz 2D planos que rebotan sin penetrar la epidermis */}
          {rayPositions.map((rx, idx) => {
            const raySpring = spring({
              frame: Math.max(0, localFrame - 8 - idx * 3),
              fps,
              config: SPRING_SNAPPY,
            });
            const yTop = interpolate(
              raySpring,
              [0, 1],
              [310, 192],
              CLAMP_EXTRAPOLATION
            );
            const bounceOpacity = interpolate(
              beamProgress,
              [0.3, 1],
              [0, 1],
              CLAMP_EXTRAPOLATION
            );

            return (
              <g key={rx}>
                {/* Haz ascendente LED */}
                <line
                  x1={rx - 18}
                  y1={312}
                  x2={rx}
                  y2={yTop}
                  stroke={PALETTE.accentWarning}
                  strokeWidth={4}
                  strokeLinecap="round"
                />
                {/* Haz reflejado plano 2D */}
                <line
                  x1={rx}
                  y1={192}
                  x2={rx + 22}
                  y2={312}
                  stroke={PALETTE.accentPrimary}
                  strokeWidth={3.5}
                  strokeDasharray="7 5"
                  opacity={bounceOpacity}
                />
                {/* Punto de bloqueo superficial */}
                <circle
                  cx={rx}
                  cy={190}
                  r={7}
                  fill={PALETTE.accentPrimary}
                  stroke={PALETTE.surfaceElevated}
                  strokeWidth={2}
                />
              </g>
            );
          })}

          {/* Módulo inferior: Barra emisora LED + Sensor CMOS 2D */}
          <rect
            x={48}
            y={312}
            width={720}
            height={48}
            rx={10}
            fill={PALETTE.ink}
          />
          <text
            x={408}
            y={345}
            textAnchor="middle"
            fill={PALETTE.surfaceElevated}
            fontFamily="monospace"
            fontSize={28}
            fontWeight={700}
          >
            EMISOR LED + CÁMARA PLANA 2D
          </text>
        </svg>

        {/* Contadores numéricos reales: 2D PLANO vs 180 ms */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: `2px solid ${PALETTE.gridLine}`,
            paddingTop: 18,
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
                display: 'inline-flex',
                alignItems: 'center',
                gap: 14,
                fontFamily: 'system-ui, sans-serif',
                fontSize: 74,
                fontWeight: 900,
                color: PALETTE.accentPrimary,
                lineHeight: 1,
              }}
            >
              <EyeOff size={48} color={PALETTE.accentPrimary} strokeWidth={2.5} />
              <span>
                {animatedDim}
                {metricUnit} PLANO
              </span>
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
              EXPOSICIÓN ÓPTICA
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                fontFamily: 'system-ui, sans-serif',
                fontSize: 70,
                fontWeight: 900,
                color: PALETTE.accentWarning,
                lineHeight: 1,
              }}
            >
              <AlertTriangle
                size={44}
                color={PALETTE.accentWarning}
                strokeWidth={2.5}
              />
              <span>{animatedExposureMs} ms</span>
            </div>
          </div>
        </div>
      </RoughCard>

      {/* Pie técnico diagnóstico dentro de la zona segura (< 1400px) */}
      <div
        style={{
          marginTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: PALETTE.surfaceMuted,
          border: `2px solid ${PALETTE.border}`,
          borderRadius: 14,
          padding: '16px 26px',
          opacity: interpolate(
            statusPillSpring,
            [0, 1],
            [0, 1],
            CLAMP_EXTRAPOLATION
          ),
          transform: `translateY(${interpolate(
            statusPillSpring,
            [0, 1],
            [16, 0],
            CLAMP_EXTRAPOLATION
          )}px)`,
        }}
      >
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 28,
            fontWeight: 700,
            color: PALETTE.ink,
          }}
        >
          CONTRASTE SUPERFICIAL: FALSIFICABLE CON IMAGEN 2D
        </span>
      </div>
    </div>
  );
};
