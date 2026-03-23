import React from 'react';
import ReactDOM from 'react-dom/client';
import { TDSMobileProvider } from '@toss/tds-mobile';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TDSMobileProvider
      userAgent={{
        fontA11y: undefined,
        fontScale: 100,
        isAndroid: false,
        isIOS: false,
        colorPreference: 'light',
      }}
    >
      <App />
    </TDSMobileProvider>
  </React.StrictMode>
);
