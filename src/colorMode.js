import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { getTheme } from './theme';

const STORAGE_KEY = 'emonotate:color-mode';

const ColorModeContext = createContext({ mode: 'light', preference: 'system', setPreference: () => {} });

export const useColorMode = () => useContext(ColorModeContext);

const readPreference = () => {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch (e) {
    return 'system';
  }
};

// Follows prefers-color-scheme until the user toggles manually.
export const ColorModeProvider = ({ children }) => {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [preference, setPreference] = useState(readPreference);
  const mode = preference === 'system' ? (prefersDark ? 'dark' : 'light') : preference;

  useEffect(() => {
    try {
      if (preference === 'system') window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, preference);
    } catch (e) { /* storage unavailable */ }
  }, [preference]);

  const theme = useMemo(() => getTheme(mode), [mode]);
  const value = useMemo(() => ({ mode, preference, setPreference }), [mode, preference]);

  return (
    <StyledEngineProvider injectFirst>
      <ColorModeContext.Provider value={value}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </StyledEngineProvider>
  );
};
