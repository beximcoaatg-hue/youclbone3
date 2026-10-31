import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { THEME } from '../types';

interface SubtitleCardProps {
  text: string;
  isDark?: boolean;
}

export const SubtitleCard: React.FC<SubtitleCardProps> = ({ text, isDark = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle spring entry
  const entry = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 200 },
  });

  const translateY = (1 - entry) * 18;
  const opacity = entry;

  // Render text with **keyword** highlighted in Terracotta or Jade
  const renderFormattedText = (raw: string) => {
    const parts = raw.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const word = part.slice(2, -2);
        return (
          <span
            key={index}
            style={{
              color: isDark ? '#FCA5A5' : THEME.terracotta,
              fontWeight: 800,
              padding: '0 4px',
              textDecoration: isDark ? 'underline' : 'none',
              textUnderlineOffset: '6px',
            }}
          >
            {word}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 54,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 64px',
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: isDark ? 'rgba(24, 27, 32, 0.92)' : 'rgba(255, 255, 255, 0.94)',
          color: isDark ? '#F9FAFB' : THEME.charcoal,
          border: isDark ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid rgba(30, 34, 41, 0.08)',
          boxShadow: isDark
            ? '0 12px 36px rgba(0, 0, 0, 0.6)'
            : '0 12px 32px rgba(30, 34, 41, 0.08)',
          borderRadius: 24,
          padding: '16px 36px',
          maxWidth: 1300,
          textAlign: 'center',
          backdropFilter: 'blur(16px)',
          transform: `translateY(${translateY}px)`,
          opacity,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 34,
            fontWeight: 600,
            lineHeight: 1.5,
            letterSpacing: 0.2,
          }}
        >
          {renderFormattedText(text)}
        </p>
      </div>
    </div>
  );
};
