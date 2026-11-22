import React from 'react';
import { Alert, Button } from '@mui/material';
import { PageContainer } from './PageLayout';

// Keeps the header and menu when a page cannot be drawn, e.g. when its script
// was replaced by a newer release. Reloading picks up the current release.
export default class PageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return <PageContainer>
      <Alert severity="error" action={
        <Button color="inherit" size="small" onClick={() => window.location.reload()}>再読み込み</Button>
      }>画面を表示できませんでした。</Alert>
    </PageContainer>;
  }
}
