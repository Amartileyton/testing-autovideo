import React from 'react';
import {
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { BookMetadata, BookVisualData } from '../data/schema';
import { PALETTE, SPRING_SNAPPY } from '../theme/motion';

export interface Scene4Props {
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

const DEFAULT_LAWS = [
  {
    num: '01',
    title: 'TRABAJA CON PROFUNDIDAD',
    desc: 'Blinda bloques de 90 minutos sin notificaciones',
    triggerFrame: 45,
  },
  {
    num: '02',
    title: 'ABRAZA EL ABURRIMIENTO',
    desc: 'No mires el móvil al esperar: entrena tu foco',
    triggerFrame: 105,
  },
  {
    num: '03',
    title: 'DEJA LAS REDES SOCIALES',
    desc: 'Elimina apps que roban atención y aportan 0 valor',
    triggerFrame: 165,
  },
  {
    num: '04',
    title: 'DRENA LO SUPERFICIAL',
    desc: 'Planifica cada minuto y apaga el trabajo a las 18h',
    triggerFrame: 225,
  },
];

/**
 * Scene 4 — Las 4 Reglas Accionables en Cascada (@en1minuto.es):
 * Cajón de 4 fichas en fondo bloc de notas ocre pálido (#FDF6DF), sin píldoras pequeñas de relleno.
 */
export const Scene4: React.FC<Scene4Props> = ({
  headline = 'Las 4 Reglas de Céntrate',
  canvasOffsetX = 0,
  canvasOffsetY = 1980,
  enterFrame = 1091,
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

  const lawsToRender = React.useMemo(() => {
    if (visualData?.actionableLaws && visualData.actionableLaws.length === 4) {
      const triggers = [45, 105, 165, 225];
      return visualData.actionableLaws.map((item, idx) => ({
        num: item.index || `0${idx + 1}`,
        title: item.title,
        desc: item.rule,
        triggerFrame: triggers[idx] ?? 50 + idx * 55,
      }));
    }
    return DEFAULT_LAWS;
  }, [visualData]);

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

      {/* 2. Cajón de las 4 Fichas Cinéticas en Cascada (Sin etiquetas pequeñas ni badges) */}
      <div
        style={{
          position: 'absolute',
          top: 265,
          left: 96,
          right: 96,
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
        }}
      >
        {lawsToRender.map((law) => {
          const isTriggered = localFrame >= law.triggerFrame;
          const lawProgress = spring({
            frame: Math.max(0, localFrame - law.triggerFrame),
            fps,
            config: SPRING_SNAPPY,
          });

          return (
            <div
              key={law.num}
              style={{
                position: 'relative',
                backgroundColor: PALETTE.cardNotepad,
                border: isTriggered
                  ? '2.5px solid #D94E34'
                  : `2px solid ${PALETTE.cardBorder}`,
                borderLeft: isTriggered
                  ? '10px solid #D94E34'
                  : `2px solid ${PALETTE.cardBorder}`,
                borderRadius: 20,
                padding: '28px 34px',
                boxShadow: isTriggered
                  ? '0 16px 40px rgba(217, 78, 52, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04)'
                  : '0 6px 18px rgba(45, 43, 40, 0.05)',
                opacity: lawProgress,
                transform: `translateX(${(1 - lawProgress) * 50}px) scale(${isTriggered ? 1.01 : 0.98})`,
                transformOrigin: 'left center',
                display: 'flex',
                alignItems: 'center',
                gap: 28,
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 38,
                  fontWeight: 900,
                  color: isTriggered ? '#D94E34' : '#78716C',
                  minWidth: 54,
                  lineHeight: 1,
                }}
              >
                {law.num}
              </div>

              <div>
                <div
                  style={{
                    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                    fontSize: 31,
                    fontWeight: 900,
                    color: '#141413',
                    letterSpacing: '-0.02em',
                    marginBottom: 6,
                    lineHeight: 1.1,
                  }}
                >
                  {law.title}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 18,
                    fontWeight: 600,
                    color: '#575550',
                    lineHeight: 1.3,
                  }}
                >
                  {law.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
