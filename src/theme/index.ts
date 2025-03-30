import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      primary: '#4A90E2',
      background: '#F5F5F5',
      card: '#FFFFFF',
      text: '#333333',
      accent: '#FF6B6B',
      success: '#4CAF50',
    },
  },
  fonts: {
    heading: 'system-ui, sans-serif',
    body: 'system-ui, sans-serif',
  },
  fontSizes: {
    title: '24px',
    body: '16px',
    number: '20px',
    button: '16px',
    operator: '24px',
  },
  spacing: {
    component: '20px',
    card: '10px',
    inner: '16px',
    margin: '24px',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'md',
      },
    },
  },
});

export default theme;
