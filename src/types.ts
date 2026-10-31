export interface SubtitleCue {
  id: number;
  startFrame: number;
  endFrame: number;
  text: string;
  highlightedText?: string;
  context: string;
}

export const THEME = {
  bgWarm: '#F5F1E9',
  bgDark: '#121316',
  bgBurgundy: '#38181C',
  charcoal: '#1E2229',
  charcoalMuted: '#586069',
  white: '#FFFFFF',
  jade: '#107C41',
  jadeLight: '#E8F5E9',
  terracotta: '#C84B31',
  terracottaLight: '#FDEEEB',
  gold: '#E08700',
  goldLight: '#FEF7E6',
  cardBg: 'rgba(255, 255, 255, 0.92)',
  cardBorder: 'rgba(30, 34, 41, 0.08)',
};

export interface CompositionProps {
  enableAudio?: boolean;
}
