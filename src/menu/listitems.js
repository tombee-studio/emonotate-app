import React from 'react';
import { Badge, ListSubheader } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import MovieIcon from '@mui/icons-material/Movie';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import MailIcon from '@mui/icons-material/Mail';
import PersonIcon from '@mui/icons-material/Person';
import LoyaltyIcon from '@mui/icons-material/Loyalty';

const NavItem = ({ href, icon, label, active }) => (
  <ListItemButton
    component="a"
    href={href}
    selected={active}
    aria-current={active ? 'page' : undefined}
    sx={{
      mx: 1.5,
      mb: 0.5,
      py: 1,
      transition: 'background-color .15s, color .15s',
      '&.Mui-selected': {
        bgcolor: 'action.selected',
        color: 'primary.main',
        '& .MuiListItemIcon-root': { color: 'primary.main' },
        '& .MuiListItemText-primary': { fontWeight: 600 },
      },
    }}
  >
    <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
    <ListItemText primary={label} primaryTypographyProps={{ variant: 'body2' }} />
  </ListItemButton>
);

const Section = ({ children }) => (
  <ListSubheader
    disableSticky
    sx={{ bgcolor: 'transparent', lineHeight: '32px', mt: 1.5, px: 3, fontSize: 12, letterSpacing: '0.06em' }}
  >
    {children}
  </ListSubheader>
);

// Menu entries are filtered by role exactly as before (Researchers / is_staff).
export const mainListItems = (numRequest) => {
  const { user } = window.django;
  const path = window.location.pathname;
  const isActive = (prefix) => path.startsWith(prefix);

  const profileIcon = user.notifications.profile.length > 0
    ? <Badge variant="dot" color="primary"><PersonIcon /></Badge>
    : <PersonIcon />;

  return (
    <>
      <Section>一般</Section>
      <NavItem href="/app/dashboard/" icon={<HomeIcon />} label="ホーム" active={isActive('/app/dashboard/')} />
      <NavItem href="/app/profile/" icon={profileIcon} label="プロファイル" active={isActive('/app/profile/')} />
      <NavItem href="/app/history/" icon={<HistoryIcon />} label="履歴" active={isActive('/app/history/')} />
      <NavItem
        href="/app/request_list/"
        icon={<Badge badgeContent={numRequest} color="primary"><MailIcon /></Badge>}
        label="リクエスト"
        active={isActive('/app/request_list/')}
      />
      {user.groups.includes('Researchers') && (
        <>
          <Section>研究者</Section>
          <NavItem href="/app/content/" icon={<MovieIcon />} label="コンテンツ" active={isActive('/app/content/')} />
          <NavItem href="/app/word/" icon={<TextFormatIcon />} label="表現語" active={isActive('/app/word/')} />
          <NavItem href="/app/inviting/" icon={<LoyaltyIcon />} label="招待" active={isActive('/app/inviting/')} />
        </>
      )}
      {user.is_staff && <Section>開発者</Section>}
    </>
  );
};
