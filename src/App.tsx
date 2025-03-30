import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { StartPage } from './pages/StartPage';
import theme from './theme';

export const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <StartPage />
    </ChakraProvider>
  );
};
