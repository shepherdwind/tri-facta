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
import TriFactaCard from '../components/TriFactaCard';
import { Game } from '../game/models/Game';
import { Header } from '../components/game/Header';
import { PlayerArea } from '../components/game/PlayerArea';
import { GameControls } from '../components/game/GameControls';
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
    // This is now just a placeholder since the position selection is handled in PlayerArea
  };

  const handlePositionSelect = (card: any, position: CardPosition) => {
    store.handleCardClick(card, position);
  };

  return (
    <Container maxW="1200px" py={8}>
      <VStack spacing={8} align="stretch">
        <Header onExit={onExit} />
        <ErrorAlert message={store.errorMessage ? t(store.errorMessage) : null} />

        <PlayerArea
          player={game.getPlayers()[0]}
          selectedCards={store.selectedCards}
          onCardClick={handleCardClick}
          onPositionSelect={handlePositionSelect}
          isCurrentPlayer={game.getPlayers()[0].isCurrentPlayer()}
          cardBg={cardBg}
          currentPlayerBorderColor={currentPlayerBorderColor}
        />

        <Box bg={cardBg} p={4} borderRadius="lg" boxShadow="lg">
          <VStack spacing={4}>
            <TriFactaCard
              topNumber={9}
              leftNumber={5}
              rightNumber={4}
              gameMode={game.getGameMode()}
              selectedCards={store.selectedCards}
            />
            <GameControls
              onDrawCard={() => store.drawCard()}
              onPlayCards={() => store.playCards()}
              onEndTurn={() => store.endTurn()}
            />
          </VStack>
        </Box>

        <PlayerArea
          player={game.getPlayers()[1]}
          selectedCards={store.selectedCards}
          onCardClick={handleCardClick}
          onPositionSelect={handlePositionSelect}
          isCurrentPlayer={game.getPlayers()[1].isCurrentPlayer()}
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
