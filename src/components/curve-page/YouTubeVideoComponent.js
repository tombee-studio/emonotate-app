import React, { useRef, useState } from 'react';
import { Alert, Box } from '@mui/material';
import YouTube from 'react-youtube';

export default function YouTubeVideoComponent({ videoId, details, onReady }) {
  const ready = useRef(false);
  const [error, setError] = useState(false);
  const handleReady = event => {
    if (!ready.current && event.target.getDuration() > 0) {
      ready.current = true;
      onReady(event);
    }
  };
  return <Box>
    <Box sx={{ maxWidth: 'min(720px, 80vh)', '& > div': { position: 'relative', pt: '56.25%' },
      '& iframe': { position: 'absolute', inset: 0, width: '100%', height: '100%' } }}>
      <YouTube videoId={videoId} onReady={handleReady} onStateChange={handleReady}
        onError={() => setError(true)} opts={{ width: '100%', height: '100%', playerVars: { controls: 1, playsinline: 1 } }} />
    </Box>
    {error && <Alert severity="error">この動画は埋め込み再生できません。別の動画を選んでください。</Alert>}
    {details}
  </Box>;
}
