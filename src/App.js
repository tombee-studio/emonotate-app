import React, { useEffect, useState } from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Redirect, 
  Switch } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { useCookies } from "react-cookie";
import { LoadingScreen, ErrorScreen, LandingScreen } from "./components/common/StatusScreens";

import loadable from "@loadable/component";

const App = () => {
  const [userData, setUserData] = useState({});
  const [userLoadedFlag, setUserLoadedFlag] = useState(false);
  const [isAuthenticatedFlag, setAuthenticatedFlag] = useState(false);
  const [error, setError] = useState(false);
  const [cookies] = useCookies();
  useEffect(() => {
    fetch('/api/me/', { cache: 'no-store' }).then(res => {
      if(res.status === 200) {
        return res.json();
      } else {
        throw res;
      }
    }).then(user => {
      setUserData(user);
      setAuthenticatedFlag(true);
      setUserLoadedFlag(true);
    }).catch(err => {
      setError(err.status !== 401 && err.status !== 403);
      setUserLoadedFlag(true);
    });
  }, []);
  if(error) return <ErrorScreen />;
  if(!userLoadedFlag) {
    return <LoadingScreen />;
  } else {
    window.django = {
      user: userData,
      csrf: cookies.csrftoken,
      YOUTUBE_API_KEY: process.env.REACT_APP_YOUTUBE_API_KEY
    };
    if(isAuthenticatedFlag) {
      return (
        <Router>
          <MainLayout component={keyword => {
            const { user } = window.django;
            const entries = [];
            entries.push(<Route exact path="/">
              { <Redirect to="/app/dashboard/" /> }
            </Route>);
            entries.push(<Route exact path='/app/dashboard/' component={_ => {
              const Dashboard = loadable(() => import('./pages/Dashboard'));
              return <Dashboard keyword={keyword} />
            }} />);
            entries.push(<Route exact path='/app/history/' component={_ => {
              const HistoryPage = loadable(() => import('./pages/HistoryPage'));
              return <HistoryPage />
            }} />);
            entries.push(<Route exact path='/app/request_list/' component={_ => {
              const RequestListPage = loadable(() => import('./pages/RequestListPage'));
              return <RequestListPage />;
            }} />);
            entries.push(<Route exact path='/app/curves/' component={ props => {
              const CurvePage = loadable(() => import('./pages/CurvePage'));
              return <CurvePage />;
            }} />);
            entries.push(<Route path='/app/curves/:id(\d+)' component={ props => {
              const CurvePage = loadable(() => import('./pages/CurvePage'));
              return <CurvePage id={props.match.params.id} />;
            }} />);
            entries.push(<Route exact path='/app/profile/' component={_ => {
              const ProfilePage = loadable(() => import('./pages/ProfilePage'));
              return <ProfilePage />
            }} />);
            entries.push(<Route exact path='/app/login/' >
              <Redirect to="/app/dashboard/" />
            </Route>);
            entries.push(<Route exact path='/app/signup/' >
              <Redirect to="/app/dashboard/" />
            </Route>);
            entries.push(<Route exact path='/app/change_email/' render={() => <Redirect to='/app/profile/' />}>
            </Route>);
            if(userData.groups.includes("Researchers")) {
              entries.push(<Route exact path='/app/content/' component={_ => {
                const ContentListPage = loadable(() => import('./pages/ContentListPage'));
                return <ContentListPage />
              }} />);
              entries.push(<Route exact path='/app/word/' component={_ => {
                const ValueTypeListPage = loadable(() => import('./pages/ValueTypeListPage'));
                return <ValueTypeListPage />;
              }} />);
              entries.push(<Route exact path='/app/requests/' component={ _ => {
                const RequestPage = loadable(() => import('./pages/RequestPage'));
                return <RequestPage keyword={keyword} />;
              }} />);
              entries.push(<Route exact path='/app/requests/:id(\d+)' component={props => {
                const RequestPage = loadable(() => import('./pages/RequestPage'));
                return <RequestPage id={props.match.params.id} />;
              }} />);
              entries.push(<Route exact path='/app/inviting/' component={_ => {
                const InvitingPage = loadable(() => import('./pages/InvitingPage'));
                return <InvitingPage />;
              }} />);
            }
            if(user.is_staff) {
            }
            entries.push(<Route>
              { <Redirect to="/app/dashboard/" /> }
            </Route>);
            return (<Switch>{entries}</Switch>);
          }} />
        </Router>
      );
    } else {
      return <LandingScreen />;
    }
  }
}

export default App;
