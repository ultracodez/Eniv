import { AspectRatio, Badge, Card, Center, Divider, Group, Text } from '@mantine/core';
import { useEffect, useRef } from 'react';
import sanitize from 'sanitize-html';
import { capitalizeFirstLetter } from '../helpers/capitalizeFirstLetter';
import { sanitizeAndAddLinks } from '../helpers/sanitize';
import useElementOnScreen, { defaultOptions as defaultIoOptions } from './useElementOnScreen';
import { HygraphVideoMetadata } from './get100Videos';

export default function VideoPlayOnVisible({ video }: { video: HygraphVideoMetadata }) {
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
            src={video.cloudinaryId}
            controls
          ></video>
        </AspectRatio>
      </Card.Section>
      <Group position="apart" mt="md" mb="xs">
        <Group>
          <Text weight={500}>{capitalizeFirstLetter(video.title)}</Text>
          <Divider orientation="vertical" />
          <Text fs="italic" size="sm" color="dimmed">
            Uploaded on {new Date(video.createdAt).toLocaleDateString()}
          </Text>
        </Group>
        <Badge color={video.verified ? 'green' : 'red'} variant="light">
          {video.verified ? 'Verified' : 'Not Verified'}
        </Badge>
      </Group>

      <Text
        size="sm"
        color="dimmed"
        dangerouslySetInnerHTML={{
          __html: sanitizeAndAddLinks(
            video.description
              ? video.description
              : "There's no description for this video. <br/> :)"
          ),
        }}
      />
    </Card>
  );
}

function convertRemToPixels(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
