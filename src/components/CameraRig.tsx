import React from 'react';
import { useCurrentFrame } from 'remotion';

interface CameraRigProps {
  children: React.ReactNode;
  zoom?: number;
  panX?: number;
  panY?: number;
  rotation?: number;
  shakeFrames?: number[];
  shakeIntensity?: number;
}

export const CameraRig: React.FC<CameraRigProps> = ({
  children,
  zoom = 1,
  panX = 0,
  panY = 0,
  rotation = 0,
  shakeFrames = [],
  shakeIntensity = 14,
}) => {
  const frame = useCurrentFrame();

  let shakeX = 0;
  let shakeY = 0;
  let shakeRot = 0;

  for (const sf of shakeFrames) {
    if (frame >= sf && frame <= sf + 8) {
      const progress = 1 - (frame - sf) / 8;
      shakeX += Math.sin((frame - sf) * 3.8) * shakeIntensity * progress;
      shakeY += Math.cos((frame - sf) * 4.5) * (shakeIntensity * 0.7) * progress;
      shakeRot += Math.sin((frame - sf) * 3.2) * 1.8 * progress;
    }
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translate(${panX + shakeX}px, ${panY + shakeY}px) scale(${zoom}) rotate(${rotation + shakeRot}deg)`,
        transformOrigin: 'center center',
      }}
    >
      {children}
    </div>
  );
};
