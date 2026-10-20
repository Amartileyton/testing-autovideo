import React from 'react';
import {
  interpolate,
  useCurrentFrame,
} from 'remotion';
import {
  CornerHudTelemetry,
  DatasetTerminalDrawer,
  HeroPropStage,
  LeaderLineCallout,
  VectorSelectionBox,
} from '../components/blueprints/ResultaaqueeBlueprints';
import {
  CLAMP_EXTRAPOLATION,
  SAFE_ZONE,
} from '../theme/motion';

export interface Scene4Props {
  headline?: string;
  metricValue?: number;
  metricUnit?: string;
  metricLabel?: string;
  canvasOffsetX?: number;
  canvasOffsetY?: number;
  enterFrame?: number;
}

/**
 * Scene 4 — Desbloqueo en Milisegundos (Art-First + Estilo @resultaaquee Ref 2 Dataset Drawer + Malla 3D)
 * - HeroPropStage 3D CAD: Chip Secure Enclave proyectando un mapa topográfico holográfico 3D
 *   en verde esmeralda (#22C55E) y cian (#38BDF8).
 * - Cajón de telemetría monoespaciado en vivo (DatasetTerminalDrawer estilo es_50k.txt de Ref 2).
 * - Marco de selección vectorial azul sobre el hash 3D validado en 25 ms.
 */
export const Scene4: React.FC<Scene4Props> = ({
  metricValue = 25,
  canvasOffsetX = 0,
  canvasOffsetY = 1980,
  enterFrame = 628,
}) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - enterFrame);

  const msCounter = Math.round(
    interpolate(localFrame, [20, 140], [180, metricValue], CLAMP_EXTRAPOLATION)
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
        leftLabel="TIEMPO DE RESPUESTA"
        leftValue={`${msCounter} ms`}
        rightLabel="SECURE ENCLAVE 3D"
        rightValue="VERIFICADO"
        accentColor="#22C55E"
        textColor="#38BDF8"
      />

      {/* Hero Prop 3D CAD: Procesador Secure Enclave proyectando Relieve Biométrico 3D */}
      <HeroPropStage
        src="assets/props/hero-scene4-biometric-chip.png"
        x={540}
        y={615}
        size={560}
        enterFrame={8}
        localFrame={localFrame}
        accentColor="#22C55E"
        secondaryColor="#38BDF8"
        scanBeam
        pulseRings
        noiseSeed="scene4-chip"
        cadTag="FIG 04 · SECURE ENCLAVE 3D"
      />

      {/* Marco de Selección Vectorial sobre el mapa biométrico */}
      <div
        style={{
          position: 'absolute',
          left: 365,
          top: 905,
          zIndex: 55,
        }}
      >
        <VectorSelectionBox color="#3B82F6" active={localFrame >= 40}>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 27,
              fontWeight: 700,
              color: '#4ADE80',
            }}
          >
            MAPA 3D VALIDADO · 25 ms
          </span>
        </VectorSelectionBox>
      </div>

      {/* Línea guía hacia el núcleo biométrico */}
      <LeaderLineCallout
        anchorX={360}
        anchorY={640}
        elbowX={180}
        elbowY={1010}
        labelX={210}
        labelY={1010}
        title="hash topográfico 3D"
        subtitle="compara crestas, poros y valles en 25 milisegundos"
        color="#22C55E"
        enterFrame={48}
      />

      {/* Cajón Monoespaciado de Telemetría en Vivo (Estilo es_50k.txt de Ref 2) */}
      <div
        style={{
          position: 'absolute',
          left: SAFE_ZONE.minSafeX + 34,
          top: 1125,
          zIndex: 55,
        }}
      >
        <DatasetTerminalDrawer
          filename="biometric_3d_bench.log"
          subtitle="comparativa de latencia y seguridad"
          enterFrame={65}
          rows={[
            {
              token: 'ultrasónico_3d (20 MHz)',
              countLabel: '25 ms · RELIEVE 400 µm',
              probabilityPct: 99,
              highlight: true,
            },
            {
              token: 'óptico_antiguo (luz 2D)',
              countLabel: '180 ms · SUPERFICIE PLANA',
              probabilityPct: 14,
            },
            {
              token: 'foto_impresa_2d (spoof)',
              countLabel: 'BLOQUEADO · 0 µm EJE Z',
              probabilityPct: 0,
              rejected: true,
            },
          ]}
        />
      </div>
    </div>
  );
};
