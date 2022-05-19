import React from 'react';
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

const App = () => {
  const [cookies, setCookies, removeCookies] = useCookies(undefined);
  if(!cookies.username) {
    if(process.env.STAGING == "local") {
      return <Redirect to={"http://127.0.0.1:8000/"} />
    } else if(process.env.STAGING == "alpha") {
      return <Redirect to={"https://enigmatic-thicket-08912.herokuapp.com/"} />
    } else if(process.env.STAGING == "prod") {
      return <Redirect to={"https://www.emonotate.com/"} />
    }
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
