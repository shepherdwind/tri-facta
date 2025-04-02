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
  useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
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
  cardBg: string;
  currentPlayerBorderColor: string;
}

export const PlayerArea = observer<PlayerAreaProps>(({ cardBg, currentPlayerBorderColor }) => {
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

  const getCardTargetPosition = (card: Card): CardPosition | undefined => {
    for (const [position, selectedCard] of store.selectedCards.entries()) {
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
      borderColor={currentPlayerBorderColor}
      transition="all 0.2s"
      opacity={1}
      pointerEvents="auto"
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
                isSelected={Array.from(store.selectedCards.values()).includes(card)}
                onClick={() => handleCardClick(card)}
                targetPosition={getCardTargetPosition(card)}
              />
              {selectedCard === card &&
                !Array.from(store.selectedCards.values()).includes(card) && (
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
});
