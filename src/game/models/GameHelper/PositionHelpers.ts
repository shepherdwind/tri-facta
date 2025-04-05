import { Card } from '../Card';
import { CardGroupState, CardPosition, GameMode } from '../../types';
import { CardPlacementSuggestion } from './types';
import { getCommittedCardsMap, generateExplanation } from './utils';

/**
 * Try placing a card at the top position
 */
export function tryTopPosition(
  card: Card,
  cardValue: number,
  leftValue: number | null,
  rightValue: number | null,
  gameMode: GameMode,
  committedState: CardGroupState,
  suggestions: CardPlacementSuggestion[]
): void {
  // If placing at the top, check if it equals the sum/product of the bottom cards
  if (leftValue !== null && rightValue !== null) {
    const expectedValue =
      gameMode === GameMode.ADDITION ? leftValue + rightValue : leftValue * rightValue;

    if (cardValue === expectedValue) {
      const cards = getCommittedCardsMap(committedState);
      cards.set(CardPosition.TOP, card);
      const explanation = generateExplanation(cards, gameMode);
      suggestions.push({ explanation, cards });
    }
  }
}

/**
 * Try placing a card at the bottom left position
 */
export function tryBottomLeftPosition(
  card: Card,
  cardValue: number,
  topValue: number | null,
  rightValue: number | null,
  gameMode: GameMode,
  committedState: CardGroupState,
  suggestions: CardPlacementSuggestion[]
): void {
  // If placing at the bottom left, check if it works with the top and bottom right
  if (topValue !== null && rightValue !== null) {
    // For addition: top = left + right
    // For multiplication: top = left * right
    if (gameMode === GameMode.ADDITION) {
      // Check if top = left + right
      if (topValue === cardValue + rightValue) {
        const cards = getCommittedCardsMap(committedState);
        cards.set(CardPosition.BOTTOM_LEFT, card);
        const explanation = generateExplanation(cards, gameMode);
        suggestions.push({ explanation, cards });
      }
    } else {
      // Check if top = left * right
      if (topValue === cardValue * rightValue) {
        const cards = getCommittedCardsMap(committedState);
        cards.set(CardPosition.BOTTOM_LEFT, card);
        const explanation = generateExplanation(cards, gameMode);
        suggestions.push({ explanation, cards });
      }
    }
  }
}

/**
 * Try placing a card at the bottom right position
 */
export function tryBottomRightPosition(
  card: Card,
  cardValue: number,
  topValue: number | null,
  leftValue: number | null,
  gameMode: GameMode,
  committedState: CardGroupState,
  suggestions: CardPlacementSuggestion[]
): void {
  // If placing at the bottom right, check if it works with the top and bottom left
  if (topValue !== null && leftValue !== null) {
    // For addition: top = left + right
    // For multiplication: top = left * right
    if (gameMode === GameMode.ADDITION) {
      // Check if top = left + right
      if (topValue === leftValue + cardValue) {
        const cards = getCommittedCardsMap(committedState);
        cards.set(CardPosition.BOTTOM_RIGHT, card);
        const explanation = generateExplanation(cards, gameMode);
        suggestions.push({ explanation, cards });
      }
    } else {
      // Check if top = left * right
      if (topValue === leftValue * cardValue) {
        const cards = getCommittedCardsMap(committedState);
        cards.set(CardPosition.BOTTOM_RIGHT, card);
        const explanation = generateExplanation(cards, gameMode);
        suggestions.push({ explanation, cards });
      }
    }
  }
}
