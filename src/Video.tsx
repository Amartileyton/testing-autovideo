import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import audioManifestJson from '../public/audio/info.json';
import scenesJson from './data/scenes.json';
import type { AudioManifest, VideoProps } from './data/schema';
import { CameraRig, type CameraKeyframe } from './components/CameraRig';
import { DynamicCaptions } from './components/DynamicCaptions';
import { Scene1 } from './scenes/Scene1';
import { Scene2 } from './scenes/Scene2';
import { Scene3 } from './scenes/Scene3';
import { Scene4 } from './scenes/Scene4';
import { CLAMP_EXTRAPOLATION, PALETTE, SAFE_ZONE } from './theme/motion';

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
  surfaceColor = PALETTE.surface,
  enableCaptions = true,
  enableBackgroundMusic = false,
}) => {
  const frame = useCurrentFrame();
  const timeline = useMemo(() => computeSceneTimeline(manifest), []);

  /**
   * Keyframes de cámara continua sincronizados al fotograma de inicio de cada escena en info.json
   */
  const cameraKeyframes: CameraKeyframe[] = useMemo(() => {
    const defaultCoords = [
      { x: 0, y: 0, zoom: 1.0, rotateDeg: 0 },
      { x: 1100, y: 0, zoom: 1.04, rotateDeg: 0 },
      { x: 1100, y: 1980, zoom: 1.02, rotateDeg: 0 },
      { x: 0, y: 1980, zoom: 1.0, rotateDeg: 0 },
    ];
    return timeline.map((item, idx) => {
      const sceneMeta = scenesJson.scenes[idx];
      const fallback = defaultCoords[idx] ?? { x: 0, y: idx * 1980, zoom: 1, rotateDeg: 0 };
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
    return timeline.some((sceneWin) => {
      const localFrame = frame - sceneWin.from;
      if (localFrame < 0 || localFrame > sceneWin.durationInFrames) {
        return false;
      }
      return sceneWin.wordTimestamps.some(
        (w) => localFrame >= w.startFrame - 3 && localFrame <= w.endFrame + 4
      );
    });
  }, [timeline, frame]);

  const bgmVolume = interpolate(
    isVoiceSpeaking ? 1 : 0,
    [0, 1],
    [0.32, 0.12],
    CLAMP_EXTRAPOLATION
  );

  return (
    <AbsoluteFill style={{ backgroundColor: surfaceColor }}>
      {/* Lienzo continuo gobernado por CameraRig (SPRING_CAMERA) */}
      <CameraRig keyframes={cameraKeyframes} surfaceColor={surfaceColor}>
        {/* Conectores vectoriales entre cuadrantes del lienzo continuo */}
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
            d="M 984 520 L 1196 520"
            stroke={PALETTE.border}
            strokeWidth={3}
            strokeDasharray="10 10"
            fill="none"
          />
          <path
            d="M 1640 1320 L 1640 2090"
            stroke={PALETTE.border}
            strokeWidth={3}
            strokeDasharray="10 10"
            fill="none"
          />
          <path
            d="M 1196 2500 L 984 2500"
            stroke={PALETTE.border}
            strokeWidth={3}
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
          enterFrame={timeline[1]?.from ?? 189}
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
          enterFrame={timeline[2]?.from ?? 389}
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
          enterFrame={timeline[3]?.from ?? 571}
        />
      </CameraRig>

      {/* Secuencias sincronizadas al fotograma desde public/audio/info.json */}
      {timeline.map((sceneWin) => {
        const sceneOpacity = interpolate(
          frame - sceneWin.from,
          [
            0,
            manifest.crossDissolveFrames,
            sceneWin.durationInFrames - manifest.crossDissolveFrames,
            sceneWin.durationInFrames,
          ],
          [0, 1, 1, 0],
          CLAMP_EXTRAPOLATION
        );

        return (
          <Sequence
            key={sceneWin.id}
            from={sceneWin.from}
            durationInFrames={sceneWin.durationInFrames}
            name={`Scene-${sceneWin.id}`}
          >
            {sceneWin.audioFile ? (
              <Audio src={staticFile(sceneWin.audioFile)} />
            ) : null}

            {enableCaptions ? (
              <div style={{ opacity: sceneOpacity }}>
                <DynamicCaptions
                  wordTimestamps={sceneWin.wordTimestamps}
                  sceneStartFrame={0}
                />
              </div>
            ) : null}
          </Sequence>
        );
      })}

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
          borderTop: `2px dashed ${PALETTE.gridLine}`,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
