import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { GameStore } from '../../stores/GameStore';
import { HelpButton } from '../HelpButton';

interface GameControlsProps {
  store: GameStore;
}

export const GameControls = observer<GameControlsProps>(({ store }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-end space-y-4">
      <button
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:hover:bg-gray-400 dark:disabled:hover:bg-gray-600 disabled:border-2 disabled:border-dashed disabled:border-gray-500 disabled:text-gray-600 dark:disabled:text-gray-400"
        onClick={() => store.drawCard()}
        disabled={!store.canDrawCard}
      >
        {t('game.drawCard')}
      </button>
      <button
        className="px-4 py-2 text-sm font-medium text-white bg-green-600 dark:bg-green-700 rounded-md hover:bg-green-700 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:hover:bg-gray-400 dark:disabled:hover:bg-gray-600 disabled:border-2 disabled:border-dashed disabled:border-gray-500 disabled:text-gray-600 dark:disabled:text-gray-400"
        onClick={() => store.playCards()}
        disabled={store.selectedCards.size < 2}
      >
        {t('game.playCards')}
      </button>
      <button
        className="px-4 py-2 text-sm font-medium text-white bg-gray-600 dark:bg-gray-500 rounded-md hover:bg-gray-500 dark:hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800 disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:hover:bg-gray-400 dark:disabled:hover:bg-gray-600 disabled:border-2 disabled:border-dashed disabled:border-gray-500 disabled:text-gray-600 dark:disabled:text-gray-400"
        onClick={() => store.endTurn()}
        disabled={!store.canEndTurn}
      >
        {t('game.endTurn')}
      </button>
      <HelpButton gameStore={store} />
    </div>
  );
});
