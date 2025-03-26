import { Card } from '../types/game';
import { GameMode } from '../constants/gameConstants';

export function validateCardPlacement(cards: Card[], mode: GameMode): boolean {
  if (cards.length < 2 || cards.length > 3) return false;

  // Count wildcards
  const wildcards = cards.filter((card) => card.isWildcard);
  if (wildcards.length > 2) return false; // Maximum 2 wildcards allowed

  // Get non-wildcard cards
  const numberCards = cards.filter((card) => !card.isWildcard);
  const values = numberCards.map((card) => card.value);

  // For 2 cards, they must be equal
  if (cards.length === 2) {
    // If we have one wildcard and one number card, they must have the same value
    if (wildcards.length === 1) {
      return wildcards[0].value === values[0];
    }
    // If we have two wildcards, they must have the same value
    if (wildcards.length === 2) {
      return wildcards[0].value === wildcards[1].value;
    }
    // If we have two number cards, they must have the same value
    return values[0] === values[1];
  }

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
      // In standard mode, we need to check if:
      // 1. The sum of the two numbers equals the wildcard value
      const sum = a + b;
      const isValid = sum === wildcardValue; // Only check if a + b = wildcard
      console.log('Standard mode equations:', {
        'a + b': sum,
        'wildcard value': wildcardValue,
        isValid,
      });
      return isValid;
    } else {
      // In advanced mode, we need to check if:
      // 1. The product of the two numbers equals the wildcard value
      // 2. The wildcard value times one number equals the other number
      const product = a * b;
      const isValid =
        product === wildcardValue || // a * b = wildcard
        wildcardValue * a === b || // wildcard * a = b
        wildcardValue * b === a || // wildcard * b = a
        a * b === wildcardValue || // a * b = wildcard (again)
        (a === wildcardValue && b === wildcardValue) || // wildcard = wildcard
        a === wildcardValue || // wildcard = a
        b === wildcardValue; // wildcard = b
      console.log('Advanced mode equations:', {
        'a * b': product,
        'wildcard * a': wildcardValue * a,
        'wildcard * b': wildcardValue * b,
        'wildcard value': wildcardValue,
        'a === wildcard': a === wildcardValue,
        'b === wildcard': b === wildcardValue,
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
