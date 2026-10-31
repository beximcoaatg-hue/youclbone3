import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { THEME } from '../types';

interface StampBadgeProps {
  text: string;
  type?: 'reject' | 'approve' | 'warning';
  subtext?: string;
  size?: 'normal' | 'large';
}

export const StampBadge: React.FC<StampBadgeProps> = ({
  text,
  type = 'reject',
  subtext,
  size = 'normal',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleSpring = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 220, mass: 0.8 },
  });

  const scale = 2.4 - scaleSpring * 1.4; // 2.4 -> 1.0 with sharp slam
  const opacity = Math.min(1, scaleSpring * 2);

  const mainColor =
    type === 'reject'
      ? THEME.terracotta
      : type === 'approve'
      ? THEME.jade
      : THEME.gold;

  const isLarge = size === 'large';

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: `${isLarge ? 7 : 5}px solid ${mainColor}`,
        borderRadius: isLarge ? 24 : 16,
        padding: isLarge ? '20px 48px' : '12px 28px',
        color: mainColor,
        transform: `scale(${scale}) rotate(-7deg)`,
        opacity,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        boxShadow: `0 8px 32px ${mainColor}33`,
        textTransform: 'uppercase',
        letterSpacing: 2,
      }}
    >
      <span
        style={{
          fontSize: isLarge ? 74 : 44,
          fontWeight: 900,
          lineHeight: 1.1,
          textAlign: 'center',
        }}
      >
        {text}
      </span>
      {subtext && (
        <span
          style={{
            fontSize: isLarge ? 24 : 18,
            fontWeight: 700,
            letterSpacing: 1.5,
            marginTop: 6,
            opacity: 0.9,
          }}
        >
          {subtext}
        </span>
      )}
    </div>
  );
};
