import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LevelProvider } from './components/LevelContext.jsx';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LevelProvider>
        <a className="skip-link" href="#main">Skip to content</a>
        <App />
      </LevelProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
