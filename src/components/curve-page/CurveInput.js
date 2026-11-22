import React, { useRef, useState } from 'react';
import { Alert, Box, CircularProgress, Stack } from '@mui/material';
import CurveEditor from './CurveEditor';
import TextSource from './TextSource';
import VideoComponent from './VideoComponent';
import YouTubeVideoComponent from './YouTubeVideoComponent';
import { axes, isText, startValues } from '../../helper/curve';

// The source of a curve and the curve below it.
export default function CurveInput({ curve, borders, readOnly, onChange }) {
  const [source, setSource] = useState(null);
  const latest = useRef(curve);
  latest.current = curve;

  const { content } = curve;
  const axis = axes(curve);

  function ready({ duration, getCurrent, setCurrent }) {
    const now = latest.current;
    let player = { duration, getCurrent, setCurrent };
    if (isText(content) && !axes(now).characters) {
      // Curves saved in percent of the text.
      player = { duration: 100, getCurrent: () => 100 * getCurrent() / duration,
        setCurrent: percent => setCurrent(duration * percent / 100) };
    }
    if (now.id === undefined) {
      const area = { ...axes(now), duration: player.duration };
      onChange({ ...now, values: startValues(now.values, now.kind, area) });
    }
    setSource(player);
  }

  let player;
  if (content.video_id) {
    player = <YouTubeVideoComponent videoId={content.video_id} onReady={event => ready({
      duration: event.target.getDuration(), getCurrent: () => event.target.getCurrentTime(),
      setCurrent: value => event.target.seekTo(value, true),
    })} />;
  } else if (isText(content)) {
    player = <TextSource content={content} onReady={ready} />;
  } else {
    player = <VideoComponent url={content.url} mime={content.data_type} onReady={video => ready({
      duration: video.duration, getCurrent: () => video.currentTime,
      setCurrent: value => { video.currentTime = value; },
    })} />;
  }

  const values = Array.isArray(curve.values) ? curve.values : [];
  // A saved curve can end a little after the source reports.
  const duration = source && Math.max(source.duration, values.length ? values[values.length - 1].x : 0);
  return <Stack spacing={2}>
    {player}
    {source && curve.id !== undefined && values.length < 2 && <Alert severity="warning">曲線の点がありません。</Alert>}
    {source && values.length > 1 ?
      <CurveEditor values={values} kind={curve.kind} area={{ ...axis, duration }} borders={borders}
        label={curve.value_type && curve.value_type.title} readOnly={readOnly}
        getCurrent={source.getCurrent} setCurrent={source.setCurrent}
        onChange={next => onChange({ ...latest.current, values: next })} /> :
      !source && <Box sx={{ minHeight: 240 }}><CircularProgress aria-label="素材を読み込み中" /></Box>}
  </Stack>;
}
