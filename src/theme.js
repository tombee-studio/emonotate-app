import { createTheme } from '@mui/material/styles';

// ---- Design tokens -------------------------------------------------------
export const tokens = {
  radius: { sm: 8, md: 12, lg: 16, xl: 24 },
  sidebarWidth: 264,
  topBarHeight: 64,
  fontFamily: [
    'Inter',
    '"Noto Sans JP"',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    'sans-serif',
  ].join(','),
};

const palettes = {
  light: {
    primary: { main: '#4f46e5', light: '#818cf8', dark: '#3730a3', contrastText: '#ffffff' },
    secondary: { main: '#0d9488', contrastText: '#ffffff' },
    error: { main: '#dc2626' },
    background: { default: '#f6f7fb', paper: '#ffffff' },
    text: { primary: '#111827', secondary: '#4b5563' },
    divider: 'rgba(17, 24, 39, 0.08)',
  },
  dark: {
    primary: { main: '#818cf8', light: '#a5b4fc', dark: '#6366f1', contrastText: '#0b1020' },
    secondary: { main: '#2dd4bf', contrastText: '#06201c' },
    error: { main: '#f87171' },
    background: { default: '#0b1020', paper: '#141a2e' },
    text: { primary: '#f3f4f6', secondary: '#a8b0c3' },
    divider: 'rgba(255, 255, 255, 0.10)',
  },
};

const shadows = {
  light: {
    card: '0 1px 2px rgba(16,24,40,0.04), 0 4px 16px rgba(16,24,40,0.06)',
    hover: '0 4px 8px rgba(16,24,40,0.06), 0 12px 28px rgba(16,24,40,0.10)',
  },
  dark: {
    card: '0 1px 2px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.25)',
    hover: '0 4px 8px rgba(0,0,0,0.35), 0 12px 28px rgba(0,0,0,0.35)',
  },
};

export const getTheme = (mode = 'light') => {
  const palette = { mode, ...palettes[mode] };
  const shadow = shadows[mode];

  return createTheme({
    palette,
    shape: { borderRadius: tokens.radius.md },
    spacing: 8,
    typography: {
      fontFamily: tokens.fontFamily,
      h1: { fontWeight: 700, letterSpacing: '-0.02em' },
      h2: { fontWeight: 700, letterSpacing: '-0.02em' },
      h3: { fontWeight: 700, letterSpacing: '-0.015em' },
      h4: { fontWeight: 700, letterSpacing: '-0.01em' },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    tokens: { ...tokens, shadow },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { backgroundColor: palette.background.default },
          '*:focus-visible': {
            outline: `2px solid ${palette.primary.main}`,
            outlineOffset: 2,
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: tokens.radius.sm + 2,
            transition: 'background-color .15s, box-shadow .15s, transform .15s',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: { root: { transition: 'background-color .15s' } },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: { backgroundImage: 'none' },
          rounded: { borderRadius: tokens.radius.lg },
          outlined: { borderColor: palette.divider },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: tokens.radius.lg,
            boxShadow: shadow.card,
            border: `1px solid ${palette.divider}`,
            transition: 'box-shadow .2s, transform .2s',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: tokens.radius.xl, boxShadow: shadow.hover },
        },
      },
      MuiTextField: { defaultProps: { variant: 'outlined' } },
      MuiOutlinedInput: {
        styleOverrides: { root: { borderRadius: tokens.radius.sm + 2 } },
      },
      MuiChip: { styleOverrides: { root: { fontWeight: 500 } } },
      MuiListItemButton: {
        styleOverrides: { root: { borderRadius: tokens.radius.sm + 2 } },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            borderRadius: tokens.radius.lg,
            borderColor: palette.divider,
          },
        },
      },
    },
  });
};

// Backwards compatible default export (light theme).
export default getTheme('light');
