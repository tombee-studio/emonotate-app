import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ColorModeProvider } from './colorMode';
import './index.css';

ReactDOM.render(
  <ColorModeProvider>
    <App />
  </ColorModeProvider>,
  document.getElementById('root'),
);
