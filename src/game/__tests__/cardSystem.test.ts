import { GameManager } from '../GameManager';
import { Card } from '../../types/game';
import { CardType, GameConfig, GameMode } from '../../constants/gameConstants';
import { validateCardPlacement } from '../gameRules';

describe('Card System', () => {
  let gameManager: GameManager;

  beforeEach(() => {
    gameManager = new GameManager();
  });

  describe('Card Generation', () => {
    it('should create a deck with correct number of cards', () => {
      const deck = gameManager['createDeck']();
      const expectedSize =
        GameConfig.MAX_NUMBER_VALUE * GameConfig.CARDS_PER_NUMBER + GameConfig.WILDCARDS_COUNT;
      expect(deck.length).toBe(expectedSize);
    });

    it('should create correct number of number cards', () => {
      const deck = gameManager['createDeck']();
      const numberCards = deck.filter((card) => card.type === CardType.NUMBER);
      const expectedNumberCards = GameConfig.MAX_NUMBER_VALUE * GameConfig.CARDS_PER_NUMBER;
      expect(numberCards.length).toBe(expectedNumberCards);
    });

    it('should create correct number of wildcards', () => {
      const deck = gameManager['createDeck']();
      const wildcards = deck.filter((card) => card.type === CardType.WILDCARD);
      expect(wildcards.length).toBe(GameConfig.WILDCARDS_COUNT);
    });

    it('should create cards with correct value ranges', () => {
      const deck = gameManager['createDeck']();
      const numberCards = deck.filter((card) => card.type === CardType.NUMBER);
      const wildcards = deck.filter((card) => card.type === CardType.WILDCARD);

      // Check if all number cards have values within the correct range
      numberCards.forEach((card) => {
        expect(card.value).toBeGreaterThanOrEqual(1);
        expect(card.value).toBeLessThanOrEqual(GameConfig.MAX_NUMBER_VALUE);
      });

      // Check if all wildcards have values within the correct range
      wildcards.forEach((card) => {
        expect(card.value).toBeGreaterThanOrEqual(1);
        expect(card.value).toBeLessThanOrEqual(GameConfig.MAX_NUMBER_VALUE);
      });
    });

    it('should create unique card IDs', () => {
      const deck = gameManager['createDeck']();
      const cardIds = deck.map((card) => card.id);
      const uniqueCardIds = new Set(cardIds);
      expect(cardIds.length).toBe(uniqueCardIds.size);
    });

    it('should create correct number of cards per value', () => {
      const deck = gameManager['createDeck']();
      const numberCards = deck.filter((card) => card.type === CardType.NUMBER);

      // Count cards for each value
      const valueCounts = new Map<number, number>();
      numberCards.forEach((card) => {
        valueCounts.set(card.value, (valueCounts.get(card.value) || 0) + 1);
      });

      // Check if each value has the correct number of cards
      valueCounts.forEach((count) => {
        expect(count).toBe(GameConfig.CARDS_PER_NUMBER);
      });
    });
  });

  describe('Card Validation', () => {
    const wildcard: Card = {
      id: 'wild1',
      type: CardType.WILDCARD,
      value: 3,
      isWildcard: true,
    };

    const numberCard1: Card = {
      id: 'num1',
      type: CardType.NUMBER,
      value: 1,
      isWildcard: false,
    };

    const numberCard2: Card = {
      id: 'num2',
      type: CardType.NUMBER,
      value: 2,
      isWildcard: false,
    };

    const numberCard3: Card = {
      id: 'num3',
      type: CardType.NUMBER,
      value: 3,
      isWildcard: false,
    };

    describe('Wildcard Usage', () => {
      it('should validate wildcard usage correctly in standard mode', () => {
        // Test valid wildcard usage (1 + 2 = 3)
        expect(validateCardPlacement([wildcard, numberCard1, numberCard2], GameMode.STANDARD)).toBe(
          true
        );

        // Test invalid wildcard usage (too many wildcards)
        const wildcard2: Card = {
          id: 'wild2',
          type: CardType.WILDCARD,
          value: 4,
          isWildcard: true,
        };
        expect(validateCardPlacement([wildcard, wildcard2, numberCard1], GameMode.STANDARD)).toBe(
          true
        );
      });

      it('should validate wildcard usage correctly in advanced mode', () => {
        // Test valid wildcard usage (2 × 3 = 6)
        expect(validateCardPlacement([wildcard, numberCard2, numberCard3], GameMode.ADVANCED)).toBe(
          true
        );

        // Test invalid wildcard usage (too many wildcards)
        const wildcard2: Card = {
          id: 'wild2',
          type: CardType.WILDCARD,
          value: 4,
          isWildcard: true,
        };
        expect(validateCardPlacement([wildcard, wildcard2, numberCard1], GameMode.ADVANCED)).toBe(
          true
        );
      });

      it('should allow any combination with two wildcards', () => {
        const wildcard2: Card = {
          id: 'wild2',
          type: CardType.WILDCARD,
          value: 4,
          isWildcard: true,
        };

        // Test in standard mode
        expect(validateCardPlacement([wildcard, wildcard2, numberCard1], GameMode.STANDARD)).toBe(
          true
        );

        // Test in advanced mode
        expect(validateCardPlacement([wildcard, wildcard2, numberCard1], GameMode.ADVANCED)).toBe(
          true
        );
      });

      it('should validate wildcard with two number cards correctly', () => {
        // Test valid combination (1 + 2 = 3)
        expect(validateCardPlacement([wildcard, numberCard1, numberCard2], GameMode.STANDARD)).toBe(
          true
        );

        // Test invalid combination (1 + 2 ≠ 4)
        const numberCard4: Card = {
          id: 'num4',
          type: CardType.NUMBER,
          value: 4,
          isWildcard: false,
        };
        expect(validateCardPlacement([wildcard, numberCard1, numberCard4], GameMode.STANDARD)).toBe(
          false
        );
      });
    });

    describe('Number Card Combinations', () => {
      it('should validate valid number combinations in standard mode', () => {
        // Test valid combinations
        expect(
          validateCardPlacement([numberCard1, numberCard2, numberCard3], GameMode.STANDARD)
        ).toBe(true);

        // Test invalid combinations
        const numberCard4: Card = {
          id: 'num4',
          type: CardType.NUMBER,
          value: 4,
          isWildcard: false,
        };
        expect(
          validateCardPlacement([numberCard1, numberCard2, numberCard4], GameMode.STANDARD)
        ).toBe(false);
      });

      it('should validate valid number combinations in advanced mode', () => {
        // Test valid combinations (2 × 3 = 6)
        const numberCard6: Card = {
          id: 'num6',
          type: CardType.NUMBER,
          value: 6,
          isWildcard: false,
        };
        expect(
          validateCardPlacement([numberCard2, numberCard3, numberCard6], GameMode.ADVANCED)
        ).toBe(true);

        // Test invalid combinations
        expect(
          validateCardPlacement([numberCard1, numberCard2, numberCard3], GameMode.ADVANCED)
        ).toBe(false);
      });
    });
  });
});
