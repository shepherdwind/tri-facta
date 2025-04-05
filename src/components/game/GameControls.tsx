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
    <div className="flex flex-col items-center space-y-4">
      <button
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => store.drawCard()}
        disabled={!store.canDrawCard}
      >
        {t('game.drawCard')}
      </button>
      <button
        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => store.playCards()}
        disabled={store.selectedCards.size < 2}
      >
        {t('game.playCards')}
      </button>
      <button
        className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => store.endTurn()}
        disabled={!store.canEndTurn}
      >
        {t('game.endTurn')}
      </button>
      <HelpButton gameStore={store} />
    </div>
  );
});
