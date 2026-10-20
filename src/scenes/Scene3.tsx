import React from 'react';
import { Fingerprint, Layers, ScanLine } from 'lucide-react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { RoughCard } from '../components/RoughCard';
import {
  CLAMP_EXTRAPOLATION,
  PALETTE,
  SAFE_ZONE,
  SPRING_SNAPPY,
} from '../theme/motion';

export interface Scene3Props {
  headline?: string;
  metricValue?: number;
  metricUnit?: string;
  metricLabel?: string;
  canvasOffsetX?: number;
  canvasOffsetY?: number;
  enterFrame?: number;
}

/**
 * Scene3 — Escena Impar (Slot 3)
 * Corte transversal topográfico 3D de la epidermis (crestas, valles y poros sudoríparos)
 * donde ondas ultrasónicas de eco miden la profundidad exacta hasta 400 µm en los ejes X · Y · Z.
 * Respeta Zona Segura Vertical 9:16 (padding >= 96px, titulares >= 64px <= 7 palabras, etiquetas >= 28px, y < 1400px).
 */
export const Scene3: React.FC<Scene3Props> = ({
  headline = 'RELIEVE EPIDÉRMICO EN 3D',
  metricValue = 400,
  metricUnit = 'µm',
  metricLabel = 'PENETRACIÓN EPIDÉRMICA',
  canvasOffsetX = 1100,
  canvasOffsetY = 1980,
  enterFrame = 389,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - enterFrame);

  const headerSpring = spring({
    frame: localFrame,
    fps,
    config: SPRING_SNAPPY,
  });

  const scanProgress = interpolate(
    localFrame,
    [4, 68],
    [0, 1],
    CLAMP_EXTRAPOLATION
  );

  const animatedDepthUm = Math.round(
    interpolate(localFrame, [6, 54], [0, metricValue], CLAMP_EXTRAPOLATION)
  );

  const animatedNodes = Math.round(
    interpolate(localFrame, [10, 60], [0, 3], CLAMP_EXTRAPOLATION)
  );

  const footerSpring = spring({
    frame: Math.max(0, localFrame - 16),
    fps,
    config: SPRING_SNAPPY,
  });

  const echoColumns = [
    { x: 118, ridgeY: 168, type: 'CRESTA' },
    { x: 232, ridgeY: 86, type: 'VALLE' },
    { x: 348, ridgeY: 168, type: 'PORO' },
    { x: 464, ridgeY: 84, type: 'VALLE' },
    { x: 580, ridgeY: 168, type: 'CRESTA' },
    { x: 696, ridgeY: 88, type: 'VALLE' },
  ];

  const scanLineX = interpolate(
    scanProgress,
    [0, 1],
    [70, 746],
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
        <Layers size={32} color={PALETTE.accentSecondary} strokeWidth={2.5} />
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 28,
            fontWeight: 700,
            color: PALETTE.ink,
            letterSpacing: '0.05em',
          }}
        >
          TOPOGRAFÍA VOLUMÉTRICA · EJES X · Y · Z
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

      {/* Tarjeta principal RoughCard (888x720) con corte transversal epidérmico 3D */}
      <RoughCard
        width={888}
        height={720}
        enterFrame={enterFrame + 4}
        accentColor={PALETTE.accentSecondary}
        seed={303}
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
            <Fingerprint
              size={36}
              color={PALETTE.accentSecondary}
              strokeWidth={2.4}
            />
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 28,
                fontWeight: 700,
                color: PALETTE.ink,
              }}
            >
              CORTE TRANSVERSAL EPIDÉRMICO
            </span>
          </div>
          <ScanLine size={36} color={PALETTE.accentSuccess} strokeWidth={2.4} />
        </div>

        {/* Diagrama vectorial causal: Corte transversal 3D con crestas, valles y poros */}
        <svg width={816} height={370} viewBox="0 0 816 370">
          {/* Cuadrícula de medición micrométrica Z (0 a 400 µm) */}
          <rect
            x={16}
            y={12}
            width={784}
            height={272}
            rx={12}
            fill={PALETTE.surface}
            stroke={PALETTE.border}
            strokeWidth={2.5}
          />

          {/* Líneas guía de profundidad Z */}
          <line
            x1={28}
            y1={86}
            x2={788}
            y2={86}
            stroke={PALETTE.gridLine}
            strokeWidth={2}
            strokeDasharray="6 6"
          />
          <line
            x1={28}
            y1={168}
            x2={788}
            y2={168}
            stroke={PALETTE.gridLine}
            strokeWidth={2}
            strokeDasharray="6 6"
          />

          {/* Etiqueta de cota superior 400 µm (>= 28px) */}
          <text
            x={36}
            y={52}
            fill={PALETTE.accentSecondary}
            fontFamily="monospace"
            fontSize={28}
            fontWeight={700}
          >
            Z = 400 µm · DERMIS Y POROS
          </text>

          {/* Polígono sombreado del tejido epidérmico (Crestas, Valles y Poro Sudoríparo) */}
          <path
            d="M 48 24 L 768 24 L 768 124 L 696 88 L 580 168 L 464 84 L 364 168 L 356 122 L 340 122 L 332 168 L 232 86 L 118 168 L 48 118 Z"
            fill={PALETTE.surfaceMuted}
            stroke={PALETTE.ink}
            strokeWidth={4}
            strokeLinejoin="round"
          />

          {/* Indicador de poro sudoríparo en X=348 */}
          <circle
            cx={348}
            cy={118}
            r={10}
            fill={PALETTE.accentPrimary}
            stroke={PALETTE.surfaceElevated}
            strokeWidth={2.5}
          />

          {/* Vectores ultrasónicos de eco midiendo la profundidad Z en cada punto */}
          {echoColumns.map((col, idx) => {
            const colSpring = spring({
              frame: Math.max(0, localFrame - 8 - idx * 3),
              fps,
              config: SPRING_SNAPPY,
            });
            const currentY = interpolate(
              colSpring,
              [0, 1],
              [274, col.ridgeY],
              CLAMP_EXTRAPOLATION
            );
            const isValley = col.ridgeY < 120;

            return (
              <g key={col.x}>
                {/* Pulso ascendente y eco reflejado */}
                <line
                  x1={col.x}
                  y1={276}
                  x2={col.x}
                  y2={currentY}
                  stroke={
                    isValley ? PALETTE.accentSecondary : PALETTE.accentSuccess
                  }
                  strokeWidth={4}
                  strokeDasharray={isValley ? '7 5' : undefined}
                />
                {/* Nodo de lectura topográfica */}
                <circle
                  cx={col.x}
                  cy={currentY}
                  r={8}
                  fill={
                    isValley ? PALETTE.accentSecondary : PALETTE.accentSuccess
                  }
                  stroke={PALETTE.surfaceElevated}
                  strokeWidth={2.5}
                />
              </g>
            );
          })}

          {/* Barrido vertical activo de reconstrucción X·Y·Z */}
          <line
            x1={scanLineX}
            y1={20}
            x2={scanLineX}
            y2={278}
            stroke={PALETTE.accentPrimary}
            strokeWidth={3.5}
          />

          {/* Base inferior: Matriz receptora piezoeléctrica */}
          <rect
            x={16}
            y={296}
            width={784}
            height={58}
            rx={10}
            fill={PALETTE.ink}
          />
          <text
            x={408}
            y={334}
            textAnchor="middle"
            fill={PALETTE.surfaceElevated}
            fontFamily="monospace"
            fontSize={28}
            fontWeight={700}
          >
            MATRIZ RECEPTORA DE ECO ACÚSTICO (X · Y · Z)
          </text>
        </svg>

        {/* Contadores numéricos reales: 0 -> 400 µm y Ejes 3D */}
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
                fontSize: 76,
                fontWeight: 900,
                color: PALETTE.accentSecondary,
                lineHeight: 1,
              }}
            >
              <ScanLine
                size={48}
                color={PALETTE.accentSecondary}
                strokeWidth={2.5}
              />
              <span>
                {animatedDepthUm} {metricUnit}
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
              MAPA VOLUMÉTRICO
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                fontFamily: 'system-ui, sans-serif',
                fontSize: 70,
                fontWeight: 900,
                color: PALETTE.accentSuccess,
                lineHeight: 1,
              }}
            >
              <Layers
                size={44}
                color={PALETTE.accentSuccess}
                strokeWidth={2.5}
              />
              <span>{animatedNodes}D X·Y·Z</span>
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
            footerSpring,
            [0, 1],
            [0, 1],
            CLAMP_EXTRAPOLATION
          ),
          transform: `translateY(${interpolate(
            footerSpring,
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
          DETECCIÓN SUBDÉRMICA: CRESTAS · VALLES · POROS
        </span>
      </div>
    </div>
  );
};
