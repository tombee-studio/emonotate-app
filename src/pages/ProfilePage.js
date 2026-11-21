import React from 'react';
import { Typography } from '@mui/material';
import { PageContainer, Section } from '../components/common/PageLayout';

export default function ProfilePage() {
  return <PageContainer title="プロファイル" maxWidth="md">
    <Section title="アカウント">
      <Typography color="text.secondary" variant="body2">メールアドレス</Typography>
      <Typography>{window.django.user.email}</Typography>
    </Section>
  </PageContainer>;
}
