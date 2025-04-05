import { tryTwoCardPlacements } from '../TwoCardPlacements';
import { Card } from '../../Card';
import { CardPosition, GameMode } from '../../../types';
import { CardPlacementSuggestion } from '../types';

describe('tryTwoCardPlacements', () => {
  it('should find valid two card placements for addition game mode', () => {
    // Create player hand from the provided data
    const playerHand: Card[] = [
      new Card(12, false),
      new Card(11, false),
      new Card(12, false),
      new Card(4, false),
      new Card(13, false),
    ];

    // Empty positions - we need all three positions for a valid equation
    const emptyPositions: CardPosition[] = [CardPosition.TOP, CardPosition.BOTTOM_LEFT];

    // Committed cards (empty map)
    const committedCards = new Map<CardPosition, Card>([
      [CardPosition.BOTTOM_RIGHT, new Card(9, false)],
    ]);

    // Game mode
    const gameMode: GameMode = GameMode.ADDITION;

    // Suggestions array
    const suggestions: CardPlacementSuggestion[] = [];

    // Call the function
    tryTwoCardPlacements(playerHand, emptyPositions, committedCards, gameMode, suggestions);

    // Log the results
    console.log('Found suggestions:', suggestions.length);
    suggestions.forEach((suggestion, index) => {
      console.log(`Suggestion ${index + 1}:`, suggestion.explanation);
      console.log('Cards:', Array.from(suggestion.cards.entries()));
    });

    // Basic assertions
    expect(suggestions.length).toBeGreaterThan(0);

    // Check that each suggestion has exactly 2 cards
    suggestions.forEach((suggestion) => {
      expect(suggestion.cards.size).toBe(2);
    });
  });

  it('should find valid two card placements when player has 12, 11, 10 and bottom has 2', () => {
    // Create player hand with 12, 11, 10
    const playerHand: Card[] = [new Card(12, false), new Card(11, false), new Card(10, false)];

    // Empty positions - we need top and bottom left for a valid equation
    const emptyPositions: CardPosition[] = [CardPosition.TOP, CardPosition.BOTTOM_LEFT];

    // Committed cards with 2 at bottom
    const committedCards = new Map<CardPosition, Card>([
      [CardPosition.BOTTOM_RIGHT, new Card(2, false)],
    ]);

    // Game mode
    const gameMode: GameMode = GameMode.ADDITION;

    // Suggestions array
    const suggestions: CardPlacementSuggestion[] = [];

    // Call the function
    tryTwoCardPlacements(playerHand, emptyPositions, committedCards, gameMode, suggestions);

    // Log the results
    console.log('Found suggestions:', suggestions.length);
    suggestions.forEach((suggestion, index) => {
      console.log(`Suggestion ${index + 1}:`, suggestion.explanation);
      console.log(
        'Cards:',
        Array.from(suggestion.cards.entries()).map((o) => `${o[0].toString()} ${o[1].getValue()}`)
      );
    });

    // Basic assertions
    expect(suggestions.length).toBeGreaterThan(0);

    // Check that each suggestion has exactly 2 cards
    suggestions.forEach((suggestion) => {
      expect(suggestion.cards.size).toBe(2);
    });

    // Check that the suggestions make valid equations with the bottom card (2)
    suggestions.forEach((suggestion) => {
      const cards = Array.from(suggestion.cards.entries());
      const topCard = cards.find(([pos]) => pos === CardPosition.TOP)?.[1];
      const bottomLeftCard = cards.find(([pos]) => pos === CardPosition.BOTTOM_LEFT)?.[1];
      expect(topCard?.getValue()).toBe((bottomLeftCard?.getValue() ?? 0) + 2);
    });
  });

  it('should find valid two card placements when player has 9, 2, 8 and top has 10', () => {
    // Create player hand with 9, 2, 8
    const playerHand: Card[] = [new Card(9, false), new Card(2, false), new Card(8, false)];

    // Empty positions - we need bottom left and bottom right for a valid equation
    const emptyPositions: CardPosition[] = [CardPosition.BOTTOM_LEFT, CardPosition.BOTTOM_RIGHT];

    // Committed cards with 10 at top
    const committedCards = new Map<CardPosition, Card>([[CardPosition.TOP, new Card(10, false)]]);

    // Game mode
    const gameMode: GameMode = GameMode.ADDITION;

    // Suggestions array
    const suggestions: CardPlacementSuggestion[] = [];

    // Call the function
    tryTwoCardPlacements(playerHand, emptyPositions, committedCards, gameMode, suggestions);

    // Log the results
    console.log('Found suggestions:', suggestions.length);
    suggestions.forEach((suggestion, index) => {
      console.log(`Suggestion ${index + 1}:`, suggestion.explanation);
      console.log(
        'Cards:',
        Array.from(suggestion.cards.entries()).map((o) => `${o[0].toString()} ${o[1].getValue()}`)
      );
    });

    // Basic assertions
    expect(suggestions.length).toBeGreaterThan(0);

    // Check that each suggestion has exactly 2 cards
    suggestions.forEach((suggestion) => {
      expect(suggestion.cards.size).toBe(2);
    });

    // Check that the suggestions make valid equations with the top card (10)
    suggestions.forEach((suggestion) => {
      const cards = Array.from(suggestion.cards.entries());
      const bottomLeftCard = cards.find(([pos]) => pos === CardPosition.BOTTOM_LEFT)?.[1];
      const bottomRightCard = cards.find(([pos]) => pos === CardPosition.BOTTOM_RIGHT)?.[1];
      expect((bottomLeftCard?.getValue() ?? 0) + (bottomRightCard?.getValue() ?? 0)).toBe(10);
    });
  });

  it('should find valid two card placements when player has 12, 18, 13 and bottom left has 5', () => {
    // Create player hand with 12, 18, 13
    const playerHand: Card[] = [new Card(12, false), new Card(18, false), new Card(13, false)];

    // Empty positions - we need top and bottom right for a valid equation
    const emptyPositions: CardPosition[] = [CardPosition.TOP, CardPosition.BOTTOM_RIGHT];

    // Committed cards with 5 at bottom left
    const committedCards = new Map<CardPosition, Card>([
      [CardPosition.BOTTOM_LEFT, new Card(5, false)],
    ]);

    // Game mode
    const gameMode: GameMode = GameMode.ADDITION;

    // Suggestions array
    const suggestions: CardPlacementSuggestion[] = [];

    // Call the function
    tryTwoCardPlacements(playerHand, emptyPositions, committedCards, gameMode, suggestions);

    // Log the results
    console.log('Found suggestions:', suggestions.length);
    suggestions.forEach((suggestion, index) => {
      console.log(`Suggestion ${index + 1}:`, suggestion.explanation);
      console.log(
        'Cards:',
        Array.from(suggestion.cards.entries()).map((o) => `${o[0].toString()} ${o[1].getValue()}`)
      );
    });

    // Basic assertions
    expect(suggestions.length).toBeGreaterThan(0);

    // Check that each suggestion has exactly 2 cards
    suggestions.forEach((suggestion) => {
      expect(suggestion.cards.size).toBe(2);
    });

    // Check that the suggestions make valid equations with the bottom left card (5)
    suggestions.forEach((suggestion) => {
      const cards = Array.from(suggestion.cards.entries());
      const topCard = cards.find(([pos]) => pos === CardPosition.TOP)?.[1];
      const bottomRightCard = cards.find(([pos]) => pos === CardPosition.BOTTOM_RIGHT)?.[1];
      expect(topCard?.getValue()).toBe((bottomRightCard?.getValue() ?? 0) + 5);
    });
  });
});
