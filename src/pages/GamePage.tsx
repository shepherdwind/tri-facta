import React from 'react';
import { Container, VStack, useColorModeValue, useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/game/Header';
import { PlayerArea } from '../components/game/PlayerArea';
import { GameCenter } from '../components/game/GameCenter';
import { WildcardModal } from '../components/game/WildcardModal';
import { GameStore } from '../stores/GameStore';
import { CardPosition } from '../game/types';
import { Card } from '../game/models/Card';

export const GamePage = observer(() => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const store = GameStore.getInstance();

  const currentPlayer = store.game.getCurrentPlayer();

  const cardBg = useColorModeValue('brand.card', 'gray.700');
  const currentPlayerBorderColor = useColorModeValue('blue.500', 'blue.300');

  React.useEffect(() => {
    store.setToast((options: any) => {
      toast({
        ...options,
        description: t(options.description),
      });
    });
  }, [store, toast, t]);

  const handleCardClick = (card: Card) => {
    store.handleCardClick(card);
  };

  const handlePositionSelect = (card: Card, position: CardPosition) => {
    store.handlePositionSelect(card, position);
  };

  const handleExit = () => {
    GameStore.reset();
    navigate('/');
  };

  return (
    <Container maxW="1200px" py={8}>
      <VStack spacing={8} align="stretch">
        <Header onExit={handleExit} />

        <PlayerArea
          key={currentPlayer.getId()}
          player={currentPlayer}
          selectedCards={store.selectedCards}
          onCardClick={handleCardClick}
          onPositionSelect={handlePositionSelect}
          isCurrentPlayer={true}
          cardBg={cardBg}
          currentPlayerBorderColor={currentPlayerBorderColor}
          store={store}
        />

        <GameCenter store={store} />
      </VStack>

      <WildcardModal
        isOpen={store.isWildcardModalOpen}
        onClose={() => store.closeWildcardModal()}
        value={store.wildcardValue}
        onChange={(value) => store.setWildcardValueInput(value)}
        onConfirm={() => store.setWildcardValue()}
      />
    </Container>
  );
});
