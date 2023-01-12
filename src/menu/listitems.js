import React from 'react';
import { Badge, ListSubheader } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import MovieIcon from '@mui/icons-material/Movie';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import MailIcon from '@mui/icons-material/Mail';
import PersonIcon from '@mui/icons-material/Person';
import LoyaltyIcon from '@mui/icons-material/Loyalty';

export const mainListItems = (numRequest) => {
  const { user } = window.django;
  const items = [];
  items.push(<ListSubheader>一般</ListSubheader>);
  items.push(<ListItem button component="a" href="/app/dashboard/">
    <ListItemIcon>
      <HomeIcon />
    </ListItemIcon>
    <ListItemText primary="ホーム" />
  </ListItem>);
  items.push(<ListItem button component="a" href="/app/profile/">
    <ListItemIcon>
      <PersonIcon />
    </ListItemIcon>
    <ListItemText primary="プロファイル" />
  </ListItem>);
  items.push(<ListItem button component="a" href="/app/history/">
    <ListItemIcon>
      <HistoryIcon />
    </ListItemIcon>
    <ListItemText primary="履歴" />
  </ListItem>);
  items.push(<ListItem button component="a" href="/app/request_list/">
    <ListItemIcon>
    <Badge badgeContent={numRequest} color="primary">
      <MailIcon />
    </Badge>
    </ListItemIcon>
    <ListItemText primary="リクエスト" />
  </ListItem>);
  if(user.groups.includes("Researchers")) {
    items.push(<ListSubheader>研究者</ListSubheader>);
    items.push(<ListItem button component="a" href="/app/content/">
      <ListItemIcon>
        <MovieIcon />
      </ListItemIcon>
      <ListItemText primary="コンテンツ" />
    </ListItem>);
    items.push(<ListItem button component="a" href="/app/word/">
      <ListItemIcon>
        <TextFormatIcon />
      </ListItemIcon>
      <ListItemText primary="表現語" />
    </ListItem>);
    items.push(<ListItem button component="a" href="/app/inviting/">
      <ListItemIcon>
        <LoyaltyIcon />
      </ListItemIcon>
      <ListItemText primary="招待" />
    </ListItem>);
  }
  if(user.is_staff) {
    items.push(<ListSubheader>開発者</ListSubheader>);
  }
  return <>{items}</>;
};
