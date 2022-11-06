import {
  Box,
  Center,
  Checkbox,
  Divider,
  Group,
  LoadingOverlay,
  NativeSelect,
  Paper,
  Switch,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { hygraph } from '../Hygraph';
import get100Videos, { HygraphVideoMetadata } from './get100Videos';
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
  const [videoList, setVideoList] = useState<HygraphVideoMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { colorScheme } = useMantineColorScheme();
  const [isShowingUnverified, setIsShowingUnverified] = useState(false);
  const [sortSelectValue, setSortSelectValue] = useState<string>('Upvotes');

  //load initial function
  const callback = (e: HygraphVideoMetadata[]) => {
    setIsLoading(false);
    setVideoList(e);
  };
  useEffect(() => {
    get100Videos(callback);
  }, []);

  return (
    <Box>
      <Paper radius={0}>
        <Group position="apart">
          <Box sx={{ marginLeft: '25%' }}>
            <Checkbox
              labelPosition="left"
              label="Show unverified:"
              color="teal"
              checked={isShowingUnverified}
              onChange={(event) => setIsShowingUnverified(event.currentTarget.checked)}
            />
          </Box>
          <Box sx={{ marginRight: '25%' }}>
            <Center sx={{ height: '2.9rem' }}>
              <Group>
                <Text>Sort By: </Text>
                <NativeSelect
                  value={sortSelectValue}
                  onChange={(event) => setSortSelectValue(event.currentTarget.value)}
                  placeholder="Pick one"
                  data={['Views', 'Upvotes', 'Published']}
                />
              </Group>
            </Center>
          </Box>
        </Group>
      </Paper>
      <Center>
        <Box
          sx={(theme) => ({
            [theme.fn.largerThan('lg')]: {
              width: '50%',
              height: '90%',
            },
            //height: 'calc(100vh-5rem)',
            position: 'relative',
          })}
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
              height: `calc(100vh - 5rem${' - 3rem'})`,
              width: '100%',
            }}
          >
            <ScrollAreaViewport>
              {videoList
                .filter((vid: HygraphVideoMetadata) => {
                  return isShowingUnverified || vid.verified === true;
                })
                .sort((vid1, vid2) => {
                  if (sortSelectValue === 'Upvotes') {
                    return vid1.upvotes - vid2.upvotes;
                  } else if (sortSelectValue === 'Views') {
                    return vid1.views - vid2.views;
                  } else {
                    return (
                      new Date(vid1.createdAt).getSeconds() - new Date(vid2.createdAt).getSeconds()
                    );
                  }
                })
                .map((vid: HygraphVideoMetadata) => {
                  return <VideoPlayOnVisible video={vid} />;
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
        </Box>
      </Center>
    </Box>
  );
}
