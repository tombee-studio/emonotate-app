import React from 'react';
import { Box, Divider } from '@mui/material';
import AddContent from '../components/content-list-page/AddContent';
import ContentsHistoryList from '../components/content-list-page/ContentsHistoryList';

export default function ContentListPage() {
  return <Box m={2}><AddContent /><Divider /><ContentsHistoryList /></Box>;
}
