import { Player } from '../Player';
import { Card } from '../Card';
import { CardPosition } from '../../types';
import { CardGroup } from '../CardGroup';
import { GameMode } from '../../types';

describe('Player', () => {
  let player: Player;
  const playerId = 'player1';
  const playerName = 'Test Player';
  const INITIAL_HAND_SIZE = 6;

  beforeEach(() => {
    player = new Player(playerId, playerName);
    // Initialize player with 6 cards
    for (let i = 0; i < INITIAL_HAND_SIZE; i++) {
      player.addCard(new Card(i + 1));
    }
  });

  describe('constructor and initialization', () => {
    it('should start with 6 cards in hand', () => {
      expect(player.getHand()).toHaveLength(INITIAL_HAND_SIZE);
    });
  });

  describe('stageCard', () => {
    it('should remove card from hand when staging', () => {
      const card = player.getHand()[0];
      player.stageCard(card, CardPosition.TOP);

      expect(player.getHand()).not.toContain(card);
      expect(player.getStagedCards().get(CardPosition.TOP)).toBe(card);
      expect(player.getHand()).toHaveLength(INITIAL_HAND_SIZE - 1);
    });

    it('should throw error when staging a card not in hand', () => {
      const card = new Card(7);
      expect(() => player.stageCard(card, CardPosition.TOP)).toThrow(
        'Player does not have this card'
      );
    });
  });

  describe('unstageCard', () => {
    it('should move card back to hand when unstaging', () => {
      const card = player.getHand()[0];
      player.stageCard(card, CardPosition.TOP);
      expect(player.getHand()).toHaveLength(INITIAL_HAND_SIZE - 1);

      player.unstageCard(CardPosition.TOP);

      expect(player.getHand()).toContain(card);
      expect(player.getHand()).toHaveLength(INITIAL_HAND_SIZE);
      expect(player.getStagedCards().has(CardPosition.TOP)).toBe(false);
    });
  });

  describe('clearStagingArea', () => {
    it('should move all cards back to hand', () => {
      // Stage three cards
      const card1 = player.getHand()[0];
      const card2 = player.getHand()[1];
      const card3 = player.getHand()[2];

      player.stageCard(card1, CardPosition.TOP);
      player.stageCard(card2, CardPosition.BOTTOM_LEFT);
      player.stageCard(card3, CardPosition.BOTTOM_RIGHT);

      expect(player.getHand()).toHaveLength(INITIAL_HAND_SIZE - 3);
      expect(player.getStagedCards().size).toBe(3);

      player.clearStagingArea();

      expect(player.getHand()).toHaveLength(INITIAL_HAND_SIZE);
      expect(player.getStagedCards().size).toBe(0);
      expect(player.getHand()).toContain(card1);
      expect(player.getHand()).toContain(card2);
      expect(player.getHand()).toContain(card3);
    });
  });

  describe('commit to CardGroup', () => {
    it('should clear staging area after commit', () => {
      const cardGroup = new CardGroup(GameMode.ADDITION);

      // Stage three cards that form a valid equation (e.g., 5 = 2 + 3)
      const topCard = new Card(5);
      const bottomLeftCard = new Card(2);
      const bottomRightCard = new Card(3);

      // Add cards to player's hand
      player.addCard(topCard);
      player.addCard(bottomLeftCard);
      player.addCard(bottomRightCard);

      // Stage the cards
      player.stageCard(topCard, CardPosition.TOP);
      player.stageCard(bottomLeftCard, CardPosition.BOTTOM_LEFT);
      player.stageCard(bottomRightCard, CardPosition.BOTTOM_RIGHT);

      // Commit to card group
      player.commitToCardGroup(cardGroup);

      // Verify staging area is cleared
      expect(player.getStagedCards().size).toBe(0);
      expect(player.getHand()).toHaveLength(INITIAL_HAND_SIZE);
    });
  });

  describe('addCard', () => {
    it('should add a card to player hand', () => {
      const card = new Card(5);
      player.addCard(card);
      expect(player.getHand()).toContain(card);
      expect(player.hasCard(card)).toBe(true);
    });
  });

  describe('getStagedCards', () => {
    it('should return a copy of staged cards', () => {
      const card = new Card(5);
      player.addCard(card);
      player.stageCard(card, CardPosition.TOP);

      const stagedCards = player.getStagedCards();
      stagedCards.delete(CardPosition.TOP);

      expect(player.getStagedCards().has(CardPosition.TOP)).toBe(true);
    });
  });

  describe('hasCard', () => {
    it('should return true for card in hand', () => {
      const card = new Card(5);
      player.addCard(card);
      expect(player.hasCard(card)).toBe(true);
    });

    it('should return true for card in staging area', () => {
      const card = new Card(5);
      player.addCard(card);
      player.stageCard(card, CardPosition.TOP);
      expect(player.hasCard(card)).toBe(true);
    });

    it('should return false for card not in hand or staging area', () => {
      const card = new Card(5);
      expect(player.hasCard(card)).toBe(false);
    });
  });

  describe('getHand', () => {
    it('should return a copy of hand', () => {
      const card = new Card(5);
      player.addCard(card);

      const hand = player.getHand();
      hand.pop();

      expect(player.getHand()).toContain(card);
    });
  });

  describe('setCurrentTurn', () => {
    it('should update current turn status', () => {
      player.setCurrentTurn(true);
      expect(player.isCurrentPlayer()).toBe(true);

      player.setCurrentTurn(false);
      expect(player.isCurrentPlayer()).toBe(false);
    });
  });

  describe('hasWon', () => {
    it('should return true when hand and staging area are empty', () => {
      const emptyPlayer = new Player(playerId, playerName);
      expect(emptyPlayer.hasWon()).toBe(true);
    });

    it('should return false when hand has cards', () => {
      expect(player.hasWon()).toBe(false);
    });

    it('should return false when staging area has cards', () => {
      const card = player.getHand()[0];
      player.stageCard(card, CardPosition.TOP);
      expect(player.hasWon()).toBe(false);
    });
  });
});
