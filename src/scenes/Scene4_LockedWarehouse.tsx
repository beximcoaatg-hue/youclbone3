import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraRig } from '../components/CameraRig';
import { THEME } from '../types';

export const Scene4_LockedWarehouse: React.FC = () => {
  const frame = useCurrentFrame(); // Local 0 to 938 (Global 4618 to 5556)
  const { fps } = useVideoConfig();

  // Exact Blueprint Sub-Beats Mapped to Scene 4 Timeline:
  // Beat 1 (Local 0 - 180): Macro Zoom (1.65x) on Steel Bone Vault & 240px Heavy Padlock slamming shut with metallic chains wrapping around it (lock-click.wav).
  // Beat 2 (Local 180 - 380): Calcium Particle Collision Physics — Stream of 70px glowing Calcium orbs flies in from left, collides with locked vault door, sparks red impact rings, and bounces backward into a rising pile (plus Kidney/Artery Stone danger callout).
  // Beat 3 (Local 380 - 560): Hero Vitamin D3 Sun-Key Flight — Camera tracks a 240px radiant Sun badge morphing into a Golden D3 Key that flies along a curved Bezier arc straight into the keyhole.
  // Beat 4 (Local 560 - 740): 90-Degree Key Turn & Vault Door Slide — Golden Key rotates 90deg (lock-click.wav), shatters the red chains, and slides heavy vault doors open to reveal bone interior.
  // Beat 5 (Local 740 - 938): Vitamin K2 Traffic Officer & Laser Funnel — 240px Vitamin K2 Traffic Officer icon pops into center spotlight (ui-pop.wav), blowing whistle and projecting glowing green conveyor beam that sweeps all waiting Calcium orbs inside!

  // Camera Zoom Choreography (1.65x -> 1.3x -> 1.45x -> 1.35x -> 1.25x)
  const zoom = interpolate(
    frame,
    [0, 30, 170, 210, 370, 410, 550, 590, 730, 770, 938],
    [1.1, 1.65, 1.65, 1.28, 1.28, 1.48, 1.48, 1.35, 1.35, 1.28, 1.28],
    { extrapolateRight: 'clamp' }
  );

  const panX = interpolate(
    frame,
    [0, 170, 210, 370, 410, 550, 590, 938],
    [0, 0, 110, 110, -180, 0, 0, 0],
    { extrapolateRight: 'clamp' }
  );

  // Beat 1: Padlock Slam & Chains
  const padlockSlam = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 10, stiffness: 220 } });
  const isUnlocked = frame >= 590;
  const doorSlidePx = interpolate(frame, [605, 700], [0, 165], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Beat 3 & 4: Radiant Sun Morphing into Golden D3 Key + Bezier Flight + 90deg Rotation
  const sunKeyPop = spring({ frame: Math.max(0, frame - 380), fps, config: { damping: 12, stiffness: 180 } });
  const keyFlight = interpolate(frame, [420, 555], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // Bezier curve coordinates from Right Spotlight (x: 420, y: -120) to Vault Keyhole (x: 0, y: 15)
  const bezierT = keyFlight;
  const keyX = (1 - bezierT) * (1 - bezierT) * 440 + 2 * (1 - bezierT) * bezierT * 220 + bezierT * bezierT * 0;
  const keyY = (1 - bezierT) * (1 - bezierT) * -80 + 2 * (1 - bezierT) * bezierT * -240 + bezierT * bezierT * 15;
  const keyTurnDeg = interpolate(frame, [560, 600], [0, 90], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Beat 5: 240px Vitamin K2 Traffic Officer & Green Conveyor Funnel
  const k2OfficerPop = spring({
    frame: Math.max(0, frame - 740),
    fps,
    config: { damping: 12, stiffness: 190 },
  });

  return (
    <CameraRig zoom={zoom} panX={panX} shakeFrames={[10, 590]} shakeIntensity={15}>
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: THEME.bgWarm,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* LEFT: Stream of 70px Glowing Calcium Orbs Colliding / Piling Up / Swept Inside by K2 Conveyor Beam */}
        <div
          style={{
            position: 'absolute',
            left: 140,
            top: 260,
            width: 520,
            height: 520,
            zIndex: 25,
            pointerEvents: 'none',
          }}
        >
          {/* Green Laser Conveyor Beam when K2 Officer is Active (Frame 740+) */}
          {frame >= 740 && (
            <svg width="650" height="300" style={{ position: 'absolute', top: 90, left: 20, overflow: 'visible' }}>
              <path
                d="M 40 160 L 620 120"
                stroke="#4ADE80"
                strokeWidth="54"
                strokeLinecap="round"
                opacity={0.28}
              />
              <path
                d="M 40 160 L 620 120"
                stroke={THEME.jade}
                strokeWidth="8"
                strokeDasharray="24 16"
                strokeDashoffset={-frame * 6}
              />
            </svg>
          )}

          {/* 5 Glowing 70px Calcium Orbs */}
          {[0, 1, 2, 3, 4].map((orbIdx) => {
            const enterOrb = 180 + orbIdx * 28;
            if (frame < enterOrb) return null;

            // Before unlock: fly toward door (x: 420), collide, spark red ring, bounce back into pile
            const localF = frame - enterOrb;
            const hitTime = 26;
            let orbX = 0;
            let orbY = 180;

            if (frame < 740) {
              if (localF <= hitTime) {
                orbX = interpolate(localF, [0, hitTime], [0, 410]);
                orbY = interpolate(localF, [0, hitTime], [140 + (orbIdx % 2) * 30, 190]);
              } else {
                const bounceT = Math.min(1, (localF - hitTime) / 30);
                const pileX = 110 + (orbIdx % 3) * 78;
                const pileY = 270 - Math.floor(orbIdx / 3) * 74;
                orbX = interpolate(bounceT, [0, 1], [410, pileX]);
                orbY = interpolate(bounceT, [0, 0.5, 1], [190, 110, pileY]);
              }
            } else {
              // Frame 740+: Swept straight into unlocked Bone Vault by K2 Conveyor Beam!
              const sweepT = interpolate(frame - (745 + orbIdx * 18), [0, 45], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              const startX = 110 + (orbIdx % 3) * 78;
              const startY = 270 - Math.floor(orbIdx / 3) * 74;
              orbX = interpolate(sweepT, [0, 1], [startX, 620]);
              orbY = interpolate(sweepT, [0, 1], [startY, 195]);
            }

            const isColliding = frame < 590 && Math.abs(localF - hitTime) <= 5;

            return (
              <div key={orbIdx}>
                {/* Red Collision Impact Ring */}
                {isColliding && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 410,
                      top: 175,
                      width: 110,
                      height: 110,
                      borderRadius: '50%',
                      border: `6px solid ${THEME.terracotta}`,
                      transform: 'translate(-50%, -50%) scale(1.25)',
                      boxShadow: '0 0 30px #EF4444',
                    }}
                  />
                )}

                {/* 70px Glowing Calcium Orb */}
                <div
                  style={{
                    position: 'absolute',
                    left: orbX,
                    top: orbY,
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 30% 30%, #FEF08A, #F59E0B)',
                    border: `4px solid ${THEME.charcoal}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    fontWeight: 900,
                    color: THEME.charcoal,
                    boxShadow: '0 8px 20px rgba(245,158,11,0.45)',
                  }}
                >
                  Ca²⁺
                </div>
              </div>
            );
          })}

          {/* Piling Up Warning (Kidney & Artery Stone Calcification) during Collision Phase */}
          {frame >= 260 && frame < 740 && (
            <div
              style={{
                position: 'absolute',
                top: 365,
                left: 10,
                background: THEME.terracotta,
                color: THEME.white,
                padding: '12px 24px',
                borderRadius: 20,
                border: `4px solid ${THEME.charcoal}`,
                fontSize: 22,
                fontWeight: 900,
                boxShadow: '0 12px 30px rgba(200,75,49,0.4)',
                width: 440,
              }}
            >
              ⚠️ বাইরে জমে কিডনি ও রক্তনালীতে পাথর তৈরি করে!
            </div>
          )}
        </div>

        {/* CENTER: Massive Steel Bone Vault Door + Metallic Chains + 240px Heavy Padlock */}
        <div
          style={{
            width: 540,
            height: 520,
            backgroundColor: '#0F172A',
            borderRadius: 44,
            border: `7px solid ${THEME.charcoal}`,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
            zIndex: 15,
          }}
        >
          {/* Glowing Bone Interior Revealed When Vault Doors Slide Open */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle, #ECFDF5 0%, #10B981 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 110 }}>🦴</span>
            <span style={{ fontSize: 30, fontWeight: 900, color: THEME.charcoal, marginTop: 8 }}>
              হাড়ের ভেতরে ক্যালসিয়াম শোষিত!
            </span>
          </div>

          {/* Left Sliding Steel Vault Door */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: '50%',
              backgroundColor: '#334155',
              borderRight: `4px solid ${THEME.charcoal}`,
              transform: `translateX(${-doorSlidePx}px)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />

          {/* Right Sliding Steel Vault Door */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              width: '50%',
              backgroundColor: '#334155',
              borderLeft: `4px solid ${THEME.charcoal}`,
              transform: `translateX(${doorSlidePx}px)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />

          {/* Top Vault Header */}
          <div
            style={{
              position: 'absolute',
              top: 24,
              background: THEME.charcoal,
              color: THEME.white,
              padding: '8px 28px',
              borderRadius: 999,
              fontSize: 26,
              fontWeight: 900,
              zIndex: 20,
              border: '2px solid #94A3B8',
            }}
          >
            🏦 হাড়ের ক্যালসিয়াম গোডাউন
          </div>

          {/* Metallic Chains Wrapped Around Vault (Shatter at Frame 590) */}
          {!isUnlocked && (
            <svg width="540" height="520" style={{ position: 'absolute', top: 0, left: 0, zIndex: 18 }}>
              <line x1="0" y1="120" x2="540" y2="420" stroke="#94A3B8" strokeWidth="18" strokeDasharray="28 10" />
              <line x1="0" y1="420" x2="540" y2="120" stroke="#CBD5E1" strokeWidth="18" strokeDasharray="28 10" />
            </svg>
          )}

          {/* 240px Heavy Padlock in Center of Vault */}
          {frame < 640 && (
            <div
              style={{
                width: 210,
                height: 240,
                backgroundColor: isUnlocked ? THEME.jade : THEME.terracotta,
                borderRadius: 36,
                border: `7px solid ${THEME.white}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transform: `scale(${padlockSlam * (frame >= 615 ? 1 - (frame - 615) / 25 : 1)})`,
                boxShadow: '0 20px 50px rgba(0,0,0,0.55)',
                zIndex: 22,
              }}
            >
              {/* Padlock Shackle */}
              <div
                style={{
                  position: 'absolute',
                  top: -74,
                  width: 116,
                  height: 86,
                  borderRadius: '58px 58px 0 0',
                  border: '18px solid #E2E8F0',
                  borderBottom: 'none',
                  transform: isUnlocked ? 'translateY(-22px) rotate(-18deg)' : 'none',
                }}
              />
              <span style={{ fontSize: 78 }}>{isUnlocked ? '🔓' : '🔒'}</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: THEME.white, marginTop: 6 }}>
                {isUnlocked ? 'UNLOCKED!' : 'LOCKED'}
              </span>
            </div>
          )}
        </div>

        {/* HERO 3: 240px Radiant Sun Morphing into Golden D3 Key & Flying Along Curved Bezier Arc into Keyhole */}
        {frame >= 380 && frame < 635 && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(${keyX}px, ${keyY}px) scale(${sunKeyPop}) rotate(${keyTurnDeg}deg)`,
              zIndex: 35,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            {frame < 460 && (
              <div
                style={{
                  background: THEME.goldLight,
                  border: `4px solid ${THEME.gold}`,
                  borderRadius: 999,
                  padding: '6px 24px',
                  fontSize: 26,
                  fontWeight: 900,
                  color: THEME.gold,
                  marginBottom: 8,
                  whiteSpace: 'nowrap',
                }}
              >
                ☀️ ভিটামিন D3 মাস্টার চাবি
              </div>
            )}
            <div
              style={{
                width: 220,
                height: 220,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #FEF08A 0%, #F59E0B 70%)',
                border: `6px solid ${THEME.charcoal}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 105,
                boxShadow: '0 0 55px rgba(245, 158, 11, 0.8)',
              }}
            >
              {frame < 425 ? '☀️' : '🔑'}
            </div>
          </div>
        )}

        {/* HERO 4 (Frame 740+): 240px Vitamin K2 Traffic Officer Icon with Whistle & Green Conveyor Funnel */}
        {frame >= 740 && (
          <div
            style={{
              position: 'absolute',
              right: 110,
              top: 260,
              transform: `scale(${k2OfficerPop})`,
              zIndex: 35,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: THEME.white,
              border: `6px solid ${THEME.jade}`,
              borderRadius: 36,
              padding: '24px 32px',
              boxShadow: '0 24px 60px rgba(16,124,65,0.3)',
            }}
          >
            <div
              style={{
                background: THEME.jade,
                color: THEME.white,
                padding: '6px 22px',
                borderRadius: 999,
                fontSize: 24,
                fontWeight: 900,
                marginBottom: 12,
              }}
            >
              👮 ভিটামিন K2 ট্রাফিক গার্ড
            </div>

            <div
              style={{
                width: 220,
                height: 220,
                borderRadius: '50%',
                backgroundColor: THEME.jadeLight,
                border: `5px solid ${THEME.charcoal}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <span style={{ fontSize: 92 }}>👮‍♂️</span>
              <span
                style={{
                  position: 'absolute',
                  bottom: 14,
                  right: -10,
                  background: THEME.gold,
                  color: THEME.charcoal,
                  border: `3px solid ${THEME.charcoal}`,
                  padding: '4px 12px',
                  borderRadius: 999,
                  fontSize: 18,
                  fontWeight: 900,
                }}
              >
                📢 বাঁশি: হাড়ে ঢুকুন!
              </span>
            </div>

            <div style={{ fontSize: 22, fontWeight: 900, color: THEME.jade, marginTop: 12 }}>
              ক্যালসিয়ামকে সরাসরি হাড়ে পাঠায়
            </div>
          </div>
        )}
      </div>
    </CameraRig>
  );
};
