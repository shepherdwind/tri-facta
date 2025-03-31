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
import { Player } from '../../game/models/Player';
import { Card } from '../../game/models/Card';
import { GameCard } from '../GameCard';
import { CardPosition } from '../../game/types';

interface PlayerAreaProps {
  player: Player;
  selectedCards: Map<CardPosition, Card>;
  onCardClick: (card: Card) => void;
  onPositionSelect: (card: Card, position: CardPosition) => void;
  isCurrentPlayer: boolean;
  cardBg: string;
  currentPlayerBorderColor: string;
}

export const PlayerArea: React.FC<PlayerAreaProps> = ({
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
    setSelectedCard(card);
    onCardClick(card);
  };

  const handlePositionSelect = (position: CardPosition) => {
    if (selectedCard) {
      onPositionSelect(selectedCard, position);
      setSelectedCard(null);
    }
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
              />
              {selectedCard === card && (
                <Menu isOpen={true} onClose={() => setSelectedCard(null)}>
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
                    <MenuItem onClick={() => handlePositionSelect(CardPosition.TOP)}>
                      {t('game.position.top')}
                    </MenuItem>
                    <MenuItem onClick={() => handlePositionSelect(CardPosition.BOTTOM_LEFT)}>
                      {t('game.position.bottomLeft')}
                    </MenuItem>
                    <MenuItem onClick={() => handlePositionSelect(CardPosition.BOTTOM_RIGHT)}>
                      {t('game.position.bottomRight')}
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}
            </Box>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
};
