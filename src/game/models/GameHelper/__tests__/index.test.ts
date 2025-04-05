import { findValidPlacements } from '../index';
import { Card } from '../../Card';
import { CardGroup } from '../../CardGroup';
import { GameMode, CardPosition } from '../../../types';

describe('findValidPlacements', () => {
  it('should find valid card placements for addition game mode', () => {
    // Create player hand with cards that can form valid equations
    const playerHand: Card[] = [
      new Card(5, false), // Can be used as top card
      new Card(2, false), // Can be used as bottom left
      new Card(3, false), // Can be used as bottom right
      new Card(7, false), // Can be used as top card
      new Card(4, false), // Can be used as bottom left
    ];

    // Create a card group in addition mode
    const cardGroup = new CardGroup(GameMode.ADDITION);

    // Find valid placements
    const suggestions = findValidPlacements(playerHand, cardGroup);

    // Verify that we found at least one valid suggestion
    expect(suggestions.length).toBeGreaterThan(0);

    // Verify that each suggestion has valid cards
    suggestions.forEach((suggestion) => {
      // Check that the suggestion has an explanation
      expect(suggestion.explanation).toBeTruthy();

      // Check that the suggestion has cards
      expect(suggestion.cards.size).toBeGreaterThan(0);

      // Verify that the cards form a valid equation
      const cards = Array.from(suggestion.cards.entries());
      const topCard = cards.find(([pos]) => pos === 'top')?.[1];
      const bottomLeftCard = cards.find(([pos]) => pos === 'bottomLeft')?.[1];
      const bottomRightCard = cards.find(([pos]) => pos === 'bottomRight')?.[1];

      if (topCard && bottomLeftCard && bottomRightCard) {
        const topValue = topCard.getValue();
        const bottomLeftValue = bottomLeftCard.getValue();
        const bottomRightValue = bottomRightCard.getValue();

        if (topValue !== null && bottomLeftValue !== null && bottomRightValue !== null) {
          expect(topValue).toBe(bottomLeftValue + bottomRightValue);
        }
      }
    });
  });

  it('should find valid card placements when there are committed cards', () => {
    // Create player hand with cards
    const playerHand: Card[] = [new Card(15, false), new Card(9, false), new Card(13, false)];

    // Create a card group in addition mode
    const cardGroup = new CardGroup(GameMode.ADDITION);

    // Place and commit cards in the card group (13 = 4 + 9)
    const committedCards = new Map<CardPosition, Card>([
      [CardPosition.TOP, new Card(13, false)],
      [CardPosition.BOTTOM_LEFT, new Card(4, false)],
      [CardPosition.BOTTOM_RIGHT, new Card(9, false)],
    ]);

    // Place and commit the cards
    cardGroup.placeCards(committedCards, 'player1');
    cardGroup.commit();

    // Find valid placements
    const suggestions = findValidPlacements(playerHand, cardGroup);

    // Verify that we found at least one valid suggestion
    expect(suggestions.length).toBeGreaterThan(0);

    // Verify that each suggestion has valid cards
    suggestions.forEach((suggestion) => {
      // Check that the suggestion has an explanation
      expect(suggestion.explanation).toBeTruthy();

      // Check that the suggestion has cards
      expect(suggestion.cards.size).toBeGreaterThan(0);

      // Verify that the cards form a valid equation
      const cards = Array.from(suggestion.cards.entries());
      const topCard = cards.find(([pos]) => pos === 'top')?.[1];
      const bottomLeftCard = cards.find(([pos]) => pos === 'bottomLeft')?.[1];
      const bottomRightCard = cards.find(([pos]) => pos === 'bottomRight')?.[1];

      if (topCard && bottomLeftCard && bottomRightCard) {
        const topValue = topCard.getValue();
        const bottomLeftValue = bottomLeftCard.getValue();
        const bottomRightValue = bottomRightCard.getValue();

        if (topValue !== null && bottomLeftValue !== null && bottomRightValue !== null) {
          expect(topValue).toBe(bottomLeftValue + bottomRightValue);
        }
      }
    });
  });
});
