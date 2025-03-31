import { Deck } from '../Deck';
import { Card } from '../Card';

describe('Deck', () => {
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck();
  });

  describe('constructor and initialization', () => {
    it('should initialize with correct number of cards', () => {
      // A standard deck should have 42 cards (1-20 × 2 + 2 wild cards)
      expect(deck.getCards()).toHaveLength(42);
    });

    it('should contain all required cards', () => {
      const cards = deck.getCards();

      // Check for number cards (1-20)
      for (let i = 1; i <= 20; i++) {
        const numberCards = cards.filter(
          (card: Card) => !card.isWildcard && card.getValue() === i
        );
        expect(numberCards).toHaveLength(2); // Each number should appear 2 times
      }

      // Check for wild cards
      const wildCards = cards.filter((card: Card) => card.isWildcard);
      expect(wildCards).toHaveLength(2); // 2 wild cards
    });
  });

  describe('shuffle', () => {
    it('should maintain the same number of cards', () => {
      const originalCount = deck.getCards().length;
      deck.shuffle();
      expect(deck.getCards()).toHaveLength(originalCount);
    });

    it('should change the order of cards', () => {
      const originalOrder = [...deck.getCards()];
      deck.shuffle();
      const shuffledOrder = deck.getCards();

      // Check if at least one card is in a different position
      let hasDifferentPosition = false;
      for (let i = 0; i < originalOrder.length; i++) {
        if (originalOrder[i] !== shuffledOrder[i]) {
          hasDifferentPosition = true;
          break;
        }
      }
      expect(hasDifferentPosition).toBe(true);
    });
  });

  describe('draw', () => {
    it('should draw correct number of cards', () => {
      const drawnCards = deck.draw(3);
      expect(drawnCards).toHaveLength(3);
      expect(deck.getCards()).toHaveLength(39); // 42 - 3
    });

    it('should remove drawn cards from deck', () => {
      const drawnCards = deck.draw(3);
      const remainingCards = deck.getCards();

      // Check that drawn cards are not in the remaining deck
      drawnCards.forEach((card) => {
        expect(remainingCards).not.toContain(card);
      });
    });

    it('should throw error when trying to draw more cards than available', () => {
      expect(() => deck.draw(43)).toThrow('Not enough cards in deck');
    });

    it('should return empty array when drawing 0 cards', () => {
      const drawnCards = deck.draw(0);
      expect(drawnCards).toHaveLength(0);
      expect(deck.getCards()).toHaveLength(42);
    });
  });

  describe('isEmpty', () => {
    it('should return false when deck has cards', () => {
      expect(deck.isEmpty()).toBe(false);
    });

    it('should return true when deck is empty', () => {
      deck.draw(42); // Draw all cards
      expect(deck.isEmpty()).toBe(true);
    });
  });

  describe('reset', () => {
    it('should restore deck to initial state', () => {
      // Draw some cards
      deck.draw(10);
      const drawnCount = 10;
      expect(deck.getCards()).toHaveLength(42 - drawnCount);

      // Reset deck
      deck.reset();
      expect(deck.getCards()).toHaveLength(42);
    });

    it('should contain all required cards after reset', () => {
      deck.draw(42); // Empty the deck
      deck.reset();

      const cards = deck.getCards();

      // Check for number cards (1-20)
      for (let i = 1; i <= 20; i++) {
        const numberCards = cards.filter(
          (card: Card) => !card.isWildCard()&& card.getValue() === i
        );
        expect(numberCards).toHaveLength(2); // Each number should appear 2 times
      }

      // Check for wild cards
      const wildCards = cards.filter((card: Card) => card.isWildCard());
      expect(wildCards).toHaveLength(2); // 2 wild cards
    });
  });
});
