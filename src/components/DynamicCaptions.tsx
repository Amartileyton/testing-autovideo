import React, { useMemo } from 'react';
import { createTikTokStyleCaptions, type Caption } from '@remotion/captions';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { WordTimestamp } from '../data/schema';
import {
  CLAMP_EXTRAPOLATION,
  PALETTE,
  SAFE_ZONE,
  SPRING_SNAPPY,
} from '../theme/motion';

export interface DynamicCaptionsProps {
  wordTimestamps: WordTimestamp[];
  /** Offset global en fotogramas donde arranca esta escena */
  sceneStartFrame?: number;
}

/**
 * DynamicCaptions — Subtítulos dinámicos palabra por palabra compatibles con @remotion/captions
 * Posicionados estrictamente dentro del 85% superior del lienzo (SAFE_ZONE.maxSafeY = 1632px).
 */
export const DynamicCaptions: React.FC<DynamicCaptionsProps> = ({
  wordTimestamps,
  sceneStartFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - sceneStartFrame;
  const currentTimeMs = (localFrame / fps) * 1000;

  const pages = useMemo(() => {
    if (!wordTimestamps || wordTimestamps.length === 0) {
      return [];
    }
    const captions: Caption[] = wordTimestamps.map((w, index) => ({
      text: index === 0 ? w.word : ` ${w.word}`,
      startMs: w.startMs,
      endMs: w.endMs,
      timestampMs: w.startMs,
      confidence: 1,
    }));

    const { pages: tiktokPages } = createTikTokStyleCaptions({
      captions,
      combineTokensWithinMilliseconds: 950,
    });
    return tiktokPages;
  }, [wordTimestamps]);

  const activePage = useMemo(() => {
    return pages.find((page, idx) => {
      const nextPage = pages[idx + 1];
      const pageEndMs = nextPage
        ? nextPage.startMs
        : (page.tokens[page.tokens.length - 1]?.toMs ?? page.startMs + 1200) + 250;
      return currentTimeMs >= page.startMs - 60 && currentTimeMs <= pageEndMs;
    });
  }, [pages, currentTimeMs]);

  if (!activePage) {
    return null;
  }

  const pageStartFrame = Math.floor((activePage.startMs / 1000) * fps);
  const pageEntrance = spring({
    frame: localFrame - pageStartFrame,
    fps,
    config: SPRING_SNAPPY,
  });

  const translateY = interpolate(pageEntrance, [0, 1], [14, 0], CLAMP_EXTRAPOLATION);

  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE_ZONE.horizontalPaddingPx,
        right: SAFE_ZONE.horizontalPaddingPx,
        top: SAFE_ZONE.maxSafeY - 196,
        maxHeight: 170,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: PALETTE.surfaceElevated,
          border: `3px solid ${PALETTE.border}`,
          borderRadius: 18,
          padding: '18px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px 12px',
          maxWidth: SAFE_ZONE.maxSafeX - SAFE_ZONE.minSafeX,
        }}
      >
        {activePage.tokens.map((token, idx) => {
          const isActive =
            currentTimeMs >= token.fromMs - 30 && currentTimeMs <= token.toMs + 60;
          const tokenStartFrame = Math.floor((token.fromMs / 1000) * fps);
          const tokenPop = spring({
            frame: localFrame - tokenStartFrame,
            fps,
            config: SPRING_SNAPPY,
          });
          const scale = isActive
            ? interpolate(tokenPop, [0, 1], [0.94, 1.06], CLAMP_EXTRAPOLATION)
            : 1;

          return (
            <span
              key={`${token.fromMs}-${idx}`}
              style={{
                display: 'inline-block',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: 38,
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                color: isActive ? PALETTE.surfaceElevated : PALETTE.ink,
                backgroundColor: isActive ? PALETTE.accentPrimary : 'transparent',
                padding: isActive ? '2px 12px' : '2px 4px',
                borderRadius: 10,
                transform: `scale(${scale})`,
              }}
            >
              {token.text.trim()}
            </span>
          );
        })}
      </div>
    </div>
  );
};
