import {
  AspectRatio,
  Badge,
  Button,
  Card,
  Center,
  Divider,
  Group,
  HoverCard,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import sanitize from 'sanitize-html';
import { capitalizeFirstLetter } from '../helpers/capitalizeFirstLetter';
import { sanitizeAndAddLinks } from '../helpers/sanitize';
import useElementOnScreen, { defaultOptions as defaultIoOptions } from './useElementOnScreen';
import { HygraphVideoMetadata } from './get100Videos';
import { IconCaretUp, IconCheck, IconEye, IconX } from '@tabler/icons';
import { updateVideoVerified, updateVideoViews, updateVideoVotes } from './updateVideo';
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { HoverCardDropdown } from '@mantine/core/lib/HoverCard/HoverCardDropdown/HoverCardDropdown';

const updateVideoDataForVideo = (video: HygraphVideoMetadata) => {
  //alert('yep');
  updateVideoVotes(video, video.upvotes + 1);
};

export default function VideoPlayOnVisible({ video }: { video: HygraphVideoMetadata }) {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [role, setRole] = useState<string>();
  const user = useUser();
  const [isModeratorApproved, setIsModeratorApproved] = useState(video.verified);
  const [isModeratorOverriden, setIsModeratorOverriden] = useState(false);

  const { colorScheme } = useMantineColorScheme();

  const [loading, setLoading] = useState(true);

  const [videoUploaderAvatarUrl, setVideoUploaderAvatarUrl] = useState(video.uploaderAvatarUrl);

  useEffect(() => {
    if (videoUploaderAvatarUrl) downloadImage(videoUploaderAvatarUrl);
  }, [videoUploaderAvatarUrl]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setVideoUploaderAvatarUrl(url);
    } catch (error) {
      console.log('Error downloading image: ', error);
    }
  }

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from('enivprofiles')
        .select(`username, full_name, avatar_url, role`)
        .filter('id', 'eq', user?.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setRole(data.role);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

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

  const adminVerifyClicked = () => {
    setIsModeratorOverriden(true);
    updateVideoVerified(video, !isModeratorApproved);
    setIsModeratorApproved(!isModeratorApproved);
  };

  const veryfied = isModeratorOverriden ? isModeratorApproved : video.verified;

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
            Uploaded on {new Date(video.createdAt).toLocaleDateString()}{' '}
            <HoverCard width={280} shadow="md" position="top">
              <HoverCard.Target>
                <span>{video.uploaderName ? `by ${video.uploaderName}` : ''}</span>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <div>
                  <Center>
                    {videoUploaderAvatarUrl ? (
                      <img
                        src={videoUploaderAvatarUrl}
                        style={{
                          borderRadius: '10rem',
                          width: '50%',
                          height: '50%',
                        }}
                      />
                    ) : (
                      ''
                    )}
                  </Center>
                  <Center>
                    <Text fs="initial" size={30} color={colorScheme === 'dark' ? 'white' : 'black'}>
                      {video.uploaderName}
                    </Text>
                  </Center>
                </div>
              </HoverCard.Dropdown>
            </HoverCard>
          </Text>
        </Group>
        <Badge color={veryfied ? 'green' : 'red'} variant="light">
          {veryfied ? 'Verified' : 'Not Verified'}
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
          {role === 'admin' ? (
            <>
              <Button
                onClick={adminVerifyClicked}
                compact
                variant="subtle"
                color={veryfied ? 'green' : 'red'}
              >
                {veryfied ? (
                  <IconCheck style={{ paddingRight: '0.2rem' }} />
                ) : (
                  <IconX style={{ paddingRight: '0.2rem' }} />
                )}
                {veryfied ? 'Verified' : 'Unverified'}
              </Button>
            </>
          ) : (
            ''
          )}
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
