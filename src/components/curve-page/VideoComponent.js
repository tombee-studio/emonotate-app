import React, { useState } from 'react';
import { Alert, Box } from '@mui/material';

export default function VideoComponent({ url, mime, onReady, details }) {
  const [error, setError] = useState(false);
  return <Box>
    <video controls preload="metadata" style={{ width: '100%', maxWidth: 720 }}
      onLoadedMetadata={event => onReady(event.currentTarget)} onError={() => setError(true)}>
      <source src={url} type={mime || 'video/mp4'} onError={() => setError(true)} />
    </video>
    {error && <Alert severity="error">動画を読み込めませんでした。ファイルの形式と閲覧権限を確認してください。</Alert>}
    {details}
  </Box>;
}
