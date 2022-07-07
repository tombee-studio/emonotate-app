import React, {useEffect, useState} from 'react';
import {Box, Card} from '@mui/material';
import RequestListComponent from '../components/request-page/RequestListComponent';
import RequireListComponent from '../components/request-page/RequireListComponent';
import RequestListAPI from '../helper/RequestListAPI';

export default function RequestPage(props) {
  const [request, setRequest] = useState([]);
  useEffect(() => {
    const requestAPI = new RequestListAPI();
    Promise.all([
      new Promise(resolve => {
        return requestAPI.get({
          'format': 'json',
          'role': 'participant',
        })
        .then(json => {
          resolve(json.models);
        });
      })
    ])
    .then(values => {
      const [_requests, _requires] = values;
      setRequest(_requests);
    });
  }, []);
  return (
    <Box m={2}>
        <Card m={2}>
            <RequestListComponent requests={request} />
            <RequireListComponent />
        </Card>
    </Box>
  );
}