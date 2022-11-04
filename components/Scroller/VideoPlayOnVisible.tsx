import { Center } from '@mantine/core';
import { useEffect, useRef } from 'react';
import useElementOnScreen, { defaultOptions as defaultIoOptions } from './useElementOnScreen';

export default function VideoPlayOnVisible({ id }: { id: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useElementOnScreen(defaultIoOptions, containerRef);

  const afterDelayScrollCallback = () => {
    if (isOnScreen) {
      //containerRef.current?.scrollIntoView({behavior:"smooth",block: "end", inline: "nearest"});
      /*if (containerRef !== undefined) {
        const eleY = containerRef && containerRef?.current?.getBoundingClientRect()?.top;
        if (eleY) {
          const y = eleY + window.scrollY - convertRemToPixels(10);
          window.scroll({
            top: y,
            behavior: 'smooth',
          });
        }
      }*/
    }
  };
  useEffect(() => {
    setTimeout(afterDelayScrollCallback, 1000);
  }, [isOnScreen]);

  return (
    <Center style={{ paddingTop: '5rem' }}>
      <div
        style={{
          height: '75vh',
          width: '50%',
          background: isOnScreen ? 'red' : 'green',
          border: 'medium dashed green',
        }}
        ref={containerRef}
      >
        {id}
      </div>
    </Center>
  );
}

function convertRemToPixels(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
