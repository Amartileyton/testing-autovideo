import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import audioManifestJson from '../public/audio/info.json';
import scenesJson from './data/scenes.json';
import type { AudioManifest, VideoProps, WordTimestamp } from './data/schema';
import { CameraRig, type CameraKeyframe } from './components/CameraRig';
import { DynamicCaptions } from './components/DynamicCaptions';
import { Scene1 } from './scenes/Scene1';
import { Scene2 } from './scenes/Scene2';
import { Scene3 } from './scenes/Scene3';
import { Scene4 } from './scenes/Scene4';
import {
  BLUEPRINT_THEMES,
  CLAMP_EXTRAPOLATION,
  SAFE_ZONE,
} from './theme/motion';

const manifest = audioManifestJson as AudioManifest;

export interface ComputedSceneWindow {
  id: string;
  index: number;
  from: number;
  durationInFrames: number;
  audioFile: string;
  wordTimestamps: AudioManifest['scenes'][number]['wordTimestamps'];
}

/**
 * Calcula las ventanas de tiempo exactas por escena a partir de public/audio/info.json,
 * aplicando el solapamiento de cross-dissolve (10 fotogramas) entre escenas consecutivas.
 */
export function computeSceneTimeline(
  audioManifest: AudioManifest
): ComputedSceneWindow[] {
  const overlap = audioManifest.crossDissolveFrames || 10;
  let cursor = 0;

  return audioManifest.scenes.map((scene, index) => {
    const from = cursor;
    const durationInFrames = scene.durationInFrames;
    cursor += Math.max(1, durationInFrames - overlap);
    return {
      id: scene.id,
      index,
      from,
      durationInFrames,
      audioFile: scene.audioFile,
      wordTimestamps: scene.wordTimestamps,
    };
  });
}

