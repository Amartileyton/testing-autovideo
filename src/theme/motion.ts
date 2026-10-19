/**
 * src/theme/motion.ts
 * Sistema de Movimiento Cerrado, Físicas Spring, Paleta Editorial (Zero-Neon)
 * y Constantes de Zona Segura Vertical (9:16).
 *
 * REGLAS INQUEBRANTABLES:
 * 1. Prohibido CSS transition o @keyframes. Todo movimiento usa useCurrentFrame().
 * 2. Todo interpolate() debe incluir CLAMP_EXTRAPOLATION.
 * 3. Únicamente se permiten dos físicas spring(): SPRING_SNAPPY y SPRING_CAMERA.
 * 4. Política Zero-Neon: Cero resplandores, cero gradientes cian-púrpura, cero cyberpunk.
 * 5. Zona Segura Vertical (9:16): Todo texto y vector clave en el 85% superior (288px inferiores reservados).
 */

import type { SpringConfig } from 'remotion';

/**
 * Física Spring #1: Entradas de UI, iconos lucide-react, tarjetas y trazos roughjs.
 */
export const SPRING_SNAPPY: SpringConfig = {
  damping: 20,
  stiffness: 200,
  mass: 0.8,
  overshootClamping: false,
} as const;

/**
 * Física Spring #2: Movimientos panorámicos y zooms del CameraRig sobre lienzo continuo.
 */
export const SPRING_CAMERA: SpringConfig = {
  damping: 30,
  stiffness: 90,
  mass: 1.2,
  overshootClamping: false,
} as const;

/**
 * Configuración obligatoria para todas las llamadas a interpolate().
 */
export const CLAMP_EXTRAPOLATION = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

/**
 * Dimensiones y Zona Segura Vertical (9:16 — Reels / TikTok / Shorts)
 */
export const VIDEO_CONFIG = {
  fps: 30,
  width: 1080,
  height: 1920,
  crossDissolveFrames: 10,
} as const;

export const SAFE_ZONE = {
  /** 85% superior del lienzo disponible para titulares, subtítulos y vectores clave */
  maxSafeY: 1632, // 1920 - 288
  /** 288px inferiores reservados estrictamente para la UI de Reels/TikTok/Shorts */
  bottomReservedPx: 288,
  /** Padding lateral mínimo obligatorio a cada lado */
  horizontalPaddingPx: 96,
  /** Coordenada X mínima y máxima segura */
  minSafeX: 96,
  maxSafeX: 984, // 1080 - 96
  /** Reglas tipográficas mínimas */
  minHeadlinePx: 64,
  maxHeadlineWords: 7,
  minLabelPx: 28,
  maxLabelWords: 20,
} as const;

/**
 * Paleta Editorial Cálida — Política Estricta ZERO-NEON
 * Prohibido box-shadow resplandeciente, text-shadow neón o gradientes cian-púrpura.
 */
export const PALETTE = {
  /** Superficie cálida principal tipo papel técnico */
  surface: '#F8F7F4',
  /** Superficie de tarjeta editorial elevada */
  surfaceElevated: '#FFFFFF',
  /** Superficie secundaria sutil */
  surfaceMuted: '#EFECE6',
  /** Cuadrícula técnica sutil */
  gridLine: '#E5E2DC',
  /** Tinta principal de alto contraste */
  ink: '#141413',
  /** Tinta secundaria para etiquetas y metadatos */
  inkMuted: '#575550',
  /** Acento primario cálido (Terracota / Bermellón técnico) */
  accentPrimary: '#D94E34',
  /** Acento secundario técnico (Azul Cobalto mate) */
  accentSecondary: '#1D4ED8',
  /** Acento de verificación / métrica positiva (Verde bosque mate) */
  accentSuccess: '#15803D',
  /** Acento de advertencia / contraste (Ámbar ocre mate) */
  accentWarning: '#B45309',
  /** Borde técnico para trazos y contenedores */
  border: '#262523',
} as const;
