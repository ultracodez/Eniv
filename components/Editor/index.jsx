import { useState, useRef, useEffect } from 'react';
import {
  ActionIcon,
  Button,
  Center,
  Container,
  Group,
  Modal,
  Progress,
  RangeSlider,
  Slider,
  Text,
  TextInput,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconCheck,
  IconCloudUpload,
  IconDownload,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
} from '@tabler/icons';
import eniv from '../../public/eniv.png';
import Image from 'next/image';
import { cloudinary, cloudinaryCloudName } from '../Cloudinary/CloudinaryComponent';

const MaxLength = 4;

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'; // https://github.com/ffmpegwasm/ffmpeg.wasm/blob/master/docs/api.md
import { hideNotification, showNotification } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { uploadFile } from '../Cloudinary/uploadFile';
import { getJsonFromUrl } from '../helpers/getJsonFromUrl';

export { Editor };
export default function Editor({ videoUrl, /* timings, setTimings,*/ /* redirectUrl,*/ ...props }) {
  var params = getJsonFromUrl(window?.location?.search);

  const [modalOpened, setModalOpened] = useState(false);

  //Ref to handle the current instance of ffmpeg when loaded
  const ffmpeg = useRef(null);
  //Boolean state handling whether ffmpeg has loaded or not
  const [ready, setReady] = useState(false);
  //Function handling loading in ffmpeg
  const load = async () => {
    try {
      await ffmpeg.current.load();

      setReady(true);
    } catch (error) {
      console.log(error);
    }
  };
  //Loading in ffmpeg when this component renders
  useEffect(() => {
    ffmpeg.current = createFFmpeg({
      log: true,
      corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js', //'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
    });
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Boolean state to handle video mute
  const [isMuted, setIsMuted] = useState(false);
  //Boolean state to handle whether video is playing or not
  const [playing, setPlaying] = useState(false);
  //Float integer state to help with trimming duration logic
  const [difference, setDifference] = useState(0.2);
  //State for imageUrl
  const [imageUrl, setImageUrl] = useState('');

  //Ref handling the trimmed video element
  const trimmedVidRef = useRef();

  //Ref handling the initial video element for trimming
  const playVideoRef = useRef();

  //for renderProgress
  const [progressColor, setProgressColor] = useState('violet');

  //State handling storing of the trimmed video
  const [trimmedVideo, setTrimmedVideo] = useState('FAILURE');
  const [trimmingDone, setTrimmingDone] = useState(false);

  //Integer state to handle the progress bars numerical incremation
  const [progress, setProgress] = useState(0);
  const [renderProgress, setRenderProgress] = useState(0);
  const [progressY, setProgressY] = useState(0);

  function setAndUpdateProgress(progPercent) {
    playVideoRef.current.currentTime = (progPercent * playVideoRef.current.duration) / 100;

    //setProgressY((progPercent * playVideoRef.current.duration) / 100);
    // setProgress(progPercent);
    //playVideoRef.current.currentTime = 76 * progPercent;
  }

  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);

  const [rangeValue, setRangeValue] = useState([20, 30]);
  const [lastDir, setLastDir] = useState('');

  function setAndUpdateRangeValue(progPercentt) {
    /*
    var start = Math.round(progPercentt[0] / 10);
    var end = Math.round(progPercentt[1] / 10);
    var len = Math.round((progPercentt[1] - progPercentt[0]) / 10);
    var oldStart = Math.round(rangeValue[0] / 10);
    var oldEnd = Math.round(rangeValue[1] / 10);
    /* */

    var start = progPercentt[0] / 10;
    var end = progPercentt[1] / 10;
    var len = (progPercentt[1] - progPercentt[0]) / 10;
    var oldStart = rangeValue[0] / 10;
    var oldEnd = rangeValue[1] / 10;

    const curPosPercentator = playVideoRef.current.duration;

    if (oldStart !== start) {
      setProgress((start / curPosPercentator) * 100);
      playVideoRef.current.currentTime =
        (start / curPosPercentator) * playVideoRef.current.duration;
    } //console.log(start); //setProgress((oldStart / curPosPercentator) * 100); //console.log('start changed');
    if (oldEnd !== end) {
      //setProgress((start / curPosPercentator) * 100);
      //playVideoRef.current.currentTime =
      //  (start / curPosPercentator) * playVideoRef.current.duration;
    }

    var rRangeValue = rangeValue;

    if (len > MaxLength) {
      //setProgressY(oldEnd + ' : ' + end);
      if (end > oldEnd && start < oldStart) {
        //setProgressY('whaaaa');
      } else if (end > oldEnd) {
        //setProgressY('end bigger than oldEnd');
        rRangeValue = [start * 10 + 1, end * 10];
        setLastDir('end');
        setProgress((end / playVideoRef?.current?.duration) * 100);
      } else if (start < oldStart) {
        //setProgressY('start bigger than oldStart');

        rRangeValue = [start * 10, end * 10 - 1];
        setLastDir('start');
        setProgress((start / playVideoRef?.current?.duration) * 100);
        //setProgress(start*3);
      }

      // Incase the user clicked
      var length = Math.round((rRangeValue[1] - rRangeValue[0]) / 10);
      //setProgressY(length + JSON.stringify(rRangeValue));
      //aka incase the length is STILL greater than 7
      if (length > MaxLength) {
        if (end > oldEnd) {
          rRangeValue = [end * 10 - MaxLength * 10, end * 10];
          //rRangeValue = [end * 10 - MaxLength * 10, end * 10];
          //setProgressY('ENDNDNENEND');
        } else if (start < oldStart) {
          //setProgressY('ayuq3truehu');
          rRangeValue = [start * 10, start * 10 + MaxLength * 10];
        } else {
          //setProgressY(start + ' aaa ' + end);
        }
      }
    } else {
      rRangeValue = progPercentt;
      if (lastDir === 'start') {
        //setProgress((progPercentt[0] / playVideoRef?.current?.duration) * 100);
      } else if (lastDir === 'end') {
        //setProgress((progPercentt[1] / playVideoRef?.current?.duration) * 100);
      }
      //setProgressY(`Start: ${start}. End: ${end}. Duration: ${len}.`);
    }

    setRangeValue(rRangeValue);
    setProgressY((rRangeValue[1] - rRangeValue[0]) / 10 < MaxLength ? 'true' : 'false');
  }

  const saveVideo = async ({ vidTitle }) => {
    if (!ready) {
      alert('ffmpeg not ready yet, please wait a bit');

      setModalSubmitButtonDisabled(false);
      return;
    }

    setProgressColor('violet');
    setRenderProgress(0);
    const trimStart = rangeValue[0] / 10;
    const trimEnd = rangeValue[1] / 10;

    const trimmedVideo = trimEnd - trimStart;

    console.log('Trimmed Duration: ', trimmedVideo);
    console.log('Trim End: ', trimEnd);
    setRenderProgress(10);
    try {
      //Disabling new-cap for FS function
      // eslint-disable-next-line new-cap
      ffmpeg.current.FS('writeFile', 'myFile.mp4', await fetchFile(videoUrl));
      setRenderProgress(30);
      ffmpeg.current.setProgress(({ ratio }) => {
        console.log('ffmpeg progress: ', ratio);
        if (ratio < 0) {
          //setProgress(0);
        }
        //setProgress(Math.round(ratio * 100));
      });
      setRenderProgress(50);
      await ffmpeg.current.run(
        '-ss',
        `${trimStart}`,
        '-accurate_seek',
        '-i',
        'myFile.mp4',
        '-to',
        `${trimmedVideo}`,
        '-codec',
        'copy',
        'output.mp4'
      );
      setRenderProgress(70);
      //Disabling new-cap for FS function
      // eslint-disable-next-line new-cap
      const data = ffmpeg.current.FS('readFile', 'output.mp4');
      setRenderProgress(80);
      var blobby = new Blob([data.buffer], { type: 'video/mp4' });
      const url = URL.createObjectURL(blobby);
      setRenderProgress(90);
      setTrimmedVideo(url);
      setTrimmingDone(true);
      // setLottiePlaying(false)

      setRenderProgress(100);
      setProgressColor('green');

      showNotification({
        id: 'uploadNot',
        title: 'Uploading to Eniv',
        message: ':o',
        loading: true,
        disallowClose: true,
        autoClose: 100000,
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        /*const formData = new FormData();
        formData.append('inputFile', blobby);
        formData.append('vidTitle', vidTitle);
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();*/
        //setPublicId(data.public_id);

        uploadFile(blobby, cloudinaryCloudName, onSuccess, onError, {
          title: modalForm.values.vidTitle,
          description: '',
        });

        async function onSuccess() {
          hideNotification('uploadNot');

          await new Promise((resolve) => setTimeout(resolve, 300));
          showNotification({
            title: 'Upload Successful',
            message: ':)',
            icon: <IconCheck />,
            color: 'green',
          });
          setTimeout(() => {
            if (params.rdUrl) {
              window.location.href = params.rdUrl;
            }
          }, 2000);
        }
        async function onError() {
          hideNotification('uploadNot');

          await new Promise((resolve) => setTimeout(resolve, 300));
          showNotification({
            title: 'Upload Failed',
            message:
              'Error data: ' +
              JSON.stringify(error) +
              ' ' +
              JSON.stringify(error.stack) +
              ' ' +
              JSON.stringify(error.cause),
            icon: <IconAlertCircle />,
            color: 'red',
          });
          setModalSubmitButtonDisabled(false);
        }
      } catch (error) {
        hideNotification('uploadNot');

        await new Promise((resolve) => setTimeout(resolve, 300));
        showNotification({
          title: 'Upload Failed',
          message:
            'Error data: ' +
            JSON.stringify(error) +
            ' ' +
            JSON.stringify(error.stack) +
            ' ' +
            JSON.stringify(error.cause),
          icon: <IconAlertCircle />,
          color: 'red',
        });
        setModalSubmitButtonDisabled(false);
      } finally {
        setModalOpened(false);
      }

      /*event.preventDefault();
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('inputFile', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        setPublicId(data.public_id);
      } catch (error) {
        setShowSpinner(false);
      } finally {
        setShowSpinner(false);
        setShowVideo(true);
      }/* */
    } catch (error) {
      console.log(error);

      setProgressY(JSON.stringify(error.stack));
      setProgressColor('red');

      setModalSubmitButtonDisabled(false);
    }

    setModalOpened(false);
  };
  /*const onChange = async (event) => {
    setShowSpinner(true);
    event.preventDefault();
    const formData = new FormData();
    const file = event.target.files[0];
    formData.append("inputFile", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      setPublicId(data.public_id);
    } catch (error) {
      setShowSpinner(false);
    } finally {
      setShowSpinner(false);
      setShowVideo(true);
    }
  };*/

  const playPause = () => {
    if (playing) {
      playVideoRef.current.pause();
    } else {
      /*if (playVideoRef.current.currentTime >= timings[0].end) {
        playVideoRef.current.pause();
        setPlaying(false);
        currentlyGrabbedRef.current = { index: 0, type: 'start' };
        playVideoRef.current.currentTime = timings[0].start;
        progressBarRef.current.style.left = `${
          (timings[0].start / playVideoRef.current.duration) * 100
        }%`;
        progressBarRef.current.style.width = '0%';
      }*/
      playVideoRef.current.play();
    } /**/
    setPlaying(!playing);
  };

  const skipToStart = () => {
    playVideoRef.current.currentTime = 0;
  };

  const skipToEnd = () => {
    playVideoRef.current.currentTime = playVideoRef.current.duration;
    playVideoRef.current.pause();
  };

  const modalForm = useForm({ initialValues: { vidTitle: '' } });
  const [modalSubmitButtonDisabled, setModalSubmitButtonDisabled] = useState(false);

  function saveVideoWrapper() {
    setModalSubmitButtonDisabled(true);
    var vidTitle = modalForm.values.vidTitle;
    saveVideo({ vidTitle });
  }

  return (
    <>
      {JSON.stringify(params)}
      {rangeValue[1]}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Set Video Properties"
        centered
      >
        <TextInput
          label="Video Title"
          placeholder="My Best 3-Second Video Yet"
          {...modalForm.getInputProps('vidTitle')}
        ></TextInput>
        <Center style={{ paddingTop: '20px' }}>
          <Button
            disabled={modalSubmitButtonDisabled}
            onClick={saveVideoWrapper}
            variant="light"
            color="cyan"
          >
            Submit & Upload
          </Button>
        </Center>
      </Modal>
      <Container>
        <div id="debugTrimmerInformation" style={{ display: 'none' }}>
          {JSON.stringify(trimmedVideo)}
          wtf +{JSON.stringify(trimmedVideo)}+<br />
          FFMPEG LOADED? : {ready ? 'yes' : 'no'}
          <br />
          {progress}
          <br />
          {progressY}
          <br />
          {playVideoRef?.current?.currentTime}
        </div>
        <Center style={{ paddingTop: '5rem' }}>
          <video
            style={{
              height: '48vh',
              overflow: 'hidden',
            }}
            className="video"
            autoload="metadata"
            muted={isMuted}
            ref={playVideoRef}
            onLoadedData={() => {
              console.log(playVideoRef);
              playPause();
            }}
            onClick={() => {
              playPause();
            }}
            onTimeUpdate={() => {
              console.log((playVideoRef.current.currentTime / playVideoRef.current.duration) * 100);
              setProgress((playVideoRef.current.currentTime / playVideoRef.current.duration) * 100);
              //setSeekerBar(progressBarRef.current.style.width);
            }}
          >
            {' '}
            <source src={videoUrl} type="video/mp4" />
          </video>
        </Center>
        <Slider step={0.5} value={progress} onChange={setAndUpdateProgress} />
        <RangeSlider
          step={0.1}
          min={0}
          label={null}
          max={playVideoRef?.current?.duration * 10 ?? 100}
          value={rangeValue}
          onChange={setAndUpdateRangeValue}
        />
        <Group position="apart">
          <div style={{ visibility: 'hidden' }}>div</div>
          <Group style={{ marginLeft: 180 }}>
            <ActionIcon
              style={{ paddingRight: '0.5rem' }}
              size="lg"
              className="go-to-start-control"
              title="Skip To Start"
              onClick={skipToStart}
            >
              <IconPlayerSkipBack size={30} />
            </ActionIcon>
            <ActionIcon size="lg" className="play-control" title="Play/Pause" onClick={playPause}>
              {playing ? <IconPlayerPause size={30} /> : <IconPlayerPlay size={30} />}
            </ActionIcon>
            <ActionIcon
              style={{ paddingLeft: '0.5rem' }}
              size="lg"
              className="go-to-start-control"
              title="Skip To End"
              onClick={skipToEnd}
            >
              <IconPlayerSkipForward size={30} />
            </ActionIcon>
          </Group>
          <Button
            size="md"
            variant="subtle"
            className="upload-and-complete-control"
            title="Upload And Finish Result"
            onClick={() => {
              setModalOpened(true);
            }}
          >
            {/* onClick={saveVideo} */}
            Upload to Eniv {'   '}
            <IconCloudUpload style={{ paddingLeft: '8px' }} size={30} />
          </Button>
        </Group>
        <Group>
          <Text>Render Progress:</Text>
          <Progress style={{ width: '100%' }} value={renderProgress} color={progressColor} />
        </Group>
      </Container>
    </>
  );
}
