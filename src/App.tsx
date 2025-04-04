import React from 'react';
import { ChakraProvider, ColorModeScript, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StartPage } from './pages/StartPage';
import HelpPage from './components/HelpPage';
import { Footer } from './components/Footer';
import theme from './theme';
import './i18n';
import { GamePage } from './pages/GamePage';

export const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Router>
        <Box minH="100vh" display="flex" flexDirection="column">
          <Box flex="1">
            <Routes>
              <Route path="/" element={<StartPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/game" element={<GamePage />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ChakraProvider>
  );
};
