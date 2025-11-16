'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f8fafc',
    },
  },
  typography: {
    fontFamily: 'inherit',
  },
});

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
