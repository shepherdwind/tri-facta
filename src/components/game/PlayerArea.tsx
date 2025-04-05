import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { Card } from '../../game/models/Card';
import { GameCard } from '../GameCard';
import { CardPosition } from '../../game/types';
import { GameStore } from '../../stores/GameStore';
import { useTheme } from '../../hooks/useTheme';

interface PositionSelectMenuProps {
  onPositionSelect: (position: CardPosition) => void;
  onClose: () => void;
}

const PositionSelectMenu: React.FC<PositionSelectMenuProps> = observer(
  ({ onPositionSelect, onClose }) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          onClose();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [onClose]);

    return (
      <div
        ref={menuRef}
        className={`absolute left-1/2 transform -translate-x-1/2 mt-2 w-32 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="py-1">
          <button
            className={`block w-full text-left px-4 py-2 text-sm ${
              theme === 'dark'
                ? 'text-gray-300 hover:bg-blue-900 hover:text-white'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
            }`}
            onClick={() => onPositionSelect(CardPosition.TOP)}
          >
            {t('game.position.top')}
          </button>
          <button
            className={`block w-full text-left px-4 py-2 text-sm ${
              theme === 'dark'
                ? 'text-gray-300 hover:bg-blue-900 hover:text-white'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
            }`}
            onClick={() => onPositionSelect(CardPosition.BOTTOM_LEFT)}
          >
            {t('game.position.bottomLeft')}
          </button>
          <button
            className={`block w-full text-left px-4 py-2 text-sm ${
              theme === 'dark'
                ? 'text-gray-300 hover:bg-blue-900 hover:text-white'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
            }`}
            onClick={() => onPositionSelect(CardPosition.BOTTOM_RIGHT)}
          >
            {t('game.position.bottomRight')}
          </button>
        </div>
      </div>
    );
  }
);

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
      className={`bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg border-2 ${currentPlayerBorderColor} transition-all duration-200`}
    >
      <div className="flex flex-col space-y-2">
        <div className="text-center">
          <h2 className="text-lg font-bold">{player.getName()}</h2>
          <p>
            {t('game.cardsRemaining')}: {player.getHand().length}
          </p>
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
