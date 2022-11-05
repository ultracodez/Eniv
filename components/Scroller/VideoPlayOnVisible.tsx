import { AspectRatio, Center } from '@mantine/core';
import { useEffect, useRef } from 'react';
import useElementOnScreen, { defaultOptions as defaultIoOptions } from './useElementOnScreen';

export default function VideoPlayOnVisible({ url }: { url: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useElementOnScreen(defaultIoOptions, containerRef);

  return (
    <div
      style={{
        scrollSnapAlign: 'center',
        height: '80vh',
        width: '100%',
        marginTop: '2.5rem',
        marginBottom: '2.5rem',
      }}
      ref={containerRef}
    >
      <AspectRatio ratio={16 / 9}>
        <video style={{ width: '100%' }} src={url}></video>
      </AspectRatio>
    </div>
  );
}

function convertRemToPixels(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
