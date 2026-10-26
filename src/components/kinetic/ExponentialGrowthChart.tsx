import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { evolvePath } from '@remotion/paths';
import { CLAMP_EXTRAPOLATION, PALETTE, SPRING_SNAPPY } from '../../theme/motion';

export interface ExponentialGrowthChartProps {
  startFrame?: number;
  width?: number;
  height?: number;
  accentColor?: string;
  headerTitle?: string;
  peakValue?: number;
  peakLabel?: string;
  latentLabel?: string;
  xUnitLabel?: string;
  maxUnits?: number;
}

/**
 * ExponentialGrowthChart — Gráfico Cinético de Crecimiento Exponencial
 * Fondo bloc de notas ocre pálido (#FDF6DF) y diseño limpio sin etiquetas diminutas.
 */
export const ExponentialGrowthChart: React.FC<ExponentialGrowthChartProps> = ({
  startFrame = 0,
  width = 888,
  height = 520,
  accentColor = '#D94E34',
  peakValue = 5.0,
  xUnitLabel = 'HORA',
  maxUnits = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - startFrame);

  // 1. Entrada de la tarjeta contenedora
  const containerEntrance = spring({
    frame: localFrame,
    fps,
    config: SPRING_SNAPPY,
  });

  // 2. Progreso continuo y ultra-suave de la curva
  const rawProgress = interpolate(
    localFrame,
    [35, 305],
    [0, 1],
    CLAMP_EXTRAPOLATION
  );
  const curveProgress = Math.pow(rawProgress, 1.45);

  const padLeft = 86;
  const padRight = 50;
  const padTop = 44;
  const padBottom = 68;

  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  // 3. Generar trayectoria matemática continua de alta resolución (200 muestras)
  const sampleCount = 200;
  const points: { x: number; y: number; val: number; day: number }[] = [];

  for (let i = 0; i <= sampleCount; i++) {
    const t = i / sampleCount;
    const day = t * maxUnits;
    const rawExp = (Math.pow(1.01, t * 365) - 1.0) / (37.78 - 1.0);
    const multiplier = 1.0 + rawExp * (peakValue - 1.0);
    const normY = rawExp;

    const px = padLeft + t * plotWidth;
    const py = padTop + plotHeight - normY * plotHeight;
    points.push({ x: px, y: py, val: multiplier, day });
  }

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const evolved = evolvePath(curveProgress, pathD);

  const currentT = curveProgress;
  const currentNormY = (Math.pow(1.01, currentT * 365) - 1.0) / (37.78 - 1.0);
  const currentPt = {
    x: padLeft + currentT * plotWidth,
    y: padTop + plotHeight - currentNormY * plotHeight,
  };

  const areaD = `${pathD} L ${padLeft + plotWidth} ${padTop + plotHeight} L ${padLeft} ${padTop + plotHeight} Z`;

  const yLevels =
    peakValue <= 10
      ? [2, 3, 4, peakValue]
      : [10, 20, 30, peakValue];

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: PALETTE.cardNotepad,
        border: `2px solid ${PALETTE.cardBorder}`,
        borderRadius: 24,
        padding: '20px 24px',
        boxShadow: '0 16px 44px rgba(45, 43, 40, 0.08)',
        boxSizing: 'border-box',
        overflow: 'hidden',
        opacity: containerEntrance,
        transform: `translateY(${(1 - containerEntrance) * 20}px)`,
      }}
    >
      {/* Capa SVG: Gráfico, Rejilla, Ejes y Curva Dinámica */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.32" />
            <stop offset="70%" stopColor={accentColor} stopOpacity="0.09" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.0" />
          </linearGradient>

          <pattern id="chartDots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#D5C5A3" />
          </pattern>
        </defs>

        <rect
          x={padLeft}
          y={padTop}
          width={plotWidth}
          height={plotHeight}
          fill="url(#chartDots)"
          opacity={0.75}
        />

        {yLevels.map((lvl) => {
          const norm = (lvl - 1.0) / Math.max(0.1, peakValue - 1.0);
          const yPos = padTop + plotHeight - norm * plotHeight;
          return (
            <g key={lvl}>
              <line
                x1={padLeft}
                y1={yPos}
                x2={padLeft + plotWidth}
                y2={yPos}
                stroke="rgba(45, 43, 40, 0.14)"
                strokeDasharray="6 6"
                strokeWidth={1.5}
              />
              <text
                x={padLeft - 14}
                y={yPos + 5}
                fontFamily="'JetBrains Mono', monospace"
                fontSize={16}
                fontWeight={800}
                fill={lvl === peakValue ? accentColor : '#575550'}
                textAnchor="end"
              >
                {lvl}x
              </text>
            </g>
          );
        })}

        <line
          x1={padLeft}
          y1={padTop + plotHeight}
          x2={padLeft + plotWidth}
          y2={padTop + plotHeight}
          stroke="#575550"
          strokeWidth={2}
        />
        <text
          x={padLeft - 14}
          y={padTop + plotHeight + 5}
          fontFamily="'JetBrains Mono', monospace"
          fontSize={16}
          fontWeight={800}
          fill="#575550"
          textAnchor="end"
        >
          1x
        </text>

        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const d = Math.round(ratio * maxUnits);
          const xPos = padLeft + ratio * plotWidth;
          return (
            <text
              key={idx}
              x={xPos}
              y={padTop + plotHeight + 32}
              fontFamily="'JetBrains Mono', monospace"
              fontSize={15}
              fontWeight={800}
              fill="#575550"
              textAnchor={idx === 0 ? 'start' : idx === 4 ? 'end' : 'middle'}
            >
              {xUnitLabel} {d}
            </text>
          );
        })}

        <clipPath id="progressClip">
          <rect
            x={padLeft}
            y={padTop}
            width={plotWidth * curveProgress}
            height={plotHeight}
          />
        </clipPath>
        <path
          d={areaD}
          fill="url(#curveGradient)"
          clipPath="url(#progressClip)"
        />

        <path
          d={pathD}
          stroke="rgba(217, 78, 52, 0.18)"
          strokeWidth={2.5}
          strokeDasharray="6 6"
          fill="none"
        />

        <path
          d={pathD}
          stroke={accentColor}
          strokeWidth={5.5}
          strokeLinecap="round"
          strokeDasharray={evolved.strokeDasharray}
          strokeDashoffset={evolved.strokeDashoffset}
          fill="none"
        />

        {curveProgress > 0.02 && (
          <g transform={`translate(${currentPt.x}, ${currentPt.y})`}>
            <circle cx={0} cy={0} r={18} fill={accentColor} opacity={0.25} />
            <circle cx={0} cy={0} r={8} fill={accentColor} />
            <circle cx={0} cy={0} r={3.5} fill="#FFFFFF" />
          </g>
        )}
      </svg>
    </div>
  );
};
