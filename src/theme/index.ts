import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

interface ColorMode {
  colorMode: 'light' | 'dark';
}

const theme = extendTheme({
  config,
  colors: {
    brand: {
      primary: '#4A90E2',
      background: '#F5F5F5',
      card: '#FFFFFF',
      text: '#333333',
      accent: '#FF6B6B',
      success: '#4CAF50',
    },
    dark: {
      background: '#1A202C',
      card: '#2D3748',
      text: '#FFFFFF',
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
  styles: {
    global: (props: ColorMode) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'dark.background' : 'brand.background',
        color: props.colorMode === 'dark' ? 'dark.text' : 'brand.text',
      },
      '@keyframes float': {
        '0%, 100%': {
          transform: 'translateY(0)',
        },
        '50%': {
          transform: 'translateY(-10px)',
        },
      },
    }),
  },
});

export default theme;
