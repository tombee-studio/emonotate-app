import React from 'react';
import { Pagination, Card, Divider, Grid, ImageListItem, Box, ImageList, ImageListItemBar } from '@mui/material';
import { ListSkeleton } from '../common/PageLayout';
import withStyles from '@mui/styles/withStyles';
import { linkProps } from '../../navigation';
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
          <ImageList gap={16} sx={{ gridTemplateColumns: { xs: 'repeat(1, 1fr) !important', sm: 'repeat(2, 1fr) !important', lg: 'repeat(4, 1fr) !important' } }}>
            {
              contents.models.map(content => (
                <ImageListItem
                  key={content.id} 
                  {...linkProps('/app/new/' + content.id)}>
                  <img
                    srcSet={`https://picsum.photos/640/480/?random`}
                    alt={content.title}
                  />
                  <ImageListItemBar
                    title={content.title}
                    subtitle={<span>added by: {content.user.username}</span>}
                  />
                </ImageListItem>
              ))
            }
          </ImageList>
        </Box>
      );
    } else {
      return (
        <ListSkeleton />
      );
    }
  };
}

export default withStyles(styles)(UsersList);
