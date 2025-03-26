import { Card } from '../types/game';
import { GameMode } from '../constants/gameConstants';
import { GameConfig } from '../constants/gameConstants';

export function validateCardPlacement(cards: Card[], mode: GameMode): boolean {
  if (cards.length !== 3) return false;

  // Count wildcards
  const wildcards = cards.filter((card) => card.isWildcard);
  if (wildcards.length > 2) return false; // Maximum 2 wildcards allowed

  // Get non-wildcard cards
  const numberCards = cards.filter((card) => !card.isWildcard);
  const values = numberCards.map((card) => card.value);

  // Check for duplicate values among number cards
  const uniqueValues = new Set(values);
  if (uniqueValues.size !== values.length) return false;

  // If we have 2 or 3 wildcards, any combination is valid
  if (wildcards.length >= 2) return true;

  // If we have 1 wildcard, we need to check if the remaining numbers can form a valid equation
  if (wildcards.length === 1) {
    if (numberCards.length !== 2) return false;
    // For standard mode: a + b = c
    // For advanced mode: a × b = c
    // We need to check if the two numbers can form a valid equation
    const [a, b] = values;
    const wildcardValue = wildcards[0].value;

    console.log('Validating cards:', { a, b, wildcardValue, mode });

    // Try all possible positions for the wildcard
    if (mode === GameMode.STANDARD) {
      // In standard mode, we need to check if the sum of the two numbers
      // equals the wildcard value
      const sum = a + b;
      const isValid = sum === wildcardValue;
      console.log('Standard mode equations:', {
        'a + b': sum,
        'wildcard value': wildcardValue,
        isValid,
      });
      return isValid;
    } else {
      // In advanced mode, we need to check if the product of the two numbers
      // is a valid value for the wildcard
      const product = a * b;
      const isValid = product >= 1 && product <= GameConfig.MAX_NUMBER_VALUE;
      console.log('Advanced mode equations:', {
        'a * b': product,
        isValid,
      });
      return isValid;
    }
  }

  // If we have no wildcards, validate the number combination
  return validateNumberCombination(values[0], values[1], values[2], mode);
}

function validateNumberCombination(a: number, b: number, c: number, mode: GameMode): boolean {
  if (mode === GameMode.STANDARD) {
    return a + b === c || b + c === a || a + c === b;
  } else {
    return a * b === c || b * c === a || a * c === b;
  }
}

export const validateCardReplacement = (
  newCard: Card,
  placedCards: Card[],
  gameMode: GameMode
): boolean => {
  // Find the card to replace in placed cards
  const cardToReplaceIndex = placedCards.findIndex((card) => card.id === newCard.id);
  if (cardToReplaceIndex === -1) return false;

  // Create new combination with replaced card
  const newCombination = [...placedCards];
  newCombination[cardToReplaceIndex] = newCard;

  // Validate the new combination
  return validateCardPlacement(newCombination, gameMode);
};

export function checkGameEnd(players: { id: string; hand: Card[] }[]): string | null {
  // Game ends when a player has no cards left
  const winnerIndex = players.findIndex((player) => player.hand.length === 0);

  if (winnerIndex === -1) return null;

  return players[winnerIndex].id;
}

export function canReplaceCards(player: { hand: Card[] }, oldCards: Card[]): boolean {
  // Check if all old cards are in player's hand
  return oldCards.every((card) => player.hand.some((handCard) => handCard.id === card.id));
}

export function canDrawCard(deck: Card[]): boolean {
  return deck.length > 0;
}
