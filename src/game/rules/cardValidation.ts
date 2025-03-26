import { Card } from '../../types/game';
import { GameMode } from '../../constants/gameConstants';

export class CardValidator {
  validateCardPlacement(cards: Card[], mode: GameMode): boolean {
    if (cards.length < 2 || cards.length > 3) return false;

    // Count wildcards
    const wildcards = cards.filter((card) => card.isWildcard);
    if (wildcards.length > 2) return false; // Maximum 2 wildcards allowed

    // Get non-wildcard cards
    const numberCards = cards.filter((card) => !card.isWildcard);
    const values = numberCards.map((card) => card.value);

    // For 2 cards, they must be equal
    if (cards.length === 2) {
      return this.validateTwoCards(wildcards, values);
    }

    // Check for duplicate values among number cards
    const uniqueValues = new Set(values);
    if (uniqueValues.size !== values.length) return false;

    // If we have 2 or 3 wildcards, any combination is valid
    if (wildcards.length >= 2) return true;

    // If we have 1 wildcard, validate the combination
    if (wildcards.length === 1) {
      return this.validateOneWildcard(values, wildcards[0].value, mode);
    }

    // If we have no wildcards, validate the number combination
    return this.validateNumberCombination(values[0], values[1], values[2], mode);
  }

  validateCardReplacement(newCard: Card, placedCards: Card[], gameMode: GameMode): boolean {
    // Find the card to replace in placed cards
    const cardToReplaceIndex = placedCards.findIndex((card) => card.id === newCard.id);
    if (cardToReplaceIndex === -1) return false;

    // Create new combination with replaced card
    const newCombination = [...placedCards];
    newCombination[cardToReplaceIndex] = newCard;

    // Validate the new combination
    return this.validateCardPlacement(newCombination, gameMode);
  }

  private validateTwoCards(wildcards: Card[], values: number[]): boolean {
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

  private validateOneWildcard(values: number[], wildcardValue: number, mode: GameMode): boolean {
    if (values.length !== 2) return false;
    const [a, b] = values;

    if (mode === GameMode.STANDARD) {
      // In standard mode, we need to check if:
      // 1. The sum of the two numbers equals the wildcard value
      return a + b === wildcardValue;
    } else {
      // In advanced mode, we need to check if:
      // 1. The product of the two numbers equals the wildcard value
      // 2. The wildcard value times one number equals the other number
      return (
        a * b === wildcardValue || // a * b = wildcard
        wildcardValue * a === b || // wildcard * a = b
        wildcardValue * b === a || // wildcard * b = a
        a * b === wildcardValue || // a * b = wildcard (again)
        (a === wildcardValue && b === wildcardValue) || // wildcard = wildcard
        a === wildcardValue || // wildcard = a
        b === wildcardValue // wildcard = b
      );
    }
  }

  private validateNumberCombination(a: number, b: number, c: number, mode: GameMode): boolean {
    if (mode === GameMode.STANDARD) {
      return a + b === c || b + c === a || a + c === b;
    } else {
      return a * b === c || b * c === a || a * c === b;
    }
  }
}
