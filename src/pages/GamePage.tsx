import React from 'react';
import { Container, VStack, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { Game } from '../game/models/Game';
import { Header } from '../components/game/Header';
import { PlayerArea } from '../components/game/PlayerArea';
import { GameCenter } from '../components/game/GameCenter';
import { WildcardModal } from '../components/game/WildcardModal';
import { ErrorAlert } from '../components/game/ErrorAlert';
import { GameStore } from '../stores/GameStore';
import { CardPosition } from '../game/types';
import { Card } from '../game/models/Card';

interface GamePageProps {
  game: Game;
  onExit: () => void;
}

export const GamePage = observer<GamePageProps>(({ game, onExit }) => {
  const { t } = useTranslation();
  const store = React.useMemo(() => new GameStore(game), [game]);

  // 使用 useMemo 来保持玩家顺序不变
  const players = React.useMemo(() => game.getPlayers(), [game]);
  const player1 = players[0];
  const player2 = players[1];

  const cardBg = useColorModeValue('brand.card', 'gray.700');
  const currentPlayerBorderColor = useColorModeValue('blue.500', 'blue.300');

  const handleCardClick = (card: Card) => {
    store.handleCardClick(card);
  };

  const handlePositionSelect = (card: Card, position: CardPosition) => {
    store.handlePositionSelect(card, position);
  };

  return (
    <Container maxW="1200px" py={8}>
      <VStack spacing={8} align="stretch">
        <Header onExit={onExit} />
        <ErrorAlert message={store.errorMessage ? t(store.errorMessage) : null} />

        <PlayerArea
          key="player1"
          player={player1}
          selectedCards={store.selectedCards}
          onCardClick={handleCardClick}
          onPositionSelect={handlePositionSelect}
          isCurrentPlayer={player1.isCurrentPlayer()}
          cardBg={cardBg}
          currentPlayerBorderColor={currentPlayerBorderColor}
          store={store}
        />

        <GameCenter store={store} />

        <PlayerArea
          key="player2"
          player={player2}
          selectedCards={store.selectedCards}
          onCardClick={handleCardClick}
          onPositionSelect={handlePositionSelect}
          isCurrentPlayer={player2.isCurrentPlayer()}
          cardBg={cardBg}
          currentPlayerBorderColor={currentPlayerBorderColor}
          store={store}
        />
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
