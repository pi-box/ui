import React from 'react';
import ReactDOM from 'react-dom/client';
import { SnackbarProvider } from 'notistack';

import App from './App';
import RTL from './RTL';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<SnackbarProvider maxSnack={3} autoHideDuration={2000}>
		<RTL><App /></RTL>
  </SnackbarProvider>,
);
