import React from 'react';
import {
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { BookMetadata, BookVisualData } from '../data/schema';
import { BRAND_CONFIG, SPRING_SNAPPY } from '../theme/motion';
import { CtaEndCard, KineticCard } from '../components/kinetic';

export interface Scene5Props {
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
 * Scene 5 — Tesis de Atención y Call To Action Final (@en1minuto.es):
 * 1. Titular limpio sin píldora superior.
 * 2. Tarjeta de Tesis en fondo bloc de notas ocre pálido (#FDF6DF) sin micro-etiquetas.
 * 3. CtaEndCard con Píldora Dinámica Animada (Reloj + @en1minuto.es).
 */
export const Scene5: React.FC<Scene5Props> = ({
  headline = 'Protege tu Atención',
  canvasOffsetX = 560,
  canvasOffsetY = 3960,
  enterFrame = 1402,
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

      {/* 2. Tarjeta de Identidad en KineticCard (Sin píldoras pequeñas) */}
      <div style={{ position: 'absolute', top: 265, left: 96, right: 96 }}>
        <KineticCard
          enterFrame={enterFrame + 30}
          accentBorderColor="#141413"
          padding="34px 38px"
          style={{
            borderTop: '8px solid #D94E34',
          }}
        >
          <blockquote
            style={{
              margin: 0,
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
              fontSize: 34,
              fontWeight: 800,
              fontStyle: 'normal',
              lineHeight: 1.32,
              color: '#141413',
              letterSpacing: '-0.02em',
            }}
          >
            «Quien eres y lo que logras es la suma de aquello en lo que decides{' '}
            <span
              style={{
                backgroundColor: 'rgba(217, 78, 52, 0.20)',
                padding: '2px 8px',
                borderRadius: 6,
                color: '#D94E34',
                fontWeight: 900,
              }}
            >
              concentrarte
            </span>
            .»
          </blockquote>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 18,
              color: '#575550',
              marginTop: 16,
              marginBottom: 0,
              fontWeight: 600,
            }}
          >
            {visualData?.identitySub ||
              'Tu atención es el activo más escaso y valioso de esta década.'}
          </p>
        </KineticCard>
      </div>

      {/* 3. Tarjeta Final de Call To Action con Píldora Dinámica (Reloj + @en1minuto.es) */}
      <div style={{ position: 'absolute', top: 585, left: 96, right: 96 }}>
        <CtaEndCard
          enterFrame={enterFrame + 155}
          handle={BRAND_CONFIG.channelHandle}
          questionText={
            visualData?.ctaPrompt ??
            '¿Cuántas horas de concentración real logras al día? Comenta abajo'
          }
        />
      </div>
    </div>
  );
};
