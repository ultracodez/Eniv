import { Center, LoadingOverlay, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { hygraph } from '../Hygraph';
import get100Videos from './get100Videos';
import VideoPlayOnVisible from './VideoPlayOnVisible';

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
        <div
          style={{
            scrollSnapType: 'y mandatory',
            overflow: 'scroll',
            height: 'calc(100vh - 5rem)',
            width: '100%',
          }}
        >
          {videoList.map((vid: any) => {
            return <VideoPlayOnVisible url={vid.cloudinaryId} />;
          })}
        </div>
      </div>
    </Center>
  );
}
