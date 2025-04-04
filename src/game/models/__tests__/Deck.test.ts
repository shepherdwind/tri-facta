import { Deck } from '../Deck';
import { Card } from '../Card';
import { GameMode } from '../../types';

describe('Deck', () => {
  describe('Addition Mode', () => {
    let deck: Deck;

    beforeEach(() => {
      deck = new Deck(GameMode.ADDITION);
    });

    describe('constructor and initialization', () => {
      it('should initialize with correct number of cards', () => {
        // Addition mode: 42 cards (1-20 × 2 + 2 wild cards)
        expect(deck.getCards()).toHaveLength(42);
      });

      it('should contain all required cards for addition mode', () => {
        const cards = deck.getCards();

        // Check for number cards (1-20)
        for (let i = 1; i <= 20; i++) {
          const numberCards = cards.filter(
            (card: Card) => !card.isWildcard && card.getValue() === i
          );
          expect(numberCards).toHaveLength(2); // Each number should appear 2 times
        }

        // Check for wild cards (2 cards)
        const wildCards = cards.filter((card: Card) => card.isWildcard);
        expect(wildCards).toHaveLength(2);
      });
    });
  });

  describe('Multiplication Mode', () => {
    let deck: Deck;

    beforeEach(() => {
      deck = new Deck(GameMode.MULTIPLICATION);
    });

    describe('constructor and initialization', () => {
      it('should initialize with correct number of cards', () => {
        // Multiplication mode: 48 cards (24 small + 8 medium + 8 large + 8 wild cards)
        expect(deck.getCards()).toHaveLength(48);
      });

      it('should contain all required cards for multiplication mode', () => {
        const cards = deck.getCards();

        // Check small numbers (1-6) appear 4 times each
        const smallNumbers = [1, 2, 3, 4, 5, 6];
        smallNumbers.forEach((num) => {
          const numberCards = cards.filter(
            (card: Card) => !card.isWildcard && card.getValue() === num
          );
          expect(numberCards).toHaveLength(4);
        });

        // Check medium numbers (8-12) appear 2 times each
        const mediumNumbers = [8, 9, 10, 12];
        mediumNumbers.forEach((num) => {
          const numberCards = cards.filter(
            (card: Card) => !card.isWildcard && card.getValue() === num
          );
          expect(numberCards).toHaveLength(2);
        });

        // Check large numbers (15-36) appear 1 time each
        const largeNumbers = [15, 16, 18, 20, 24, 25, 30, 36];
        largeNumbers.forEach((num) => {
          const numberCards = cards.filter(
            (card: Card) => !card.isWildcard && card.getValue() === num
          );
          expect(numberCards).toHaveLength(1);
        });

        // Check for wild cards (8 cards)
        const wildCards = cards.filter((card: Card) => card.isWildcard);
        expect(wildCards).toHaveLength(8);
      });
    });
  });

  describe('Common functionality', () => {
    let deck: Deck;

    beforeEach(() => {
      deck = new Deck(GameMode.ADDITION); // Use addition mode for common tests
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

      it('should throw error when trying to draw more cards than available', () => {
        expect(() => deck.draw(43)).toThrow('Not enough cards in deck');
      });
    });

    describe('isEmpty', () => {
      it('should return true when deck is empty', () => {
        deck.draw(42); // Draw all cards
        expect(deck.isEmpty()).toBe(true);
      });
    });

    describe('reset', () => {
      it('should restore deck to initial state', () => {
        deck.draw(10);
        deck.reset();
        expect(deck.getCards()).toHaveLength(42);
      });
    });
  });
});
