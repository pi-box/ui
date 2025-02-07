import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { heIL } from '@mui/material/locale';

import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

/**
 * RTL Theme Provider for Pi-Box UI
 * 
 * This component ensures right-to-left (RTL) support for Hebrew and other RTL languages.
 * It sets up a Material-UI theme with RTL direction and provides an Emotion cache
 * to properly handle CSS styling for RTL.
 * 
 * Features:
 * - Applies RTL styling globally
 * - Uses Material-UI's theming system with Hebrew locale
 * - Provides an Emotion cache with RTL support
 * 
 * Usage:
 * Wrap the root component of the app inside `<RTL>` to enable RTL support.
 */

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#3f50b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#fafafa',
    },
  },
  heIL,
});

// Create RTL cache
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
