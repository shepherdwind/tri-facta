import React from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from '../components/Logo';
import { GameSettings } from '../components/GameSettings';
import { GameMode } from '../game/types';
import { I18nIcon } from '../components/icons/I18nIcon';
import { ThemeToggle } from '../components/ThemeToggle';
import { router } from '../router';

export const StartPage: React.FC = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'zh' : 'en');
  };

  const handleHelpClick = () => {
    router.navigate('/help');
  };

  const handleStartGame = () => {
    router.navigate('/game');
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">tri-FACTa!™</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleLanguage}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label={i18n.language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
              title={i18n.language === 'en' ? '切换到中文' : 'Switch to English'}
            >
              <I18nIcon className="w-6 h-6" />
            </button>
            <ThemeToggle />
            <button
              onClick={handleHelpClick}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={t('common.help')}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Game Title */}
        <div className="text-center">
          <p className="text-xl text-gray-700 dark:text-gray-300">{t('game.subtitle')}</p>
        </div>

        {/* Game Logo */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg text-center">
          <Logo size={200} gameMode={GameMode.ADDITION} />
        </div>

        {/* Game Settings */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
          <GameSettings onGameStart={handleStartGame} />
        </div>

        {/* Game Instructions */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
          <div className="flex flex-col space-y-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('game.instructions.title')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {t('game.instructionItems.winCondition')}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {t('game.instructionItems.dragAndDrop')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
