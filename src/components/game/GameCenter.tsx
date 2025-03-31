import React from 'react';
import { Box, VStack, useColorModeValue } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import TriFactaCard from '../TriFactaCard';
import { GameControls } from './GameControls';
import { GameStore } from '../../stores/GameStore';
import { CardPosition } from '../../game/types';

interface GameCenterProps {
  store: GameStore;
}

export const GameCenter = observer<GameCenterProps>(({ store }) => {
  const triFactaCard = store.game.getTriFactaCard();
  const cardBg = useColorModeValue('brand.card', 'gray.700');

  // 获取已提交的卡片
  const committedTopCard = triFactaCard.getCard(CardPosition.TOP);
  const committedLeftCard = triFactaCard.getCard(CardPosition.BOTTOM_LEFT);
  const committedRightCard = triFactaCard.getCard(CardPosition.BOTTOM_RIGHT);

  // 获取暂存区的卡片
  const stagedCards = store.selectedCards;

  // 合并已提交和暂存的卡片
  const topNumber =
    stagedCards.get(CardPosition.TOP)?.getValue() ?? committedTopCard?.getValue() ?? 0;
  const leftNumber =
    stagedCards.get(CardPosition.BOTTOM_LEFT)?.getValue() ?? committedLeftCard?.getValue() ?? 0;
  const rightNumber =
    stagedCards.get(CardPosition.BOTTOM_RIGHT)?.getValue() ?? committedRightCard?.getValue() ?? 0;

  return (
    <Box bg={cardBg} p={4} borderRadius="lg" boxShadow="lg">
      <VStack spacing={4}>
        <TriFactaCard
          topNumber={topNumber}
          leftNumber={leftNumber}
          rightNumber={rightNumber}
          gameMode={store.game.getGameMode()}
          selectedCards={store.selectedCards}
        />
        <GameControls store={store} />
      </VStack>
    </Box>
  );
});
