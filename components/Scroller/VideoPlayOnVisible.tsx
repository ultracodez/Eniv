import { AspectRatio, Badge, Card, Center, Group, Text } from '@mantine/core';
import { useEffect, useRef } from 'react';
import { capitalizeFirstLetter } from '../helpers/capitalizeFirstLetter';
import useElementOnScreen, { defaultOptions as defaultIoOptions } from './useElementOnScreen';

export default function VideoPlayOnVisible({
  url,
  title,
  verified,
}: {
  url: any;
  title: string;
  verified: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useElementOnScreen(defaultIoOptions, containerRef);

  return (
    <Card
      style={{
        scrollSnapAlign: 'center',
        height: '80vh',
        width: '100%',
        marginTop: '2.5rem',
        marginBottom: '2.5rem',
      }}
      ref={containerRef}
    >
      <Card.Section>
        <AspectRatio ratio={16 / 9}>
          <video style={{ width: '100%' }} src={url} controls></video>
        </AspectRatio>
      </Card.Section>
      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{capitalizeFirstLetter(title)}</Text>
        <Badge color="pink" variant="light">
          {verified ? 'true' : 'false'}
        </Badge>
      </Group>
    </Card>
  );
}

function convertRemToPixels(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
