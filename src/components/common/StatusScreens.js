import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import CloudOffIcon from '@mui/icons-material/CloudOff';

const Centered = ({ children }) => (
  <Box
    component="main"
    sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3,
      bgcolor: 'background.default',
      backgroundImage: (t) =>
        `radial-gradient(60% 50% at 50% 0%, ${t.palette.primary.main}22, transparent)`,
    }}
  >
    {children}
  </Box>
);

export const LoadingScreen = () => (
  <Centered>
    <Box role="status" sx={{ textAlign: 'center' }}>
      <CircularProgress size={36} />
      <Typography variant="h6" sx={{ mt: 2 }}>少々お待ちください</Typography>
    </Box>
  </Centered>
);

export const ErrorScreen = () => (
  <Centered>
    <Card sx={{ maxWidth: 420, p: 4, textAlign: 'center' }}>
      <CloudOffIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
      <Typography variant="h6" sx={{ mt: 1 }}>サーバーに接続できませんでした。</Typography>
      <Button variant="contained" sx={{ mt: 3 }} onClick={() => window.location.reload()}>
        再試行
      </Button>
    </Card>
  </Centered>
);

export const LandingScreen = () => (
  <Centered>
    <Card sx={{ maxWidth: 480, p: { xs: 3, sm: 5 }, textAlign: 'center' }}>
      <Box
        sx={{
          width: 48, height: 48, borderRadius: 3, mx: 'auto', mb: 2,
          background: (t) => `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
        }}
      />
      <Typography variant="h4" component="h1">Emonotate</Typography>
      <Typography color="text.secondary" sx={{ mt: 1.5, mb: 4 }}>
        YouTube、動画、テキストに感情曲線を描けます。
      </Typography>
      <Button variant="contained" size="large" fullWidth href="/api/cognito/login/">
        ログイン・新規登録
      </Button>
    </Card>
  </Centered>
);
