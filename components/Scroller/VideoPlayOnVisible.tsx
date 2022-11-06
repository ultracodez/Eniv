import { AspectRatio, Badge, Card, Center, Group, Text } from '@mantine/core';
import { useEffect, useRef } from 'react';
import sanitize from 'sanitize-html';
import { capitalizeFirstLetter } from '../helpers/capitalizeFirstLetter';
import { sanitizeAndAddLinks } from '../helpers/sanitize';
import useElementOnScreen, { defaultOptions as defaultIoOptions } from './useElementOnScreen';

export default function VideoPlayOnVisible({
  url,
  title,
  verified,
  description,
}: {
  url: any;
  title: string;
  verified: boolean;
  description: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useElementOnScreen(defaultIoOptions, containerRef);

  return (
    <Card
      sx={(theme) => ({
        scrollSnapAlign: 'center',
        [theme.fn.largerThan('lg')]: {
          //height: '80vh',
        },
        width: '100%',
        marginTop: '2.5rem',
        marginBottom: '2.5rem',
        borderRadius: '0.5rem',
      })}
      ref={containerRef}
    >
      <Card.Section>
        <AspectRatio ratio={16 / 9}>
          <video
            poster="https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg?cs=srgb&dl=pexels-pixabay-356079.jpg&fm=jpg"
            style={{ width: '100%' }}
            src={url}
            controls
          ></video>
        </AspectRatio>
      </Card.Section>
      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{capitalizeFirstLetter(title)}</Text>
        <Badge color={verified ? 'green' : 'red'} variant="light">
          {verified ? 'Verified' : 'Not Verified'}
        </Badge>
      </Group>

      <Text
        size="sm"
        color="dimmed"
        dangerouslySetInnerHTML={{ __html: sanitizeAndAddLinks(description) }}
      />
    </Card>
  );
}

function convertRemToPixels(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
