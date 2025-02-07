import React from 'react';
import ReactDOM from 'react-dom/client';
import { SnackbarProvider } from 'notistack';

import App from './App';
import RTL from './RTL';

/**
 * Entry Point for Pi-Box UI
 * 
 * This file initializes the React application and renders it inside the root div.
 * It also wraps the app with providers for notifications and RTL support.
 * 
 * Features:
 * - Uses ReactDOM to render the app
 * - Wraps the app with `SnackbarProvider` for notifications
 * - Wraps the app with `RTL` for right-to-left (RTL) language support
 * 
 * Usage:
 * This file should be the main entry point in the React app (referenced in `index.html`).
 */

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
    <RTL>
      <App />
    </RTL>
  </SnackbarProvider>,
);
