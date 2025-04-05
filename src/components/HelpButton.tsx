import React from 'react';
import { observer } from 'mobx-react-lite';
import { GameStore } from '../stores/GameStore';
import { useTranslation } from 'react-i18next';

interface HelpButtonProps {
  gameStore: GameStore;
}

export const HelpButton: React.FC<HelpButtonProps> = observer(({ gameStore }) => {
  const { t } = useTranslation();

  const handleClick = () => {
    const success = gameStore.helpPlaceCards();
    if (!success) {
      gameStore.displayError(t('game.noValidPlacements'));
    }
  };

  // Count valid cards (excluding wildcards) in the current player's hand
  const validCardCount = gameStore.currentPlayer
    .getHand()
    .filter((card) => !card.isWildCard()).length;

  // Get remaining hints
  const remainingHints = gameStore.currentPlayer.getRemainingHints();

  // Disable the button if there are 2 or fewer valid cards or no remaining hints
  const isDisabled = validCardCount < 2 || remainingHints <= 0;

  return (
    <div className="relative">
      <button
        className="px-4 py-1.5 text-sm font-medium text-white bg-gray-600 dark:bg-gray-500 rounded-md hover:bg-gray-500 dark:hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800 border-2 border-transparent disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:hover:bg-gray-400 dark:disabled:hover:bg-gray-600 disabled:border-dashed disabled:border-gray-500 disabled:text-gray-600 dark:disabled:text-gray-400"
        onClick={handleClick}
        disabled={isDisabled}
        title={t('game.help')}
      >
        {t('game.help')}
      </button>
      {!isDisabled && (
        <div className="absolute right-[8px] top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-1 h-1 rounded-full ${
                index <= remainingHints ? 'bg-white' : 'bg-gray-400 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
});
