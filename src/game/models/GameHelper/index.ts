import { Card } from '../Card';
import { CardGroup } from '../CardGroup';
import { CardPlacementSuggestion } from './types';
import { hasCommittedCards } from './utils';
import { findValidCombinationsWithCommittedCards } from './CommittedCardsHelper';
import { findValidCombinationsForNewEquation } from './NewEquationHelper';

/**
 * Find valid card placements based on the player's hand and the current game state
 * @param playerHand The cards in the player's hand
 * @param cardGroup The card group containing the current game state
 * @returns An array of valid card placement suggestions
 */
export function findValidPlacements(
  playerHand: Card[],
  cardGroup: CardGroup
): CardPlacementSuggestion[] {
  const committedState = cardGroup.getCommittedState();
  const gameMode = cardGroup.getGameMode();

  // First try to find valid combinations for new equations
  const newEquationSuggestions = findValidCombinationsForNewEquation(playerHand, gameMode);

  // If we found valid new equation placements, return those
  if (newEquationSuggestions.length > 0) {
    return newEquationSuggestions;
  }

  // If no new equation placements were found and there are committed cards,
  // try to find combinations that work with committed cards
  const hasCommitted = hasCommittedCards(committedState);
  if (hasCommitted) {
    return findValidCombinationsWithCommittedCards(playerHand, committedState, gameMode);
  }

  // If no valid placements were found at all, return empty array
  return [];
}

// Re-export types
export * from './types';
