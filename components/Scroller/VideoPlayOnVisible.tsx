import { AspectRatio, Badge, Button, Card, Center, Divider, Group, Text } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import sanitize from 'sanitize-html';
import { capitalizeFirstLetter } from '../helpers/capitalizeFirstLetter';
import { sanitizeAndAddLinks } from '../helpers/sanitize';
import useElementOnScreen, { defaultOptions as defaultIoOptions } from './useElementOnScreen';
import { HygraphVideoMetadata } from './get100Videos';
import { IconCaretUp, IconEye } from '@tabler/icons';
import { updateVideoViews, updateVideoVotes } from './updateVideo';

const updateVideoDataForVideo = (video: HygraphVideoMetadata) => {
  //alert('yep');
  updateVideoVotes(video, video.upvotes + 1);
};

export default function VideoPlayOnVisible({ video }: { video: HygraphVideoMetadata }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useElementOnScreen(defaultIoOptions, containerRef);
  const [hasVoted, setHasVoted] = useState(false);
  const [fHasVoted, setFHasVoted] = useState(false);
  const [hasMarkedViewed, setHasMarkedViewed] = useState(false);

  const finishedWatchingVideo = () => {
    if (!hasMarkedViewed) updateVideoViews(video);
    setHasMarkedViewed(true);
  };

  const voteUpClicked = () => {
    const curVote = !hasVoted;
    setHasVoted(!hasVoted);
    //alert('wow ' + curVote + ' w ' + !fHasVoted + ' w ' + (curVote && !fHasVoted));
    if (curVote && !fHasVoted) {
      //alert('yes');
      updateVideoDataForVideo(video);
    }

    setFHasVoted(true);
  };

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
          {/* 
          
          ***
          NOTE: old poster was set using 

          poster="https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg?cs=srgb&dl=pexels-pixabay-356079.jpg&fm=jpg"
          
          ***
          
          */}
          <video
            poster={video.cloudinaryId.replace(/(\.(?:mp4|m4v|avi|mov|webm|wmv))/i, '.png')}
            style={{ width: '100%' }}
            src={video.cloudinaryId}
            controls
            onEnded={finishedWatchingVideo}
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

      <Group position="apart">
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
        <Group spacing={0}>
          <Button onClick={voteUpClicked} compact variant="subtle">
            <IconCaretUp />
            {video.upvotes + (hasVoted ? 1 : 0)}
          </Button>

          <Button compact variant="subtle" color={'gray'}>
            <IconEye size={20} style={{ marginRight: 5 }} />
            {video.views + (hasMarkedViewed ? 1 : 0)}
          </Button>
        </Group>
      </Group>
    </Card>
  );
}

function convertRemToPixels(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
