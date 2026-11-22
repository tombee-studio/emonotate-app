import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import { mainListItems } from '../menu/listitems';
import { useColorMode } from '../colorMode';
import { tokens } from '../theme';

import AuthenticateComponent from '../components/common/AuthenticateComponent';
import RequestListAPI from '../helper/RequestListAPI';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://www.emonotate.com/">
        emonotate.com
      </Link>{' '}
      2021 - {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Brand = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 3, height: tokens.topBarHeight }}>
    <Box
      sx={{
        width: 32, height: 32, borderRadius: 2,
        background: (t) => `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
      }}
    />
    <Typography variant="h6" component="span" sx={{ letterSpacing: '-0.02em' }}>
      emonotate
    </Typography>
  </Box>
);

export default function MainLayout(props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [numRequest, setNumRequest] = useState(undefined);
  const [keyword, setKeyword] = useState('');
  const { mode, setPreference } = useColorMode();
  const isDesktop = useMediaQuery((t) => t.breakpoints.up('md'));
  const { component } = props;
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    // Back and forward keep the scroll position restored by the browser.
    if (history.action !== 'POP') window.scrollTo(0, 0);
  }, [location.key]);

  useEffect(() => {
    let active = true;
    const api = new RequestListAPI();
    api.get({ format: 'json', role: 'participant' })
      .then(data => { if (active) setNumRequest(data.models.length); })
      .catch(() => {});
    return () => { active = false; };
  }, [location.key]);

  const nav = (
    <Box component="nav" aria-label="main navigation" sx={{ height: '100%', overflowY: 'auto' }}>
      <Brand />
      <List disablePadding sx={{ pb: 2 }}>{mainListItems(numRequest, location.pathname)}</List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {isDesktop ? (
        <Drawer
          variant="permanent"
          sx={{
            width: tokens.sidebarWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: tokens.sidebarWidth,
              boxSizing: 'border-box',
              borderRight: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            },
          }}
          open
        >
          {nav}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: tokens.sidebarWidth, boxSizing: 'border-box' } }}
        >
          {nav}
        </Drawer>
      )}

      <Box sx={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <AppBar
          position="sticky"
          color="inherit"
          elevation={0}
          sx={{
            bgcolor: (t) => alpha(t.palette.background.paper, 0.8),
            backdropFilter: 'blur(12px)',
            borderBottom: 1,
            borderColor: 'divider',
            color: 'text.primary',
          }}
        >
          <Toolbar sx={{ minHeight: tokens.topBarHeight, gap: 1 }}>
            {!isDesktop && (
              <IconButton edge="start" aria-label="open navigation" onClick={() => setMobileOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                flexGrow: { xs: 1, md: 0 },
                width: { md: 360 },
                borderRadius: 5,
                bgcolor: (t) => alpha(t.palette.text.primary, 0.06),
                transition: 'background-color .15s, box-shadow .15s',
                '&:hover': { bgcolor: (t) => alpha(t.palette.text.primary, 0.09) },
                '&:focus-within': { boxShadow: (t) => `0 0 0 2px ${t.palette.primary.main}` },
              }}
            >
              <SearchIcon fontSize="small" sx={{ ml: 1.5, color: 'text.secondary' }} />
              <InputBase
                placeholder="検索…"
                value={keyword}
                inputProps={{ 'aria-label': 'search' }}
                onChange={ev => setKeyword(ev.target.value)}
                sx={{ flexGrow: 1, px: 1, py: 0.5 }}
              />
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Tooltip title={mode === 'dark' ? 'ライトモード' : 'ダークモード'}>
              <IconButton
                aria-label="toggle color mode"
                onClick={() => setPreference(mode === 'dark' ? 'light' : 'dark')}
              >
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            <AuthenticateComponent />
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
          {component(keyword)}
        </Box>
        <Box sx={{ py: 3 }}>
          <Copyright />
        </Box>
      </Box>
    </Box>
  );
}
