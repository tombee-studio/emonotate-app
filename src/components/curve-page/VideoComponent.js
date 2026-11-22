import React, { useRef, useState } from 'react';
import { Alert, Box } from '@mui/material';

export default function VideoComponent({ url, mime, onReady, details }) {
  const [error, setError] = useState(false);
  const ready = useRef(false);
  // A video recorded in a browser tells its length only after a jump to the end.
  const check = video => {
    if (ready.current) return;
    if (Number.isFinite(video.duration) && video.duration > 0) {
      ready.current = true;
      if (video.currentTime) video.currentTime = 0;
      onReady(video);
    } else if (video.duration === Infinity) {
      video.currentTime = 1e9;
    }
  };
  return <Box>
    <video controls playsInline preload="metadata" style={{ width: '100%', maxWidth: 720, maxHeight: '60vh' }}
      onLoadedMetadata={event => check(event.currentTarget)}
      onDurationChange={event => check(event.currentTarget)} onError={() => setError(true)}>
      <source src={url} type={mime || 'video/mp4'} onError={() => setError(true)} />
    </video>
    {error && <Alert severity="error">動画を読み込めませんでした。ファイルの形式と閲覧権限を確認してください。</Alert>}
    {details}
  </Box>;
}
