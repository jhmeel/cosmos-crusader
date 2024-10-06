import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff9d',
    },
    secondary: {
      main: '#7000ff',
    },
    background: {
      default: '#0a0e17',
      paper: '#131a2a',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#a0a0a0',
    },
  },
  typography: {
    fontFamily: 'Rajdhani, Arial, sans-serif',
    h1: {
      fontFamily: 'Orbitron, sans-serif',
      fontWeight: 700,
      fontSize: '3rem',
    },
    h2: {
      fontFamily: 'Orbitron, sans-serif',
      fontWeight: 500,
      fontSize: '2.5rem',
    },
    h3: {
      fontFamily: 'Orbitron, sans-serif',
      fontWeight: 400,
      fontSize: '2rem',
    },
    body1: {
      fontSize: '1.1rem',
    },
    button: {
      fontFamily: 'Orbitron, sans-serif',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'uppercase',
          padding: '10px 20px',
          background: 'linear-gradient(45deg, #00ff9d 30%, #7000ff 90%)',
          boxShadow: '0 3px 5px 2px rgba(0, 255, 157, .3)',
          color: '#000',
          '&:hover': {
            background: 'linear-gradient(45deg, #00ff9d 60%, #7000ff 90%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(19, 26, 42, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
});

export default theme;