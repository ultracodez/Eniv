import { Center } from '@mantine/core';
import VideoPlayOnVisible from './VideoPlayOnVisible';

export default function VideoScroller() {
  const a = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  return (
    <Center>
      <div
        style={{
          scrollSnapType: 'y mandatory',
          overflow: 'scroll',
          height: 'calc(100vh - 5rem)',
          width: '50%',
        }}
      >
        {a.map(() => {
          return <VideoPlayOnVisible id={'nah'} />;
        })}
      </div>
    </Center>
  );
}
