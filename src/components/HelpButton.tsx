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

  // Disable the button if there are 2 or fewer valid cards
  const isDisabled = validCardCount < 2;

  return (
    <button
      className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleClick}
      disabled={isDisabled}
      title={t('game.help')}
    >
      {t('game.help')}
    </button>
  );
});
