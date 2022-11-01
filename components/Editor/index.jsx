import { useState, useRef, useEffect } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'; // https://github.com/ffmpegwasm/ffmpeg.wasm/blob/master/docs/api.md
import { ActionIcon, Center, Container, RangeSlider, Slider } from '@mantine/core';
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
} from '@tabler/icons';
import eniv from '../../public/eniv.png';
import Image from 'next/image';

export { Editor };
export default function Editor({ videoUrl, timings, setTimings }) {
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

  //State handling storing of the trimmed video
  const [trimmedVideo, setTrimmedVideo] = useState();

  //Integer state to handle the progress bars numerical incremation
  const [progress, setProgress] = useState(0);
  const [progressY, setProgressY] = useState(0);

  function setAndUpdateProgress(progPercent) {
    playVideoRef.current.currentTime = (progPercent * playVideoRef.current.duration) / 100;
    //setProgressY((progPercent * playVideoRef.current.duration) / 100);
    // setProgress(progPercent);
    //playVideoRef.current.currentTime = 76 * progPercent;
  }

  //Boolean state handling whether ffmpeg has loaded or not
  const [ready, setReady] = useState(false);

  //Ref to handle the current instance of ffmpeg when loaded
  const ffmpeg = useRef(null);

  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);

  const [rangeValue, setRangeValue] = useState([20, 80]);

  function setAndUpdateRangeValue(progPercentt) {
    var start = Math.round(progPercentt[0] / 10);
    var end = Math.round(progPercentt[1] / 10);
    var len = Math.round((progPercentt[1] - progPercentt[0]) / 10);
    var oldStart = Math.round(rangeValue[0] / 10);
    var oldEnd = Math.round(rangeValue[1] / 10);

    var rRangeValue = rangeValue;

    if (len > 7) {
      //setProgressY(oldEnd + ' : ' + end);
      if (end > oldEnd && start < oldStart) {
        setProgressY('whaaaa');
      } else if (end > oldEnd) {
        setProgressY('end bigger than oldEnd');
        rRangeValue = [start * 10 + 15, end * 10];
      } else if (start < oldStart) {
        setProgressY('start bigger than oldStart');

        rRangeValue = [start * 10, end * 10 - 15];
      }

      // Incase the user clicked
      var length = Math.round((rRangeValue[1] - rRangeValue[0]) / 10);
      setProgressY(length + JSON.stringify(rRangeValue));
      //aka incase the length is STILL greater than 7
      if (length > 7) {
        if (end > oldEnd) {
          rRangeValue = [end * 10 - 70, end * 10];
          setProgressY('ENDNDNENEND');
        } else if (start < oldStart) {
          setProgressY('ayuq3truehu');
          rRangeValue = [start * 10, start * 10 + 70];
        } else {
          setProgressY(start + ' aaa ' + end);
        }
      }
    } else {
      rRangeValue = progPercentt;
      setProgressY(`Start: ${start}. End: ${end}. Duration: ${len}.`);
    }

    setRangeValue(rRangeValue);
    setProgressY((rRangeValue[1] - rRangeValue[0]) / 10 < 8 ? 'true' : 'false');
  }

  const saveVideo = async (fileInput) => {
    const trimStart = Math.round(progPercentt[0] / 10);
    const trimEnd = Math.round(progPercentt[1] / 10);
  };

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
      corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
    });
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <>
      <Container>
        {progress}
        <br />
        {progressY}
        <br />
        {playVideoRef?.current?.currentTime}
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
        <Center>
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
        </Center>
      </Container>
    </>
  );
}
