import React from 'react';
import {
  Container,
  VStack,
  Box,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from '@chakra-ui/react';
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

interface GamePageProps {
  game: Game;
  onExit: () => void;
}

export const GamePage = observer<GamePageProps>(({ game, onExit }) => {
  const { t } = useTranslation();
  const store = React.useMemo(() => new GameStore(game), [game]);

  const cardBg = useColorModeValue('brand.card', 'gray.700');
  const currentPlayerBorderColor = useColorModeValue('blue.500', 'blue.300');

  const handleCardClick = (card: any) => {
    store.handleCardClick(card);
  };

  const handlePositionSelect = (card: any, position: CardPosition) => {
    store.handlePositionSelect(card, position);
  };

  return (
    <Container maxW="1200px" py={8}>
      <VStack spacing={8} align="stretch">
        <Header onExit={onExit} />
        <ErrorAlert message={store.errorMessage ? t(store.errorMessage) : null} />

        <PlayerArea
          key="player1"
          player={store.currentPlayer}
          selectedCards={store.selectedCards}
          onCardClick={handleCardClick}
          onPositionSelect={handlePositionSelect}
          isCurrentPlayer={store.currentPlayer.isCurrentPlayer()}
          cardBg={cardBg}
          currentPlayerBorderColor={currentPlayerBorderColor}
        />

        <GameCenter store={store} />

        <PlayerArea
          key="player2"
          player={game.getPlayers().find((p) => p !== store.currentPlayer)!}
          selectedCards={store.selectedCards}
          onCardClick={handleCardClick}
          onPositionSelect={handlePositionSelect}
          isCurrentPlayer={game
            .getPlayers()
            .find((p) => p !== store.currentPlayer)!
            .isCurrentPlayer()}
          cardBg={cardBg}
          currentPlayerBorderColor={currentPlayerBorderColor}
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
