import React from 'react';
import {
  Box,
  VStack,
  Text,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { Player } from '../../game/models/Player';
import { Card } from '../../game/models/Card';
import { GameCard } from '../GameCard';
import { CardPosition } from '../../game/types';

interface PositionSelectMenuProps {
  onPositionSelect: (position: CardPosition) => void;
  onClose: () => void;
}

const PositionSelectMenu: React.FC<PositionSelectMenuProps> = observer(
  ({ onPositionSelect, onClose }) => {
    const { t } = useTranslation();

    return (
      <Menu isOpen={true} onClose={onClose}>
        <MenuButton
          as={Button}
          size="sm"
          position="absolute"
          top="-40px"
          left="50%"
          transform="translateX(-50%)"
          colorScheme="blue"
          zIndex={1}
        >
          {t('game.selectPosition')}
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => onPositionSelect(CardPosition.TOP)}>
            {t('game.position.top')}
          </MenuItem>
          <MenuItem onClick={() => onPositionSelect(CardPosition.BOTTOM_LEFT)}>
            {t('game.position.bottomLeft')}
          </MenuItem>
          <MenuItem onClick={() => onPositionSelect(CardPosition.BOTTOM_RIGHT)}>
            {t('game.position.bottomRight')}
          </MenuItem>
        </MenuList>
      </Menu>
    );
  }
);

interface PlayerAreaProps {
  player: Player;
  selectedCards: Map<CardPosition, Card>;
  onCardClick: (card: Card) => void;
  onPositionSelect: (card: Card, position: CardPosition) => void;
  isCurrentPlayer: boolean;
  cardBg: string;
  currentPlayerBorderColor: string;
}

export const PlayerArea = observer<PlayerAreaProps>(
  ({
    player,
    selectedCards,
    onCardClick,
    onPositionSelect,
    isCurrentPlayer,
    cardBg,
    currentPlayerBorderColor,
  }) => {
    const { t } = useTranslation();
    const [selectedCard, setSelectedCard] = React.useState<Card | null>(null);

    const handleCardClick = (card: Card) => {
      if (Array.from(selectedCards.values()).includes(card)) {
        for (const [, selectedCard] of selectedCards.entries()) {
          if (selectedCard === card) {
            onCardClick(card);
            return;
          }
        }
      }
      setSelectedCard(card);
      onCardClick(card);
    };

    const handlePositionSelect = (position: CardPosition) => {
      if (selectedCard) {
        onPositionSelect(selectedCard, position);
        setSelectedCard(null);
      }
    };

    const getCardTargetPosition = (card: Card): CardPosition | undefined => {
      for (const [position, selectedCard] of selectedCards.entries()) {
        if (selectedCard === card) {
          return position;
        }
      }
      return undefined;
    };

    return (
      <Box
        bg={cardBg}
        p={4}
        borderRadius="lg"
        boxShadow="lg"
        borderWidth="2px"
        borderColor={isCurrentPlayer ? currentPlayerBorderColor : 'transparent'}
        transition="all 0.2s"
      >
        <VStack spacing={2}>
          <Text fontSize="lg" fontWeight="bold">
            {player.getName()}
          </Text>
          <Text>
            {t('game.cardsRemaining')}: {player.getHand().length}
          </Text>
          <HStack spacing={2} wrap="wrap" justify="center">
            {player.getHand().map((card, index) => (
              <Box key={index} position="relative">
                <GameCard
                  card={card}
                  isSelected={Array.from(selectedCards.values()).includes(card)}
                  onClick={() => handleCardClick(card)}
                  isCurrentPlayer={isCurrentPlayer}
                  targetPosition={getCardTargetPosition(card)}
                />
                {selectedCard === card && !Array.from(selectedCards.values()).includes(card) && (
                  <PositionSelectMenu
                    onPositionSelect={handlePositionSelect}
                    onClose={() => setSelectedCard(null)}
                  />
                )}
              </Box>
            ))}
          </HStack>
        </VStack>
      </Box>
    );
  }
);
