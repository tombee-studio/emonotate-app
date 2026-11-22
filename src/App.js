import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import AppRoutes from './AppRoutes';
import MainLayout from './layouts/MainLayout';
import { LoadingScreen, ErrorScreen, LandingScreen } from "./components/common/StatusScreens";

const fetchMe = () => fetch('/api/me/', { cache: 'no-store' }).then(res => {
  if(res.status === 200) {
    return res.json();
  } else {
    throw res;
  }
});

const isSignedOut = err => err.status === 401 || err.status === 403;

// Checks the session in the background on each move between pages.
const SessionCheck = ({ onNavigate }) => {
  const { key } = useLocation();
  const initial = useRef(true);
  useEffect(() => {
    if(initial.current) {
      initial.current = false;
    } else {
      onNavigate();
    }
  }, [key]);
  return null;
};

const App = () => {
  const [userData, setUserData] = useState({});
  const [userLoadedFlag, setUserLoadedFlag] = useState(false);
  const [isAuthenticatedFlag, setAuthenticatedFlag] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    fetchMe().then(user => {
      setUserData(user);
      setAuthenticatedFlag(true);
      setUserLoadedFlag(true);
    }).catch(err => {
      setError(!isSignedOut(err));
      setUserLoadedFlag(true);
    });
  }, []);
  const refreshUser = () => {
    fetchMe().then(setUserData).catch(err => {
      if(isSignedOut(err)) setAuthenticatedFlag(false);
    });
  };
  if(error) return <ErrorScreen />;
  if(!userLoadedFlag) return <LoadingScreen />;
  if(!isAuthenticatedFlag) return <LandingScreen />;
  window.django = {
    user: userData,
    // Read when used: the cookie can change while the document stays open.
    get csrf() { return new Cookies().get('csrftoken'); },
    YOUTUBE_API_KEY: process.env.REACT_APP_YOUTUBE_API_KEY
  };
  return (
    <Router>
      <SessionCheck onNavigate={refreshUser} />
      <MainLayout component={keyword => <AppRoutes keyword={keyword} />} />
    </Router>
  );
}

export default App;
