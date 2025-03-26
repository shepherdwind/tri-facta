import {
  validateCardPlacement,
  validateCardReplacement,
  checkGameEnd,
  canReplaceCards,
  canDrawCard,
} from '../gameRules';
import { Card } from '../../types/game';
import { GameMode, CardType } from '../../constants/gameConstants';

describe('gameRules', () => {
  const mockCard1: Card = {
    id: '1',
    type: CardType.NUMBER,
    value: 1,
    isWildcard: false,
  };

  const mockCard2: Card = {
    id: '2',
    type: CardType.NUMBER,
    value: 2,
    isWildcard: false,
  };

  const mockCard3: Card = {
    id: '3',
    type: CardType.NUMBER,
    value: 3,
    isWildcard: false,
  };

  describe('validateCardPlacement', () => {
    it('should validate valid card combinations in standard mode', () => {
      expect(validateCardPlacement([mockCard1, mockCard2, mockCard3], GameMode.STANDARD)).toBe(
        true
      );
    });

    it('should reject invalid card combinations in standard mode', () => {
      const invalidCard: Card = {
        id: '4',
        type: CardType.NUMBER,
        value: 5,
        isWildcard: false,
      };
      expect(validateCardPlacement([mockCard1, mockCard2, invalidCard], GameMode.STANDARD)).toBe(
        false
      );
    });

    it('should validate multiplication mode correctly', () => {
      const mode = GameMode.ADVANCED;

      // Valid: 2 × 3 = 6
      const card6: Card = {
        id: 'card6',
        type: CardType.NUMBER,
        value: 6,
        isWildcard: false,
      };
      expect(validateCardPlacement([mockCard2, mockCard3, card6], mode)).toBe(true);

      // Invalid: 2 × 3 ≠ 7
      const card7: Card = {
        id: 'card7',
        type: CardType.NUMBER,
        value: 7,
        isWildcard: false,
      };
      expect(validateCardPlacement([mockCard2, mockCard3, card7], mode)).toBe(false);
    });

    it('should require exactly 3 cards', () => {
      const mode = GameMode.STANDARD;
      expect(validateCardPlacement([mockCard1, mockCard2], mode)).toBe(false);
      expect(validateCardPlacement([mockCard1, mockCard2, mockCard3, mockCard1], mode)).toBe(false);
    });
  });

  describe('validateCardReplacement', () => {
    it('should validate card replacement with valid combination', () => {
      const placedCards = [mockCard1, mockCard2, mockCard3];
      expect(validateCardReplacement(mockCard2, placedCards, GameMode.STANDARD)).toBe(true);
    });

    it('should reject replacement with invalid combination', () => {
      const placedCards = [mockCard1, mockCard2, mockCard3];
      const invalidCard: Card = {
        id: '4',
        type: CardType.NUMBER,
        value: 5,
        isWildcard: false,
      };
      expect(validateCardReplacement(invalidCard, placedCards, GameMode.STANDARD)).toBe(false);
    });

    it('should reject replacement with card not in placed cards', () => {
      const placedCards = [mockCard1, mockCard2, mockCard3];
      const newCard: Card = {
        id: '4',
        type: CardType.NUMBER,
        value: 3,
        isWildcard: false,
      };
      expect(validateCardReplacement(newCard, placedCards, GameMode.STANDARD)).toBe(false);
    });
  });

  describe('checkGameEnd', () => {
    it('should detect winner when a player has no cards', () => {
      const players = [
        { id: '1', name: 'Player 1', hand: [] },
        { id: '2', name: 'Player 2', hand: [mockCard1] },
      ];

      expect(checkGameEnd(players)).toBe('1');
    });

    it('should return null when no player has empty hand', () => {
      const players = [
        { id: '1', name: 'Player 1', hand: [mockCard1] },
        { id: '2', name: 'Player 2', hand: [mockCard2] },
      ];

      expect(checkGameEnd(players)).toBeNull();
    });
  });

  describe('canReplaceCards', () => {
    it('should allow replacing cards that are in player hand', () => {
      const player = {
        id: '1',
        name: 'Player 1',
        hand: [mockCard1, mockCard2],
      };

      expect(canReplaceCards(player, [mockCard1, mockCard2])).toBe(true);
    });

    it('should not allow replacing cards that are not in player hand', () => {
      const player = {
        id: '1',
        name: 'Player 1',
        hand: [mockCard1],
      };

      expect(canReplaceCards(player, [mockCard1, mockCard2])).toBe(false);
    });
  });

  describe('canDrawCard', () => {
    it('should allow drawing when deck has cards', () => {
      const deck = [mockCard1];
      expect(canDrawCard(deck)).toBe(true);
    });

    it('should not allow drawing when deck is empty', () => {
      const deck: Card[] = [];
      expect(canDrawCard(deck)).toBe(false);
    });
  });
});
