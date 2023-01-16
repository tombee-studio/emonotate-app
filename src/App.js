import React, { useEffect, useState } from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Redirect, 
  Switch } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { useCookies } from "react-cookie";

import loadable from "@loadable/component";

const App = () => {
  const [userData, setUserData] = useState({});
  const [userLoadedFlag, setUserLoadedFlag] = useState(false);
  const [isAuthenticatedFlag, setAuthenticatedFlag] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies();
  useEffect(() => {
    fetch('/api/me/').then(res => {
      if(res.status == 200) {
        return res.json();
      } else {
        throw res;
      }
    }).then(user => {
      setUserData(user);
      setAuthenticatedFlag(true);
      setUserLoadedFlag(true);
    }).catch(_ => {
      setUserLoadedFlag(true);
    });
  }, []);
  if(!userLoadedFlag) {
    return <h1>少々お待ちください</h1>;
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
            entries.push(<Route exact path='/app/change_email/' component={_ => {
              const ChangeEmailPage = loadable(() => import('./pages/ChangeEmailPage'));
              return <ChangeEmailPage />
            }}>
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
      return <Router>
        <Switch>
          <Route exact path='/'>
            <Redirect to="/app/login/" />
          </Route>
          <Route exact path='/app/login/' component={_ => {
            const LoginPage = loadable(() => import('./pages/LoginPage'));
            return <LoginPage />
          }} />
          <Route exact path='/app/signup/' component={_ => {
            const SignupPage = loadable(() => import('./pages/SignupPage'));
            return <SignupPage />
          }} />
          <Route exact path='/app/reset_password/' component={_ => {
            const PasswordResetPage = loadable(() => import('./pages/PasswordResetPage'));
            return <PasswordResetPage />
          }} />
        </Switch>
      </Router>;
    }
  }
}

export default App;
