import React, { useEffect, useState } from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Redirect, 
  Switch } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { useCookies } from "react-cookie";

import Dashboard from './pages/Dashboard';
import HistoryPage from './pages/HistoryPage';
import RequestPage from './pages/RequestPage';
import ContentListPage from './pages/ContentListPage';
import ValueTypeListPage from './pages/ValueTypeListPage';
import RoomPage from './pages/RoomPage';
import ProfilePage from './pages/ProfilePage';
import CurvePage from './pages/CurvePage';
import LoginPage from './pages/LoginPage';

const App = () => {
  const [userData, setUserData] = useState({});
  const [userLoadedFlag, setUserLoadedFlag] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies();
  useEffect(() => {
    fetch('/api/me/').then(res => {
      return res.json();
    }).then(user => {
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
              return <Dashboard keyword={keyword} />
            }} />
            <Route exact path='/app/history/' component={_ => {
              return <HistoryPage />
            }} />
            <Route exact path='/app/requests/' component={_ => {
              return <RequestPage />;
            }} />
            <Route exact path='/app/content/' component={_ => {
              return <ContentListPage />
            }} />
            <Route exact path='/app/word/' component={_ => {
              return <ValueTypeListPage />;
            }} />
            <Route exact path='/app/curves/' component={ props => {
              return <CurvePage />;
            }} />
            <Route exact path='/app/rooms/' component={ _ => {
              return <RoomPage keyword={keyword} />;
            }} />
            <Route path='/app/curves/:id(\d+)' component={ props => {
              return <CurvePage id={props.match.params.id} />;
            }} />
            <Route exact path='/app/profile/' component={_ => {
              return <ProfilePage />
            }} />
            <Route exact path='/app/login/' component={_ => {
              return <LoginPage />
            }} />
            <Route exact path='/app/requests/' component={_ => {
              return <RequestPage />;
            }} />
            <Route exact path='/app/rooms/:id(\d+)' component={ props => {
              return <RoomPage id={props.match.params.id} keyword={keyword} />;
            }} />
          </Switch>);
        }} />
      </Router>
    );
  }
}

export default App;
