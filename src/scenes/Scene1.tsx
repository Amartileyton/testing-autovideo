import React from 'react';
import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { BookMetadata, BookVisualData } from '../data/schema';
import { CLAMP_EXTRAPOLATION, PALETTE, SPRING_SNAPPY } from '../theme/motion';
import { ComparisonBattle, LiveCounter } from '../components/kinetic';

export interface Scene1Props {
  headline?: string;
  metricValue?: number;
  metricUnit?: string;
  metricLabel?: string;
  canvasOffsetX?: number;
  canvasOffsetY?: number;
  enterFrame?: number;
  bookMetadata?: BookMetadata;
  visualData?: BookVisualData;
}

/**
 * Scene 1 — Apertura Corporativa @en1minuto.es:
 * 1. Titular limpio sin píldoras pequeñas.
 * 2. Ficha Estadística en fondo bloc de notas ocre pálido (#FDF6DF).
 * 3. Portada 2.5D del Libro flanqueada por las DOS PÍLDORAS POP-UP rescatadas:
 *    - Pop-up Ventas (+3M COPIAS · Nº 1 New York Times)
 *    - Pop-up Goodreads con su logo oficial (`assets/goodreads-logo.png` + ★ 4.15 y reseñas)
 * 4. Confrontación Cinética limpia (Trabajo Superficial vs Trabajo Profundo).
 */
