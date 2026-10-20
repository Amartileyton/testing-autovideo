import { z } from 'zod';

/**
 * Presets de personalidad vocal de ElevenLabs mapeados a voice_settings
 */
export const CharacterPresetSchema = z.enum([
  'narrator',
  'expert',
  'dramatic',
  'conversational',
  'calm',
]);

export type CharacterPreset = z.infer<typeof CharacterPresetSchema>;

/**
 * Marca de tiempo palabra por palabra calculada a partir del alignment de ElevenLabs
 */
export const WordTimestampSchema = z.object({
  word: z.string(),
  startMs: z.number(),
  endMs: z.number(),
  startFrame: z.number(),
  endFrame: z.number(),
});

export type WordTimestamp = z.infer<typeof WordTimestampSchema>;

/**
 * Definición de escena en src/data/scenes.json
 */
export const SceneInputSchema = z.object({
  id: z.string(),
  title: z.string(),
  text: z.string(),
  characterPreset: CharacterPresetSchema,
  visualCue: z.string(),
  cameraTarget: z
    .object({
      x: z.number(),
      y: z.number(),
      zoom: z.number().min(0.4).max(3.0),
      rotateDeg: z.number().optional(),
    })
    .optional(),
  metrics: z
    .object({
      label: z.string(),
      numericValue: z.number(),
      unit: z.string(),
    })
    .optional(),
});

export type SceneInput = z.infer<typeof SceneInputSchema>;

export const ScenesFileSchema = z.object({
  projectTitle: z.string(),
  fps: z.number().default(30),
  width: z.number().default(1080),
  height: z.number().default(1920),
  crossDissolveFrames: z.number().default(10),
  scenes: z.array(SceneInputSchema),
});

export type ScenesFile = z.infer<typeof ScenesFileSchema>;

/**
 * Metadatos de sincronización generados por scripts/elevenlabs-sync.mjs en public/audio/info.json
 */
export const SceneAudioInfoSchema = z.object({
  id: z.string(),
  audioFile: z.string(),
  characterPreset: CharacterPresetSchema,
  actualDuration: z.number(),
  durationInFrames: z.number(),
  wordsPerSecond: z.number(),
  leadingSilenceMs: z.number(),
  trailingSilenceMs: z.number(),
  trimOffsetMs: z.number().default(0),
  warnings: z.array(z.string()).default([]),
  wordTimestamps: z.array(WordTimestampSchema),
});

export type SceneAudioInfo = z.infer<typeof SceneAudioInfoSchema>;

export const AudioManifestSchema = z.object({
  generatedAt: z.string(),
  fps: z.number(),
  crossDissolveFrames: z.number(),
  totalDurationInFrames: z.number(),
  totalDurationSeconds: z.number(),
  backgroundMusicFile: z.string().nullable().default(null),
  scenes: z.array(SceneAudioInfoSchema),
});

export type AudioManifest = z.infer<typeof AudioManifestSchema>;

/**
 * Props parametrizables del componente principal <Video />
 */
export const VideoPropsSchema = z.object({
  title: z.string().default('Diagnóstico Estudio Vectorial Antigravity'),
  surfaceColor: z.string().default('#111111'),
  enableCaptions: z.boolean().default(true),
  enableBackgroundMusic: z.boolean().default(false),
});

export type VideoProps = z.infer<typeof VideoPropsSchema>;
