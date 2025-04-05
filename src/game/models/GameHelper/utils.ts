import { Card } from '../Card';
import { CardGroupState, CardPosition, GameMode } from '../../types';

/**
 * 表示找到的等式三元组
 * a 运算符 b = c
 */
export interface EquationTriplet {
  a: number;
  b: number;
  c: number;
  operator: '+' | '*';
}

/**
 * 在数组中查找所有可以组成等式的三元组
 * @param numbers 输入的数字数组
 * @returns 所有找到的等式三元组
 */
export function findEquationTriplets(numbers: number[]): EquationTriplet[] {
  const results: EquationTriplet[] = [];
  const n = numbers.length;

  // 创建一个集合用于快速查找
  const numSet = new Set(numbers);

  // 检查所有可能的两个数字对
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        // 确保不使用同一个数字两次
        const a = numbers[i];
        const b = numbers[j];

        // 检查加法: a + b = c
        const sum = a + b;
        if (numSet.has(sum) && sum !== a && sum !== b) {
          results.push({ a, b, c: sum, operator: '+' });
        }

        // 检查乘法: a * b = c
        const product = a * b;
        if (numSet.has(product) && product !== a && product !== b) {
          results.push({ a, b, c: product, operator: '*' });
        }
      }
    }
  }

  return results;
}

/**
 * Get the empty positions in the card group
 */
export function getEmptyPositions(committedState: CardGroupState): CardPosition[] {
  const emptyPositions: CardPosition[] = [];

  if (committedState.topCard === null) {
    emptyPositions.push(CardPosition.TOP);
  }
  if (committedState.bottomLeftCard === null) {
    emptyPositions.push(CardPosition.BOTTOM_LEFT);
  }
  if (committedState.bottomRightCard === null) {
    emptyPositions.push(CardPosition.BOTTOM_RIGHT);
  }

  return emptyPositions;
}

/**
 * Get a map of committed cards
 */
export function getCommittedCardsMap(committedState: CardGroupState): Map<CardPosition, Card> {
  const committedCards: Map<CardPosition, Card> = new Map();

  if (committedState.topCard !== null) {
    committedCards.set(CardPosition.TOP, committedState.topCard);
  }
  if (committedState.bottomLeftCard !== null) {
    committedCards.set(CardPosition.BOTTOM_LEFT, committedState.bottomLeftCard);
  }
  if (committedState.bottomRightCard !== null) {
    committedCards.set(CardPosition.BOTTOM_RIGHT, committedState.bottomRightCard);
  }

  return committedCards;
}

/**
 * Get the card at a specific position
 */
export function getCardAtPosition(
  committedState: CardGroupState,
  position: CardPosition
): Card | null {
  switch (position) {
    case CardPosition.TOP:
      return committedState.topCard;
    case CardPosition.BOTTOM_LEFT:
      return committedState.bottomLeftCard;
    case CardPosition.BOTTOM_RIGHT:
      return committedState.bottomRightCard;
    default:
      return null;
  }
}

/**
 * Check if the equation is valid
 */
export function isValidEquation(cards: Map<CardPosition, Card>, gameMode: GameMode): boolean {
  const topCard = cards.get(CardPosition.TOP);
  const leftCard = cards.get(CardPosition.BOTTOM_LEFT);
  const rightCard = cards.get(CardPosition.BOTTOM_RIGHT);

  if (!topCard || !leftCard || !rightCard) {
    return false;
  }

  const topValue = topCard.getValue();
  const leftValue = leftCard.getValue();
  const rightValue = rightCard.getValue();

  if (topValue === null || leftValue === null || rightValue === null) {
    return false;
  }

  // 直接检查等式是否成立
  if (gameMode === GameMode.ADDITION) {
    return leftValue + rightValue === topValue;
  } else if (gameMode === GameMode.MULTIPLICATION) {
    return leftValue * rightValue === topValue;
  }
  return false;
}

/**
 * Generate an explanation for the card placement
 */
export function generateExplanation(cards: Map<CardPosition, Card>, gameMode: GameMode): string {
  const topCard = cards.get(CardPosition.TOP);
  const leftCard = cards.get(CardPosition.BOTTOM_LEFT);
  const rightCard = cards.get(CardPosition.BOTTOM_RIGHT);

  const topValue = topCard?.getValue() ?? '?';
  const leftValue = leftCard?.getValue() ?? '?';
  const rightValue = rightCard?.getValue() ?? '?';

  const operator = gameMode === GameMode.ADDITION ? '+' : '×';
  return `${leftValue} ${operator} ${rightValue} = ${topValue}`;
}

/**
 * Check if there are any committed cards in the card group
 */
export function hasCommittedCards(committedState: CardGroupState): boolean {
  return (
    committedState.topCard !== null ||
    committedState.bottomLeftCard !== null ||
    committedState.bottomRightCard !== null
  );
}
