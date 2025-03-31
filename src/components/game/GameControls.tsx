import React from 'react';
import { HStack, Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { GameStore } from '../../stores/GameStore';

interface GameControlsProps {
  store: GameStore;
}

export const GameControls = observer<GameControlsProps>(({ store }) => {
  const { t } = useTranslation();

  return (
    <HStack spacing={4}>
      <Button colorScheme="blue" onClick={() => store.drawCard()} isDisabled={!store.canDrawCard}>
        {t('game.drawCard')}
      </Button>
      <Button
        colorScheme="green"
        onClick={() => store.playCards()}
        isDisabled={store.selectedCards.size < 2}
      >
        {t('game.playCards')}
      </Button>
      <Button colorScheme="gray" onClick={() => store.endTurn()} isDisabled={!store.canEndTurn}>
        {t('game.endTurn')}
      </Button>
    </HStack>
  );
});
