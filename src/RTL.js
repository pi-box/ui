import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { heIL } from '@mui/material/locale';

import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

const theme = createTheme({
  direction: 'rtl',
	palette: {
		
		primary: {
			main: '#3f50b5',
			
		},
		
    secondary: {
      main: "#f50057",
    },
		background: {
      default: "#fafafa"
    }
	},
	heIL,
});

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function RTL(props) {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
				<CssBaseline />
				{props.children}
      </ThemeProvider>
    </CacheProvider>
  );
}
