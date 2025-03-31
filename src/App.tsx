import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StartPage } from './pages/StartPage';
import HelpPage from './components/HelpPage';
import theme from './theme';
import './i18n';

export const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};
