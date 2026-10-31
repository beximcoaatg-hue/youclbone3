import React, { useEffect, useState } from 'react';
import { Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, delayRender, continueRender, cancelRender } from 'remotion';
import '../public/fonts/fonts.css';
import { HeaderPill } from './components/HeaderPill';
import { ProgressBar } from './components/ProgressBar';
import { SubtitleCard } from './components/SubtitleCard';
import { Scene1_ParadoxHook } from './scenes/Scene1_ParadoxHook';
import { Scene2_ConstructionSite } from './scenes/Scene2_ConstructionSite';
import { Scene3_UseItOrLoseIt } from './scenes/Scene3_UseItOrLoseIt';
import { Scene4_LockedWarehouse } from './scenes/Scene4_LockedWarehouse';
import { Scene5_ThreeSolutions } from './scenes/Scene5_ThreeSolutions';
import { Scene6_EpigramOutro } from './scenes/Scene6_EpigramOutro';
import { SUBTITLES } from './subtitles';
import { CompositionProps } from './types';

export const RemotionVideo: React.FC<CompositionProps> = ({ enableAudio = true }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;
  const [fontHandle] = useState(() => delayRender('Loading Hind Siliguri'));

  useEffect(() => {
    Promise.all(
      [400, 500, 600, 700].map(async (weight) => {
        const fonts = await document.fonts.load(
          `${weight} 32px "Hind Siliguri"`,
          'বাংলা EduTalk'
        );
        if (fonts.length === 0) {
          throw new Error(`Hind Siliguri ${weight} is missing`);
        }
      }).concat(
        document.fonts.load('400 32px "Noto Emoji"', '💊🔒🔓🔑🚶☀️🐟🏭🧠⚡★♂✔🏃🏋🥚✓✗➔🍬💻📉📜🚬🪑⚠⛔🏦❓🥛🦴👮📢✂️📡🥣🥬⭐').then((fonts) => {
          if (fonts.length === 0) throw new Error('Noto Emoji is missing');
        })
      )
    ).then(() => continueRender(fontHandle)).catch(cancelRender);
  }, [fontHandle]);

  const activeCue =
    SUBTITLES.find((c) => frame >= c.startFrame && frame <= c.endFrame) ||
    SUBTITLES.find((c, idx) => {
      const next = SUBTITLES[idx + 1];
      return frame > c.endFrame && next && frame < next.startFrame;
    });

  // Dark scene states: Scene 1 Stamp Flash, Scene 3 Pitch-Black Pattern Interrupt (4389-4617), Scene 6 Deep Burgundy Outro (7132+)
  const isDarkScene =
    (frame >= 258 && frame < 338) ||
    (frame >= 4389 && frame < 4618) ||
    frame >= 7132;

  // Exact Blueprint Tactile SFX Cue Frames:
  const uiPopFrames = [
    2,     // Scene 1: Milk Glass spring pop
    120,   // Scene 1: Calcium Pill pop
    600,   // Scene 1: Question badge 1
    612,   // Scene 1: Question badge 2
    624,   // Scene 1: Question badge 3
    1245,  // Scene 2: Mason Golden Brick 1 (805 + 440)
    1340,  // Scene 2: Mason Golden Brick 2 (805 + 535)
    1435,  // Scene 2: Mason Golden Brick 3 (805 + 630)
    3509,  // Scene 3: Mason Zzz bubble 1 (3049 + 460)
    3527,  // Scene 3: Mason Zzz bubble 2
    3545,  // Scene 3: Mason Zzz bubble 3
    4179,  // Scene 3: Macro Bone Cavity 1 (3049 + 1130)
    4189,  // Scene 3: Macro Bone Cavity 2
    4199,  // Scene 3: Macro Bone Cavity 3
    4209,  // Scene 3: Macro Bone Cavity 4
    4219,  // Scene 3: Macro Bone Cavity 5
    4229,  // Scene 3: Macro Bone Cavity 6
    4998,  // Scene 4: Vitamin D3 Sun-Key pop (4618 + 380)
    5358,  // Scene 4: Vitamin K2 Traffic Officer pop (4618 + 740)
    5777,  // Scene 5: Spotlight 1 Exercise pop (5557 + 220)
    6507,  // Scene 5: Spotlight 2 Sunlight pop (5557 + 950)
    6879,  // Scene 5: Superfood 1 Fish pop (5557 + 1322)
    6891,  // Scene 5: Superfood 2 Curd pop (5557 + 1334)
    6903,  // Scene 5: Superfood 3 Greens pop (5557 + 1346)
    6915,  // Scene 5: Superfood 4 Egg Yolk pop (5557 + 1358)
    7652,  // Scene 6: Cursor Click on Follow CTA (7132 + 520)
  ];

  const stampThudFrames = [
    258,   // Scene 1: Shock Stamp Slam
    600,   // Scene 1: Fracture Stamp Slam
    4389,  // Scene 3: Pitch-Black Pattern Interrupt Slam (3049 + 1340)
  ];

  const lockClickFrames = [
    4626,  // Scene 4: Heavy Padlock Slam Shut (4618 + 8)
    5178,  // Scene 4: 90-Degree Golden Key Turn & Unlock (4618 + 560)
  ];

  const gentleChimeFrames = [
    2645,  // Scene 2: 100% Balance Scale Lock-In (805 + 1840)
    7042,  // Scene 5: 3-Row Checklist Sweep 1 (5557 + 1485)
    7062,  // Scene 5: 3-Row Checklist Sweep 2 (5557 + 1505)
    7082,  // Scene 5: 3-Row Checklist Sweep 3 (5557 + 1525)
    7319,  // Scene 6: Epigram Reveal Chime
  ];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#F5F1E9',
        fontFamily: "'Hind Siliguri', 'Noto Emoji', sans-serif",
      }}
    >
      {/* Primary Voiceover Audio */}
      {enableAudio && <Audio src={staticFile('voiceover.mp3')} />}

      {/* Frame-Accurate Blueprint Tactile SFX Cues */}
      {enableAudio && (
        <>
          {uiPopFrames.map((f, i) => (
            <Sequence key={`pop-${i}`} from={f} durationInFrames={20}>
              <Audio src={staticFile('sfx/ui-pop.wav')} volume={0.45} />
            </Sequence>
          ))}
          {stampThudFrames.map((f, i) => (
            <Sequence key={`stamp-${i}`} from={f} durationInFrames={30}>
              <Audio src={staticFile('sfx/stamp-thud.wav')} volume={0.8} />
            </Sequence>
          ))}
          {lockClickFrames.map((f, i) => (
            <Sequence key={`lock-${i}`} from={f} durationInFrames={25}>
              <Audio src={staticFile('sfx/lock-click.wav')} volume={0.75} />
            </Sequence>
          ))}
          {gentleChimeFrames.map((f, i) => (
            <Sequence key={`chime-${i}`} from={f} durationInFrames={45}>
              <Audio src={staticFile('sfx/gentle-chime.wav')} volume={0.6} />
            </Sequence>
          ))}
        </>
      )}

      {/* Top Progress Bar */}
      <ProgressBar isDark={isDarkScene} />

      {/* Persistent Brand & Scene Context Pill */}
      <HeaderPill
        context={activeCue ? activeCue.context : '• স্বাস্থ্যবিজ্ঞান'}
        isDark={isDarkScene}
      />

      {/* Responsive Stage Wrapper for both 16:9 Main and 9:16 VerticalReel */}
      <div
        style={{
          width: 1920,
          height: 1080,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: isVertical
            ? 'translate(-50%, -50%) scale(0.86)'
            : 'translate(-50%, -50%) scale(1)',
          transformOrigin: 'center center',
        }}
      >
        <Sequence from={0} durationInFrames={805}>
          <Scene1_ParadoxHook />
        </Sequence>

        <Sequence from={805} durationInFrames={2244}>
          <Scene2_ConstructionSite />
        </Sequence>

        <Sequence from={3049} durationInFrames={1569}>
          <Scene3_UseItOrLoseIt />
        </Sequence>

        <Sequence from={4618} durationInFrames={939}>
          <Scene4_LockedWarehouse />
        </Sequence>

        <Sequence from={5557} durationInFrames={1575}>
          <Scene5_ThreeSolutions />
        </Sequence>

        <Sequence from={7132} durationInFrames={648}>
          <Scene6_EpigramOutro />
        </Sequence>
      </div>

      {/* Bottom Floating Subtitle Card */}
      {activeCue && (
        <SubtitleCard
          text={activeCue.highlightedText || activeCue.text}
          isDark={isDarkScene}
        />
      )}
    </div>
  );
};
