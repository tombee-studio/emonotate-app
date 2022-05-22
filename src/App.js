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
  const [cookies, setCookie, removeCookie] = useCookies();
  useEffect(() => {
    fetch('/api/me/').then(res => {
      return res.json();
    }).then(user => {
      console.log(user);
      setUserData(user);
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
    return (
      <Router>
        <MainLayout component={keyword => {
          return (<Switch>
            <Route exact path="/">
              { <Redirect to="/app/dashboard/" /> }
            </Route>
            <Route exact path='/app/dashboard/' component={_ => {
              const Dashboard = loadable(() => import('./pages/Dashboard'));
              return <Dashboard keyword={keyword} />
            }} />
            <Route exact path='/app/history/' component={_ => {
              const HistoryPage = loadable(() => import('./pages/HistoryPage'));
              return <HistoryPage />
            }} />
            <Route exact path='/app/requests/' component={_ => {
              const RequestPage = loadable(() => import('./pages/RequestPage'));
              return <RequestPage />;
            }} />
            <Route exact path='/app/content/' component={_ => {
              const ContentListPage = loadable(() => import('./pages/ContentListPage'));
              return <ContentListPage />
            }} />
            <Route exact path='/app/word/' component={_ => {
              const ValueTypeListPage = loadable(() => import('./pages/ValueTypeListPage'));
              return <ValueTypeListPage />;
            }} />
            <Route exact path='/app/curves/' component={ props => {
              const CurvePage = loadable(() => import('./pages/CurvePage'));
              return <CurvePage />;
            }} />
            <Route exact path='/app/rooms/' component={ _ => {
              const RoomPage = loadable(() => import('./pages/RoomPage'));
              return <RoomPage keyword={keyword} />;
            }} />
            <Route path='/app/curves/:id(\d+)' component={ props => {
              const CurvePage = loadable(() => import('./pages/CurvePage'));
              return <CurvePage id={props.match.params.id} />;
            }} />
            <Route exact path='/app/profile/' component={_ => {
              const ProfilePage = loadable(() => import('./pages/ProfilePage'));
              return <ProfilePage />
            }} />
            <Route exact path='/app/login/' component={_ => {
              const LoginPage = loadable(() => import('./pages/LoginPage'));
              return <LoginPage />
            }} />
            <Route exact path='/app/requests/' component={_ => {
              const RequestPage = loadable(() => import('./pages/RequestPage'));
              return <RequestPage />;
            }} />
            <Route exact path='/app/rooms/:id(\d+)' component={ props => {
              const RoomPage = loadable(() => import('./pages/RoomPage'));
              return <RoomPage id={props.match.params.id} keyword={keyword} />;
            }} />
          </Switch>);
        }} />
      </Router>
    );
  }
}

export default App;
