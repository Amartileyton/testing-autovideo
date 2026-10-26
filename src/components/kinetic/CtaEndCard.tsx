import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CLAMP_EXTRAPOLATION, PALETTE, SPRING_SNAPPY } from '../../theme/motion';
import { OneMinuteStopwatch } from '../OneMinuteStopwatch';

export interface CtaEndCardProps {
  enterFrame?: number;
  handle?: string;
  questionText?: string;
}

/**
 * CtaEndCard — Tarjeta Final de Conversión (@en1minuto.es)
 * Incluye:
 * 1. Píldora Corporativa Dinámica con el Reloj Cronómetro + @en1minuto.es que se despliega con animación elástica.
 * 2. Fondo bloc de notas ocre pálido (#FDF6DF) sin micro-etiquetas superfluas.
 * 3. Caja de pregunta a la comunidad y acciones de guardar/compartir.
 */
export const CtaEndCard: React.FC<CtaEndCardProps> = ({
  enterFrame = 0,
  handle = '@en1minuto.es',
  questionText = '¿Cuántas horas de concentración real logras al día? Comenta abajo',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - enterFrame);

  // 1. Entrada de la tarjeta con resorte snappy
  const cardSpring = spring({
    frame: localFrame,
    fps,
    config: SPRING_SNAPPY,
  });

  // 2. Despliegue elástico de la píldora corporativa (Reloj + @en1minuto.es)
  const pillExpandSpring = spring({
    frame: Math.max(0, localFrame - 6),
    fps,
    config: { damping: 16, stiffness: 180, mass: 0.8 },
  });

  const handleRevealSpring = spring({
    frame: Math.max(0, localFrame - 14),
    fps,
    config: SPRING_SNAPPY,
  });

  // 3. Pulso constante en la píldora principal y botón de seguir
  const pulseLoop = (localFrame % 30) / 30;
  const pulseScale = interpolate(
    pulseLoop,
    [0, 0.5, 1],
    [1.0, 1.035, 1.0],
    CLAMP_EXTRAPOLATION
  );

  return (
    <div
      style={{
        position: 'relative',
        width: 888,
        backgroundColor: PALETTE.cardNotepad,
        border: '3px solid #D94E34',
        borderRadius: 26,
        padding: '36px 40px 30px',
        boxShadow:
          '0 24px 60px rgba(217, 78, 52, 0.18), 0 4px 14px rgba(0,0,0,0.05)',
        boxSizing: 'border-box',
        textAlign: 'center',
        opacity: cardSpring,
        transform: `translateY(${(1 - cardSpring) * 35}px) scale(${interpolate(
          cardSpring,
          [0, 1],
          [0.92, 1.0],
          CLAMP_EXTRAPOLATION
        )})`,
      }}
    >
      {/* 1. PÍLDORA DINÁMICA EN BLANCO CON EL RELOJ + @EN1MINUTO.ES */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 18,
          backgroundColor: '#FFFFFF',
          border: '3px solid #D94E34',
          borderRadius: 999,
          padding: '12px 34px 12px 16px',
          marginBottom: 22,
          boxShadow: '0 16px 38px rgba(217, 78, 52, 0.18), 0 4px 12px rgba(20, 20, 19, 0.08)',
          transform: `scale(${interpolate(pillExpandSpring, [0, 1], [0.65, pulseScale], CLAMP_EXTRAPOLATION)})`,
          transformOrigin: 'center center',
        }}
      >
        <OneMinuteStopwatch
          size={78}
          mode="hero"
          currentFrame={localFrame}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            opacity: handleRevealSpring,
            transform: `translateX(${(1 - handleRevealSpring) * -18}px)`,
          }}
        >
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
              fontSize: 40,
              fontWeight: 900,
              color: '#141413',
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
            }}
          >
            {handle}
          </span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 16,
              fontWeight: 800,
              color: '#D94E34',
              marginTop: 2,
            }}
          >
            🔔 Síguenos para 1 libro al día en 60s
          </span>
        </div>
      </div>

      {/* 2. Titular de Alto Impacto */}
      <h3
        style={{
          fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
          fontSize: 36,
          fontWeight: 900,
          color: '#141413',
          margin: '0 0 20px 0',
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
        }}
      >
        Aprende 1 libro al día en 60 segundos
      </h3>

      {/* 3. Caja Interactiva de Pregunta para Comentarios */}
      <div
        style={{
          backgroundColor: '#FFFDF7',
          border: '2px dashed rgba(217, 78, 52, 0.50)',
          borderRadius: 16,
          padding: '16px 22px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 30, flexShrink: 0 }}>💬</span>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 19,
            fontWeight: 800,
            color: '#141413',
            lineHeight: 1.3,
          }}
        >
          {questionText}
        </div>
      </div>

      {/* 4. Fila de Acciones (Guardar y Compartir) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 18,
          borderTop: `1.5px solid ${PALETTE.cardBorder}`,
          paddingTop: 16,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
            fontSize: 15,
            fontWeight: 800,
            color: '#141413',
            backgroundColor: '#FFFDF7',
            border: `1.5px solid ${PALETTE.cardBorder}`,
            padding: '10px 18px',
            borderRadius: 12,
          }}
        >
          <span>🔖</span>
          <span>GUARDA ESTE RESUMEN</span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
            fontSize: 15,
            fontWeight: 800,
            color: '#141413',
            backgroundColor: '#FFFDF7',
            border: `1.5px solid ${PALETTE.cardBorder}`,
            padding: '10px 18px',
            borderRadius: 12,
          }}
        >
          <span>↗️</span>
          <span>COMPARTE CON UN AMIGO</span>
        </div>
      </div>
    </div>
  );
};