export const Scene1: React.FC<Scene1Props> = ({
  headline = 'El superpoder perdido',
  canvasOffsetX = 0,
  canvasOffsetY = 0,
  enterFrame = 0,
  bookMetadata,
  visualData,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - enterFrame);

  // 1. Cabecera editorial (frame 0)
  const headerEntrance = spring({
    frame: localFrame,
    fps,
    config: SPRING_SNAPPY,
  });

  // 2. Ficha estadística del gancho (frame 6)
  const statEntrance = spring({
    frame: Math.max(0, localFrame - 6),
    fps,
    config: SPRING_SNAPPY,
  });

  // 3. Portada 2.5D del libro (entra en frame 38)
  const bookEntrance = spring({
    frame: Math.max(0, localFrame - 38),
    fps,
    config: SPRING_SNAPPY,
  });

  // 4. Pop-up 1: Ventas (entra en frame 70)
  const salesEntrance = spring({
    frame: Math.max(0, localFrame - 70),
    fps,
    config: SPRING_SNAPPY,
  });

  // 5. Pop-up 2: Goodreads con logo (entra en frame 95)
  const goodreadsEntrance = spring({
    frame: Math.max(0, localFrame - 95),
    fps,
    config: SPRING_SNAPPY,
  });

  // Inclinación 2.5D sutil del libro
  const bookTilt = interpolate(
    localFrame,
    [38, 140, 280],
    [-4, 3, 0],
    CLAMP_EXTRAPOLATION
  );

  const coverSrc =
    bookMetadata?.coverImage || 'assets/books/centrate-deep-work-cover.jpg';
  const authorName = bookMetadata?.author || 'Cal Newport';
  const rating = bookMetadata?.rating ?? 4.15;
  const ratingsCount = bookMetadata?.ratingsCount || '190K';
  const salesCopies =
    bookMetadata?.salesCopies ||
    visualData?.badgeVentas ||
    '+3M COPIAS';

  const statNumber = visualData?.hookStatValue ?? 40;
  const statSuffix = visualData?.hookStatSuffix ?? '%';
  const statTitle =
    visualData?.hookLabel ?? 'Caída de tu capacidad cognitiva al mirar el móvil';
  const statSub =
    visualData?.hookSublabel ??
    `Investigación científica de ${authorName}`;

  const titleA = visualData?.mythLabel || 'Trabajo Superficial';
  const subtitleA =
    visualData?.mythText ||
    'Correos, chats y multitarea que fragmentan tus neuronas';
  const titleB = visualData?.realityLabel || 'Trabajo Profundo';
  const subtitleB =
    visualData?.realityText ||
    'Bloques de concentración extrema sin distracciones';

  return (
    <div
      style={{
        position: 'absolute',
        left: canvasOffsetX,
        top: canvasOffsetY,
        width: 1080,
        height: 1920,
        pointerEvents: 'none',
        padding: '0 96px',
        boxSizing: 'border-box',
      }}
    >
      {/* 1. Titular Limpio (Sin píldora superior) */}
      <div
        style={{
          position: 'absolute',
          top: 135,
          left: 96,
          right: 96,
          opacity: headerEntrance,
          transform: `translateY(${(1 - headerEntrance) * -20}px)`,
        }}
      >
        <h1
          style={{
            fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
            fontSize: 62,
            fontWeight: 900,
            color: '#141413',
            margin: 0,
            lineHeight: 1.06,
            letterSpacing: '-0.035em',
          }}
        >
          {headline}
        </h1>
      </div>

      {/* 2. Ficha Estadística con LiveCounter en Fondo Bloc de Notas Ocre Pálido */}
      <div
        style={{
          position: 'absolute',
          top: 245,
          left: 96,
          right: 96,
          backgroundColor: PALETTE.cardNotepad,
          border: `2px solid ${PALETTE.cardBorder}`,
          borderLeft: '8px solid #D94E34',
          borderRadius: 18,
          padding: '22px 28px',
          boxShadow: '0 12px 32px rgba(45, 43, 40, 0.08)',
          opacity: statEntrance,
          transform: `scale(${interpolate(statEntrance, [0, 1], [0.94, 1], CLAMP_EXTRAPOLATION)})`,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div style={{ minWidth: 145 }}>
          <LiveCounter
            from={0}
            to={statNumber}
            startFrame={6}
            durationFrames={28}
            suffix={statSuffix}
            fontSize={56}
            color="#D94E34"
          />
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
              fontSize: 22,
              fontWeight: 800,
              color: '#141413',
              lineHeight: 1.2,
            }}
          >
            {statTitle}
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 15,
              fontWeight: 600,
              color: '#575550',
              marginTop: 4,
            }}
          >
            {statSub}
          </div>
        </div>
      </div>

      {/* 3. Portada 2.5D del Libro */}
      <div
        style={{
          position: 'absolute',
          top: 415,
          left: 96,
          right: 96,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: bookEntrance,
          transform: `translateY(${(1 - bookEntrance) * 35}px) perspective(1200px) rotateY(${bookTilt}deg)`,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 380,
            height: 570,
            borderRadius: 20,
            padding: 8,
            overflow: 'hidden',
            boxShadow:
              '0 30px 65px rgba(45, 43, 40, 0.22), 0 6px 18px rgba(45, 43, 40, 0.10)',
            border: '2.5px solid #141413',
            backgroundColor: PALETTE.cardNotepad,
          }}
        >
          <Img
            src={staticFile(coverSrc)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 12,
            }}
          />
        </div>
      </div>

      {/* POP-UP 1 RESCATADO: VENTAS (+3M COPIAS VENDIDAS) */}
      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 760,
          padding: '16px 24px',
          borderRadius: 18,
          backgroundColor: '#1C1917',
          border: '2.5px solid #F59E0B',
          boxShadow: '0 20px 45px rgba(20, 20, 19, 0.35)',
          opacity: salesEntrance,
          transform: `scale(${salesEntrance}) rotate(-4deg)`,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          zIndex: 40,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: '#F59E0B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
          }}
        >
          🔥
        </div>
        <div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 26,
              fontWeight: 900,
              color: '#FFFFFF',
            }}
          >
            {salesCopies}
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: '#FBBF24',
            }}
          >
            Nº 1 New York Times
          </div>
        </div>
      </div>

      {/* POP-UP 2 RESCATADO: GOODREADS (LOGO OFICIAL + ESTRELLAS Y RESEÑAS) */}
      <div
        style={{
          position: 'absolute',
          right: 72,
          top: 865,
          padding: '18px 26px',
          borderRadius: 20,
          backgroundColor: PALETTE.cardNotepad,
          border: '2.5px solid #382110',
          boxShadow: '0 22px 50px rgba(20, 20, 19, 0.28)',
          opacity: goodreadsEntrance,
          transform: `scale(${goodreadsEntrance}) rotate(3deg)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 8,
          zIndex: 45,
          minWidth: 275,
        }}
      >
        <Img
          src={staticFile('assets/goodreads-logo.png')}
          style={{
            height: 36,
            objectFit: 'contain',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 30,
              fontWeight: 900,
              color: '#1C1917',
            }}
          >
            ★ {rating}
          </span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 18,
              fontWeight: 700,
              color: '#57534E',
            }}
          >
            ({ratingsCount} reseñas)
          </span>
        </div>
      </div>

      {/* 4. Confrontación Cinética Limpia (Sin píldoras pequeñas) */}
      <div
        style={{
          position: 'absolute',
          top: 1045,
          left: 96,
          right: 96,
        }}
      >
        <ComparisonBattle
          titleA={titleA}
          subtitleA={subtitleA}
          titleB={titleB}
          subtitleB={subtitleB}
          metricB={{ value: 100, suffix: '% IMPACTO' }}
          enterFrameA={160}
          enterFrameB={190}
          battleFrame={225}
          accentColor="#D94E34"
        />
      </div>
    </div>
  );
};
