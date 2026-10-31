import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraRig } from '../components/CameraRig';
import { StampBadge } from '../components/StampBadge';
import { THEME } from '../types';

export const Scene1_ParadoxHook: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 804 (0:00 to 0:13.4)
  const { fps } = useVideoConfig();

  // Exact Blueprint Sub-Beats (60fps):
  // 1) 0:00 - 0:02 (Frames 0 - 120): Whip-Zoom Hero Milk Glass (1.6x, 260px, liquid sloshing, 56px Bangla label sliding out from behind)
  // 2) 0:02 - 0:04 (Frames 120 - 240): Spotlight Dock & Calcium Pill Pop (Milk Glass docks left, whip-pan right 1.6x, 260px rotating Calcium Tablet + orbiting sparkles)
  // 3) 0:04 - 0:07 (Frames 240 - 420): Self-Drawing Energy Stream to Bone (Camera pulls back 1.15x, golden SVG stream self-draws from milk & pill into 280px Bone X-Ray scanner)
  // 4) 0:07 - 0:10 (Frames 420 - 600): Live X-Ray Scan & Fracture Propagation (Laser scan bar sweeps, live counter drops 100% -> 58%, red SVG micro-cracks branch outward)
  // 5) 0:10 - 0:14 (Frames 600 - 804): Stamp Slam, Dutch Tilt & Question Burst (StampBadge slams across fractured bone, camera tilts -2.5deg with 6-frame shake, 3 oversized ? badges pop every 12 frames)
  // Note: Also honors the voiceover's "একদম ভুল!" shock accent at Frame 258 with a Stamp flash!

  // Camera Zoom Choreography
  const cameraZoom = interpolate(
    frame,
    [0, 18, 110, 132, 230, 258, 415, 435, 595, 615, 804],
    [1.0, 1.6, 1.6, 1.6, 1.6, 1.15, 1.15, 1.38, 1.38, 1.28, 1.32],
    { extrapolateRight: 'clamp' }
  );

  // Camera Whip-Pan X
  const panX = interpolate(
    frame,
    [0, 110, 132, 230, 255, 804],
    [0, 0, -240, -240, 0, 0],
    { extrapolateRight: 'clamp' }
  );

  // Camera Pan Y
  const panY = interpolate(
    frame,
    [0, 230, 258, 420, 804],
    [40, 40, -20, -35, -35],
    { extrapolateRight: 'clamp' }
  );

  // Dutch Tilt (-2.5deg on Stamp Slam at 258 & 600)
  const cameraTilt =
    (frame >= 258 && frame < 338) || frame >= 600
      ? -2.5
      : Math.sin(frame * 0.04) * 0.4;

  // 1) Milk Glass Springs & Sloshing
  const milkPop = spring({ frame, fps, config: { damping: 12, stiffness: 180 } });
  const labelSlide = spring({ frame: Math.max(0, frame - 14), fps, config: { damping: 14, stiffness: 170 } });
  const milkSlosh = Math.sin((frame * 2 * Math.PI) / 28) * 10;

  // Dock transition for Milk & Pill when X-Ray Scanner appears at Frame 240
  const dockProgress = spring({
    frame: Math.max(0, frame - 235),
    fps,
    config: { damping: 14, stiffness: 140 },
  });

  const milkX = interpolate(frame, [0, 110, 132, 235, 270], [0, 0, -310, -310, -520], {
    extrapolateRight: 'clamp',
  });
  const milkY = interpolate(dockProgress, [0, 1], [0, -140]);
  const milkScale = interpolate(dockProgress, [0, 1], [1.0, 0.46]); // 260px -> ~120px docked

  // 2) Calcium Pill Springs & 3D Perspective Rotation
  const pillPop = spring({
    frame: Math.max(0, frame - 120),
    fps,
    config: { damping: 12, stiffness: 190 },
  });
  const pillX = interpolate(dockProgress, [0, 1], [240, 520]);
  const pillY = interpolate(dockProgress, [0, 1], [0, -140]);
  const pillScale = interpolate(dockProgress, [0, 1], [1.0, 0.46]);
  const pillRotY = Math.sin((frame - 120) * 0.12) * 32;
  const pillRotZ = ((frame - 120) * 2.2) % 360;

  // 3) Self-Drawing Golden Energy Stream (Frames 240 - 420)
  const streamDraw = interpolate(frame, [245, 360], [0, 600], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const streamDashOffset = -frame * 4; // Continuous flowing loop

  // 4) Central 280px Bone X-Ray Scanner & Fracture Propagation
  const scannerPop = spring({
    frame: Math.max(0, frame - 240),
    fps,
    config: { damping: 13, stiffness: 160 },
  });
  const laserY = interpolate(frame % 75, [0, 75], [24, 256]);
  const boneDensity = Math.round(
    interpolate(frame, [420, 595], [100, 58], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const crackProgress = interpolate(frame, [430, 590], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <CameraRig
      zoom={cameraZoom}
      panX={panX}
      panY={panY}
      rotation={cameraTilt}
      shakeFrames={[258, 600]}
      shakeIntensity={16}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: THEME.bgWarm,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Subtle Moving Background Grid */}
        <svg
          width="1920"
          height="1080"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: 0.12,
            transform: `translate(${(frame * 0.6) % 60}px, ${(frame * 0.4) % 60}px)`,
          }}
        >
          <defs>
            <pattern id="s1Grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke={THEME.charcoal} strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="1920" height="1080" fill="url(#s1Grid)" />
        </svg>

        {/* Self-Drawing Golden SVG Energy Streams from Docked Milk & Pill into Bone Scanner */}
        {frame >= 240 && (
          <svg
            width="1920"
            height="1080"
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 5 }}
          >
            {/* Left Stream (Milk -> Bone Scanner) */}
            <path
              d="M 480 390 C 640 390, 700 520, 820 520"
              fill="none"
              stroke={THEME.gold}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="600"
              strokeDashoffset={600 - streamDraw}
              opacity={0.45}
            />
            {frame >= 290 && (
              <path
                d="M 480 390 C 640 390, 700 520, 820 520"
                fill="none"
                stroke="#FACC15"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="16 14"
                strokeDashoffset={streamDashOffset}
              />
            )}

            {/* Right Stream (Calcium Pill -> Bone Scanner) */}
            <path
              d="M 1440 390 C 1280 390, 1220 520, 1100 520"
              fill="none"
              stroke={THEME.gold}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="600"
              strokeDashoffset={600 - streamDraw}
              opacity={0.45}
            />
            {frame >= 290 && (
              <path
                d="M 1440 390 C 1280 390, 1220 520, 1100 520"
                fill="none"
                stroke="#FACC15"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="16 14"
                strokeDashoffset={-streamDashOffset}
              />
            )}
          </svg>
        )}

        {/* HERO 1: 260px Milk Glass with Sloshing Liquid & 56px Bangla Label */}
        <div
          style={{
            position: 'absolute',
            transform: `translate(${milkX}px, ${milkY}px) scale(${milkPop * milkScale})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 15,
          }}
        >
          {/* 56px Bold Bangla Label Sliding Out From Behind */}
          <div
            style={{
              transform: `translateY(${interpolate(labelSlide, [0, 1], [90, -14])}px) scale(${labelSlide})`,
              opacity: labelSlide,
              background: THEME.white,
              border: `5px solid ${THEME.charcoal}`,
              borderRadius: 999,
              padding: '10px 36px',
              fontSize: 56,
              fontWeight: 900,
              color: THEME.charcoal,
              boxShadow: '0 14px 32px rgba(0,0,0,0.14)',
              whiteSpace: 'nowrap',
              marginBottom: 8,
            }}
          >
            🥛 খাঁটি দুধ ও ক্যালসিয়াম
          </div>

          <svg width="260" height="260" viewBox="0 0 260 260" fill="none">
            <path
              d="M 50 25 L 70 235 C 72 248, 188 248, 190 235 L 210 25 Z"
              fill="rgba(255,255,255,0.82)"
              stroke={THEME.charcoal}
              strokeWidth="6.5"
            />
            <path
              d={`M 58 78 Q 130 ${72 + milkSlosh} 202 78 L 185 230 C 183 240, 77 240, 75 230 Z`}
              fill="#FFFFFF"
            />
            <ellipse
              cx="130"
              cy={78 + milkSlosh * 0.45}
              rx="72"
              ry="15"
              fill="#F1F5F9"
              stroke={THEME.charcoal}
              strokeWidth="4"
            />
            <circle cx="130" cy="158" r="42" fill={THEME.jadeLight} stroke={THEME.jade} strokeWidth="4.5" />
            <text x="130" y="168" textAnchor="middle" fontSize="28" fontWeight="900" fill={THEME.jade}>
              Ca²⁺
            </text>
          </svg>
        </div>

        {/* HERO 2: 260px Glowing Calcium Tablet Rotating in 3D Perspective + Orbiting Sparkles */}
        {frame >= 118 && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(${pillX}px, ${pillY}px) scale(${pillPop * pillScale})`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 15,
            }}
          >
            <div
              style={{
                background: THEME.goldLight,
                border: `5px solid ${THEME.gold}`,
                borderRadius: 999,
                padding: '10px 36px',
                fontSize: 52,
                fontWeight: 900,
                color: THEME.gold,
                boxShadow: '0 14px 32px rgba(224,135,0,0.2)',
                whiteSpace: 'nowrap',
                marginBottom: 12,
              }}
            >
              💊 মুঠো মুঠো ট্যাবলেট
            </div>

            <div style={{ position: 'relative', width: 260, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Orbiting Sparkle Particles */}
              {[0, 1, 2, 3, 4, 5].map((sp) => {
                const angle = (frame * 0.06) + (sp * Math.PI) / 3;
                const rx = Math.cos(angle) * 122;
                const ry = Math.sin(angle) * 122;
                return (
                  <div
                    key={sp}
                    style={{
                      position: 'absolute',
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      backgroundColor: sp % 2 === 0 ? '#FACC15' : '#38BDF8',
                      border: `3px solid ${THEME.charcoal}`,
                      transform: `translate(${rx}px, ${ry}px) scale(${0.8 + Math.sin(frame * 0.2 + sp) * 0.3})`,
                      boxShadow: '0 0 16px #FACC15',
                    }}
                  />
                );
              })}

              {/* 260px 3D-Perspective Tablet */}
              <div
                style={{
                  width: 220,
                  height: 220,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, #FEF9C3 0%, #FACC15 55%, #CA8A04 100%)',
                  border: `7px solid ${THEME.charcoal}`,
                  boxShadow: `14px 18px 0px ${THEME.charcoal}, 0 0 50px rgba(250, 204, 21, 0.65)`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `perspective(600px) rotateY(${pillRotY}deg) rotateZ(${pillRotZ * 0.15}deg)`,
                }}
              >
                <span style={{ fontSize: 56, fontWeight: 900, color: THEME.charcoal, lineHeight: 1 }}>Ca²⁺</span>
                <span style={{ fontSize: 28, fontWeight: 900, color: THEME.charcoal, marginTop: 4 }}>500 mg</span>
              </div>
            </div>
          </div>
        )}

        {/* HERO 3: Central 280px Bone X-Ray Scanner + Live Counter (100% -> 58%) + Branching Micro-Cracks */}
        {frame >= 240 && (
          <div
            style={{
              transform: `translateY(55px) scale(${scannerPop})`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 20,
              position: 'relative',
            }}
          >
            {/* 280px Tall X-Ray Scanner Viewport */}
            <div
              style={{
                width: 660,
                height: 280,
                backgroundColor: '#0F172A',
                borderRadius: 36,
                border: `6px solid ${THEME.charcoal}`,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 26px 65px rgba(0,0,0,0.32)',
              }}
            >
              {/* Sweeping Horizontal Laser Scan Bar */}
              <div
                style={{
                  position: 'absolute',
                  top: laserY,
                  left: 0,
                  right: 0,
                  height: 6,
                  background: 'linear-gradient(90deg, transparent, #38BDF8, #FFFFFF, #38BDF8, transparent)',
                  boxShadow: '0 0 24px #38BDF8, 0 0 45px #0284C7',
                  zIndex: 25,
                }}
              />

              {/* Bone Shaft & Branching Red SVG Micro-Cracks */}
              <svg width="580" height="230" viewBox="0 0 580 230" fill="none">
                <path
                  d="M 90 65 C 58 25, 18 52, 18 92 C 18 132, 58 148, 95 128 L 485 128 C 522 148, 562 132, 562 92 C 562 52, 522 25, 490 65 C 470 90, 448 90, 428 76 L 152 76 C 132 90, 110 90, 90 65 Z"
                  fill={boneDensity < 75 ? '#E2D9C8' : '#FFFFFF'}
                  stroke="#38BDF8"
                  strokeWidth="5"
                />

                {/* Termite-wood porous holes */}
                {crackProgress > 0.1 && (
                  <g opacity={crackProgress}>
                    <circle cx="195" cy="102" r={16 * crackProgress} fill="#334155" />
                    <circle cx="285" cy="100" r={22 * crackProgress} fill="#1E293B" />
                    <circle cx="375" cy="104" r={18 * crackProgress} fill="#334155" />
                    <circle cx="240" cy="112" r={13 * crackProgress} fill="#0F172A" />
                    <circle cx="335" cy="110" r={15 * crackProgress} fill="#0F172A" />
                  </g>
                )}

                {/* Branching Red Micro-Cracks */}
                {crackProgress > 0 && (
                  <g>
                    <path
                      d="M 285 76 L 272 96 L 294 110 L 280 128"
                      stroke="#EF4444"
                      strokeWidth="5.5"
                      strokeLinecap="round"
                      strokeDasharray="120"
                      strokeDashoffset={120 * (1 - crackProgress)}
                    />
                    <path
                      d="M 272 96 L 235 108 L 210 100"
                      stroke="#EF4444"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="90"
                      strokeDashoffset={90 * (1 - crackProgress)}
                    />
                    <path
                      d="M 294 110 L 340 98 L 370 112"
                      stroke="#EF4444"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="90"
                      strokeDashoffset={90 * (1 - crackProgress)}
                    />
                  </g>
                )}
              </svg>

              {/* Top-Left X-Ray HUD Label */}
              <div
                style={{
                  position: 'absolute',
                  top: 16,
                  left: 22,
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '2px solid #38BDF8',
                  borderRadius: 12,
                  padding: '6px 16px',
                  color: '#38BDF8',
                  fontSize: 20,
                  fontWeight: 900,
                }}
              >
                🦴 BONE X-RAY SCANNER
              </div>
            </div>

            {/* Live Bone Density Counter (100% -> 58%) */}
            <div
              style={{
                marginTop: 18,
                background: THEME.white,
                border: `5px solid ${boneDensity < 70 ? THEME.terracotta : THEME.charcoal}`,
                borderRadius: 24,
                padding: '12px 42px',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                boxShadow: '0 14px 34px rgba(0,0,0,0.12)',
              }}
            >
              <span style={{ fontSize: 32, fontWeight: 900, color: THEME.charcoal }}>
                হাড়ের ঘনত্ব (Density):
              </span>
              <span
                style={{
                  fontSize: 48,
                  fontWeight: 900,
                  color: boneDensity < 70 ? THEME.terracotta : THEME.jade,
                }}
              >
                {boneDensity}% {boneDensity <= 65 ? '📉 (ঝাঁঝরা কাঠ!)' : ''}
              </span>
            </div>

            {/* Stamp Slam Overlay (Frames 258-338 AND Frames 600-804) */}
            {((frame >= 258 && frame < 338) || frame >= 600) && (
              <div
                style={{
                  position: 'absolute',
                  top: 38,
                  zIndex: 40,
                }}
              >
                <StampBadge
                  text="একদম ভুল!"
                  type="reject"
                  subtext="শুধু ক্যালসিয়ামে হাড় ক্ষয় থামে না!"
                  size="large"
                />
              </div>
            )}

            {/* 3 Oversized '?' Badges Popping In One-by-One Every 12 Frames (600, 612, 624) */}
            {frame >= 600 &&
              [
                { enter: 600, x: -380, y: -90, rot: -14 },
                { enter: 612, x: 380, y: -80, rot: 15 },
                { enter: 624, x: 0, y: -175, rot: -6 },
              ].map((q, idx) => {
                const qPop = spring({
                  frame: Math.max(0, frame - q.enter),
                  fps,
                  config: { damping: 10, stiffness: 220 },
                });
                const qFloat = Math.sin((frame + idx * 20) * 0.12) * 8;
                return (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      top: 90,
                      transform: `translate(${q.x}px, ${q.y + qFloat}px) scale(${qPop}) rotate(${q.rot}deg)`,
                      width: 118,
                      height: 118,
                      borderRadius: '50%',
                      backgroundColor: THEME.terracotta,
                      border: `5px solid ${THEME.white}`,
                      color: THEME.white,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 68,
                      fontWeight: 900,
                      boxShadow: '0 16px 36px rgba(200,75,49,0.45)',
                      zIndex: 45,
                    }}
                  >
                    ❓
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </CameraRig>
  );
};
