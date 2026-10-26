import React from 'react';
import {
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { BookMetadata, BookVisualData } from '../data/schema';
import { SPRING_SNAPPY } from '../theme/motion';
import { KineticCard, VectorLoopCircuit } from '../components/kinetic';

export interface Scene3Props {
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
 * Scene 3 — Circuito Neurológico + Cita Subrayada (@en1minuto.es):
 * Sin píldoras pequeñas ni micro-etiquetas. Tarjetas en fondo ocre pálido bloc de notas (#FDF6DF).
 */
export const Scene3: React.FC<Scene3Props> = ({
  headline = 'La fórmula del éxito',
  canvasOffsetX = 1120,
  canvasOffsetY = 1980,
  enterFrame = 725,
  bookMetadata,
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

  const authorName = bookMetadata?.author || visualData?.quoteAuthor || 'Cal Newport';

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
          {headline}
        </h1>
      </div>

      {/* 2. Circuito Vectorial Animado (VectorLoopCircuit) */}
      <div
        style={{
          position: 'absolute',
          top: 265,
          left: 96,
          right: 96,
        }}
      >
        <VectorLoopCircuit
          startFrame={enterFrame}
          accentColor="#D94E34"
          width={888}
          height={480}
        />
      </div>

      {/* 3. Tarjeta Cita Célebre Subrayada en KineticCard (Sin píldoras pequeñas) */}
      <div
        style={{
          position: 'absolute',
          top: 790,
          left: 96,
          right: 96,
        }}
      >
        <KineticCard
          enterFrame={enterFrame + 180}
          accentBorderColor="#141413"
          padding="36px 38px"
          style={{
            borderLeft: '8px solid #D94E34',
          }}
        >
          <blockquote
            style={{
              margin: 0,
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
              fontSize: 36,
              fontWeight: 800,
              fontStyle: 'normal',
              lineHeight: 1.3,
              letterSpacing: '-0.02em',
              color: '#141413',
            }}
          >
            «El{' '}
            <span
              style={{
                backgroundColor: 'rgba(217, 78, 52, 0.20)',
                padding: '2px 8px',
                borderRadius: 6,
                color: '#D94E34',
                fontWeight: 900,
              }}
            >
              trabajo profundo
            </span>{' '}
            es el superpoder del siglo XXI: concentrarse{' '}
            <span
              style={{
                backgroundColor: 'rgba(217, 78, 52, 0.20)',
                padding: '2px 8px',
                borderRadius: 6,
                color: '#D94E34',
                fontWeight: 900,
              }}
            >
              sin distracción
            </span>
            .»
          </blockquote>

          <div
            style={{
              marginTop: 22,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ width: 36, height: 3, backgroundColor: '#D94E34' }} />
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                fontSize: 20,
                fontWeight: 800,
                color: '#141413',
              }}
            >
              {authorName}
            </span>
          </div>
        </KineticCard>
      </div>
    </div>
  );
};
