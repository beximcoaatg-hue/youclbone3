import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { MasonWorker } from '../characters/MasonWorker';
import { CameraRig } from '../components/CameraRig';
import { THEME } from '../types';

export const Scene5_ThreeSolutions: React.FC = () => {
  const frame = useCurrentFrame(); // Local 0 to 1574 (Global 5557 to 7131)
  const { fps } = useVideoConfig();

  // Exact Blueprint + Voiceover Synced Spotlight-Then-Dock Beats:
  // Note: Voiceover speaks Exercise first (Global 5792 / Local 235), Sunlight/D3/K2 second (Global 6515 / Local 958), and 4 Superfoods third (Global 6879 / Local 1322).
  // Both Exercise (250px Dumbbell + Running Shoes + Cheering MasonWorker) AND Sunlight (250px Rotating Sun + 15-20 Min Clock Dial) AND Superfood Carousel (4 200px Food Icons popping every 12 frames) enter solo at Center Spotlight (1.55x zoom) and then smoothly shrink & dock into their 3-Row Stack!
  // Finally (Local 1475 - 1574): Camera pulls back (1.0x) as 3 green checkmarks draw themselves sequentially down the docked rows with gentle-chime.wav.

  // Camera Zoom (1.55x on Center Spotlight during each item's hero entrance -> 1.0x on Full 3-Row Checklist Sweep)
  const zoom = interpolate(
    frame,
    [0, 180, 235, 620, 720, 955, 1010, 1210, 1280, 1325, 1450, 1495, 1574],
    [1.08, 1.15, 1.52, 1.52, 1.12, 1.12, 1.52, 1.52, 1.12, 1.48, 1.48, 1.0, 1.02],
    { extrapolateRight: 'clamp' }
  );

  const panY = interpolate(
    frame,
    [0, 235, 620, 720, 1010, 1210, 1325, 1450, 1495, 1574],
    [0, 35, 35, 0, 35, 35, 35, 35, -15, -15],
    { extrapolateRight: 'clamp' }
  );

  // Spotlight 1 (Local 220 - 700, then docks to Top Row): Weight-Bearing Stride & 250px Dumbbell + Cheering MasonWorker
  const step1Enter = spring({ frame: Math.max(0, frame - 220), fps, config: { damping: 13, stiffness: 170 } });
  const step1Dock = spring({ frame: Math.max(0, frame - 660), fps, config: { damping: 14, stiffness: 140 } });
  const dumbbellPump = Math.sin(frame * 0.25) * 18;

  // Spotlight 2 (Local 950 - 1250, then docks to Middle Row): 250px Rotating Sun & Animated Clock Dial Sweeping 15-20 Min
  const step2Enter = spring({ frame: Math.max(0, frame - 950), fps, config: { damping: 13, stiffness: 170 } });
  const step2Dock = spring({ frame: Math.max(0, frame - 1230), fps, config: { damping: 14, stiffness: 140 } });
  const clockSweepDeg = interpolate(frame, [965, 1180], [0, 120], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Spotlight 3 (Local 1315 - 1465, then docks to Bottom Row): Staggered Superfood Carousel (4 200px Food Icons popping every 12 frames)
  const step3Enter = spring({ frame: Math.max(0, frame - 1315), fps, config: { damping: 13, stiffness: 170 } });
  const step3Dock = spring({ frame: Math.max(0, frame - 1465), fps, config: { damping: 14, stiffness: 140 } });

  return (
    <CameraRig zoom={zoom} panY={panY}>
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
        {/* Top Action Plan Header */}
        <div
          style={{
            position: 'absolute',
            top: 96,
            background: THEME.charcoal,
            color: THEME.white,
            padding: '12px 42px',
            borderRadius: 999,
            fontSize: 34,
            fontWeight: 900,
            boxShadow: '0 12px 30px rgba(0,0,0,0.14)',
            zIndex: 10,
          }}
        >
          হাড়ের ক্ষয় উল্টে দেওয়ার ৩টি অ্যাকশন প্ল্যান
        </div>

        {/* ========================================================================= */}
        {/* SPOTLIGHT 1 (Before Docking): 250px Dumbbell + Running Shoes + Cheering Mason */}
        {/* ========================================================================= */}
        {frame >= 220 && frame < 720 && (
          <div
            style={{
              position: 'absolute',
              transform: `scale(${step1Enter * (1 - step1Dock * 0.85)})`,
              opacity: 1 - step1Dock,
              background: THEME.white,
              border: `6px solid ${THEME.jade}`,
              borderRadius: 40,
              padding: '32px 54px',
              display: 'flex',
              alignItems: 'center',
              gap: 44,
              boxShadow: '0 30px 80px rgba(16,124,65,0.28)',
              zIndex: 30,
            }}
          >
            {/* 250px Pumping Dumbbell & Running Stride */}
            <div
              style={{
                width: 250,
                height: 250,
                borderRadius: 36,
                backgroundColor: THEME.jadeLight,
                border: `5px solid ${THEME.jade}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `translateY(${dumbbellPump}px)`,
              }}
            >
              <span style={{ fontSize: 86 }}>🏋️‍♂️🏃‍♂️</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: THEME.jade, marginTop: 8 }}>
                ২০ মিনিট হাঁটা ও ওজন
              </span>
            </div>

            <div style={{ maxWidth: 460 }}>
              <div
                style={{
                  display: 'inline-block',
                  background: THEME.jade,
                  color: THEME.white,
                  padding: '6px 20px',
                  borderRadius: 999,
                  fontSize: 22,
                  fontWeight: 900,
                  marginBottom: 10,
                }}
              >
                অ্যাকশন ০১ • মেকানিক্যাল লোড
              </div>
              <div style={{ fontSize: 38, fontWeight: 900, color: THEME.charcoal, lineHeight: 1.25 }}>
                ঘুমন্ত রাজমিস্ত্রিদের জাগাতে হাড়ে চাপ দিন!
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: THEME.charcoalMuted, marginTop: 10 }}>
                দ্রুত হাঁটা, সিঁড়ি ভাঙা ও হালকা ওজন তুললেই নতুন হাড় গড়ার ওয়ার্ক অর্ডার তৈরি হয়।
              </div>
            </div>

            {/* Waking & Cheering MasonWorker */}
            <MasonWorker scale={0.95} state="cheering" />
          </div>
        )}

        {/* ========================================================================= */}
        {/* SPOTLIGHT 2 (Before Docking): 250px Rotating Sun & 15-20 Min Clock Dial     */}
        {/* ========================================================================= */}
        {frame >= 950 && frame < 1290 && (
          <div
            style={{
              position: 'absolute',
              transform: `scale(${step2Enter * (1 - step2Dock * 0.85)})`,
              opacity: 1 - step2Dock,
              background: THEME.white,
              border: `6px solid ${THEME.gold}`,
              borderRadius: 40,
              padding: '34px 58px',
              display: 'flex',
              alignItems: 'center',
              gap: 48,
              boxShadow: '0 30px 80px rgba(224,135,0,0.3)',
              zIndex: 35,
            }}
          >
            {/* 250px Rotating Sun Icon + Sweeping 15-20 Min Clock Dial SVG */}
            <div style={{ position: 'relative', width: 250, height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="250" height="250" viewBox="0 0 250 250">
                {/* Rotating Sun Rays */}
                <g transform={`translate(125, 125) rotate(${(frame * 1.8) % 360})`}>
                  {Array.from({ length: 12 }).map((_, rIdx) => (
                    <rect
                      key={rIdx}
                      x="-8"
                      y="-118"
                      width="16"
                      height="32"
                      rx="8"
                      fill="#FACC15"
                      stroke={THEME.charcoal}
                      strokeWidth="3"
                      transform={`rotate(${rIdx * 30})`}
                    />
                  ))}
                </g>
                {/* Clock Face Inside Sun */}
                <circle cx="125" cy="125" r="82" fill="#FEF9C3" stroke={THEME.charcoal} strokeWidth="5" />
                {/* 15-20 Min Sweeping Wedge */}
                <path
                  d="M 125 125 L 125 52 A 73 73 0 0 1 190 160 Z"
                  fill="rgba(245, 158, 11, 0.45)"
                />
                {/* Sweeping Clock Hand */}
                <g transform={`translate(125, 125) rotate(${clockSweepDeg})`}>
                  <line x1="0" y1="0" x2="0" y2="-62" stroke={THEME.terracotta} strokeWidth="6" strokeLinecap="round" />
                  <circle cx="0" cy="0" r="8" fill={THEME.charcoal} />
                </g>
                <text x="125" y="172" textAnchor="middle" fontSize="22" fontWeight="900" fill={THEME.charcoal}>
                  15–20 MIN
                </text>
              </svg>
            </div>

            <div style={{ maxWidth: 520 }}>
              <div
                style={{
                  display: 'inline-block',
                  background: THEME.gold,
                  color: THEME.white,
                  padding: '6px 20px',
                  borderRadius: 999,
                  fontSize: 22,
                  fontWeight: 900,
                  marginBottom: 10,
                }}
              >
                অ্যাকশন ০২ • গোডাউনের চাবি
              </div>
              <div style={{ fontSize: 38, fontWeight: 900, color: THEME.charcoal, lineHeight: 1.25 }}>
                ১৫–২০ মিনিট রোদ ও ভিটামিন D3 + K2
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: THEME.charcoalMuted, marginTop: 10 }}>
                ভিটামিন D3 গোডাউনের তালা খোলে আর K2 ক্যালসিয়ামকে রক্তনালীতে জমতে না দিয়ে সোজা হাড়ে পাঠায়।
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SPOTLIGHT 3 (Before Docking): 4 x 200px Superfood Icons Every 12 Frames   */}
        {/* ========================================================================= */}
        {frame >= 1315 && frame < 1495 && (
          <div
            style={{
              position: 'absolute',
              transform: `scale(${step3Enter * (1 - step3Dock * 0.85)})`,
              opacity: 1 - step3Dock,
              background: THEME.white,
              border: '6px solid #2563EB',
              borderRadius: 40,
              padding: '32px 48px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 24,
              boxShadow: '0 30px 80px rgba(37,99,235,0.28)',
              zIndex: 40,
            }}
          >
            <div
              style={{
                background: '#2563EB',
                color: THEME.white,
                padding: '6px 24px',
                borderRadius: 999,
                fontSize: 24,
                fontWeight: 900,
              }}
            >
              অ্যাকশন ০৩ • প্রাকৃতিক ক্যালসিয়াম ও কাঁচামাল
            </div>

            <div style={{ display: 'flex', gap: 24 }}>
              {[
                { name: 'কাঁটাসহ ছোট মাছ', icon: '🐟', enter: 1322 },
                { name: 'টক দই', icon: '🥣', enter: 1334 },
                { name: 'তিল ও সবুজ শাক', icon: '🥬', enter: 1346 },
                { name: 'ডিমের কুসুম', icon: '🥚', enter: 1358 },
              ].map((food, fIdx) => {
                const fPop = spring({
                  frame: Math.max(0, frame - food.enter),
                  fps,
                  config: { damping: 11, stiffness: 220 },
                });
                return (
                  <div
                    key={fIdx}
                    style={{
                      width: 200,
                      height: 200,
                      borderRadius: 32,
                      backgroundColor: '#EFF6FF',
                      border: `4.5px solid ${THEME.charcoal}`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: `scale(${frame >= food.enter ? fPop : 0})`,
                      boxShadow: '0 14px 30px rgba(0,0,0,0.08)',
                    }}
                  >
                    <span style={{ fontSize: 76 }}>{food.icon}</span>
                    <span style={{ fontSize: 22, fontWeight: 900, color: THEME.charcoal, marginTop: 10 }}>
                      {food.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DOCKED 3-ROW STACK + SEQUENTIAL SELF-DRAWING GREEN CHECKMARK SWEEP        */}
        {/* ========================================================================= */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            width: 1460,
            marginTop: 30,
            zIndex: 15,
          }}
        >
          {[
            {
              num: '০১',
              title: 'প্রতিদিন ২০ মিনিট দ্রুত হাঁটা, সিঁড়ি ভাঙা ও হালকা ওজন তোলা',
              sub: 'হাড়ে যান্ত্রিক চাপ পড়লেই রাজমিস্ত্রিদের ওয়ার্ক অর্ডার তৈরি হয়',
              icon: '🏃‍♂️🏋️',
              color: THEME.jade,
              bg: THEME.jadeLight,
              dockProgress: step1Dock,
              checkEnter: 1485,
            },
            {
              num: '০২',
              title: '১৫–২০ মিনিট সকালের রোদ এবং ভিটামিন D3 ও K2 নিশ্চিত করা',
              sub: 'হাড়ের গোডাউনের তালা খোলে এবং ক্যালসিয়ামকে সরাসরি হাড়ে পাঠায়',
              icon: '☀️🔑',
              color: THEME.gold,
              bg: THEME.goldLight,
              dockProgress: step2Dock,
              checkEnter: 1505,
            },
            {
              num: '০৩',
              title: 'কাঁটাসহ ছোট মাছ, টক দই, তিল, সবুজ শাক ও ডিম খাওয়া',
              sub: 'প্রাকৃতিক ও জৈব উৎস থেকে হাড়ের আসল কাঁচামাল সরবরাহ করে',
              icon: '🐟🥚',
              color: '#2563EB',
              bg: '#EFF6FF',
              dockProgress: step3Dock,
              checkEnter: 1525,
            },
          ].map((row, rIdx) => {
            const checkDraw = interpolate(frame - row.checkEnter, [0, 22], [0, 80], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });

            return (
              <div
                key={rIdx}
                style={{
                  transform: `scale(${row.dockProgress}) translateY(${(1 - row.dockProgress) * 40}px)`,
                  opacity: row.dockProgress,
                  background: THEME.white,
                  border: `5px solid ${frame >= row.checkEnter ? THEME.jade : row.color}`,
                  borderRadius: 28,
                  padding: '20px 34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 14px 36px rgba(0,0,0,0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  <div
                    style={{
                      width: 110,
                      height: 110,
                      borderRadius: 24,
                      backgroundColor: row.bg,
                      border: `3.5px solid ${row.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 46,
                    }}
                  >
                    {row.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: THEME.charcoal }}>
                      {row.num}. {row.title}
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: THEME.charcoalMuted, marginTop: 4 }}>
                      {row.sub}
                    </div>
                  </div>
                </div>

                {/* Self-Drawing Green Checkmark SVG on Final Sweep */}
                <div
                  style={{
                    width: 78,
                    height: 78,
                    borderRadius: '50%',
                    backgroundColor: frame >= row.checkEnter ? THEME.jade : '#F1F5F9',
                    border: `4px solid ${THEME.charcoal}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {frame >= row.checkEnter && (
                    <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
                      <path
                        d="M 10 24 L 20 34 L 37 13"
                        stroke="#FFFFFF"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="80"
                        strokeDashoffset={80 - checkDraw}
                      />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CameraRig>
  );
};
