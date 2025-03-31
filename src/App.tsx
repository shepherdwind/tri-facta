import React from 'react';
import { ChakraProvider, ColorModeScript, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StartPage } from './pages/StartPage';
import HelpPage from './components/HelpPage';
import { Footer } from './components/Footer';
import { InstallPWA } from './components/InstallPWA';
import theme from './theme';
import './i18n';

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
            </Routes>
          </Box>
          <Footer />
          <InstallPWA />
        </Box>
      </Router>
    </ChakraProvider>
  );
};
