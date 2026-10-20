import React from 'react';
import { useCurrentFrame } from 'remotion';
import {
  CornerHudTelemetry,
  DimensionRuler,
  HeroPropStage,
  HypothesisScoreboard,
  LeaderLineCallout,
} from '../components/blueprints/ResultaaqueeBlueprints';

export interface Scene1Props {
  headline?: string;
  metricValue?: number;
  metricUnit?: string;
  metricLabel?: string;
  canvasOffsetX?: number;
  canvasOffsetY?: number;
  enterFrame?: number;
}

/**
 * Scene 1 — El Fallo del Sensor Óptico (Art-First + Estilo @resultaaquee Ref 2 + Ref 4)
 * - Escenario Persistente Zero-Box sobre cuadrícula DARK_CAD_XRAY (#111111).
 * - Marcador de Hipótesis [2D̸] vs [3D] que tacha la hipótesis de "una foto 2D".
 * - HeroPropStage 3D CAD: dedo real suspendido sobre la placa de cristal cian 3D
 *   y la rejilla óptica roja 2D separadas en vista explosionada isométrica.
 * - Líneas guía quebradas (LeaderLineCallout) y acotación de profundidad 0 µm (DimensionRuler).
 */
export const Scene1: React.FC<Scene1Props> = ({
  canvasOffsetX = 0,
  canvasOffsetY = 0,
  enterFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - enterFrame);

  // Tachado de la hipótesis [2D] cuando menciona "antiguos lectores ópticos... dos dimensiones"
  const discard2D = localFrame >= 90;

  return (
    <div
      style={{
        position: 'absolute',
        left: canvasOffsetX,
        top: canvasOffsetY,
        width: 1080,
        height: 1920,
        pointerEvents: 'none',
      }}
    >
      {/* Telemetría de esquina superior (Estilo Ref 1) */}
      <CornerHudTelemetry
        leftLabel="SENSOR ÓPTICO ANTIGUO"
        leftValue="LUZ 2D PLANA"
        rightLabel="LECTURA EJE Z"
        rightValue="0 µm"
        accentColor="#F43F5E"
        textColor="#F59E0B"
      />

      {/* Marcador de Hipótesis estilo Ref 4 ([2D̸] vs [3D]) situado bajo los subtítulos superiores */}
      <HypothesisScoreboard
        top={355}
        options={[
          {
            value: '2D',
            status: discard2D ? 'discarded' : 'neutral',
          },
          {
            value: '3D',
            status: discard2D ? 'winner' : 'neutral',
          },
        ]}
      />

      {/* Hero Prop 3D CAD: Dedo + Placa Cristal 3D + Sensor Óptico 2D Explosionados */}
      <HeroPropStage
        src="assets/props/hero-scene1-finger-layers.png"
        x={540}
        y={825}
        size={690}
        enterFrame={8}
        localFrame={localFrame}
        accentColor="#38BDF8"
        secondaryColor="#F43F5E"
        scanBeam
        pulseRings
        noiseSeed="scene1-finger"
        cadTag="FIG 01 · EXPLODED CAD 2.5D"
      />

      {/* Líneas guía quebradas (LeaderLineCallout estilo Ref 2 / Ref 3) */}
      <LeaderLineCallout
        anchorX={360}
        anchorY={740}
        elbowX={180}
        elbowY={1245}
        labelX={210}
        labelY={1245}
        title="relieve real 3D (ciano)"
        subtitle="crestas, poros y valles con profundidad física"
        color="#38BDF8"
        enterFrame={38}
      />

      <LeaderLineCallout
        anchorX={690}
        anchorY={965}
        elbowX={860}
        elbowY={1395}
        labelX={760}
        labelY={1395}
        title="cámara óptica 2D (coral)"
        subtitle="solo fotografía luz plana y se engaña con copias"
        color="#F43F5E"
        enterFrame={95}
        align="right"
      />

      {/* Regla de acotación CAD en la parte inferior segura */}
      <DimensionRuler
        x1={160}
        y1={1545}
        x2={920}
        y2={1545}
        label="PENETRACIÓN ÓPTICA: 0 µm (2D)"
        color="#F43F5E"
        enterFrame={115}
      />
    </div>
  );
};
