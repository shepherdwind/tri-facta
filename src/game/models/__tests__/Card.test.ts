import { Card } from '../Card';

describe('Card', () => {
  describe('constructor', () => {
    it('should create a regular card with the given value', () => {
      const card = new Card(5);
      expect(card.getValue()).toBe(5);
      expect(card.isWildCard()).toBe(false);
    });

    it('should create a wild card when isWild is true', () => {
      const card = new Card(5, true);
      expect(card.getValue()).toBe(5);
      expect(card.isWildCard()).toBe(true);
    });
  });

  describe('setWildValue', () => {
    it('should set wild value for a wild card', () => {
      const card = new Card(5, true);
      const newCard = card.setWildValue(10);
      expect(newCard.getValue()).toBe(10);
      expect(newCard.isWildCard()).toBe(true);
    });

    it('should throw error when setting wild value for non-wild card', () => {
      const card = new Card(5);
      expect(() => card.setWildValue(10)).toThrow('Cannot set wild value for non-wild card');
    });
  });

  describe('getValue', () => {
    it('should return original value for regular card', () => {
      const card = new Card(5);
      expect(card.getValue()).toBe(5);
    });

    it('should return original value for wild card without wild value set', () => {
      const card = new Card(5, true);
      expect(card.getValue()).toBe(5);
    });

    it('should return wild value for wild card with wild value set', () => {
      const card = new Card(5, true);
      const newCard = card.setWildValue(10);
      expect(newCard.getValue()).toBe(10);
    });
  });

  describe('isWildCard', () => {
    it('should return true for wild card', () => {
      const card = new Card(5, true);
      expect(card.isWildCard()).toBe(true);
    });

    it('should return false for regular card', () => {
      const card = new Card(5);
      expect(card.isWildCard()).toBe(false);
    });
  });
});
