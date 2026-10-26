import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { evolvePath } from '@remotion/paths';
import { CLAMP_EXTRAPOLATION, PALETTE, SPRING_SNAPPY } from '../../theme/motion';

export interface CircuitNode {
  id: string;
  num: string;
  label: string;
  sublabel: string;
  x: number;
  y: number;
  triggerFrame: number;
  endSpokenFrame?: number;
}

export interface VectorLoopCircuitProps {
  nodes?: CircuitNode[];
  startFrame?: number;
  accentColor?: string;
  width?: number;
  height?: number;
}

const DEFAULT_NODES: CircuitNode[] = [
  { id: 'signal', num: '01', label: 'RITUAL', sublabel: 'Entorno sin distracciones', x: 175, y: 135, triggerFrame: 45, endSpokenFrame: 95 },
  { id: 'craving', num: '02', label: 'INMERSIÓN', sublabel: 'Bloque de 90 min puros', x: 713, y: 135, triggerFrame: 96, endSpokenFrame: 145 },
  { id: 'response', num: '03', label: 'MIELINA', sublabel: 'Velocidad sináptica x5', x: 713, y: 345, triggerFrame: 146, endSpokenFrame: 195 },
  { id: 'reward', num: '04', label: 'CIERRE', sublabel: 'Apagado cognitivo total', x: 175, y: 345, triggerFrame: 196, endSpokenFrame: 250 },
];

/**
 * VectorLoopCircuit — Circuito Vectorial Dinámico sobre Fondo Bloc de Notas Ocre Pálido (#FDF6DF)
 * Sin micro-etiquetas ni cabeceras diminutas.
 */
export const VectorLoopCircuit: React.FC<VectorLoopCircuitProps> = ({
  nodes = DEFAULT_NODES,
  startFrame = 0,
  accentColor = '#D94E34',
  width = 888,
  height = 480,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - startFrame);

  // Ruta cerrada rectangular que conecta los 4 nodos
  const circuitPath = `M ${nodes[0].x} ${nodes[0].y} L ${nodes[1].x} ${nodes[1].y} L ${nodes[2].x} ${nodes[2].y} L ${nodes[3].x} ${nodes[3].y} Z`;

  const drawProgress = spring({
    frame: Math.max(0, localFrame - 20),
    fps,
    config: { damping: 25, stiffness: 90, mass: 1 },
    durationInFrames: 60,
  });

  const pathEvolution = evolvePath(drawProgress, circuitPath);

  // Pulso/partícula que viaja en bucle continuo a lo largo del circuito
  const loopCycleFrames = 120;
  const loopProgress = (localFrame % loopCycleFrames) / loopCycleFrames;

  let particleX = nodes[0].x;
  let particleY = nodes[0].y;
  if (loopProgress < 0.25) {
    const t = loopProgress / 0.25;
    particleX = interpolate(t, [0, 1], [nodes[0].x, nodes[1].x], CLAMP_EXTRAPOLATION);
    particleY = nodes[0].y;
  } else if (loopProgress < 0.5) {
    const t = (loopProgress - 0.25) / 0.25;
    particleX = nodes[1].x;
    particleY = interpolate(t, [0, 1], [nodes[1].y, nodes[2].y], CLAMP_EXTRAPOLATION);
  } else if (loopProgress < 0.75) {
    const t = (loopProgress - 0.5) / 0.25;
    particleX = interpolate(t, [0, 1], [nodes[2].x, nodes[3].x], CLAMP_EXTRAPOLATION);
    particleY = nodes[2].y;
  } else {
    const t = (loopProgress - 0.75) / 0.25;
    particleX = nodes[3].x;
    particleY = interpolate(t, [0, 1], [nodes[3].y, nodes[0].y], CLAMP_EXTRAPOLATION);
  }

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: PALETTE.cardNotepad,
        border: `2px solid ${PALETTE.cardBorder}`,
        borderRadius: 24,
        padding: 24,
        boxShadow: '0 14px 40px rgba(45, 43, 40, 0.08)',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Capa SVG: Circuito y Trazos Dibujados en Vivo */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}
      >
        <path
          d={circuitPath}
          stroke="rgba(45, 43, 40, 0.12)"
          strokeWidth={3.5}
          strokeDasharray="6 6"
          fill="none"
        />

        <path
          d={circuitPath}
          stroke={accentColor}
          strokeWidth={4.5}
          strokeDasharray={pathEvolution.strokeDasharray}
          strokeDashoffset={pathEvolution.strokeDashoffset}
          fill="none"
        />

        {drawProgress > 0.4 && (
          <g transform={`translate(${particleX}, ${particleY})`}>
            <circle cx={0} cy={0} r={16} fill={accentColor} opacity={0.28} />
            <circle cx={0} cy={0} r={8} fill={accentColor} />
            <circle cx={0} cy={0} r={3.5} fill="#FFFFFF" />
          </g>
        )}
      </svg>

      {/* Capa HTML: 4 Estaciones Limpias sin micro-píldoras */}
      {nodes.map((node) => {
        const isTriggered = localFrame >= node.triggerFrame;
        const isCurrentlySpoken =
          localFrame >= node.triggerFrame &&
          localFrame <= (node.endSpokenFrame ?? node.triggerFrame + 25);

        const nodeSpring = spring({
          frame: Math.max(0, localFrame - node.triggerFrame),
          fps,
          config: SPRING_SNAPPY,
        });

        const cardBg = isCurrentlySpoken ? accentColor : '#FFFBF0';
        const cardBorder = isCurrentlySpoken
          ? '3px solid #B91C1C'
          : `2px solid ${accentColor}`;

        return (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: node.x - 130,
              top: node.y - 54,
              width: 260,
              backgroundColor: cardBg,
              border: cardBorder,
              borderRadius: 18,
              padding: '16px 20px',
              boxShadow: '0 10px 26px rgba(45, 43, 40, 0.08)',
              transform: `scale(${isTriggered ? interpolate(nodeSpring, [0, 1], [0.9, isCurrentlySpoken ? 1.06 : 1.0], CLAMP_EXTRAPOLATION) : 0.94})`,
              transformOrigin: 'center center',
              zIndex: isCurrentlySpoken ? 30 : 10,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 28,
                fontWeight: 900,
                color: isCurrentlySpoken ? '#FFFFFF' : accentColor,
                lineHeight: 1,
              }}
            >
              {node.num}
            </span>

            <div>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  fontSize: 24,
                  fontWeight: 900,
                  color: isCurrentlySpoken ? '#FFFFFF' : '#141413',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                {node.label}
              </div>

              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: isCurrentlySpoken ? '#FEE2E2' : '#575550',
                  marginTop: 4,
                  lineHeight: 1.2,
                }}
              >
                {node.sublabel}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
