import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { THEME } from '../types';

export const Scene6_EpigramOutro: React.FC = () => {
  const frame = useCurrentFrame(); // Local 0 to 648 (Global 7132 to 7780)
  const { fps } = useVideoConfig();

  // Exact Blueprint Sub-Beats:
  // 1) 1:34 - 1:38 (Local 0 - 340): Circular Iris Wipe transitions to Deep Burgundy (#3A1F24) as each word of the final Bangla epigram springs up individually (60px+ font) with a self-drawing golden underline.
  // 2) 1:38 - End (Local 340 - 648): Oversized Mobile CTA & Cursor Click Physics — A 280px+ Follow/Share pill button pulses at center stage; a vector hand cursor swoops in along a curved path, clicks the button (scale: 0.9 -> 1.12 + ui-pop.wav at local 520), and triggers an expanding ring of golden bone/star particles.

  // Circular Iris Wipe Radius (0% to 150%)
  const irisRadius = interpolate(frame, [0, 38], [0, 150], {
    extrapolateRight: 'clamp',
  });

  const line1Words = ['মনে', 'রাখবেন,', 'হাড়কে', 'শুধু', 'ক্যালসিয়াম', 'দেবেন', 'না—'];
  const line2Words = ['হাড়কে', 'শক্ত', 'থাকার', 'একটা', 'কারণ', 'দিন!'];

  // Self-Drawing Golden Underline (Local 235 - 300)
  const underlineDraw = interpolate(frame, [235, 300], [0, 920], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // CTA Card Entrance (Local 345)
  const ctaPop = spring({
    frame: Math.max(0, frame - 345),
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  // Curved Vector Hand Cursor Flight (Local 430 -> 518)
  const cursorT = interpolate(frame, [430, 518], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursorX = (1 - cursorT) * (1 - cursorT) * 380 + 2 * (1 - cursorT) * cursorT * 180 + cursorT * cursorT * 0;
  const cursorY = (1 - cursorT) * (1 - cursorT) * 240 + 2 * (1 - cursorT) * cursorT * -40 + cursorT * cursorT * 36;

  // Click Physics: scale 1.0 -> 0.9 -> 1.12 -> 1.04
  const isClicked = frame >= 520;
  const buttonClickScale = interpolate(
    frame,
    [512, 520, 532, 550],
    [1.0, 0.9, 1.12, 1.04],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Expanding Ring of Golden Bone/Star Particles on Click (Local 520+)
  const burstProgress = interpolate(frame, [520, 585], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#3A1F24',
        clipPath: `circle(${irisRadius}% at 50% 50%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 80px',
        color: THEME.white,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Part 1 of Epigram: Word-by-Word Kinetic Entrance */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 18 }}>
        {line1Words.map((word, wIdx) => {
          const wSpring = spring({
            frame: Math.max(0, frame - (18 + wIdx * 10)),
            fps,
            config: { damping: 12, stiffness: 200 },
          });
          return (
            <span
              key={wIdx}
              style={{
                transform: `translateY(${(1 - wSpring) * 35}px) scale(${wSpring})`,
                opacity: wSpring,
                fontSize: 48,
                fontWeight: 700,
                color: '#FCA5A5',
                textDecoration: frame >= 185 ? 'line-through' : 'none',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Part 2 of Epigram: 64px Word-by-Word Kinetic Entrance + Self-Drawing Golden Underline */}
      {frame >= 180 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 38 }}>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
            {line2Words.map((word, wIdx) => {
              const wSpring = spring({
                frame: Math.max(0, frame - (185 + wIdx * 10)),
                fps,
                config: { damping: 11, stiffness: 220 },
              });
              return (
                <span
                  key={wIdx}
                  style={{
                    transform: `translateY(${(1 - wSpring) * 45}px) scale(${wSpring})`,
                    opacity: wSpring,
                    fontSize: 68,
                    fontWeight: 900,
                    color: wIdx >= 4 ? '#FACC15' : '#4ADE80',
                    textShadow: '0 10px 32px rgba(0,0,0,0.4)',
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>

          {/* Self-Drawing Golden Underline SVG */}
          <svg width="940" height="28" viewBox="0 0 940 28" style={{ marginTop: 6 }}>
            <path
              d="M 20 14 Q 470 28 920 12"
              fill="none"
              stroke="#FACC15"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="920"
              strokeDashoffset={920 - underlineDraw}
            />
          </svg>
        </div>
      )}

      {/* Oversized Mobile CTA Card + Curved Vector Hand Cursor Click + Expanding Golden Particle Ring */}
      {frame >= 345 && (
        <div
          style={{
            position: 'relative',
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            border: '3.5px solid rgba(255, 255, 255, 0.32)',
            borderRadius: 36,
            padding: '28px 68px',
            transform: `scale(${ctaPop})`,
            backdropFilter: 'blur(16px)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ fontSize: 30, fontWeight: 700, color: '#F8FAFC', marginBottom: 16 }}>
            এমন স্বাস্থ্যবিষয়ক সহজ ভিডিও পেতে
          </div>

          {/* Pulsing Follow/Share Pill Button (Scale 0.9 -> 1.12 on Click) */}
          <div
            style={{
              minWidth: 340,
              backgroundColor: isClicked ? '#107C41' : '#4ADE80',
              color: isClicked ? THEME.white : THEME.charcoal,
              fontSize: 38,
              fontWeight: 900,
              padding: '16px 52px',
              borderRadius: 999,
              border: `4px solid ${THEME.white}`,
              boxShadow: isClicked
                ? '0 0 45px rgba(74, 222, 128, 0.85)'
                : '0 12px 32px rgba(74, 222, 128, 0.45)',
              transform: `scale(${buttonClickScale})`,
            }}
          >
            {isClicked ? '✓ এডুটক ফলো করা হয়েছে!' : '+ এডুটক পেজটি ফলো করুন'}
          </div>

          {/* Expanding Ring of Golden Bone & Star Particles on Click (Local 520+) */}
          {frame >= 520 && burstProgress < 1 && (
            <div style={{ position: 'absolute', top: '65%', left: '50%', pointerEvents: 'none' }}>
              {Array.from({ length: 12 }).map((_, pIdx) => {
                const angle = (pIdx * Math.PI * 2) / 12;
                const dist = burstProgress * 240;
                const px = Math.cos(angle) * dist;
                const py = Math.sin(angle) * dist;
                return (
                  <div
                    key={pIdx}
                    style={{
                      position: 'absolute',
                      transform: `translate(${px}px, ${py}px) scale(${1.2 - burstProgress})`,
                      opacity: 1 - burstProgress,
                      fontSize: 34,
                    }}
                  >
                    {pIdx % 2 === 0 ? '⭐' : '🦴'}
                  </div>
                );
              })}
            </div>
          )}

          {/* Custom Vector Hand Cursor Swooping Along Curved Path */}
          {frame >= 430 && (
            <div
              style={{
                position: 'absolute',
                top: '55%',
                left: '50%',
                transform: `translate(${cursorX}px, ${cursorY}px) scale(${frame >= 514 && frame <= 526 ? 0.82 : 1})`,
                zIndex: 60,
                pointerEvents: 'none',
                filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.5))',
              }}
            >
              <svg width="76" height="76" viewBox="0 0 76 76" fill="none">
                <path
                  d="M 28 12 C 28 7, 36 7, 36 12 L 36 34 L 44 34 C 52 34, 56 40, 56 48 L 56 58 C 56 66, 48 72, 36 72 L 26 72 C 18 72, 14 64, 14 54 L 14 42 C 14 38, 20 38, 22 42 L 28 46 Z"
                  fill="#FFFFFF"
                  stroke={THEME.charcoal}
                  strokeWidth="4.5"
                />
              </svg>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
