import React from 'react';

import IconButton from '@mui/material/IconButton';

import { Login, Logout } from '@mui/icons-material';

import AuthenticateAPI from '../../helper/AuthenticateAPI';

const AuthenticateComponent = props => {
  return <IconButton
    edge="end"
    aria-label="account of current user"
    aria-haspopup="true"
    color="inherit"
    size="large"
    onClick={_ => {
      const api = new AuthenticateAPI();
      api.logout().then(_ => {
        window.location = '/';
      });
    }}>
    <Logout />
  </IconButton>;
};

export default AuthenticateComponent;
