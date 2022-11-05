import { Center, LoadingOverlay, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { hygraph } from '../Hygraph';
import get100Videos from './get100Videos';
import VideoPlayOnVisible from './VideoPlayOnVisible';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { styled } from '@stitches/react';

const SCROLLBAR_SIZE = 10;

const StyledScrollArea = styled(ScrollAreaPrimitive.Root, {
  width: 200,
  height: 225,
  borderRadius: 4,
  overflow: 'hidden',
  //boxShadow: `0 2px 10px ${blackA.blackA7}`,
});

const StyledViewport = styled(ScrollAreaPrimitive.Viewport, {
  width: '100%',
  height: '100%',
  borderRadius: 'inherit',
  scrollSnapType: 'y mandatory',
});

const StyledScrollbar = styled(ScrollAreaPrimitive.Scrollbar, {
  display: 'flex',
  // ensures no selection
  userSelect: 'none',
  // disable browser handling of all panning and zooming gestures on touch devices
  touchAction: 'none',
  padding: 2,
  //background: blackA.blackA6,
  transition: 'background 160ms ease-out',
  //'&:hover': { background: blackA.blackA8 },
  '&[data-orientation="vertical"]': { width: SCROLLBAR_SIZE },
  '&[data-orientation="horizontal"]': {
    flexDirection: 'column',
    height: SCROLLBAR_SIZE,
  },
});

const StyledThumb = styled(ScrollAreaPrimitive.Thumb, {
  flex: 1,
  //background: mauve.mauve10,
  borderRadius: SCROLLBAR_SIZE,
  // increase target size for touch devices https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    minWidth: 44,
    minHeight: 44,
  },
});

const StyledCorner = styled(ScrollAreaPrimitive.Corner, {
  //background: blackA.blackA8,
});

// Exports
const ScrollArea = StyledScrollArea;
const ScrollAreaViewport = StyledViewport;
const ScrollAreaScrollbar = StyledScrollbar;
const ScrollAreaThumb = StyledThumb;
const ScrollAreaCorner = StyledCorner;

export default function VideoScroller() {
  const [videoList, setVideoList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { colorScheme } = useMantineColorScheme();

  //load initial function
  const callback = (e: any) => {
    setIsLoading(false);
    setVideoList(e);
    alert(JSON.stringify(e));
  };
  useEffect(() => {
    get100Videos(callback);
  }, []);

  return (
    <Center style={{}}>
      <div
        style={{
          width: '50%',
          height: 'calc(100vh-5rem)',
          position: 'relative',
        }}
      >
        <LoadingOverlay
          visible={isLoading}
          overlayBlur={2}
          overlayColor={colorScheme === 'dark' ? 'dark' : 'light'}
        />
        <ScrollArea
          style={{
            scrollSnapType: 'y mandatory',
            //overflowY: 'scroll'
            height: 'calc(100vh - 5rem)',
            width: '100%',
          }}
        >
          <ScrollAreaViewport>
            {videoList.map((vid: any) => {
              return (
                <VideoPlayOnVisible
                  description="This is my new epic video! Check out my website: https://ultracodez.com"
                  url={vid.cloudinaryId}
                  title={vid.title}
                  verified={vid.verified ?? false}
                />
              );
            })}
          </ScrollAreaViewport>
          <ScrollAreaScrollbar orientation="vertical">
            <ScrollAreaThumb />
          </ScrollAreaScrollbar>
          <ScrollAreaScrollbar orientation="horizontal">
            <ScrollAreaThumb />
          </ScrollAreaScrollbar>
          <ScrollAreaCorner />
        </ScrollArea>
      </div>
    </Center>
  );
}
