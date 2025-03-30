import { CardGroup } from '../CardGroup';
import { Card } from '../Card';
import { GameMode, CardPosition } from '../../types';

describe('CardGroup', () => {
  let cardGroup: CardGroup;

  beforeEach(() => {
    cardGroup = new CardGroup(GameMode.ADDITION);
  });

  describe('canPlaceCards', () => {
    it('should allow placing cards in empty positions', () => {
      const cards = new Map<CardPosition, Card>([
        [CardPosition.TOP, new Card(5)],
        [CardPosition.BOTTOM_LEFT, new Card(2)],
        [CardPosition.BOTTOM_RIGHT, new Card(3)],
      ]);
      expect(cardGroup.canPlaceCards(cards)).toBe(true);
    });

    it('should allow placing cards with wild card', () => {
      const wildCard = new Card(7, true);
      const cards = new Map<CardPosition, Card>([
        [CardPosition.TOP, new Card(7)],
        [CardPosition.BOTTOM_LEFT, new Card(4)],
        [CardPosition.BOTTOM_RIGHT, wildCard],
      ]);
      expect(cardGroup.canPlaceCards(cards)).toBe(true);
    });

    it('should reject invalid equation', () => {
      const cards = new Map<CardPosition, Card>([
        [CardPosition.TOP, new Card(5)],
        [CardPosition.BOTTOM_LEFT, new Card(2)],
        [CardPosition.BOTTOM_RIGHT, new Card(4)], // 2 + 4 != 5
      ]);
      expect(cardGroup.canPlaceCards(cards)).toBe(false);
    });
  });

  describe('placeCards', () => {
    it('should place cards in working area', () => {
      const cards = new Map<CardPosition, Card>([
        [CardPosition.TOP, new Card(5)],
        [CardPosition.BOTTOM_LEFT, new Card(2)],
        [CardPosition.BOTTOM_RIGHT, new Card(3)],
      ]);
      const playerId = 'player1';

      cardGroup.placeCards(cards, playerId);

      expect(cardGroup.getCard(CardPosition.TOP)?.getValue()).toBe(5);
      expect(cardGroup.getCard(CardPosition.BOTTOM_LEFT)?.getValue()).toBe(2);
      expect(cardGroup.getCard(CardPosition.BOTTOM_RIGHT)?.getValue()).toBe(3);
      expect(cardGroup.getPlayerId()).toBe(playerId);
    });
  });

  describe('validate', () => {
    it('should validate addition mode correctly', () => {
      const cards = new Map<CardPosition, Card>([
        [CardPosition.TOP, new Card(5)],
        [CardPosition.BOTTOM_LEFT, new Card(2)],
        [CardPosition.BOTTOM_RIGHT, new Card(3)],
      ]);

      cardGroup.placeCards(cards, 'player1');

      expect(cardGroup.validate()).toBe(true);
    });

    it('should validate multiplication mode correctly', () => {
      const multiplicationCardGroup = new CardGroup(GameMode.MULTIPLICATION);
      const cards = new Map<CardPosition, Card>([
        [CardPosition.TOP, new Card(6)],
        [CardPosition.BOTTOM_LEFT, new Card(2)],
        [CardPosition.BOTTOM_RIGHT, new Card(3)],
      ]);

      multiplicationCardGroup.placeCards(cards, 'player1');

      expect(multiplicationCardGroup.validate()).toBe(true);
    });
  });

  describe('commit', () => {
    it('should commit valid card group to committed state', () => {
      const cards = new Map<CardPosition, Card>([
        [CardPosition.TOP, new Card(5)],
        [CardPosition.BOTTOM_LEFT, new Card(2)],
        [CardPosition.BOTTOM_RIGHT, new Card(3)],
      ]);

      cardGroup.placeCards(cards, 'player1');
      cardGroup.commit();

      // After commit, working area should be cleared
      expect(cardGroup.getCard(CardPosition.TOP)?.getValue()).toBe(5);
      expect(cardGroup.getCard(CardPosition.BOTTOM_LEFT)?.getValue()).toBe(2);
      expect(cardGroup.getCard(CardPosition.BOTTOM_RIGHT)?.getValue()).toBe(3);
      expect(cardGroup.getPlayerId()).toBe('player1');
    });

    it('should allow next player to place two cards and commit', () => {
      // First player places and commits 2 + 3 = 5
      const firstPlayerCards = new Map<CardPosition, Card>([
        [CardPosition.TOP, new Card(5)],
        [CardPosition.BOTTOM_LEFT, new Card(2)],
        [CardPosition.BOTTOM_RIGHT, new Card(3)],
      ]);
      cardGroup.placeCards(firstPlayerCards, 'player1');
      cardGroup.commit();

      // Second player places two cards (4 and 1) to make 4 + 1 = 5
      const secondPlayerCards = new Map<CardPosition, Card>([
        [CardPosition.BOTTOM_LEFT, new Card(4)],
        [CardPosition.BOTTOM_RIGHT, new Card(1)],
      ]);

      // Verify can not place two cards 4 + 2 != 5
      expect(
        cardGroup.canPlaceCards(
          new Map<CardPosition, Card>([
            [CardPosition.BOTTOM_LEFT, new Card(4)],
            [CardPosition.BOTTOM_RIGHT, new Card(2)],
          ])
        )
      ).toBe(false);

      // Verify can place two cards 7 = 4 + 3
      expect(
        cardGroup.canPlaceCards(
          new Map<CardPosition, Card>([
            [CardPosition.TOP, new Card(7)],
            [CardPosition.BOTTOM_RIGHT, new Card(3)],
          ])
        )
      ).toBe(true);

      expect(cardGroup.canPlaceCards(secondPlayerCards)).toBe(true);
      // Place the two cards
      cardGroup.placeCards(secondPlayerCards, 'player2');

      // Verify the new state
      expect(cardGroup.getCard(CardPosition.TOP)?.getValue()).toBe(5); // From previous commit
      expect(cardGroup.getCard(CardPosition.BOTTOM_LEFT)?.getValue()).toBe(4); // New card
      expect(cardGroup.getCard(CardPosition.BOTTOM_RIGHT)?.getValue()).toBe(1); // New card
      expect(cardGroup.getPlayerId()).toBe('player2');

      // Commit the new combination
      cardGroup.commit();

      // Verify final state
      expect(cardGroup.getCard(CardPosition.TOP)?.getValue()).toBe(5);
      expect(cardGroup.getCard(CardPosition.BOTTOM_LEFT)?.getValue()).toBe(4);
      expect(cardGroup.getCard(CardPosition.BOTTOM_RIGHT)?.getValue()).toBe(1);
      expect(cardGroup.getPlayerId()).toBe('player2');
    });
  });

  describe('isComplete', () => {
    it('should return true when all positions are filled', () => {
      const cards = new Map<CardPosition, Card>([
        [CardPosition.TOP, new Card(5)],
        [CardPosition.BOTTOM_LEFT, new Card(2)],
        [CardPosition.BOTTOM_RIGHT, new Card(3)],
      ]);

      cardGroup.placeCards(cards, 'player1');

      expect(cardGroup.isComplete()).toBe(true);
    });
  });
});