export const Video: React.FC<VideoProps> = ({
  surfaceColor = BLUEPRINT_THEMES.DARK_CAD_XRAY.surface,
  enableCaptions = true,
  enableBackgroundMusic = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeline = useMemo(() => computeSceneTimeline(manifest), []);

  /**
   * Stream unificado de palabras a nivel global (arquitectura TrendForge + @resultaaquee):
   * evita cortes o solapamientos de subtítulos durante las transiciones entre escenas.
   */
  const globalWordTimestamps: WordTimestamp[] = useMemo(() => {
    const merged: WordTimestamp[] = [];
    for (const sceneWin of timeline) {
      const offsetMs = Math.round((sceneWin.from / fps) * 1000);
      for (const w of sceneWin.wordTimestamps) {
        merged.push({
          word: w.word,
          startMs: w.startMs + offsetMs,
          endMs: w.endMs + offsetMs,
          startFrame: w.startFrame + sceneWin.from,
          endFrame: w.endFrame + sceneWin.from,
        });
      }
    }
    return merged;
  }, [timeline, fps]);

  /**
   * Keyframes de cámara continua sincronizados al fotograma de inicio de cada escena en info.json
   */
  const cameraKeyframes: CameraKeyframe[] = useMemo(() => {
    const defaultCoords = [
      { x: 0, y: 0, zoom: 1.0, rotateDeg: 0 },
      { x: 1100, y: 0, zoom: 1.03, rotateDeg: 0 },
      { x: 1100, y: 1980, zoom: 1.02, rotateDeg: 0 },
      { x: 0, y: 1980, zoom: 1.0, rotateDeg: 0 },
    ];
    return timeline.map((item, idx) => {
      const sceneMeta = scenesJson.scenes[idx];
      const fallback = defaultCoords[idx] ?? {
        x: 0,
        y: idx * 1980,
        zoom: 1,
        rotateDeg: 0,
      };
      return {
        frame: item.from,
        x: sceneMeta?.cameraTarget?.x ?? fallback.x,
        y: sceneMeta?.cameraTarget?.y ?? fallback.y,
        zoom: sceneMeta?.cameraTarget?.zoom ?? fallback.zoom,
        rotateDeg: sceneMeta?.cameraTarget?.rotateDeg ?? fallback.rotateDeg,
      };
    });
  }, [timeline]);

  /**
   * Curva de Audio Ducking automática para la pista opcional de música de fondo
   */
  const isVoiceSpeaking = useMemo(() => {
    return globalWordTimestamps.some(
      (w) => frame >= w.startFrame - 3 && frame <= w.endFrame + 4
    );
  }, [globalWordTimestamps, frame]);

  const bgmVolume = interpolate(
    isVoiceSpeaking ? 1 : 0,
    [0, 1],
    [0.32, 0.12],
    CLAMP_EXTRAPOLATION
  );

  return (
    <AbsoluteFill style={{ backgroundColor: surfaceColor }}>
      {/* Lienzo continuo @resultaaquee gobernado por CameraRig (DARK_CAD_XRAY + Rack-Focus Blur) */}
      <CameraRig
        keyframes={cameraKeyframes}
        surfaceColor={surfaceColor}
        blueprintMode="DARK_CAD_XRAY"
        rackFocusBlur={true}
      >
        {/* Conectores de ingeniería CAD entre cuadrantes del lienzo continuo */}
        <svg
          width={2400}
          height={4000}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            pointerEvents: 'none',
          }}
        >
          <path
            d="M 984 740 L 1196 740"
            stroke="rgba(255, 255, 255, 0.14)"
            strokeWidth={2}
            strokeDasharray="10 10"
            fill="none"
          />
          <path
            d="M 1640 1520 L 1640 2090"
            stroke="rgba(255, 255, 255, 0.14)"
            strokeWidth={2}
            strokeDasharray="10 10"
            fill="none"
          />
          <path
            d="M 1196 2700 L 984 2700"
            stroke="rgba(255, 255, 255, 0.14)"
            strokeWidth={2}
            strokeDasharray="10 10"
            fill="none"
          />
        </svg>

        <Scene1
          headline={scenesJson.scenes[0]?.title ?? 'EL FALLO DEL SENSOR ÓPTICO'}
          metricValue={scenesJson.scenes[0]?.metrics?.numericValue ?? 2}
          metricUnit={scenesJson.scenes[0]?.metrics?.unit ?? 'D'}
          metricLabel={
            scenesJson.scenes[0]?.metrics?.label ?? 'CAPTURA ÓPTICA PLANA'
          }
          canvasOffsetX={scenesJson.scenes[0]?.cameraTarget?.x ?? 0}
          canvasOffsetY={scenesJson.scenes[0]?.cameraTarget?.y ?? 0}
          enterFrame={timeline[0]?.from ?? 0}
        />

        <Scene2
          headline={scenesJson.scenes[1]?.title ?? 'PULSO ACÚSTICO ULTRASÓNICO'}
          metricValue={scenesJson.scenes[1]?.metrics?.numericValue ?? 20}
          metricUnit={scenesJson.scenes[1]?.metrics?.unit ?? 'MHz'}
          metricLabel={
            scenesJson.scenes[1]?.metrics?.label ?? 'FRECUENCIA ACÚSTICA'
          }
          canvasOffsetX={scenesJson.scenes[1]?.cameraTarget?.x ?? 1100}
          canvasOffsetY={scenesJson.scenes[1]?.cameraTarget?.y ?? 0}
          enterFrame={timeline[1]?.from ?? 196}
        />

        <Scene3
          headline={scenesJson.scenes[2]?.title ?? 'RELIEVE EPIDÉRMICO EN 3D'}
          metricValue={scenesJson.scenes[2]?.metrics?.numericValue ?? 400}
          metricUnit={scenesJson.scenes[2]?.metrics?.unit ?? 'µm'}
          metricLabel={
            scenesJson.scenes[2]?.metrics?.label ?? 'PENETRACIÓN EPIDÉRMICA'
          }
          canvasOffsetX={scenesJson.scenes[2]?.cameraTarget?.x ?? 1100}
          canvasOffsetY={scenesJson.scenes[2]?.cameraTarget?.y ?? 1980}
          enterFrame={timeline[2]?.from ?? 423}
        />

        <Scene4
          headline={scenesJson.scenes[3]?.title ?? 'DESBLOQUEO EN MILISEGUNDOS'}
          metricValue={scenesJson.scenes[3]?.metrics?.numericValue ?? 25}
          metricUnit={scenesJson.scenes[3]?.metrics?.unit ?? 'ms'}
          metricLabel={
            scenesJson.scenes[3]?.metrics?.label ?? 'TIEMPO DE RESPUESTA'
          }
          canvasOffsetX={scenesJson.scenes[3]?.cameraTarget?.x ?? 0}
          canvasOffsetY={scenesJson.scenes[3]?.cameraTarget?.y ?? 1980}
          enterFrame={timeline[3]?.from ?? 628}
        />
      </CameraRig>

      {/* Secuencias de audio sincronizadas al fotograma desde public/audio/info.json */}
      {timeline.map((sceneWin) => (
        <Sequence
          key={sceneWin.id}
          from={sceneWin.from}
          durationInFrames={sceneWin.durationInFrames}
          name={`Scene-${sceneWin.id}`}
        >
          {sceneWin.audioFile ? (
            <Audio src={staticFile(sceneWin.audioFile)} />
          ) : null}
        </Sequence>
      ))}

      {/* Subtítulos @resultaaquee (Ref 2 & Ref 3): Tercio superior + Caja de Selección Vectorial Azul */}
      {enableCaptions ? (
        <DynamicCaptions
          wordTimestamps={globalWordTimestamps}
          sceneStartFrame={0}
          wordsPerWindow={5}
          variant="vector-box"
          placement="upper"
        />
      ) : null}

      {/* Pista opcional de música de fondo con curva de audio ducking automática */}
      {enableBackgroundMusic && manifest.backgroundMusicFile ? (
        <Audio
          src={staticFile(manifest.backgroundMusicFile)}
          volume={bgmVolume}
        />
      ) : null}

      {/* Línea guía sutil de Zona Segura Vertical (288px inferiores reservados para UI 9:16) */}
      <div
        style={{
          position: 'absolute',
          left: SAFE_ZONE.horizontalPaddingPx,
          right: SAFE_ZONE.horizontalPaddingPx,
          top: SAFE_ZONE.maxSafeY,
          borderTop: '1.5px dashed rgba(255, 255, 255, 0.10)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
