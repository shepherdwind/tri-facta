import React from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { Card } from '../../game/models/Card';
import { GameCard } from '../GameCard';
import { CardPosition } from '../../game/types';
import { GameStore } from '../../stores/GameStore';
import { PositionSelectMenu } from './PositionSelectMenu';
import { VictoryCrown } from './VictoryCrown';

interface PlayerAreaProps {
  currentPlayerBorderColor: string;
}

export const PlayerArea = observer<PlayerAreaProps>(({ currentPlayerBorderColor }) => {
  const { t } = useTranslation();
  const [selectedCard, setSelectedCard] = React.useState<Card | null>(null);
  const store = GameStore.getInstance();
  const player = store.game.getCurrentPlayer();

  const handleCardClick = (card: Card) => {
    if (Array.from(store.selectedCards.values()).includes(card)) {
      for (const [, selectedCard] of store.selectedCards.entries()) {
        if (selectedCard === card) {
          store.handleCardClick(card);
          return;
        }
      }
    }
    setSelectedCard(card);
    store.handleCardClick(card);
  };

  const handlePositionSelect = (position: CardPosition) => {
    if (selectedCard) {
      store.handlePositionSelect(selectedCard, position);
      setSelectedCard(null);
    }
  };

  const handleCloseMenu = () => {
    setSelectedCard(null);
  };

  const getCardTargetPosition = (card: Card): CardPosition | undefined => {
    for (const [position, selectedCard] of store.selectedCards.entries()) {
      if (selectedCard === card) {
        return position;
      }
    }
    return undefined;
  };

  return (
    <div
      className={`bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg border-2 ${
        player.hasWon() ? 'border-yellow-400' : currentPlayerBorderColor
      } transition-all duration-200 relative`}
    >
      <div className="flex flex-col space-y-2">
        <div className="text-center">
          <h2 className={`text-lg font-bold ${player.hasWon() ? 'text-yellow-500' : ''}`}>
            {player.getName()}
          </h2>
          {player.hasWon() ? (
            <p className="text-yellow-500 font-bold animate-pulse">{t('game.victory')}</p>
          ) : (
            <p>
              {t('game.cardsRemaining')}: {player.getHand().length}
            </p>
          )}
          {player.hasWon() && <VictoryCrown />}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {player.getHand().map((card, index) => (
            <div key={index} className="relative">
              <GameCard
                card={card}
                isSelected={Array.from(store.selectedCards.values()).includes(card)}
                onClick={() => handleCardClick(card)}
                targetPosition={getCardTargetPosition(card)}
              />
              {selectedCard === card &&
                !Array.from(store.selectedCards.values()).includes(card) &&
                (!card.isWildCard() || card.getValue() !== null) && (
                  <PositionSelectMenu
                    onPositionSelect={handlePositionSelect}
                    onClose={handleCloseMenu}
                  />
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
