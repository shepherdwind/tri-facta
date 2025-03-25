import {
  validateCardPlacement,
  validateCardReplacement,
  checkGameEnd,
  canPlaceCards,
  canReplaceCards,
  canDrawCard,
} from '../gameRules';
import { Card, GameMode } from '../../types/game';

describe('gameRules', () => {
  const mockCard1: Card = {
    id: 'card1',
    type: 'number',
    value: 1,
    isWildcard: false,
  };

  const mockCard2: Card = {
    id: 'card2',
    type: 'number',
    value: 2,
    isWildcard: false,
  };

  const mockCard3: Card = {
    id: 'card3',
    type: 'number',
    value: 3,
    isWildcard: false,
  };

  describe('validateCardPlacement', () => {
    it('should validate addition mode correctly', () => {
      const mode: GameMode = 'addition';

      // Valid: 1 + 2 = 3
      expect(validateCardPlacement([mockCard1, mockCard2, mockCard3], mode)).toBe(true);

      // Invalid: 1 + 2 ≠ 4
      const invalidCard: Card = {
        id: 'card4',
        type: 'number',
        value: 4,
        isWildcard: false,
      };
      expect(validateCardPlacement([mockCard1, mockCard2, invalidCard], mode)).toBe(false);
    });

    it('should validate multiplication mode correctly', () => {
      const mode: GameMode = 'multiplication';

      // Valid: 2 × 3 = 6
      const card6: Card = {
        id: 'card6',
        type: 'number',
        value: 6,
        isWildcard: false,
      };
      expect(validateCardPlacement([mockCard2, mockCard3, card6], mode)).toBe(true);

      // Invalid: 2 × 3 ≠ 7
      const card7: Card = {
        id: 'card7',
        type: 'number',
        value: 7,
        isWildcard: false,
      };
      expect(validateCardPlacement([mockCard2, mockCard3, card7], mode)).toBe(false);
    });

    it('should require exactly 3 cards', () => {
      const mode: GameMode = 'addition';
      expect(validateCardPlacement([mockCard1, mockCard2], mode)).toBe(false);
      expect(validateCardPlacement([mockCard1, mockCard2, mockCard3, mockCard1], mode)).toBe(false);
    });
  });

  describe('validateCardReplacement', () => {
    it('should validate 2-card replacement', () => {
      expect(validateCardReplacement([mockCard1, mockCard2], [mockCard3])).toBe(true);
    });

    it('should validate 3-card replacement', () => {
      expect(validateCardReplacement([mockCard1, mockCard2, mockCard3], [mockCard1])).toBe(true);
    });

    it('should reject invalid card counts', () => {
      expect(validateCardReplacement([mockCard1], [mockCard2])).toBe(false);
      expect(
        validateCardReplacement([mockCard1, mockCard2, mockCard3], [mockCard2, mockCard3])
      ).toBe(false);
      expect(validateCardReplacement([mockCard1, mockCard2], [mockCard2, mockCard3])).toBe(false);
    });
  });

  describe('checkGameEnd', () => {
    it('should detect winner when a player has no cards', () => {
      const players = [
        { id: '1', hand: [] },
        { id: '2', hand: [mockCard1] },
      ];

      expect(checkGameEnd(players)).toBe('1');
    });

    it('should return null when no player has empty hand', () => {
      const players = [
        { id: '1', hand: [mockCard1] },
        { id: '2', hand: [mockCard2] },
      ];

      expect(checkGameEnd(players)).toBeNull();
    });
  });

  describe('canPlaceCards', () => {
    it('should allow placing cards that are in player hand', () => {
      const player = {
        hand: [mockCard1, mockCard2, mockCard3],
      };

      expect(canPlaceCards(player, [mockCard1, mockCard2, mockCard3])).toBe(true);
    });

    it('should not allow placing cards that are not in player hand', () => {
      const player = {
        hand: [mockCard1, mockCard2],
      };

      expect(canPlaceCards(player, [mockCard1, mockCard2, mockCard3])).toBe(false);
    });
  });

  describe('canReplaceCards', () => {
    it('should allow replacing cards that are in player hand', () => {
      const player = {
        hand: [mockCard1, mockCard2],
      };

      expect(canReplaceCards(player, [mockCard1, mockCard2])).toBe(true);
    });

    it('should not allow replacing cards that are not in player hand', () => {
      const player = {
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
