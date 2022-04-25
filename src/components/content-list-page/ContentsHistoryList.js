import React from 'react';
import { Pagination } from '@mui/material';
import { Card, Divider, Grid, ImageListItem } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import { Box, ImageList, ImageListItemBar } from '@mui/material';
import ContentsListAPI from '../../helper/ContentsListAPI';

const styles = (theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
});

class UsersList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.api = new ContentsListAPI();
  }

  componentDidMount() {
    this.api.history(
      contents => {
        this.setState({
          contents: contents
        });
      },
      err => {
        throw err;
      });
  }

  render() {
    const { classes } = this.props;
    const { contents } = this.state;
    const handlePaginate = (e, page) => {
      this.api.history(
        contents => {
          this.setState({
            contents: contents
          });
        },
        err => {
          throw err;
        },
        page);
    };
    if(contents) {
      return (
        <Box className={classes.root}>
          <Box m={2}>
            <Pagination 
              count={contents.pagination.total_pages}
              variant="outlined" 
              shape="rounded"
              onChange={handlePaginate} />
          </Box>
          <ImageList cols={4} gap={16} style={{bgcolor: "#000"}}>
            {
              contents.models.map(content => (
                <ImageListItem
                  key={content.id} 
                  component="a" 
                  href={'/app/new/' + content.id}>
                  <img
                    srcSet={`https://picsum.photos/640/480/?random`}
                    alt={content.title}
                  />
                  <ImageListItemBar
                    title={content.title}
                    subtitle={<span>added by: {content.user.email}</span>}
                  />
                </ImageListItem>
              ))
            }
          </ImageList>
        </Box>
      );
    } else {
      return (
        <Card>
          <Box>
            LOAD DATA...
          </Box>
        </Card>
      );
    }
  };
}

export default withStyles(styles)(UsersList);