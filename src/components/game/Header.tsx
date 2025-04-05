import React from 'react';
import { I18nIcon } from '../icons/I18nIcon';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { SunIcon, MoonIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { router } from '../../router';

interface HeaderProps {
  onExit: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExit }) => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const primaryColor = theme === 'dark' ? 'text-blue-400' : 'text-blue-600';

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="flex justify-between items-center py-2">
      <h1 className={`text-xl font-bold ${primaryColor}`}>{t('game.title')}</h1>
      <div className="flex items-center space-x-2">
        <button
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={toggleLanguage}
          title={i18n.language === 'en' ? '切换到中文' : 'Switch to English'}
          aria-label={i18n.language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
        >
          <I18nIcon className="w-5 h-5" />
        </button>
        <button
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={toggleTheme}
          title={theme === 'light' ? t('header.darkMode') : t('header.lightMode')}
          aria-label={theme === 'light' ? t('header.darkMode') : t('header.lightMode')}
        >
          {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
        </button>
        <button
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => router.navigate('/help')}
          title={t('common.help')}
          aria-label={t('common.help')}
        >
          <QuestionMarkCircleIcon className="w-5 h-5" />
        </button>
        <button
          className="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={onExit}
        >
          {t('common.exit')}
        </button>
      </div>
    </div>
  );
};
