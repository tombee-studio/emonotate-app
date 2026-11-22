import React from 'react';
import { Pagination, Box, Avatar, Grid, IconButton, 
  List, ListItem, ListItemAvatar, ListItemSecondaryAction, 
  ListItemText, Typography, ButtonGroup, Button, SliderThumb } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import TimelineIcon from '@mui/icons-material/Timeline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CurvesListAPI from '../../helper/CurvesListAPI';
import EmonotateAPI from '../../helper/EmonotateAPI';
import { linkProps, useAppNavigate } from '../../navigation';
import { EmptyState } from './PageLayout';

const styles = (theme) => ({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
});

const CurvesListComponent = props => {
  const { curves, handlePaginate, classes } = props;
  const navigate = useAppNavigate();
  const curvePath = curve => curve.version === "arc-1" || !curve.content.is_youtube ?
    `/app/curves/${curve.id}/` :
    curve.kind == 1 ? `/free-hand/${curve.id}` : `/fold-line/${curve.id}`;
  const handleOnClickButtonToDownloadAllCurve = (ev) => {
    const api = new EmonotateAPI();
    api.get("download_curve_data", {})
    .then(data => {
      const transport = (json) => {
        const link = document.createElement('a');
        document.body.appendChild(link);
        link.href = json["url"];
        link.setAttribute('download', json["file_name"]);
        link.click();
        document.body.removeChild(link);
      }
      console.log(data);
      transport(data);
    })
    .catch(err => {
      console.log(err);
    });
  };
  return (
    <Box className={classes.root}>
      <Box m={2}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" component="h3">
              これまでに描いた感情曲線
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Pagination 
              count={curves.pagination.total_pages}
              variant="outlined" 
              shape="rounded"
              onChange={handlePaginate} />
          </Grid>
        </Grid>
        {curves.models.length === 0 && <EmptyState message="まだ感情曲線がありません" hint="ホームから素材を選んで描いてみましょう" />}
        <List>
          {
            curves.models.map(curve => {
              return (
                <ListItem
                  key={curve.id}>
                  <ListItemAvatar>
                    <Avatar>
                      <TimelineIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={ curve.content.title }
                    secondary={ curve.value_type.title }
                  />
                  { !curve.locked ?
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        {...linkProps(curvePath(curve))}
                        size="large">
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={_ => {
                          const api = new CurvesListAPI();
                          api.delete(curve.id, {
                            'format': 'json'
                          })
                          .then(res => {
                              if(res.ok) {
                                navigate('/app/history/');
                              }
                          });
                        }}
                        size="large">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction> :
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        {...linkProps(curvePath(curve))}
                        size="large">
                        <VisibilityIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  }
                </ListItem>
              );
            })
          }
        </List>
        <ButtonGroup sx={{ mt: 2 }}>
          <Button 
            variant="contained"
            onClick={handleOnClickButtonToDownloadAllCurve} >過去に描いた全ての感情曲線をダウンロードする</Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
};

export default withStyles(styles)(CurvesListComponent);
