import React from 'react';
import {
  interpolate,
  useCurrentFrame,
} from 'remotion';
import {
  CornerHudTelemetry,
  DimensionRuler,
  HeroPropStage,
  LeaderLineCallout,
  VectorSelectionBox,
} from '../components/blueprints/ResultaaqueeBlueprints';
import { CLAMP_EXTRAPOLATION } from '../theme/motion';

export interface Scene2Props {
  headline?: string;
  metricValue?: number;
  metricUnit?: string;
  metricLabel?: string;
  canvasOffsetX?: number;
  canvasOffsetY?: number;
  enterFrame?: number;
}

/**
 * Scene 2 — Pulso Acústico Ultrasónico (Art-First + Estilo @resultaaquee Ref 3 Corte Rayos X CAD)
 * - HeroPropStage 3D CAD: Corte isométrico Rayos X del módulo transductor piezoeléctrico PMUT
 *   emitiendo ondas acústicas concéntricas a 20 MHz a través del OLED apagado y el cristal cian.
 * - Cotas ámbar (DimensionRuler), VectorSelectionBox y líneas guía quebradas (LeaderLineCallout).
 */
export const Scene2: React.FC<Scene2Props> = ({
  metricValue = 20,
  canvasOffsetX = 1100,
  canvasOffsetY = 0,
  enterFrame = 196,
}) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - enterFrame);

  const animatedFreq = Math.round(
    interpolate(localFrame, [15, 110], [0, metricValue], CLAMP_EXTRAPOLATION)
  );

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
      {/* Telemetría de esquina superior */}
      <CornerHudTelemetry
        leftLabel="FRECUENCIA ACÚSTICA"
        leftValue={`${animatedFreq} MHz`}
        rightLabel="EMISIÓN DE LUZ OLED"
        rightValue="0 LÚMENES"
        accentColor="#F59E0B"
        textColor="#38BDF8"
      />

      {/* Hero Prop 3D CAD: Corte Rayos X del Transductor Piezoeléctrico PMUT */}
      <HeroPropStage
        src="assets/props/hero-scene2-pmut-cutaway.png"
        x={540}
        y={705}
        size={690}
        enterFrame={8}
        localFrame={localFrame}
        accentColor="#F59E0B"
        secondaryColor="#38BDF8"
        scanBeam
        pulseRings
        noiseSeed="scene2-pmut"
        cadTag="FIG 02 · PMUT X-RAY CUTAWAY"
      />

      {/* Marco de selección vectorial azul sobre el módulo transductor */}
      <div
        style={{
          position: 'absolute',
          left: 365,
          top: 1065,
          zIndex: 55,
        }}
      >
        <VectorSelectionBox color="#3B82F6" active={localFrame > 35}>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 28,
              fontWeight: 700,
              color: '#FFFFFF',
            }}
          >
            PULSO MECÁNICO · 1.540 m/s
          </span>
        </VectorSelectionBox>
      </div>

      {/* Líneas guía quebradas (LeaderLineCallout) */}
      <LeaderLineCallout
        anchorX={360}
        anchorY={855}
        elbowX={180}
        elbowY={1220}
        labelX={210}
        labelY={1220}
        title="transductor ultrasónico"
        subtitle="Qualcomm 3D Sonic — vibra a 20 millones de Hz"
        color="#F59E0B"
        enterFrame={35}
      />

      <LeaderLineCallout
        anchorX={730}
        anchorY={580}
        elbowX={860}
        elbowY={1360}
        labelX={760}
        labelY={1360}
        title="atraviesa el cristal sin luz"
        subtitle="la onda mecánica cruza el OLED totalmente apagado"
        color="#38BDF8"
        enterFrame={90}
        align="right"
      />

      {/* Regla de acotación del espesor atravesado */}
      <DimensionRuler
        x1={160}
        y1={1520}
        x2={920}
        y2={1520}
        label="FRECUENCIA: 20.000.000 Hz"
        color="#38BDF8"
        enterFrame={70}
      />
    </div>
  );
};
