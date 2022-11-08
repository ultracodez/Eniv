import { Anchor, Button, Center, Container, Group, Slider, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { IconUpload, IconVideo, IconX } from '@tabler/icons';
import { Editor } from '../components/Editor';
import React from 'react';
import { getJsonFromUrl } from '../components/helpers/getJsonFromUrl';
import { useSession } from '@supabase/auth-helpers-react';
import Link from 'next/link';

export default function HomePage() {
  const session = useSession();
  if (!session)
    return (
      <Container style={{ paddingTop: '10rem' }}>
        <Title>Sorry, you need to be signed in to upload a video. </Title>
        <Text>
          <b>Why?</b> Often spam posting, bot posting or other such things are done without an
          account. Accounts allow us to keep track of who uploaded what, as well as removing most of
          the non-sophisticated bots that exist.
          <b>Thanks for your cooperation. :{')'}</b>
        </Text>
        <Center style={{ paddingTop: '1rem' }}>
          <Link href="/auth" passHref>
            <Button component="a" color="grape">
              Log In
            </Button>
          </Link>
        </Center>
      </Container>
    );

  var params: any;
  if (typeof window !== 'undefined') params = getJsonFromUrl(window?.location?.search);
  //make sure the user didnt come from nextjs routing
  useEffect(() => {
    //alert(JSON.stringify(params));
    if (params.cameFromNextJSRouting) window.location.replace('/upload'); //alert('you came from client side routing');
  }, []);
  //Boolean state handling whether upload has occured or not
  const [isUpload, setIsUpload] = useState(true);

  //State handling storing of the video
  const [videoUrl, setVideoUrl] = useState('');
  const [videoBlob, setVideoBlob] = useState<FileWithPath>();

  const renderUploader = () => {
    return (
      <div className={'wrapper'}>
        {/*<input
          onChange={(e) => uploadFile(e.target.files)}
          type="file"
          className="hidden"
          id="up_file"
    />*/}

        <Container style={{ paddingTop: '10rem' }}>
          <Dropzone
            maxFiles={1}
            onDrop={(file) => {
              uploadFile(file);
            }}
            accept={[/*'video/quicktime', */ 'video/mp4']}
          >
            <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
              <Dropzone.Accept>
                <IconUpload size={50} stroke={1.5} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX size={50} stroke={1.5} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconVideo size={50} stroke={1.5} />
              </Dropzone.Idle>
              <div>
                <Text size="xl" inline>
                  Drag a video here or click to select a file
                </Text>
                <Text size="sm" color="dimmed" inline mt={7}>
                  Only mp4 files are supported, but more support is coming soon!
                </Text>
              </div>
            </Group>
          </Dropzone>
        </Container>
      </div>
    );
  };

  //Function handling rendering the Editor component and passing props to that child component
  const renderEditor = () => {
    return (
      // videoUrl --> URL of uploaded video
      <Editor videoUrl={videoUrl} setVideoUrl={setVideoUrl} videoBlob={videoBlob} /> //videoBlob={videoBlob}
    );
  };

  //Function handling the file upload file logic
  const uploadFile = async (fileInput: FileWithPath[]) => {
    console.log(fileInput[0]);
    let fileUrl = URL.createObjectURL(fileInput[0]);
    setIsUpload(false);
    setVideoUrl(fileUrl);
    setVideoBlob(fileInput[0]);
  };

  return (
    <>
      {/* Boolean to handle whether to render the file uploader or the video editor */}
      {isUpload ? renderUploader() : renderEditor()}
    </>
  );
}
