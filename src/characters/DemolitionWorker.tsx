import React from 'react';
import { useCurrentFrame } from 'remotion';
import { THEME } from '../types';

interface DemolitionWorkerProps {
  overdrive?: boolean;
  scale?: number;
}

export const DemolitionWorker: React.FC<DemolitionWorkerProps> = ({ overdrive = false, scale = 1 }) => {
  const frame = useCurrentFrame();

  const speedMult = overdrive ? 2.2 : 1.0;
  const strikeWave = Math.sin(frame * 0.45 * speedMult);
  const toolOffsetY = strikeWave * (overdrive ? 16 : 9);
  const armSwing = strikeWave * (overdrive ? 24 : 12);
  const bodyJitterX = overdrive ? Math.sin(frame * 1.8) * 4.5 : Math.sin(frame * 0.8) * 2;

  return (
    <div
      style={{
        transform: `scale(${scale}) translateX(${bodyJitterX}px)`,
        transformOrigin: 'bottom center',
        position: 'relative',
        width: 200,
        height: 250,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        filter: overdrive ? 'drop-shadow(0 0 22px rgba(200, 75, 49, 0.75))' : 'none',
      }}
    >
      {overdrive && (
        <div
          style={{
            position: 'absolute',
            top: -22,
            backgroundColor: THEME.terracotta,
            color: THEME.white,
            padding: '5px 16px',
            borderRadius: 999,
            fontSize: 17,
            fontWeight: 900,
            border: `2.5px solid ${THEME.white}`,
            boxShadow: '0 6px 20px rgba(200, 75, 49, 0.6)',
            zIndex: 10,
          }}
        >
          🔥 2.2x OVERDRIVE!
        </div>
      )}

      <svg width="200" height="250" viewBox="0 0 200 250" fill="none">
        <g transform="translate(10, 0)">
          {/* Helmet */}
          <path d="M 52 70 C 52 44, 128 44, 128 70 Z" fill="#EA580C" stroke={THEME.charcoal} strokeWidth="3.5" />
          <rect x="42" y="68" width="96" height="9" rx="4.5" fill="#C2410C" stroke={THEME.charcoal} strokeWidth="3" />

          {/* Head */}
          <circle cx="90" cy="94" r="29" fill="#FFEDD5" stroke={THEME.charcoal} strokeWidth="3.5" />

          {/* Visor */}
          <rect x="64" y="85" width="52" height="19" rx="6" fill="#1E293B" stroke={THEME.charcoal} strokeWidth="3" />
          <circle cx="78" cy="94.5" r="5.5" fill={overdrive ? '#EF4444' : '#38BDF8'} />
          <circle cx="102" cy="94.5" r="5.5" fill={overdrive ? '#EF4444' : '#38BDF8'} />

          {/* Torso */}
          <rect
            x="60"
            y="123"
            width="60"
            height="67"
            rx="13"
            fill={overdrive ? '#B91C1C' : '#C84B31'}
            stroke={THEME.charcoal}
            strokeWidth="3.5"
          />
          <line x1="74" y1="124" x2="74" y2="188" stroke="#FEF08A" strokeWidth="5.5" />
          <line x1="106" y1="124" x2="106" y2="188" stroke="#FEF08A" strokeWidth="5.5" />

          {/* Heavy Jackhammer / Pickaxe */}
          <g transform={`translate(0, ${10 + toolOffsetY})`}>
            <rect x="83" y="132" width="14" height="60" rx="4" fill="#64748B" stroke={THEME.charcoal} strokeWidth="3" />
            <polygon points="78,192 102,192 90,226" fill={overdrive ? '#EF4444' : '#334155'} stroke={THEME.charcoal} strokeWidth="3" />
            <rect x="66" y="128" width="48" height="11" rx="5" fill="#0F172A" stroke={THEME.charcoal} strokeWidth="2.5" />
          </g>

          {/* Articulated Arms */}
          <g transform={`rotate(${armSwing}, 60, 135)`}>
            <rect x="44" y="132" width="22" height="44" rx="10" fill="#FFEDD5" stroke={THEME.charcoal} strokeWidth="3" />
          </g>
          <g transform={`rotate(${-armSwing}, 120, 135)`}>
            <rect x="114" y="132" width="22" height="44" rx="10" fill="#FFEDD5" stroke={THEME.charcoal} strokeWidth="3" />
          </g>

          {/* Legs */}
          <rect x="66" y="190" width="19" height="34" rx="6" fill="#475569" stroke={THEME.charcoal} strokeWidth="3" />
          <rect x="95" y="190" width="19" height="34" rx="6" fill="#475569" stroke={THEME.charcoal} strokeWidth="3" />
          <rect x="62" y="220" width="26" height="13" rx="4" fill="#0F172A" stroke={THEME.charcoal} strokeWidth="3" />
          <rect x="92" y="220" width="26" height="13" rx="4" fill="#0F172A" stroke={THEME.charcoal} strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
};
