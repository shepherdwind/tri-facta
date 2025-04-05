import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StartPage } from './pages/StartPage';
import HelpPage from './components/HelpPage';
import { Footer } from './components/Footer';
import './i18n';
import { GamePage } from './pages/GamePage';
import './index.css';
import { ToastProvider } from './components/ToastProvider';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<StartPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/game" element={<GamePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ToastProvider>
  );
};
