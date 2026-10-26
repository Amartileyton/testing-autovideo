import React from 'react';
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { BookMetadata, BookVisualData } from '../data/schema';
import { CLAMP_EXTRAPOLATION, SPRING_SNAPPY } from '../theme/motion';
import {
  ExponentialGrowthChart,
  KineticCard,
  LiveCounter,
} from '../components/kinetic';

export interface Scene2Props {
  headline?: string;
  metricValue?: number;
  metricUnit?: string;
  metricLabel?: string;
  canvasOffsetX?: number;
  canvasOffsetY?: number;
  enterFrame?: number;
  bookMetadata?: BookMetadata;
  visualData?: BookVisualData;
}

/**
 * Scene 2 — Ecuación Cognitiva y Curva de Crecimiento Exponencial (@en1minuto.es):
 * Sin píldoras pequeñas ni micro-títulos superfluos. Tarjetas en fondo ocre pálido bloc de notas (#FDF6DF).
 */
export const Scene2: React.FC<Scene2Props> = ({
  headline = 'Ocupado ≠ Productivo',
  canvasOffsetX = 1120,
  canvasOffsetY = 0,
  enterFrame = 393,
  visualData,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - enterFrame);

  // 1. Cabecera (frame 0)
  const headerEntrance = spring({
    frame: localFrame,
    fps,
    config: SPRING_SNAPPY,
  });

  // 2. Progreso de llenado de la barra reactiva
  const fillProgress = spring({
    frame: Math.max(0, localFrame - 180),
    fps,
    config: { damping: 22, stiffness: 100, mass: 0.9 },
    durationInFrames: 50,
  });

  const targetVal = visualData?.targetCounterValue ?? 5.0;

  return (
    <div
      style={{
        position: 'absolute',
        left: canvasOffsetX,
        top: canvasOffsetY,
        width: 1080,
        height: 1920,
        pointerEvents: 'none',
        padding: '0 96px',
        boxSizing: 'border-box',
      }}
    >
      {/* 1. Titular Limpio (Sin píldora superior) */}
      <div
        style={{
          position: 'absolute',
          top: 140,
          left: 96,
          right: 96,
          opacity: headerEntrance,
          transform: `translateY(${(1 - headerEntrance) * -20}px)`,
        }}
      >
        <h1
          style={{
            fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
            fontSize: 60,
            fontWeight: 900,
            color: '#141413',
            margin: 0,
            lineHeight: 1.06,
            letterSpacing: '-0.035em',
          }}
        >
          {visualData?.headlineTitle || headline}
        </h1>
      </div>

      {/* 2. Tarjeta Hero Integrada con LiveCounter (Sin píldoras pequeñas) */}
      <div style={{ position: 'absolute', top: 265, left: 96, right: 96 }}>
        <KineticCard
          enterFrame={enterFrame + 10}
          accentBorderColor="#141413"
          padding="32px 36px"
          style={{
            borderTop: '8px solid #D94E34',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'baseline',
              lineHeight: 1,
            }}
          >
            <LiveCounter
              from={1.0}
              to={targetVal}
              startFrame={enterFrame + 140}
              durationFrames={45}
              decimals={2}
              suffix="x"
              fontSize={112}
              color="#141413"
              fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif"
            />
          </div>

          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
              fontSize: 25,
              fontWeight: 800,
              color: '#141413',
              marginTop: 14,
              letterSpacing: '-0.02em',
            }}
          >
            {visualData?.formulaLabel || 'Producción = Tiempo × Intensidad de Enfoque'}
          </div>

          {/* Barra reactiva */}
          <div
            style={{
              marginTop: 18,
              width: '100%',
              height: 10,
              backgroundColor: 'rgba(217, 78, 52, 0.14)',
              borderRadius: 5,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${interpolate(fillProgress, [0, 1], [3, 100], CLAMP_EXTRAPOLATION)}%`,
                height: '100%',
                backgroundColor: '#D94E34',
                borderRadius: 5,
              }}
            />
          </div>
        </KineticCard>
      </div>

      {/* 3. Gráfico de Crecimiento Exponencial Animado debajo de la tarjeta */}
      <div style={{ position: 'absolute', top: 610, left: 96, right: 96 }}>
        <ExponentialGrowthChart
          startFrame={enterFrame}
          width={888}
          height={520}
          accentColor="#D94E34"
          peakValue={targetVal}
          xUnitLabel="HORA"
          maxUnits={4}
        />
      </div>
    </div>
  );
};
