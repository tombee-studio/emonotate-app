import React, { useEffect, useState } from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Redirect, 
  Switch } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import HistoryPage from './pages/HistoryPage';
import RequestPage from './pages/RequestPage';
import ContentListPage from './pages/ContentListPage';
import ValueTypeListPage from './pages/ValueTypeListPage';
import RoomPage from './pages/RoomPage';
import ProfilePage from './pages/ProfilePage';
import CurvePage from './pages/CurvePage';
import LoginPage from './pages/LoginPage';

import EmonotateAPI from './helper/EmonotateAPI';

const App = () => {
  const [cookies, setCookies, removeCookies] = useCookies(undefined);
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    const api = new EmonotateAPI();
    api.get()
    .then(res => {
      setFlag(true);
    });
  }, []);

  if(!flag) {
    return <h1>Just a minutes</h1>
  } else {
    window.django = {
      user: cookies,
      YOUTUBE_API_KEY: process.env.REACT_APP_YOUTUBE_API_KEY
    };
    return (
      <Router>
        <MainLayout component={keyword => {
          return (<Switch>
            <Route exact path="/">
              { <Redirect to="/app/dashboard/" /> }
            </Route>
            <Route exact path='/app/dashboard/' render={_ => <Dashboard keyword={keyword} />} />
            <Route exact path='/app/history/' component={ HistoryPage } />
            <Route exact path='/app/requests/' component={ RequestPage } />
            <Route exact path='/app/content/' component={ ContentListPage } />
            <Route exact path='/app/word/' component={ ValueTypeListPage } />
            <Route exact path='/app/curves/' render={ props => <CurvePage /> } />
            <Route exact path='/app/rooms/' component={ _ => 
              <RoomPage keyword={keyword} />
            } />
            <Route path='/app/curves/:id(\d+)' component={ props => <CurvePage id={props.match.params.id} /> } />
            <Route exact path='/app/profile/' component={ ProfilePage } />
            <Route exact path='/app/login/' component={ LoginPage } />
            <Route exact path='/app/requests/' component={ RequestPage } />
            <Route exact path='/app/rooms/:id(\d+)' component={ props => 
              <RoomPage id={props.match.params.id} keyword={keyword} />
            } />
          </Switch>);
        }} />
      </Router>
    );
  }
}

export default App;
