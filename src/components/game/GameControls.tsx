import React from 'react';
import { HStack, Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface GameControlsProps {
  onDrawCard: () => void;
  onPlayCards: () => void;
  onEndTurn: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onDrawCard,
  onPlayCards,
  onEndTurn,
}) => {
  const { t } = useTranslation();

  return (
    <HStack spacing={4}>
      <Button colorScheme="blue" onClick={onDrawCard}>
        {t('game.drawCard')}
      </Button>
      <Button colorScheme="green" onClick={onPlayCards}>
        {t('game.playCards')}
      </Button>
      <Button colorScheme="gray" onClick={onEndTurn}>
        {t('game.endTurn')}
      </Button>
    </HStack>
  );
};
