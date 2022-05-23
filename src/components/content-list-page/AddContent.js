import { Stack, Button, TextField, Box, CircularProgress } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect, useState } from 'react';

import { initMovieLoader } from '../../helper/file-direct-upload';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '25ch',
  },
  inputFileBtnHide: {
    opacity:0,
    appearance: "none",
    position: "absolute",
  }
}));

const AddContent = (props) => {
  const classes = useStyles();
  const [title, setTitle] = useState('');
  const [url, setURL] = useState('');
  const [progress, setProgress] = useState(0);
  const { postAPI } = props;
  const { user } = window.django;
  const handleSubmit = event => {
    event.preventDefault();
    const data = {
      'user': user.id,
      'title': title,
      'url': url,
      'data_type': 'video/mp4',
    };
    postAPI(data);
  };

  useEffect(() => {
    initMovieLoader(setURL, setProgress);
  }, []);

  return (
    <Box m={1}>
      <form className={classes.root} onSubmit={handleSubmit}>
        <TextField
          style={{ margin: 8 }}
          fullWidth
          id="title"
          label="タイトル"
          required={true}
          value={title}
          onInput={ e=>setTitle(e.target.value)} />
        <Stack direction="row" spacing={2}>
          <Button
            component="label"
          >
            ファイルを選択
            <input
              type="file"
              id="id_file"
              className={classes.inputFileBtnHide}
            />
          </Button>
          <CircularProgress variant="determinate" value={progress} />
        </Stack>
        <TextField
          style={{ margin: 8 }}
          placeholder="URL"
          fullWidth
          id="id_movie"
          label="URL"
          id="id_movie"
          required={true}
          value={url}
          onChange={value => setURL(value)}
          />
        <Button
          id="button"
          type="submit"
          color="primary"
          variant="contained">
            送信
        </Button>
      </form>
    </Box>
  );
};

export default AddContent;
