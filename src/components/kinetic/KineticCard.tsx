import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CLAMP_EXTRAPOLATION, PALETTE, SPRING_SNAPPY } from '../../theme/motion';

export interface KineticCardProps {
  children: React.ReactNode;
  /** Fotograma local en el que entra la tarjeta */
  enterFrame?: number;
  /** Desplazamiento inicial Y (en píxeles, por defecto 40) */
  enterY?: number;
  /** Inclinación en 2.5D (en grados) */
  tiltDeg?: number;
  /** Color de acento de la tarjeta o del borde */
  accentBorderColor?: string;
  /** (Obsoleto / Ignorado por limpieza corporativa) */
  badgeText?: string;
  badgeColor?: string;
  width?: number | string;
  padding?: number | string;
  style?: React.CSSProperties;
}

/**
 * KineticCard — Tarjeta Cinética Multicapa 2.5D con Fondo Bloc de Notas Ocre Pálido (#FDF6DF)
 * Sin píldoras ni micro-etiquetas superfluas.
 */
export const KineticCard: React.FC<KineticCardProps> = ({
  children,
  enterFrame = 0,
  enterY = 40,
  tiltDeg = 0,
  accentBorderColor = '#141413',
  width = '100%',
  padding = '30px 36px',
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - enterFrame);

  // Entrada con spring ultra-suave
  const entranceSpring = spring({
    frame: localFrame,
    fps,
    config: SPRING_SNAPPY,
  });

  const translateY = interpolate(
    entranceSpring,
    [0, 1],
    [enterY, 0],
    CLAMP_EXTRAPOLATION
  );

  const scale = interpolate(
    entranceSpring,
    [0, 1],
    [0.92, 1],
    CLAMP_EXTRAPOLATION
  );

  return (
    <div
      style={{
        position: 'relative',
        width,
        backgroundColor: PALETTE.cardNotepad,
        border: accentBorderColor
          ? `2px solid ${accentBorderColor}`
          : `1.5px solid ${PALETTE.cardBorder}`,
        borderRadius: 20,
        padding,
        boxShadow:
          '0 20px 50px rgba(45, 43, 40, 0.09), 0 4px 12px rgba(45, 43, 40, 0.04)',
        boxSizing: 'border-box',
        opacity: entranceSpring,
        transform: `translateY(${translateY}px) scale(${scale}) perspective(1000px) rotateX(${tiltDeg}deg)`,
        transformOrigin: 'center center',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
