import React from 'react';
import { Box, Card } from '@mui/material';
import RequestListComponent from '../components/request-page/RequestListComponent';
import RequireListComponent from '../components/request-page/RequireListComponent';
import RelativeUserRequestList from '../components/request-page/RelativeUserRequestList';

const RequestListPage = (props) => {
  const { user } = window.django;

  const createReuquestList = user => {
    const list = [];
    list.push(<RequestListComponent />);
    if(user.groups.includes("Researchers")) {
      list.push(<RequireListComponent />);
      list.push(<RelativeUserRequestList />);
    }
    return list;
  };

  return (
    <Box m={2}>
        <Card m={2}>
          { createReuquestList(user) }
        </Card>
    </Box>
  );
}

export default RequestListPage;
