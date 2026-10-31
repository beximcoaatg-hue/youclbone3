import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { THEME } from '../types';

export const ProgressBar: React.FC<{ isDark?: boolean }> = ({ isDark = false }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames], [0, 100], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 6,
        background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(30, 34, 41, 0.06)',
        zIndex: 100,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: isDark ? THEME.gold : THEME.jade,
          boxShadow: `0 0 10px ${isDark ? THEME.gold : THEME.jade}`,
          transition: 'width 0.1s linear',
        }}
      />
    </div>
  );
};
