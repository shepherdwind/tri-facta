import { Card } from '../Card';
import { CardPosition, GameMode } from '../../types';
import { CardPlacementSuggestion } from './types';
import { isValidEquation, generateExplanation, findEquationTriplets } from './utils';

/**
 * Find valid card combinations for a new equation
 */
export function findValidCombinationsForNewEquation(
  playerHand: Card[],
  gameMode: GameMode
): CardPlacementSuggestion[] {
  const suggestions: CardPlacementSuggestion[] = [];

  // 获取所有卡牌的值
  const cardValues = playerHand
    .filter((card) => !card.isWildCard())
    .map((card) => card.getValue())
    .filter((value): value is number => value !== null);

  // 使用findEquationTriplets找到所有可能的等式三元组
  const triplets = findEquationTriplets(cardValues);

  // 过滤出符合当前游戏模式的三元组
  const validTriplets = triplets.filter(
    (triplet) =>
      (gameMode === GameMode.ADDITION && triplet.operator === '+') ||
      (gameMode === GameMode.MULTIPLICATION && triplet.operator === '*')
  );

  // 为每个有效的三元组创建卡牌放置建议
  for (const triplet of validTriplets) {
    // 找到对应值的卡牌
    const topCard = playerHand.find((card) => card.getValue() === triplet.c);
    const leftCard = playerHand.find((card) => card.getValue() === triplet.a);
    const rightCard = playerHand.find((card) => card.getValue() === triplet.b);

    // 确保找到了所有需要的卡牌
    if (topCard && leftCard && rightCard) {
      // 创建卡牌放置建议
      const cards = new Map<CardPosition, Card>();
      cards.set(CardPosition.TOP, topCard);
      cards.set(CardPosition.BOTTOM_LEFT, leftCard);
      cards.set(CardPosition.BOTTOM_RIGHT, rightCard);

      // 验证这个放置是否有效
      if (isValidEquation(cards, gameMode)) {
        const explanation = generateExplanation(cards, gameMode);
        suggestions.push({ explanation, cards });
      }
    }
  }

  return suggestions;
}
