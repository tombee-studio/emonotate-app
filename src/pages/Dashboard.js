import React from 'react';
import AddContent from '../components/content-list-page/AddContent';
import SearchResultList from '../components/common/SearchResultList';
import { PageContainer } from '../components/common/PageLayout';
import { withStyles } from '@mui/styles';

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
  return (
    <PageContainer title="ホーム" subtitle="素材を選んで感情曲線を描きましょう">
      <AddContent />
      {window.django.YOUTUBE_API_KEY && <SearchResultList keyword={keyword} />}
    </PageContainer>
  );
}

export default withStyles(styles)(Dashboard);
