import { Center } from '@mantine/core';
import { useEffect, useRef } from 'react';
import useElementOnScreen, { defaultOptions as defaultIoOptions } from './useElementOnScreen';

export default function VideoPlayOnVisible({ id }: { id: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useElementOnScreen(defaultIoOptions, containerRef);

  return (
    <div
      style={{
        scrollSnapAlign: 'center',
        height: '80vh',
        width: '100%',
        background: isOnScreen ? 'red' : 'green',
        border: 'medium dashed green',
        marginTop: '2.5rem',
        marginBottom: '2.5rem',
      }}
      ref={containerRef}
    >
      {id}
    </div>
  );
}

function convertRemToPixels(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
