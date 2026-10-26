import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { BlueprintSurface } from './components/blueprints/ResultaaqueeBlueprints';
import { OneMinuteStopwatch } from './components/OneMinuteStopwatch';
import {
  ArchetypeRenderer,
  VISUAL_ARCHETYPE_CATALOG,
} from './components/kinetic/ArchetypeRenderer';
import { KineticCard } from './components/kinetic/KineticCard';
import {
  BRAND_CONFIG,
  CLAMP_EXTRAPOLATION,
  SPRING_SNAPPY,
  VIDEO_CONFIG,
} from './theme/motion';

const FRAMES_PER_ARCHETYPE = 75; // 2.5s por arquetipo a 30fps
const OVERLAP_FRAMES = 12; // Cross-dissolve suave de 12 fotogramas

/**
 * CatalogShowcaseVideo
 * Vídeo de demostración fluida de los 8 nuevos arquetipos del Catálogo Modular (@en1minuto.es)
 * con transiciones suaves (cross-dissolve + elevación elástica) para verificar formas y colores.
 */
export const CatalogShowcaseVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Seleccionamos los 8 nuevos arquetipos (#05 a #12) para el vídeo de verificación
  const showcaseItems = VISUAL_ARCHETYPE_CATALOG.slice(4, 12);

  const progressRatio = interpolate(
    frame,
    [0, Math.max(1, durationInFrames - 1)],
    [0, 1],
    CLAMP_EXTRAPOLATION
  );

  return (
    <AbsoluteFill>
      <BlueprintSurface mode="EDITORIAL_PAPER">
        {showcaseItems.map((item, idx) => {
          const startFrame = idx * (FRAMES_PER_ARCHETYPE - OVERLAP_FRAMES);
          const localFrame = frame - startFrame;

          if (localFrame < 0 || localFrame > FRAMES_PER_ARCHETYPE) {
            return null;
          }

          const fadeIn =
            idx === 0
              ? 1
              : interpolate(
                  localFrame,
                  [0, OVERLAP_FRAMES],
                  [0, 1],
                  CLAMP_EXTRAPOLATION
                );
          const fadeOut =
            idx === showcaseItems.length - 1
              ? 1
              : interpolate(
                  localFrame,
                  [
                    FRAMES_PER_ARCHETYPE - OVERLAP_FRAMES,
                    FRAMES_PER_ARCHETYPE,
                  ],
                  [1, 0],
                  CLAMP_EXTRAPOLATION
                );

          const opacity = Math.min(fadeIn, fadeOut);
          const titleSpring = spring({
            frame: Math.max(0, localFrame),
            fps,
            config: SPRING_SNAPPY,
          });

          return (
            <Sequence
              key={item.id}
              from={startFrame}
              durationInFrames={FRAMES_PER_ARCHETYPE}
            >
              <AbsoluteFill
                style={{
                  opacity,
                  padding: '96px 96px 288px 96px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              >
                {/* Cabecera Limpia sin Píldoras Superfluas */}
                <div
                  style={{
                    marginBottom: 28,
                    opacity: titleSpring,
                    transform: `translateY(${(1 - titleSpring) * 22}px)`,
                  }}
                >
                  <h1
                    style={{
                      fontFamily: BRAND_CONFIG.fontDisplay,
                      fontSize: 56,
                      fontWeight: 900,
                      color: '#141413',
                      margin: 0,
                      letterSpacing: '-0.03em',
                      lineHeight: 1.08,
                    }}
                  >
                    {item.name.toUpperCase()}
                  </h1>
                </div>

                {/* Tarjeta Ocre Superior con el Caso de Uso del Manual de Estilo */}
                <div style={{ marginBottom: 26 }}>
                  <KineticCard
                    enterFrame={2}
                    accentBorderColor="#D94E34"
                  >
                    <div
                      style={{
                        fontFamily: BRAND_CONFIG.fontDisplay,
                        fontSize: 28,
                        fontWeight: 900,
                        color: '#141413',
                        letterSpacing: '-0.02em',
                        marginBottom: 8,
                      }}
                    >
                      {item.cognitiveMetaphor}
                    </div>
                    <div
                      style={{
                        fontFamily: BRAND_CONFIG.fontSans,
                        fontSize: 18,
                        fontWeight: 600,
                        color: '#575550',
                        lineHeight: 1.35,
                      }}
                    >
                      {item.whenToChoose} <strong style={{ color: '#D94E34' }}>Ideal para:</strong> {item.bestForBooks}.
                    </div>
                  </KineticCard>
                </div>

                {/* Arquetipo Visual Dinámico con Formas Suavizadas */}
                <ArchetypeRenderer archetype={item.id} enterFrame={6} />
              </AbsoluteFill>
            </Sequence>
          );
        })}

        {/* Barra de Progreso Superior */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            backgroundColor: 'rgba(20, 20, 19, 0.08)',
            zIndex: 90,
          }}
        >
          <div
            style={{
              width: `${progressRatio * 100}%`,
              height: '100%',
              backgroundColor: '#D94E34',
            }}
          />
        </div>

        {/* Reloj Cronómetro Inferior Limpio */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 85,
          }}
        >
          <OneMinuteStopwatch
            size={86}
            mode="header"
            currentFrame={frame}
          />
        </div>
      </BlueprintSurface>
    </AbsoluteFill>
  );
};

export const CATALOG_SHOWCASE_DURATION =
  8 * FRAMES_PER_ARCHETYPE - 7 * OVERLAP_FRAMES; // 516 frames (~17.2s)
export const CATALOG_SHOWCASE_FPS = VIDEO_CONFIG.fps;
