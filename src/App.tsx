import React from 'react';
import { StartPage } from './pages/StartPage';
import HelpPage from './components/HelpPage';
import { Footer } from './components/Footer';
import './i18n';
import { GamePage } from './pages/GamePage';
import './index.css';
import { ToastProvider } from './components/ToastProvider';
import { RouterView } from './router/RouterView';
import { router } from './router';

// 注册路由
router.addRoute('/', StartPage);
router.addRoute('/help', HelpPage);
router.addRoute('/game', GamePage);

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <RouterView />
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
};
