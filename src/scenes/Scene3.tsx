import React from 'react';
import {
  interpolate,
  useCurrentFrame,
} from 'remotion';
import {
  CornerHudTelemetry,
  DimensionRuler,
  HeroPropStage,
  LiveTelemetryGraph,
  TargetReticle,
} from '../components/blueprints/ResultaaqueeBlueprints';
import { CLAMP_EXTRAPOLATION } from '../theme/motion';

export interface Scene3Props {
  headline?: string;
  metricValue?: number;
  metricUnit?: string;
  metricLabel?: string;
  canvasOffsetX?: number;
  canvasOffsetY?: number;
  enterFrame?: number;
}

/**
 * Scene 3 — Relieve Epidérmico en 3D (Art-First + Estilo @resultaaquee Ref 5 Cronofotografía + Osciloscopio)
 * - Mitad superior: HeroPropStage macro de las crestas, poros y valles de la epidermis sobre el cristal
 *   con dianas rojas (TargetReticle) en Cresta, Poro y Valle.
 * - Raíl calibrado divisorio blanco y negro.
 * - Mitad inferior: Gráfica posición-tiempo en vivo (LiveTelemetryGraph) conectada mediante
 *   línea punteada vertical roja desde el valle epidérmico hasta el escalón de la gráfica.
 */
export const Scene3: React.FC<Scene3Props> = ({
  metricValue = 400,
  canvasOffsetX = 1100,
  canvasOffsetY = 1980,
  enterFrame = 423,
}) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - enterFrame);

  const depthCounter = Math.round(
    interpolate(localFrame, [15, 130], [0, metricValue], CLAMP_EXTRAPOLATION)
  );

  // Progreso del escaneo horizontal y de la gráfica inferior (0 -> 1)
  const scanProgress = interpolate(
    localFrame,
    [10, 175],
    [0.05, 1],
    CLAMP_EXTRAPOLATION
  );

  // Coordenada X del escáner sincronizada con la gráfica inferior
  const trackerX = interpolate(
    scanProgress,
    [0.05, 1],
    [220, 860],
    CLAMP_EXTRAPOLATION
  );

  // Escalones de altura según si el escáner pasa por Cresta (x < 430), Poro (430..650) o Valle (> 650)
  const trackerTopY =
    trackerX < 430 ? 730 : trackerX < 650 ? 635 : 545;
  const trackerBottomY =
    trackerX < 430 ? 1390 : trackerX < 650 ? 1255 : 1125;

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
        leftLabel="PENETRACIÓN EPIDÉRMICA"
        leftValue={`${depthCounter} µm`}
        rightLabel="RESOLUCIÓN TOPOGRÁFICA"
        rightValue="CRESTA · PORO · VALLE"
        accentColor="#EF4444"
        textColor="#FACC15"
      />

      {/* Encabezado editorial en cursiva serif (Estilo Ref 5: "una placa, muchas exposiciones") */}
      <div
        style={{
          position: 'absolute',
          left: 96,
          top: 345,
          pointerEvents: 'none',
          zIndex: 60,
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 36,
            fontWeight: 700,
            color: '#F5F5F4',
          }}
        >
          epidermis, en corte acústico
        </div>
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontStyle: 'italic',
            fontSize: 26,
            color: '#A8A29E',
          }}
        >
          un pulso, tres tiempos de eco distintos
        </div>
      </div>

      {/* Hero Prop 3D CAD: Corte Macro de Crestas, Poros y Valles Epidérmicos */}
      <HeroPropStage
        src="assets/props/hero-scene3-epidermis-macro.png"
        x={520}
        y={675}
        size={490}
        enterFrame={6}
        localFrame={localFrame}
        accentColor="#38BDF8"
        secondaryColor="#F59E0B"
        scanBeam
        pulseRings={false}
        noiseSeed="scene3-epidermis"
      />

      {/* Escenario dividido: Dianas estroboscópicas + Raíl calibrado divisorio */}
      <svg
        width={1080}
        height={1920}
        style={{ position: 'absolute', inset: 0, overflow: 'visible', zIndex: 45 }}
      >
        {/* Dianas estroboscópicas (TargetReticle estilo Ref 5) clavadas en Cresta, Poro y Valle */}
        <TargetReticle
          x={310}
          y={730}
          opacity={0.75}
          color="#EF4444"
          label="CRESTA (0 µm)"
        />
        <TargetReticle
          x={535}
          y={635}
          opacity={localFrame >= 55 ? 0.85 : 0.35}
          color="#EF4444"
          label="PORO (220 µm)"
        />
        <TargetReticle
          x={745}
          y={545}
          opacity={localFrame >= 100 ? 1 : 0.35}
          color="#EF4444"
          label="VALLE (400 µm)"
        />

        {/* Diana móvil activa siguiendo el frente de eco */}
        <TargetReticle x={trackerX} y={trackerTopY} opacity={1} color="#EF4444" />

        {/* Raíl calibrado divisorio blanco y negro (Idéntico a Ref 5 Palomas) */}
        <g transform="translate(0, 925)">
          <rect x={96} y={0} width={888} height={24} fill="#E7E5E4" rx={4} />
          {Array.from({ length: 12 }, (_, idx) => (
            <rect
              key={idx}
              x={112 + idx * 72}
              y={5}
              width={36}
              height={14}
              fill="#1C1917"
            />
          ))}
        </g>
      </svg>

      {/* Regla de acotación vertical de los 400 micrómetros */}
      <DimensionRuler
        x1={920}
        y1={510}
        x2={920}
        y2={770}
        label="400 µm"
        color="#F59E0B"
        enterFrame={75}
      />

      {/* Gráfica de Telemetría en Tiempo Real (Mitad inferior conectada por línea punteada vertical) */}
      <LiveTelemetryGraph
        progress={scanProgress}
        continuousPathD="M 220 1420 L 860 1090"
        steppedPathD="M 220 1390 L 430 1390 L 430 1255 L 650 1255 L 650 1125 L 860 1125"
        trackerX={trackerX}
        trackerTopY={trackerTopY}
        trackerBottomY={trackerBottomY}
        primaryLabel="ECO ULTRASÓNICO 3D (ESCALONES Z)"
        secondaryLabel="SENSOR ÓPTICO 2D (PLANO)"
      />
    </div>
  );
};
