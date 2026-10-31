import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { THEME } from '../types';

interface MasonWorkerProps {
  state?: 'idle' | 'building' | 'sleeping' | 'cheering';
  scale?: number;
  desaturate?: number; // 0 to 1 (e.g. 0.6 for 40% grey)
  slump?: boolean;
}

export const MasonWorker: React.FC<MasonWorkerProps> = ({
  state = 'idle',
  scale = 1,
  desaturate = 0,
  slump = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bobbing =
    state === 'cheering'
      ? Math.abs(Math.sin((frame * 2 * Math.PI) / 16)) * -14
      : Math.sin((frame * 2 * Math.PI) / 45) * 3.5;

  const trowelSwing =
    state === 'building'
      ? Math.sin((frame * 2 * Math.PI) / 16) * 28
      : state === 'cheering'
      ? -135 + Math.sin((frame * 2 * Math.PI) / 12) * 20
      : 0;

  const rightArmAngle =
    state === 'cheering'
      ? 135 + Math.cos((frame * 2 * Math.PI) / 12) * 20
      : state === 'building'
      ? Math.cos((frame * 2 * Math.PI) / 16) * 12
      : 0;

  const isBlinking = frame % 85 >= 80;
  const isSleeping = state === 'sleeping';

  const slumpY = slump ? 18 : 0;
  const slumpRot = slump ? 12 : 0;

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'bottom center',
        position: 'relative',
        width: 200,
        height: 250,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        filter: desaturate > 0 ? `grayscale(${desaturate * 100}%) opacity(${1 - desaturate * 0.25})` : 'none',
      }}
    >
      {/* 3 Staggered Floating Zzz Bubbles when Sleeping */}
      {isSleeping &&
        [0, 1, 2].map((idx) => {
          const cycle = (frame + idx * 18) % 54;
          const zOpacity = cycle < 10 ? cycle / 10 : cycle > 42 ? (54 - cycle) / 12 : 1;
          const zY = -10 - (cycle / 54) * 55;
          const zX = 16 + idx * 18 + Math.sin((frame + idx * 10) * 0.15) * 6;
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                top: 25 + zY,
                right: 30 - zX,
                fontSize: 22 + idx * 6,
                fontWeight: 900,
                color: '#64748B',
                opacity: zOpacity,
                background: 'rgba(255,255,255,0.9)',
                border: `2.5px solid ${THEME.charcoal}`,
                borderRadius: 999,
                padding: '2px 10px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                zIndex: 10,
              }}
            >
              Zzz
            </div>
          );
        })}

      {state === 'cheering' && (
        <div
          style={{
            position: 'absolute',
            top: -22,
            backgroundColor: THEME.jade,
            color: THEME.white,
            padding: '4px 16px',
            borderRadius: 999,
            fontSize: 18,
            fontWeight: 900,
            border: `2.5px solid ${THEME.charcoal}`,
            boxShadow: '0 6px 16px rgba(16,124,65,0.35)',
          }}
        >
          ⚡ WORK ORDER ACTIVE!
        </div>
      )}

      <svg width="200" height="250" viewBox="0 0 200 250" fill="none">
        <g transform={`translate(10, ${bobbing + slumpY}) rotate(${slumpRot}, 90, 140)`}>
          {/* Hard Hat */}
          <path
            d="M 50 72 C 50 42, 130 42, 130 72 Z"
            fill="#FACC15"
            stroke={THEME.charcoal}
            strokeWidth="3.5"
          />
          <rect x="40" y="70" width="100" height="9" rx="4.5" fill="#EAB308" stroke={THEME.charcoal} strokeWidth="3" />
          <rect x="84" y="42" width="12" height="20" rx="3" fill="#CA8A04" />

          {/* Head */}
          <circle cx="90" cy="96" r="30" fill="#FEE2E2" stroke={THEME.charcoal} strokeWidth="3.5" />

          {/* Eyes */}
          {isSleeping ? (
            <>
              <path d="M 75 98 Q 81 105 87 98" stroke={THEME.charcoal} strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 95 98 Q 101 105 107 98" stroke={THEME.charcoal} strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </>
          ) : isBlinking ? (
            <>
              <line x1="75" y1="95" x2="87" y2="95" stroke={THEME.charcoal} strokeWidth="3.5" strokeLinecap="round" />
              <line x1="95" y1="95" x2="107" y2="95" stroke={THEME.charcoal} strokeWidth="3.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="81" cy="95" r="4.5" fill={THEME.charcoal} />
              <circle cx="101" cy="95" r="4.5" fill={THEME.charcoal} />
            </>
          )}

          {/* Mouth */}
          <path
            d={
              isSleeping
                ? 'M 85 113 Q 90 110 95 113'
                : state === 'cheering'
                ? 'M 80 107 Q 90 120 100 107 Z'
                : 'M 82 108 Q 90 117 98 108'
            }
            stroke={THEME.charcoal}
            strokeWidth="3.5"
            strokeLinecap="round"
            fill={state === 'cheering' ? '#EF4444' : 'none'}
          />

          {/* Torso & Overalls */}
          <rect x="60" y="126" width="60" height="66" rx="14" fill="#107C41" stroke={THEME.charcoal} strokeWidth="3.5" />
          <rect x="73" y="126" width="34" height="28" fill="#F8FAFC" rx="4" />
          <circle cx="90" cy="140" r="5.5" fill={THEME.gold} />

          {/* Left Arm & Trowel (or dropped trowel when sleeping) */}
          <g transform={`rotate(${isSleeping ? 25 : trowelSwing}, 60, 136)`}>
            <rect x="40" y="132" width="22" height="44" rx="10" fill="#FEE2E2" stroke={THEME.charcoal} strokeWidth="3" />
            {!isSleeping && (
              <g>
                <path d="M 32 178 L 54 178 L 43 204 Z" fill="#E2E8F0" stroke={THEME.charcoal} strokeWidth="3" />
                <rect x="41" y="168" width="5" height="11" fill="#78350F" />
              </g>
            )}
          </g>

          {/* Right Arm */}
          <g transform={`rotate(${rightArmAngle}, 120, 136)`}>
            <rect x="118" y="132" width="22" height="44" rx="10" fill="#FEE2E2" stroke={THEME.charcoal} strokeWidth="3" />
          </g>

          {/* Legs & Boots */}
          <rect x="66" y="190" width="19" height="34" rx="6" fill="#1E3A8A" stroke={THEME.charcoal} strokeWidth="3" />
          <rect x="95" y="190" width="19" height="34" rx="6" fill="#1E3A8A" stroke={THEME.charcoal} strokeWidth="3" />
          <rect x="62" y="220" width="26" height="13" rx="4" fill="#78350F" stroke={THEME.charcoal} strokeWidth="3" />
          <rect x="92" y="220" width="26" height="13" rx="4" fill="#78350F" stroke={THEME.charcoal} strokeWidth="3" />
        </g>

        {/* Dropped Trowel on the Floor when Sleeping */}
        {isSleeping && (
          <g transform="translate(15, 222) rotate(78)">
            <path d="M 0 0 L 22 0 L 11 26 Z" fill="#94A3B8" stroke={THEME.charcoal} strokeWidth="3" />
            <rect x="8" y="-10" width="6" height="10" fill="#78350F" stroke={THEME.charcoal} strokeWidth="2" />
          </g>
        )}
      </svg>
    </div>
  );
};
