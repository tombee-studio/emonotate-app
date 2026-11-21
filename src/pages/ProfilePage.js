import React from 'react';
import { Stack, Typography } from '@mui/material';

export default function ProfilePage() {
  return <Stack m={2} spacing={2}>
    <Typography variant="h5">アカウント</Typography>
    <Typography>{window.django.user.email}</Typography>
  </Stack>;
}
