import React from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import loadable from '@loadable/component';
import PageErrorBoundary from './components/common/PageErrorBoundary';
import { ListSkeleton, PageContainer } from './components/common/PageLayout';

const page = load => loadable(load, { fallback: <PageContainer><ListSkeleton /></PageContainer> });

// Defined once: creating these while rendering would remount the page each time.
const Dashboard = page(() => import('./pages/Dashboard'));
const HistoryPage = page(() => import('./pages/HistoryPage'));
const RequestListPage = page(() => import('./pages/RequestListPage'));
const CurvePage = page(() => import('./pages/CurvePage'));
const ProfilePage = page(() => import('./pages/ProfilePage'));
const ContentListPage = page(() => import('./pages/ContentListPage'));
const ValueTypeListPage = page(() => import('./pages/ValueTypeListPage'));
const RequestPage = page(() => import('./pages/RequestPage'));
const InvitingPage = page(() => import('./pages/InvitingPage'));

const researcherRoutes = [
  <Route key="content" exact path="/app/content/" render={() => <ContentListPage />} />,
  <Route key="word" exact path="/app/word/" render={() => <ValueTypeListPage />} />,
  <Route key="requests" exact path="/app/requests/" render={() => <RequestPage />} />,
  <Route key="request" exact path="/app/requests/:id(\d+)"
    render={({ match }) => <RequestPage id={match.params.id} />} />,
  <Route key="inviting" exact path="/app/inviting/" render={() => <InvitingPage />} />,
];

export default function AppRoutes({ keyword }) {
  const location = useLocation();
  // Each navigation starts its page from scratch, also between two URLs of the
  // same page; the surrounding layout is kept.
  return (
    <PageErrorBoundary key={location.key}>
      <Switch>
        <Route exact path="/app/dashboard/" render={() => <Dashboard keyword={keyword} />} />
        <Route exact path="/app/history/" render={() => <HistoryPage />} />
        <Route exact path="/app/request_list/" render={() => <RequestListPage />} />
        <Route exact path="/app/curves/" render={() => <CurvePage />} />
        <Route path="/app/curves/:id(\d+)" render={({ match }) => <CurvePage id={match.params.id} />} />
        <Route exact path="/app/profile/" render={() => <ProfilePage />} />
        <Route exact path="/app/change_email/" render={() => <Redirect to="/app/profile/" />} />
        {window.django.user.groups.includes('Researchers') && researcherRoutes}
        <Route render={() => <Redirect to="/app/dashboard/" />} />
      </Switch>
    </PageErrorBoundary>
  );
}
