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
  useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { Player } from '../../game/models/Player';
import { Card } from '../../game/models/Card';
import { GameCard } from '../GameCard';
import { CardPosition } from '../../game/types';
import { GameStore } from '../../stores/GameStore';

interface PositionSelectMenuProps {
  onPositionSelect: (position: CardPosition) => void;
  onClose: () => void;
}

const PositionSelectMenu: React.FC<PositionSelectMenuProps> = observer(
  ({ onPositionSelect, onClose }) => {
    const { t } = useTranslation();

    return (
      <Menu isOpen={true} onClose={onClose} placement="top" offset={[0, 8]}>
        <MenuButton
          as={Box}
          position="absolute"
          top="-8px"
          left="50%"
          transform="translateX(-50%)"
          width="0"
          height="0"
          borderLeft="8px solid transparent"
          borderRight="8px solid transparent"
          borderTop="8px solid"
          borderTopColor="blue.500"
          borderBottom="none"
          cursor="pointer"
          _hover={{
            borderTopColor: 'blue.600',
          }}
        />
        <MenuList
          borderWidth="2px"
          borderColor="blue.500"
          boxShadow="lg"
          bg={useColorModeValue('white', 'gray.800')}
          _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
          minW="120px"
          maxW="150px"
          marginBottom="-8px"
        >
          <MenuItem
            onClick={() => onPositionSelect(CardPosition.TOP)}
            _hover={{ bg: useColorModeValue('blue.50', 'blue.900') }}
          >
            {t('game.position.top')}
          </MenuItem>
          <MenuItem
            onClick={() => onPositionSelect(CardPosition.BOTTOM_LEFT)}
            _hover={{ bg: useColorModeValue('blue.50', 'blue.900') }}
          >
            {t('game.position.bottomLeft')}
          </MenuItem>
          <MenuItem
            onClick={() => onPositionSelect(CardPosition.BOTTOM_RIGHT)}
            _hover={{ bg: useColorModeValue('blue.50', 'blue.900') }}
          >
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
  store: GameStore;
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
    store,
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
        opacity={isCurrentPlayer ? 1 : 0.7}
        pointerEvents={isCurrentPlayer ? 'auto' : 'none'}
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
                  onClick={() => isCurrentPlayer && handleCardClick(card)}
                  isCurrentPlayer={isCurrentPlayer}
                  targetPosition={getCardTargetPosition(card)}
                  store={store}
                />
                {selectedCard === card &&
                  !Array.from(selectedCards.values()).includes(card) &&
                  isCurrentPlayer && (
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
