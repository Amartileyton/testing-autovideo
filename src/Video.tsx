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
import scenesJsonRaw from './data/scenes.json';
import type {
  AudioManifest,
  BookMetadata,
  BookVisualData,
  ScenesFile,
  VideoProps,
  WordTimestamp,
} from './data/schema';
import { CameraRig, type CameraKeyframe } from './components/CameraRig';
import { DynamicCaptions } from './components/DynamicCaptions';
import { OneMinuteStopwatch } from './components/OneMinuteStopwatch';
import { Scene1 } from './scenes/Scene1';
import { Scene2 } from './scenes/Scene2';
import { Scene3 } from './scenes/Scene3';
import { Scene4 } from './scenes/Scene4';
import { Scene5 } from './scenes/Scene5';
import {
  BLUEPRINT_THEMES,
  BRAND_CONFIG,
  type BlueprintModeId,
  CLAMP_EXTRAPOLATION,
} from './theme/motion';

const manifest = audioManifestJson as AudioManifest;
const scenesJson = scenesJsonRaw as unknown as ScenesFile;

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
  surfaceColor = BLUEPRINT_THEMES.EDITORIAL_PAPER.surface,
  enableCaptions = true,
  enableBackgroundMusic = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: totalDurationFrames } = useVideoConfig();
  const timeline = useMemo(() => computeSceneTimeline(manifest), []);
  const bookMetadata = scenesJson.bookMetadata as BookMetadata | undefined;

  /**
   * Stream unificado de palabras a nivel global (arquitectura Leo + @en1minuto.es):
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
      { x: 1120, y: 0, zoom: 1.0, rotateDeg: 0 },
      { x: 1120, y: 1980, zoom: 1.0, rotateDeg: 0 },
      { x: 0, y: 1980, zoom: 1.0, rotateDeg: 0 },
      { x: 560, y: 3960, zoom: 1.0, rotateDeg: 0 },
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
   * Modo de superficie editorial constante en todo el vídeo (cuadrícula marcada sobre papel cálido)
   */
  const activeBlueprintMode: BlueprintModeId = 'EDITORIAL_PAPER';

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
      {/* Lienzo continuo de 5 escenas gobernado por CameraRig + Rack-Focus Blur */}
      <CameraRig
        keyframes={cameraKeyframes}
        surfaceColor={surfaceColor}
        blueprintMode={activeBlueprintMode}
        rackFocusBlur={true}
      >
        <Scene1
          headline={scenesJson.scenes[0]?.title}
          metricValue={scenesJson.scenes[0]?.metrics?.numericValue}
          metricUnit={scenesJson.scenes[0]?.metrics?.unit}
          metricLabel={scenesJson.scenes[0]?.metrics?.label}
          canvasOffsetX={scenesJson.scenes[0]?.cameraTarget?.x ?? 0}
          canvasOffsetY={scenesJson.scenes[0]?.cameraTarget?.y ?? 0}
          enterFrame={timeline[0]?.from ?? 0}
          bookMetadata={bookMetadata}
          visualData={
            scenesJson.scenes[0]?.bookVisualData as BookVisualData | undefined
          }
        />

        <Scene2
          headline={scenesJson.scenes[1]?.title}
          metricValue={scenesJson.scenes[1]?.metrics?.numericValue}
          metricUnit={scenesJson.scenes[1]?.metrics?.unit}
          metricLabel={scenesJson.scenes[1]?.metrics?.label}
          canvasOffsetX={scenesJson.scenes[1]?.cameraTarget?.x ?? 1120}
          canvasOffsetY={scenesJson.scenes[1]?.cameraTarget?.y ?? 0}
          enterFrame={timeline[1]?.from ?? 340}
          bookMetadata={bookMetadata}
          visualData={
            scenesJson.scenes[1]?.bookVisualData as BookVisualData | undefined
          }
        />

        <Scene3
          headline={scenesJson.scenes[2]?.title}
          metricValue={scenesJson.scenes[2]?.metrics?.numericValue}
          metricUnit={scenesJson.scenes[2]?.metrics?.unit}
          metricLabel={scenesJson.scenes[2]?.metrics?.label}
          canvasOffsetX={scenesJson.scenes[2]?.cameraTarget?.x ?? 1120}
          canvasOffsetY={scenesJson.scenes[2]?.cameraTarget?.y ?? 1980}
          enterFrame={timeline[2]?.from ?? 700}
          bookMetadata={bookMetadata}
          visualData={
            scenesJson.scenes[2]?.bookVisualData as BookVisualData | undefined
          }
        />

        <Scene4
          headline={scenesJson.scenes[3]?.title}
          metricValue={scenesJson.scenes[3]?.metrics?.numericValue}
          metricUnit={scenesJson.scenes[3]?.metrics?.unit}
          metricLabel={scenesJson.scenes[3]?.metrics?.label}
          canvasOffsetX={scenesJson.scenes[3]?.cameraTarget?.x ?? 0}
          canvasOffsetY={scenesJson.scenes[3]?.cameraTarget?.y ?? 1980}
          enterFrame={timeline[3]?.from ?? 1080}
          bookMetadata={bookMetadata}
          visualData={
            scenesJson.scenes[3]?.bookVisualData as BookVisualData | undefined
          }
        />

        <Scene5
          headline={scenesJson.scenes[4]?.title}
          metricValue={scenesJson.scenes[4]?.metrics?.numericValue}
          metricUnit={scenesJson.scenes[4]?.metrics?.unit}
          metricLabel={scenesJson.scenes[4]?.metrics?.label}
          canvasOffsetX={scenesJson.scenes[4]?.cameraTarget?.x ?? 560}
          canvasOffsetY={scenesJson.scenes[4]?.cameraTarget?.y ?? 3960}
          enterFrame={timeline[4]?.from ?? 1480}
          bookMetadata={bookMetadata}
          visualData={
            scenesJson.scenes[4]?.bookVisualData as BookVisualData | undefined
          }
        />
      </CameraRig>

      {/* Secuencias de audio sincronizadas al fotograma desde public/audio/info.json (SIN pitido de alarma inicial) */}
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

      {/* Barra de progreso de lectura (Top 60s Bar) en Terracota */}
      {BRAND_CONFIG.showProgressBar && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${Math.min(100, Math.max(0, (frame / (totalDurationFrames || 1765)) * 100))}%`,
            height: 8,
            backgroundColor: BRAND_CONFIG.progressBarColor,
            zIndex: 100,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Temporizador Inferior Limpio (SOLO el Reloj Cronómetro durante las escenas 1-4; en la escena 5 se convierte en la píldora dinámica con @en1minuto.es) */}
      {(() => {
        const ctaCardFrame = (timeline[4]?.from ?? 1400) + 155;
        const bottomClockOpacity = interpolate(
          frame,
          [ctaCardFrame - 18, ctaCardFrame],
          [1, 0],
          CLAMP_EXTRAPOLATION
        );

        return (
          <div
            style={{
              position: 'absolute',
              bottom: 36,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 95,
              pointerEvents: 'none',
              opacity: bottomClockOpacity,
              transform: `scale(${interpolate(bottomClockOpacity, [0, 1], [0.75, 1], CLAMP_EXTRAPOLATION)})`,
            }}
          >
            <OneMinuteStopwatch
              size={86}
              currentFrame={frame}
              totalDurationInFrames={totalDurationFrames}
              mode="header"
            />
          </div>
        );
      })()}

      {/* Subtítulos sin fondo en el tercio inferior (Nunito 52px 800) */}
      {enableCaptions ? (
        <DynamicCaptions
          wordTimestamps={globalWordTimestamps}
          sceneStartFrame={0}
          wordsPerWindow={5}
          variant="editorial-clean"
          placement="lower"
        />
      ) : null}

      {/* Pista opcional de música de fondo con curva de audio ducking automática */}
      {enableBackgroundMusic && manifest.backgroundMusicFile ? (
        <Audio
          src={staticFile(manifest.backgroundMusicFile)}
          volume={bgmVolume}
        />
      ) : null}
    </AbsoluteFill>
  );
};
