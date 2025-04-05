import React from 'react';
import { useTranslation } from 'react-i18next';
import { I18nIcon } from './icons/I18nIcon';
import TriFactaCard from './TriFacta/TriFactaCard';
import { GameMode } from '../game/types';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import { router } from '../router';

const HelpPage: React.FC = () => {
  const { t, i18n } = useTranslation();

  const handleBack = () => {
    router.navigate('/');
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label={t('common.back')}
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-300 flex-1">
            {t('help.title')}
          </h1>
          <button
            onClick={toggleLanguage}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label={i18n.language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
            title={i18n.language === 'en' ? '切换到中文' : 'Switch to English'}
          >
            <I18nIcon className="w-6 h-6" />
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-300">
            {t('help.introduction.title')}
          </h2>
          <p className="text-gray-700 dark:text-gray-200">{t('help.introduction.content')}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-300">
            {t('help.basicRules.title')}
          </h2>
          <ul className="space-y-3">
            {['players', 'duration', 'winCondition', 'initialCards'].map((rule) => (
              <li key={rule} className="flex items-start">
                <CheckIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-200">
                  {t(`help.basicRules.${rule}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-300">
            {t('help.gameFlow.title')}
          </h2>
          <div className="space-y-4">
            <div>
              <p className="font-bold mb-2">{t('help.gameFlow.setup.title')}</p>
              <p className="text-gray-700 dark:text-gray-200">{t('help.gameFlow.setup.shuffle')}</p>
              <p className="text-gray-700 dark:text-gray-200">{t('help.gameFlow.setup.draw')}</p>
            </div>

            <div>
              <p className="font-bold mb-2">{t('help.gameFlow.turn.title')}</p>
              <p className="text-gray-700 dark:text-gray-200">{t('help.gameFlow.turn.replace')}</p>
              <p className="text-sm text-gray-500 ml-4">{t('help.gameFlow.turn.replaceExample')}</p>
              <p className="text-gray-700 dark:text-gray-200">
                {t('help.gameFlow.turn.mathRelation')}
              </p>
              <p className="text-sm text-gray-500 ml-4">{t('help.gameFlow.turn.mathExample')}</p>
              <p className="text-gray-700 dark:text-gray-200">{t('help.gameFlow.turn.priority')}</p>
            </div>

            <div>
              <p className="font-bold mb-2">{t('help.gameFlow.noPlay.title')}</p>
              <p className="text-gray-700 dark:text-gray-200">{t('help.gameFlow.noPlay.draw')}</p>
              <p className="text-gray-700 dark:text-gray-200">
                {t('help.gameFlow.noPlay.continue')}
              </p>
              <p className="text-gray-700 dark:text-gray-200">{t('help.gameFlow.noPlay.pass')}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-300">
            {t('help.interaction.title')}
          </h2>
          <ul className="space-y-3">
            {['dragAndDrop', 'clickToSelect', 'clickToDeselect'].map((interaction) => (
              <li key={interaction} className="flex items-start">
                <CheckIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-200">
                  {t(`help.interaction.${interaction}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-300">
            {t('help.examples.title')}
          </h2>
          <div className="flex justify-center space-x-8 mb-4">
            <div>
              <p className="mb-2 text-center text-gray-700 dark:text-gray-200">
                {t('help.examples.additionMode')}
              </p>
              <TriFactaCard
                topNumber={12}
                leftNumber={5}
                rightNumber={7}
                gameMode={GameMode.ADDITION}
              />
            </div>
            <div>
              <p className="mb-2 text-center text-gray-700 dark:text-gray-200">
                {t('help.examples.multiplicationMode')}
              </p>
              <TriFactaCard
                topNumber={24}
                leftNumber={6}
                rightNumber={4}
                gameMode={GameMode.MULTIPLICATION}
              />
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-200">{t('help.examples.inExamples')}</p>
          <ul className="mt-2 space-y-2">
            <li className="flex items-start">
              <CheckIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-200">
                {t('help.examples.additionExample')}
              </span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-200">
                {t('help.examples.multiplicationExample')}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-300">
            {t('help.specialRules.title')}
          </h2>
          <ul className="space-y-3">
            {['wildcardValue', 'wildcardDeclaration', 'wildcardPersistence'].map((rule) => (
              <li key={rule} className="flex items-start">
                <CheckIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-200">
                  {t(`help.specialRules.${rule}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
