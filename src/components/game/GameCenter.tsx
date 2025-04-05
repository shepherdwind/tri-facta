import { observer } from 'mobx-react-lite';
import TriFactaCard from '../TriFacta/TriFactaCard';
import { GameControls } from './GameControls';
import { GameStore } from '../../stores/GameStore';
import { CardPosition } from '../../game/types';

interface GameCenterProps {
  store: GameStore;
}

export const GameCenter = observer<GameCenterProps>(({ store }) => {
  const triFactaCard = store.game.getTriFactaCard();

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTouchEnd = (e: React.TouchEvent, position: CardPosition) => {
    e.preventDefault();
    e.stopPropagation();

    // 从 store 中获取当前拖拽的卡片
    const card = store.getDraggedCard();

    if (card) {
      store.setSelectedCard(card, position);
      store.setDraggedCard(null); // 清除拖拽的卡片
    }
  };

  const handleDrop = (e: React.DragEvent, position: CardPosition) => {
    e.preventDefault();
    e.stopPropagation();

    // 从 store 中获取当前拖拽的卡片
    const card = store.getDraggedCard();
    // store.showError(`Dropped: ${card?.getValue()} ${position}`);
    if (card) {
      store.setSelectedCard(card, position);
      store.setDraggedCard(null); // 清除拖拽的卡片
    }
  };

  return (
    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg relative">
      <div className="flex flex-col">
        <div
          onDragOver={handleDragOver}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <TriFactaCard
            topNumber={topNumber}
            leftNumber={leftNumber}
            rightNumber={rightNumber}
            gameMode={store.game.getGameMode()}
            selectedCards={store.selectedCards}
            onDrop={(e, position) => handleDrop(e, position)}
            onTouchEnd={(e, position) => handleTouchEnd(e, position)}
          />
        </div>
      </div>
      <div className="absolute right-4 top-4">
        <GameControls store={store} />
      </div>
    </div>
  );
});
