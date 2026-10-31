import React from 'react';
import { Composition } from 'remotion';
import { RemotionVideo } from './RemotionVideo';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Main"
        component={RemotionVideo}
        durationInFrames={7780}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{
          enableAudio: true,
        }}
      />
      <Composition
        id="VerticalReel"
        component={RemotionVideo}
        durationInFrames={7780}
        fps={60}
        width={1080}
        height={1920}
        defaultProps={{
          enableAudio: true,
        }}
      />
    </>
  );
};
