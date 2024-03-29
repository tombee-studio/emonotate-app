import React from 'react';
import Box from '@mui/material/Box';
import { Divider } from '@mui/material';
import AddContent from '../components/content-list-page/AddContent';
import ContentsListAPI from '../helper/ContentsListAPI';
import ContentsHistoryList from '../components/content-list-page/ContentsHistoryList';

export default function Dashboard(props) {
  const postAPI = new ContentsListAPI();

  return (
    <Box m={2}>
      <AddContent postAPI={data => {
        postAPI.post(data)
          .then(res => {
            return res.json();
          })
          .then(_ => {
            window.location.href = '/';
          });
      }} />
      <Divider />
      <Box m={1}>
        <ContentsHistoryList />
      </Box>
    </Box>
  );
}
