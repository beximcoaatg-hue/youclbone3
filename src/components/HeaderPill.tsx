import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { THEME } from '../types';

interface HeaderPillProps {
  context: string;
  isDark?: boolean;
}

export const HeaderPill: React.FC<HeaderPillProps> = ({ context, isDark = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  const translateY = (1 - entrance) * -30;
  const opacity = entrance;

  return (
    <div
      style={{
        position: 'absolute',
        top: 48,
        left: 64,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        transform: `translateY(${translateY}px)`,
        opacity,
      }}
    >
      {/* Brand Channel Pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: isDark ? 'rgba(255, 255, 255, 0.12)' : THEME.charcoal,
          color: THEME.white,
          padding: '8px 18px',
          borderRadius: 999,
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: 0.5,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: isDark ? THEME.gold : '#4ADE80',
            display: 'inline-block',
          }}
        />
        <span>@EduTalk</span>
      </div>

      {/* Dynamic Sub-Pill */}
      <div
        style={{
          background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.92)',
          color: isDark ? '#E5E7EB' : THEME.charcoal,
          border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(30, 34, 41, 0.1)',
          padding: '8px 20px',
          borderRadius: 999,
          fontSize: 19,
          fontWeight: 600,
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
        }}
      >
        <span>{context}</span>
      </div>
    </div>
  );
};
