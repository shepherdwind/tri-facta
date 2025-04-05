import React from 'react';
import { I18nIcon } from '../icons/I18nIcon';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { router } from '../../router';
import { ThemeToggle } from '../ThemeToggle';

interface HeaderProps {
  onExit: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExit }) => {
  const { theme } = useTheme();
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
          onClick={toggleLanguage}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label={i18n.language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
          title={i18n.language === 'en' ? '切换到中文' : 'Switch to English'}
        >
          <I18nIcon className="w-5 h-5" />
        </button>
        <ThemeToggle />
        <button
          onClick={() => router.navigate('/help')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title={t('common.help')}
          aria-label={t('common.help')}
        >
          <QuestionMarkCircleIcon className="w-5 h-5" />
        </button>
        <button
          onClick={onExit}
          className="px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          {t('common.exit')}
        </button>
      </div>
    </div>
  );
};
