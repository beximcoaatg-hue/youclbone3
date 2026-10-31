import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { DemolitionWorker } from '../characters/DemolitionWorker';
import { MasonWorker } from '../characters/MasonWorker';
import { CameraRig } from '../components/CameraRig';
import { THEME } from '../types';

export const Scene3_UseItOrLoseIt: React.FC = () => {
  const frame = useCurrentFrame(); // Local 0 to 1568 (Global 3049 to 4617)
  const { fps } = useVideoConfig();

  // Exact Blueprint Sub-Beats:
  // Beat 1 (Local 0 - 420): Hero Sedentary Couch & Signal Cut — Camera zooms (1.6x) onto a 250px Couch/Desk icon; animated red scissor/cross-out stroke slices through a pulsing "Mechanical Load / ওজন বহন" signal wave.
  // Beat 2 (Local 420 - 800): Mason Worker Power-Down Sequence — Camera pans to MasonWorker.tsx whose color desaturates to 40% grey; he drops his trowel, slumps down, and emits 3 staggered floating Zzz bubbles (ui-pop.wav).
  // Beat 3 (Local 800 - 1120): Demolition Worker Overdrive Zoom — Camera punches in (1.65x) on DemolitionWorker.tsx glowing Terracotta Red (#C84B31), swinging at 2.2x speed while a red speedometer needle pins to MAX (plus Sugar/Smoking/Hormone badges).
  // Beat 4 (Local 1120 - 1340): Macro Zoom Inside Porous Bone — Camera zooms 1.8x inside the bone structure where 6 dark sponge-like cavities pop open one-by-one every 10 frames as calcium particles leak out.
  // Beat 5 (Local 1340 - 1568): Pitch-Black Pattern Interrupt — Canvas flashes to #1A1815 dark mode as a giant 260px warning triangle and kinetic Bangla text (ব্যবহার না করলে হাড় ক্ষয়!) slam in word-by-word (stamp-thud.wav).

  const isPitchBlackInterrupt = frame >= 1340;
  const isMacroBonePhase = frame >= 1120 && frame < 1340;

  // Camera Zoom Choreography (1.6x -> 1.55x -> 1.65x -> 1.8x -> 1.15x)
  const zoom = interpolate(
    frame,
    [0, 30, 390, 440, 770, 825, 1095, 1135, 1330, 1345, 1568],
    [1.1, 1.6, 1.6, 1.55, 1.55, 1.65, 1.65, 1.8, 1.8, 1.15, 1.22],
    { extrapolateRight: 'clamp' }
  );

  // Camera Pan X across the 3-station stage (Left: Couch -420, Center: Mason 0, Right: Demolition +420)
  const panX = interpolate(
    frame,
    [0, 390, 440, 770, 825, 1095, 1135, 1568],
    [420, 420, 0, 0, -420, -420, 0, 0],
    { extrapolateRight: 'clamp' }
  );

  const panY = interpolate(
    frame,
    [0, 1095, 1135, 1335, 1340, 1568],
    [-25, -25, 0, 0, 0, 0],
    { extrapolateRight: 'clamp' }
  );

  // Beat 1: Scissor & Cross-Out Stroke Slicing "Mechanical Load / ওজন বহন" Wave
  const crossOutDraw = interpolate(frame, [160, 230], [0, 320], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Beat 2: Mason Worker Desaturation to 60% grey (40% color remaining)
  const masonGrey = interpolate(frame, [450, 560], [0, 0.6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Beat 3: Red Speedometer Needle Pinning to MAX (-90deg to +78deg)
  const needleAngle = interpolate(frame, [820, 940], [-85, 78], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Beat 5: Pitch-Black Pattern Interrupt Word-by-Word Kinetic Text
  if (isPitchBlackInterrupt) {
    const triPop = spring({
      frame: frame - 1340,
      fps,
      config: { damping: 10, stiffness: 220 },
    });
    const words = ['ব্যবহার', 'না', 'করলে', 'হাড়', 'ক্ষয়!'];

    return (
      <CameraRig zoom={zoom} shakeFrames={[1342]} shakeIntensity={20}>
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#1A1815',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 80px',
          }}
        >
          {/* Giant 260px Warning Triangle SVG */}
          <div style={{ transform: `scale(${triPop})`, marginBottom: 24 }}>
            <svg width="260" height="240" viewBox="0 0 260 240" fill="none">
              <polygon
                points="130,16 248,220 12,220"
                fill={THEME.terracotta}
                stroke="#FFFFFF"
                strokeWidth="8"
                strokeLinejoin="round"
              />
              <rect x="120" y="78" width="20" height="72" rx="10" fill="#FFFFFF" />
              <circle cx="130" cy="182" r="13" fill="#FFFFFF" />
            </svg>
          </div>

          {/* Word-by-Word Kinetic Bangla Text Slam */}
          <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', justifyContent: 'center' }}>
            {words.map((w, idx) => {
              const wPop = spring({
                frame: Math.max(0, frame - (1355 + idx * 14)),
                fps,
                config: { damping: 11, stiffness: 240 },
              });
              return (
                <span
                  key={idx}
                  style={{
                    transform: `scale(${wPop}) translateY(${(1 - wPop) * 40}px)`,
                    opacity: wPop,
                    fontSize: 78,
                    fontWeight: 900,
                    color: idx >= 3 ? '#FACC15' : '#FFFFFF',
                    backgroundColor: idx >= 3 ? THEME.terracotta : 'rgba(255,255,255,0.1)',
                    padding: '8px 28px',
                    borderRadius: 22,
                    border: `4px solid ${idx >= 3 ? '#FACC15' : 'rgba(255,255,255,0.25)'}`,
                    boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
        </div>
      </CameraRig>
    );
  }

  // Beat 4: Macro 1.8x Zoom Inside Porous Bone Matrix (6 Cavities Popping Every 10 Frames + Leaking Calcium)
  if (isMacroBonePhase) {
    const cavities = [
      { cx: 220, cy: 130, r: 34, enter: 1130 },
      { cx: 340, cy: 115, r: 42, enter: 1140 },
      { cx: 470, cy: 135, r: 38, enter: 1150 },
      { cx: 280, cy: 195, r: 36, enter: 1160 },
      { cx: 410, cy: 190, r: 44, enter: 1170 },
      { cx: 540, cy: 175, r: 32, enter: 1180 },
    ];

    return (
      <CameraRig zoom={zoom}>
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: THEME.bgWarm,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: THEME.terracotta,
              color: THEME.white,
              padding: '8px 28px',
              borderRadius: 999,
              fontSize: 26,
              fontWeight: 900,
              marginBottom: 14,
              border: `3.5px solid ${THEME.charcoal}`,
            }}
          >
            🔬 ম্যাক্রো জুম: হাড়ের ভেতরে ৬টি ঝাঁঝরা গর্ত ও ক্যালসিয়াম ক্ষরণ
          </div>

          <svg width="760" height="320" viewBox="0 0 760 320" fill="none">
            <rect
              x="60"
              y="50"
              width="640"
              height="210"
              rx="48"
              fill="#DFD3C3"
              stroke={THEME.charcoal}
              strokeWidth="6"
            />

            {/* 6 Dark Sponge-Like Cavities Popping Open One-by-One Every 10 Frames */}
            {cavities.map((cav, idx) => {
              const cPop = spring({
                frame: Math.max(0, frame - cav.enter),
                fps,
                config: { damping: 11, stiffness: 210 },
              });
              const leakY = ((frame - cav.enter) * 2.4) % 95;
              return (
                <g key={idx}>
                  <circle
                    cx={cav.cx}
                    cy={cav.cy}
                    r={cav.r * cPop}
                    fill="#27272A"
                    stroke={THEME.terracotta}
                    strokeWidth="4"
                  />
                  {/* Leaking Calcium Particles Falling Out */}
                  {frame >= cav.enter && (
                    <g transform={`translate(${cav.cx}, ${cav.cy + leakY})`}>
                      <circle cx="0" cy="0" r="14" fill="#FACC15" stroke={THEME.charcoal} strokeWidth="2.5" />
                      <text x="0" y="5" textAnchor="middle" fontSize="11" fontWeight="900" fill={THEME.charcoal}>
                        Ca²⁺
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </CameraRig>
    );
  }

  // Beats 1, 2, 3: 3-Station Horizontal Stage Pannable by CameraRig (1.6x -> 1.55x -> 1.65x)
  return (
    <CameraRig zoom={zoom} panX={panX} panY={panY}>
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: THEME.bgWarm,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 75,
            width: 1780,
          }}
        >
          {/* STATION 1 (Left): 250px Sedentary Couch/Desk Icon + Pulsing "Mechanical Load / ওজন বহন" Wave Sliced by Red Scissor/Cross-Out */}
          <div
            style={{
              width: 500,
              backgroundColor: THEME.white,
              border: `5px solid ${THEME.charcoal}`,
              borderRadius: 36,
              padding: '28px 32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
            }}
          >
            <div
              style={{
                background: THEME.terracotta,
                color: THEME.white,
                padding: '6px 22px',
                borderRadius: 999,
                fontSize: 22,
                fontWeight: 900,
                marginBottom: 12,
              }}
            >
              USE IT OR LOSE IT ⚠️
            </div>

            {/* 250px Custom SVG Couch/Desk + Pulsing Mechanical Signal Wave + Red Cross-Out */}
            <svg width="340" height="250" viewBox="0 0 340 250" fill="none">
              {/* Couch / Chair SVG */}
              <rect x="45" y="110" width="110" height="75" rx="18" fill="#64748B" stroke={THEME.charcoal} strokeWidth="4.5" />
              <rect x="30" y="145" width="140" height="45" rx="14" fill="#475569" stroke={THEME.charcoal} strokeWidth="4.5" />
              <text x="100" y="155" textAnchor="middle" fontSize="54">
                🪑💻
              </text>

              {/* Pulsing "Mechanical Load / ওজন বহন" Signal Wave */}
              <path
                d={`M 185 140 Q 210 ${110 + Math.sin(frame * 0.25) * 22} 235 140 T 285 140 T 325 140`}
                stroke={THEME.jade}
                strokeWidth="5"
                fill="none"
              />
              <rect x="180" y="52" width="148" height="36" rx="10" fill={THEME.jadeLight} stroke={THEME.jade} strokeWidth="3" />
              <text x="254" y="76" textAnchor="middle" fontSize="17" fontWeight="900" fill={THEME.jade}>
                ওজন বহন সিগন্যাল
              </text>

              {/* Animated Red Scissor / Cross-Out Stroke Slicing Wave */}
              {frame >= 150 && (
                <g>
                  <line
                    x1="180"
                    y1="190"
                    x2="325"
                    y2="90"
                    stroke="#EF4444"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="320"
                    strokeDashoffset={320 - crossOutDraw}
                  />
                  <line
                    x1="180"
                    y1="90"
                    x2="325"
                    y2="190"
                    stroke="#EF4444"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="320"
                    strokeDashoffset={320 - crossOutDraw}
                  />
                  <text x="252" y="152" textAnchor="middle" fontSize="42">
                    ✂️
                  </text>
                </g>
              )}
            </svg>

            <div style={{ fontSize: 24, fontWeight: 900, color: THEME.terracotta, marginTop: 6 }}>
              যান্ত্রিক চাপ = ০% (সংকেত বিচ্ছিন্ন!)
            </div>
          </div>

          {/* STATION 2 (Center): MasonWorker Power-Down (Desaturates to 40% Grey, Drops Trowel, Slumps, 3 Staggered Zzz Bubbles) */}
          <div
            style={{
              width: 460,
              backgroundColor: THEME.white,
              border: `5px solid ${THEME.charcoal}`,
              borderRadius: 36,
              padding: '28px 32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
            }}
          >
            <div
              style={{
                background: '#475569',
                color: THEME.white,
                padding: '6px 22px',
                borderRadius: 999,
                fontSize: 22,
                fontWeight: 900,
                marginBottom: 12,
              }}
            >
              📜 মস্তিষ্কের নোটিশ: ছুটি মঞ্জুর!
            </div>

            <MasonWorker
              scale={1.1}
              state="sleeping"
              desaturate={masonGrey}
              slump={frame >= 480}
            />

            <div style={{ fontSize: 24, fontWeight: 900, color: '#475569', marginTop: 10 }}>
              রাজমিস্ত্রি দল কাজ বন্ধ করে ঘুমাচ্ছে
            </div>
          </div>

          {/* STATION 3 (Right): DemolitionWorker Overdrive (2.2x Speed, Terracotta Glow, Red Speedometer Needle Pinned to MAX) */}
          <div
            style={{
              width: 520,
              backgroundColor: THEME.white,
              border: `5px solid ${THEME.terracotta}`,
              borderRadius: 36,
              padding: '28px 32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 20px 55px rgba(200,75,49,0.25)',
            }}
          >
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              {['🍬 চিনি', '🚬 ধূমপান', '📉 হরমোন ঘাটতি'].map((tag, tIdx) => (
                <span
                  key={tIdx}
                  style={{
                    background: THEME.terracottaLight,
                    color: THEME.terracotta,
                    border: `2.5px solid ${THEME.terracotta}`,
                    padding: '4px 12px',
                    borderRadius: 999,
                    fontSize: 17,
                    fontWeight: 900,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <DemolitionWorker scale={1.1} overdrive={true} />

              {/* Red Speedometer Gauge Pinned to MAX */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <svg width="160" height="120" viewBox="0 0 160 120">
                  <path
                    d="M 20 95 A 60 60 0 0 1 140 95"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 20 95 A 60 60 0 0 1 140 95"
                    fill="none"
                    stroke={THEME.terracotta}
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray="190"
                    strokeDashoffset="30"
                  />
                  {/* Pivoting Needle */}
                  <g transform={`translate(80, 95) rotate(${needleAngle})`}>
                    <polygon points="-5,0 5,0 0,-54" fill={THEME.charcoal} />
                    <circle cx="0" cy="0" r="9" fill={THEME.terracotta} stroke={THEME.charcoal} strokeWidth="3" />
                  </g>
                  <text x="132" y="42" fontSize="16" fontWeight="900" fill={THEME.terracotta}>
                    MAX!
                  </text>
                </svg>
                <span style={{ fontSize: 20, fontWeight: 900, color: THEME.terracotta }}>
                  ভাঙচুর গতি ২.২ গুণ!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CameraRig>
  );
};
