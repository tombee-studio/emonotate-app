import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import SearchResultList from '../components/common/SearchResultList';
import { withStyles } from '@mui/styles';
import EmonotateAPI from '../helper/EmonotateAPI';

const styles = (theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
});

const Dashboard = (props) => {
  const { classes, keyword } = props;
  const api = new EmonotateAPI();
  useEffect(() => {
    api.get()
      .then(json => {
        console.log(json);
      });
  }, []);
  return (
    <Box m={2}>
      <SearchResultList keyword={keyword} />
    </Box>
  );
}

export default withStyles(styles)(Dashboard);
