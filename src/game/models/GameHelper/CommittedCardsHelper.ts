import { Card } from '../Card';
import { CardGroupState, CardPosition, GameMode } from '../../types';
import { CardPlacementSuggestion } from './types';
import { getCommittedCardsMap } from './utils';
import { tryTwoCardPlacements } from './TwoCardPlacements';

/**
 * Find valid card combinations that work with already committed cards
 * 注意：此函数假设已提交的卡牌总是三张，从这三张中选择一张，与用户手中的两张卡牌组合成有效等式
 */
export function findValidCombinationsWithCommittedCards(
  playerHand: Card[],
  committedState: CardGroupState,
  gameMode: GameMode
): CardPlacementSuggestion[] {
  const suggestions: CardPlacementSuggestion[] = [];

  // 获取已提交的卡牌
  const committedCards = getCommittedCardsMap(committedState);

  // 确保已提交的卡牌是三张
  if (committedCards.size !== 3) {
    console.warn('Expected 3 committed cards, but found', committedCards.size);
    return suggestions;
  }

  // 获取所有已提交卡牌的位置
  const committedPositions: CardPosition[] = [];
  if (committedState.topCard !== null) {
    committedPositions.push(CardPosition.TOP);
  }
  if (committedState.bottomLeftCard !== null) {
    committedPositions.push(CardPosition.BOTTOM_LEFT);
  }
  if (committedState.bottomRightCard !== null) {
    committedPositions.push(CardPosition.BOTTOM_RIGHT);
  }

  // 从已提交的卡牌中选择一张，与用户手中的两张卡牌组合
  for (const positionToKeep of committedPositions) {
    // 创建新的卡牌映射，只保留要保留的卡牌
    const newCommittedCards = new Map<CardPosition, Card>();
    newCommittedCards.set(positionToKeep, committedCards.get(positionToKeep)!);

    // 获取剩余的空位
    const emptyPositions = committedPositions.filter((pos) => pos !== positionToKeep);

    // 尝试在空位放置两张卡牌
    tryTwoCardPlacements(playerHand, emptyPositions, newCommittedCards, gameMode, suggestions);
  }

  return suggestions;
}
