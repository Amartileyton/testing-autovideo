import React from 'react';

export interface VignetteOverlayProps {
  intensity?: number;
  innerRadiusPercent?: number;
  color?: string;
}

/**
 * VignetteOverlay — Enfoque Cinemático Periférico (Haidrrrry Rule)
 * Oscurece sutilmente los bordes del lienzo 9:16 para dirigir la atención visual
 * al tercio medio/superior y disimular la interfaz nativa del reproductor.
 */
export const VignetteOverlay: React.FC<VignetteOverlayProps> = ({
  intensity = 0.4,
  innerRadiusPercent = 60,
  color = 'rgba(0, 0, 0, 1)',
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 890,
        background: `radial-gradient(circle at 50% 48%, transparent ${innerRadiusPercent}%, ${color.replace(
          '1)',
          `${intensity})`
        )} 100%)`,
      }}
    />
  );
};
