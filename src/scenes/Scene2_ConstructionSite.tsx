import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { DemolitionWorker } from '../characters/DemolitionWorker';
import { MasonWorker } from '../characters/MasonWorker';
import { CameraRig } from '../components/CameraRig';
import { THEME } from '../types';

export const Scene2_ConstructionSite: React.FC = () => {
  const frame = useCurrentFrame(); // Local 0 to 2243 (Global 805 to 3048)
  const { fps } = useVideoConfig();

  // Exact Blueprint Sub-Beats Mapped to Scene 2 Timeline:
  // Beat 1 (Local 0 - 380): Blueprint Grid Unroll & 260px Bone Wall Cross-Section rises from bottom with live "Active Remodeling" radar ring.
  // Beat 2 (Local 380 - 900): 1.6x Zoom on MasonWorker.tsx (250px tall) actively scooping mortar and laying 3 glowing golden bricks one-by-one (ui-pop.wav per brick at local 460, 560, 660).
  // Beat 3 (Local 900 - 1380): Whip-Pan to DemolitionWorker.tsx (1.6x zoom, 250px tall) swinging heavy jackhammer/pickaxe that shatters 3 cracked dark bricks into flying SVG debris (local 980, 1080, 1180).
  // Beat 4 (Local 1380 - 1780): Split-Screen Kinetic Tug-of-War — Diagonal split-screen divider slices between both workers, showing live-ticking counter (+1 গড়া vs. -1 ভাঙা) pulsing on every tool strike.
  // Beat 5 (Local 1780 - 2243): Dynamic Balance Scale Lock-In & Age 30 Twist — Both workers dock onto giant animated seesaw scale in center that tilts back and forth, locks at 100% Balance with green check burst (gentle-chime.wav at 1840), and then at Age 30+ (local 1980+) Mason falls asleep!

  // Camera Zoom Choreography (1.0x -> 1.6x -> 1.6x -> 1.2x -> 1.15x)
  const zoom = interpolate(
    frame,
    [0, 350, 410, 870, 930, 1350, 1410, 1780, 2243],
    [1.12, 1.22, 1.6, 1.6, 1.6, 1.6, 1.15, 1.12, 1.18],
    { extrapolateRight: 'clamp' }
  );

  // Camera Whip-Pan X (Left to Mason at -320, Right to Demolition at +320, Center 0)
  const panX = interpolate(
    frame,
    [0, 350, 410, 870, 930, 1350, 1410, 2243],
    [0, 0, -330, -330, 330, 330, 0, 0],
    { extrapolateRight: 'clamp' }
  );

  const panY = interpolate(
    frame,
    [0, 350, 410, 1350, 1410, 2243],
    [0, 0, -25, -25, 0, 0],
    { extrapolateRight: 'clamp' }
  );

  // Beat 1: Blueprint Grid Unroll & 260px Bone Wall Rise
  const gridUnroll = interpolate(frame, [0, 75], [0, 1920], { extrapolateRight: 'clamp' });
  const boneRise = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 13, stiffness: 150 } });
  const radarAngle = (frame * 4) % 360;

  // Beat 4: Diagonal Split-Screen Tug-of-War (Local 1380 - 1780)
  const isTugOfWar = frame >= 1380 && frame < 1780;
  const strikePulse = 1 + Math.abs(Math.sin(frame * 0.25)) * 0.14;
  const buildTicks = Math.floor(interpolate(frame, [1380, 1760], [12, 48], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const breakTicks = Math.floor(interpolate(frame, [1380, 1760], [10, 32], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

  // Beat 5: Seesaw Scale Lock-In & Age 30 Turn (Local 1780 - 2243)
  const isSeesawPhase = frame >= 1780;
  const isBalanceLocked = frame >= 1840 && frame < 1975;
  const isMasonSleeping = frame >= 1975;

  const seesawTilt = isMasonSleeping
    ? interpolate(frame, [1975, 2060], [0, -10], { extrapolateRight: 'clamp' })
    : isBalanceLocked
    ? 0
    : Math.sin(frame * 0.14) * 7;

  const currentAge = Math.floor(
    interpolate(frame, [1580, 2020], [20, 35], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

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
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Architectural Blueprint Grid Unrolling Across Canvas */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: gridUnroll,
            height: '100%',
            backgroundColor: 'rgba(15, 23, 42, 0.04)',
            backgroundImage:
              'linear-gradient(to right, rgba(30, 58, 138, 0.12) 1.5px, transparent 1.5px), linear-gradient(to bottom, rgba(30, 58, 138, 0.12) 1.5px, transparent 1.5px)',
            backgroundSize: '48px 48px',
            borderRight: gridUnroll < 1920 ? '4px solid #2563EB' : 'none',
            pointerEvents: 'none',
          }}
        />

        {/* Diagonal Split-Screen Tug-of-War Overlay (Local 1380 - 1780) */}
        {isTugOfWar && (
          <div
            style={{
              position: 'absolute',
              top: 115,
              zIndex: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 36,
              background: THEME.charcoal,
              color: THEME.white,
              padding: '14px 44px',
              borderRadius: 999,
              border: `5px solid ${THEME.gold}`,
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ transform: `scale(${strikePulse})`, color: '#4ADE80', fontSize: 38, fontWeight: 900 }}>
              +{buildTicks} গড়া (Build) 🧱
            </div>
            <div
              style={{
                width: 6,
                height: 48,
                backgroundColor: THEME.gold,
                transform: 'rotate(18deg)',
              }}
            />
            <div style={{ transform: `scale(${strikePulse})`, color: '#F87171', fontSize: 38, fontWeight: 900 }}>
              -{breakTicks} ভাঙা (Break) ⛏️
            </div>
          </div>
        )}

        {/* Green Check Balance Lock-In Burst (Local 1840 - 1975) */}
        {isBalanceLocked && (
          <div
            style={{
              position: 'absolute',
              top: 115,
              zIndex: 45,
              background: THEME.jade,
              color: THEME.white,
              padding: '14px 48px',
              borderRadius: 999,
              border: `5px solid ${THEME.white}`,
              fontSize: 36,
              fontWeight: 900,
              boxShadow: '0 18px 45px rgba(16,124,65,0.45)',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <span>✓ ১০০% ব্যালেন্স লকড (বয়স: {currentAge} বছর)</span>
          </div>
        )}

        {/* Age > 30 Warning Banner (Local 1975+) */}
        {isMasonSleeping && (
          <div
            style={{
              position: 'absolute',
              top: 115,
              zIndex: 45,
              background: THEME.terracotta,
              color: THEME.white,
              padding: '14px 48px',
              borderRadius: 999,
              border: `5px solid ${THEME.white}`,
              fontSize: 36,
              fontWeight: 900,
              boxShadow: '0 18px 45px rgba(200,75,49,0.45)',
            }}
          >
            ⚠️ বয়স {currentAge}+ : রাজমিস্ত্রি দল ঘুমিয়ে পড়েছে!
          </div>
        )}

        {/* Main Seesaw / Construction Stage */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: 1580,
            background: 'rgba(255,255,255,0.9)',
            border: `6px solid ${THEME.charcoal}`,
            borderRadius: 44,
            padding: '44px 68px',
            boxShadow: '0 28px 70px rgba(0,0,0,0.12)',
            transform: `translateY(${interpolate(boneRise, [0, 1], [350, 20])}px) rotate(${seesawTilt}deg)`,
            position: 'relative',
          }}
        >
          {/* Diagonal Split-Screen Laser Line during Tug-of-War */}
          {isTugOfWar && (
            <div
              style={{
                position: 'absolute',
                top: -40,
                bottom: -40,
                left: '50%',
                width: 8,
                backgroundColor: THEME.gold,
                transform: 'rotate(14deg)',
                boxShadow: '0 0 24px #FACC15',
                zIndex: 30,
              }}
            />
          )}

          {/* LEFT SIDE: MasonWorker (Osteoblast) + 3 Glowing Golden Bricks Laid One-by-One */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, position: 'relative' }}>
            <div
              style={{
                background: THEME.jade,
                color: THEME.white,
                padding: '10px 28px',
                borderRadius: 18,
                fontSize: 30,
                fontWeight: 900,
                border: `3.5px solid ${THEME.charcoal}`,
                boxShadow: '0 8px 20px rgba(16,124,65,0.3)',
              }}
            >
              রাজমিস্ত্রি দল (Osteoblasts)
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
              <MasonWorker
                scale={1.15}
                state={isMasonSleeping ? 'sleeping' : 'building'}
                desaturate={isMasonSleeping ? 0.5 : 0}
                slump={isMasonSleeping}
              />

              {/* 3 Glowing Golden Bricks Laid One-by-One (Local 460, 560, 660) */}
              <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 10, marginBottom: 18 }}>
                {[0, 1, 2].map((bIdx) => {
                  const enterF = 440 + bIdx * 95;
                  const bPop = spring({
                    frame: Math.max(0, frame - enterF),
                    fps,
                    config: { damping: 11, stiffness: 200 },
                  });
                  return (
                    <div
                      key={bIdx}
                      style={{
                        width: 135,
                        height: 52,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #FEF08A 0%, #F59E0B 100%)',
                        border: `4px solid ${THEME.charcoal}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        fontWeight: 900,
                        color: THEME.charcoal,
                        transform: `scale(${frame >= enterF ? bPop : 0})`,
                        boxShadow: '0 0 22px rgba(245, 158, 11, 0.55)',
                      }}
                    >
                      +১ সিমেন্ট 🧱
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CENTER: 260px Bone Wall Cross-Section + Live "Active Remodeling" Radar Ring */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {/* Rotating Active Remodeling Radar Ring */}
            <div
              style={{
                position: 'relative',
                width: 280,
                height: 280,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="280"
                height="280"
                viewBox="0 0 280 280"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  transform: `rotate(${radarAngle}deg)`,
                }}
              >
                <circle
                  cx="140"
                  cy="140"
                  r="130"
                  fill="none"
                  stroke={isMasonSleeping ? THEME.terracotta : THEME.jade}
                  strokeWidth="6"
                  strokeDasharray="36 18"
                />
                <circle cx="140" cy="10" r="10" fill={THEME.gold} stroke={THEME.charcoal} strokeWidth="3" />
              </svg>

              {/* 260px Bone Wall Matrix */}
              <div
                style={{
                  width: 220,
                  height: 220,
                  backgroundColor: '#E5DEC9',
                  border: `5px solid ${THEME.charcoal}`,
                  borderRadius: 32,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 10,
                  padding: 16,
                  zIndex: 5,
                }}
              >
                {Array.from({ length: 9 }).map((_, i) => {
                  const isFilled = isMasonSleeping ? i < 4 : i < 8;
                  return (
                    <div
                      key={i}
                      style={{
                        backgroundColor: isFilled ? THEME.white : 'rgba(200, 75, 49, 0.25)',
                        border: `3px solid ${isFilled ? THEME.jade : THEME.terracotta}`,
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: 18,
                        color: isFilled ? THEME.jade : THEME.terracotta,
                      }}
                    >
                      {isFilled ? 'Ca²⁺' : 'ক্ষয়'}
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                marginTop: 12,
                background: THEME.charcoal,
                color: '#38BDF8',
                padding: '6px 22px',
                borderRadius: 999,
                fontSize: 20,
                fontWeight: 900,
              }}
            >
              🔄 ACTIVE REMODELING
            </div>
          </div>

          {/* RIGHT SIDE: DemolitionWorker (Osteoclast) + 3 Cracked Dark Bricks Shattering into Debris */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, position: 'relative' }}>
            <div
              style={{
                background: THEME.terracotta,
                color: THEME.white,
                padding: '10px 28px',
                borderRadius: 18,
                fontSize: 30,
                fontWeight: 900,
                border: `3.5px solid ${THEME.charcoal}`,
                boxShadow: '0 8px 20px rgba(200,75,49,0.3)',
              }}
            >
              ভাঙচুর দল (Osteoclasts)
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
              {/* 3 Cracked Dark Bricks Shattering into Flying SVG Debris (Local 960, 1060, 1160) */}
              <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 10, marginBottom: 18, position: 'relative' }}>
                {[0, 1, 2].map((dIdx) => {
                  const shatterFrame = 960 + dIdx * 95;
                  const isShattered = frame >= shatterFrame;
                  const debrisProgress = interpolate(frame - shatterFrame, [0, 35], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  });

                  return (
                    <div key={dIdx} style={{ position: 'relative', width: 135, height: 52 }}>
                      {!isShattered ? (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 12,
                            backgroundColor: '#475569',
                            border: `4px solid ${THEME.charcoal}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FCA5A5',
                            fontSize: 20,
                            fontWeight: 900,
                          }}
                        >
                          পুরোনো হাড় ⚡
                        </div>
                      ) : (
                        /* Shattered Flying SVG Debris Chunks */
                        debrisProgress < 1 && (
                          <svg width="150" height="80" style={{ position: 'absolute', top: -15, left: -10, overflow: 'visible' }}>
                            {[
                              { dx: -45, dy: -35, r: -40 },
                              { dx: 50, dy: -45, r: 55 },
                              { dx: -30, dy: 30, r: -70 },
                              { dx: 45, dy: 25, r: 65 },
                            ].map((frag, fIdx) => (
                              <rect
                                key={fIdx}
                                x={60 + frag.dx * debrisProgress}
                                y={30 + frag.dy * debrisProgress}
                                width={24 * (1 - debrisProgress * 0.5)}
                                height={18 * (1 - debrisProgress * 0.5)}
                                rx="4"
                                fill={THEME.terracotta}
                                stroke={THEME.charcoal}
                                strokeWidth="2.5"
                                opacity={1 - debrisProgress}
                              />
                            ))}
                          </svg>
                        )
                      )}
                    </div>
                  );
                })}
              </div>

              <DemolitionWorker scale={1.15} overdrive={isMasonSleeping} />
            </div>
          </div>
        </div>

        {/* Seesaw Fulcrum Triangle Underneath during Balance Scale Phase */}
        {isSeesawPhase && (
          <svg width="140" height="75" viewBox="0 0 140 75" style={{ marginTop: -8, zIndex: 25 }}>
            <polygon
              points="70,0 135,72 5,72"
              fill={isMasonSleeping ? THEME.terracotta : THEME.gold}
              stroke={THEME.charcoal}
              strokeWidth="6"
            />
          </svg>
        )}
      </div>
    </CameraRig>
  );
};
