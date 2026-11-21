import React from 'react';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { Login, Logout } from '@mui/icons-material';

import AuthenticateAPI from '../../helper/AuthenticateAPI';

const AuthenticateComponent = props => {
  return <Tooltip title="ログアウト"><IconButton
    edge="end"
    aria-label="logout"
    aria-haspopup="true"
    color="inherit"
    size="large"
    onClick={_ => {
      const api = new AuthenticateAPI();
      api.logout().then(result => {
        window.location.assign(result.url);
      });
    }}>
    <Logout />
  </IconButton></Tooltip>;
};

export default AuthenticateComponent;
