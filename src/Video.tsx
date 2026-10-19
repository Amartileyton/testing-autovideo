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
 * aplicando el solapamiento de cross-dissolve (8-12 fotogramas) entre escenas consecutivas.
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
    return timeline.map((item, idx) => {
      const sceneMeta = scenesJson.scenes[idx];
      return {
        frame: item.from,
        x: sceneMeta?.cameraTarget?.x ?? 0,
        y: sceneMeta?.cameraTarget?.y ?? idx * 980,
        zoom: sceneMeta?.cameraTarget?.zoom ?? 1,
        rotateDeg: sceneMeta?.cameraTarget?.rotateDeg ?? 0,
      };
    });
  }, [timeline]);

  /**
   * Curva de Audio Ducking automática para la pista opcional de música de fondo:
   * atenúa el volumen a 0.12 cuando hay palabras activas en la locución, y sube a 0.32 en pausas.
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
        <Scene1
          headline={scenesJson.scenes[0]?.title ?? 'ARQUITECTURA VECTORIAL'}
          metricValue={scenesJson.scenes[0]?.metrics?.numericValue ?? 30}
          metricUnit={scenesJson.scenes[0]?.metrics?.unit ?? 'FPS'}
          metricLabel={
            scenesJson.scenes[0]?.metrics?.label ?? 'FRECUENCIA DE MUESTREO'
          }
        />
        <Scene2
          headline={scenesJson.scenes[1]?.title ?? 'FÍSICA CONTINUA'}
          canvasOffsetY={scenesJson.scenes[1]?.cameraTarget?.y ?? 980}
          enterFrame={timeline[1]?.from ?? 120}
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
