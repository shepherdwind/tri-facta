import { Game } from '../Game';
import { Player } from '../Player';
import { Card } from '../Card';
import { CardPosition, GameMode } from '../../types';

describe('Game', () => {
  let game: Game;
  let player1: Player;
  let player2: Player;

  beforeEach(() => {
    player1 = new Player('player1', 'Player 1');
    player2 = new Player('player2', 'Player 2');
    game = new Game(GameMode.ADDITION, [player1, player2]);
    game.start(); // Initialize game state
  });

  describe('constructor and initialization', () => {
    it('should initialize with two players', () => {
      expect(game.getPlayers()).toHaveLength(2);
      expect(game.getPlayers()).toContain(player1);
      expect(game.getPlayers()).toContain(player2);
    });

    it('should set first player as current player', () => {
      expect(game.getCurrentPlayer()).toBe(player1);
    });

    it('should initialize with correct game mode', () => {
      expect(game.getGameMode()).toBe(GameMode.ADDITION);
    });
  });

  describe('player turns', () => {
    it('should switch to next player after commit', () => {
      // Stage and commit cards for player1
      const card1 = new Card(5);
      const card2 = new Card(2);
      const card3 = new Card(3);

      // Clear existing hands and add new cards
      player1.clearHand();
      player1.addCard(card1);
      player1.addCard(card2);
      player1.addCard(card3);

      // Verify initial hand size
      expect(player1.getHand()).toHaveLength(3);

      game.stageCard(player1, card1, CardPosition.TOP);
      game.stageCard(player1, card2, CardPosition.BOTTOM_LEFT);
      game.stageCard(player1, card3, CardPosition.BOTTOM_RIGHT);

      // Cards should still be in hand after staging
      expect(player1.getHand()).toHaveLength(3);

      game.commitCards(player1);

      // After commit, cards should be removed from both staging area and hand
      expect(player1.getStagedCards().size).toBe(0);
      expect(player1.getHand()).toHaveLength(0);
      expect(game.getCurrentPlayer()).toBe(player2);
    });

    it('should switch back to first player after last player', () => {
      // Stage and commit cards for both players
      const card1 = new Card(5);
      const card2 = new Card(2);
      const card3 = new Card(3);

      // Player 1's turn
      player1.clearHand();
      player1.addCard(card1);
      player1.addCard(card2);
      player1.addCard(card3);
      expect(player1.getHand()).toHaveLength(3);

      game.stageCard(player1, card1, CardPosition.TOP);
      game.stageCard(player1, card2, CardPosition.BOTTOM_LEFT);
      game.stageCard(player1, card3, CardPosition.BOTTOM_RIGHT);
      expect(player1.getHand()).toHaveLength(3);

      game.commitCards(player1);
      expect(player1.getStagedCards().size).toBe(0);
      expect(player1.getHand()).toHaveLength(0);

      // Player 2's turn
      const card4 = new Card(6);
      const card5 = new Card(2);
      const card6 = new Card(4);
      player2.clearHand();
      player2.addCard(card4);
      player2.addCard(card5);
      player2.addCard(card6);
      expect(player2.getHand()).toHaveLength(3);

      game.stageCard(player2, card4, CardPosition.TOP);
      game.stageCard(player2, card5, CardPosition.BOTTOM_LEFT);
      game.stageCard(player2, card6, CardPosition.BOTTOM_RIGHT);
      expect(player2.getHand()).toHaveLength(3);

      game.commitCards(player2);
      expect(player2.getStagedCards().size).toBe(0);
      expect(player2.getHand()).toHaveLength(0);

      expect(game.getCurrentPlayer()).toBe(player1);
    });
  });

  describe('card operations', () => {
    it('should allow staging cards', () => {
      const card = new Card(5);
      player1.clearHand();
      player1.addCard(card);
      game.stageCard(player1, card, CardPosition.TOP);

      expect(player1.getStagedCards().get(CardPosition.TOP)).toBe(card);
      expect(player1.getHand()).toContain(card);
    });

    it('should allow unstaging cards', () => {
      const card = new Card(5);
      player1.clearHand();
      player1.addCard(card);
      game.stageCard(player1, card, CardPosition.TOP);
      game.unstageCard(player1, CardPosition.TOP);

      expect(player1.getStagedCards().has(CardPosition.TOP)).toBe(false);
      expect(player1.getHand()).toContain(card);
    });

    it('should allow committing cards', () => {
      const card1 = new Card(5);
      const card2 = new Card(2);
      const card3 = new Card(3);

      player1.clearHand();
      player1.addCard(card1);
      player1.addCard(card2);
      player1.addCard(card3);

      // Verify initial hand size
      expect(player1.getHand()).toHaveLength(3);

      game.stageCard(player1, card1, CardPosition.TOP);
      game.stageCard(player1, card2, CardPosition.BOTTOM_LEFT);
      game.stageCard(player1, card3, CardPosition.BOTTOM_RIGHT);

      // Cards should still be in hand after staging
      expect(player1.getHand()).toHaveLength(3);

      game.commitCards(player1);

      // After commit, cards should be removed from both staging area and hand
      expect(player1.getStagedCards().size).toBe(0);
      expect(player1.getHand()).toHaveLength(0);
      expect(game.getCurrentPlayer()).toBe(player2);
    });
  });

  describe('game state', () => {
    it('should detect when a player has won', () => {
      // Make player1's hand and staging area empty
      const card1 = new Card(5);
      const card2 = new Card(2);
      const card3 = new Card(3);

      player1.clearHand();
      player1.addCard(card1);
      player1.addCard(card2);
      player1.addCard(card3);

      game.stageCard(player1, card1, CardPosition.TOP);
      game.stageCard(player1, card2, CardPosition.BOTTOM_LEFT);
      game.stageCard(player1, card3, CardPosition.BOTTOM_RIGHT);

      game.commitCards(player1);

      expect(game.hasPlayerWon(player1)).toBe(true);
    });

    it('should return false when player has not won', () => {
      // Add a card to player1's hand
      const card = new Card(5);
      player1.clearHand();
      player1.addCard(card);
      expect(game.hasPlayerWon(player1)).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should throw error when staging card not in player hand', () => {
      const card = new Card(5);
      player1.clearHand();
      expect(() => game.stageCard(player1, card, CardPosition.TOP)).toThrow(
        'Player does not have this card'
      );
    });

    it('should throw error when committing cards for non-current player', () => {
      expect(() => game.commitCards(player2)).toThrow("Not current player's turn");
    });

    it('should throw error when committing invalid equation', () => {
      const card1 = new Card(5);
      const card2 = new Card(2);
      const card3 = new Card(4); // Invalid equation: 5 != 2 + 4

      player1.clearHand();
      player1.addCard(card1);
      player1.addCard(card2);
      player1.addCard(card3);

      game.stageCard(player1, card1, CardPosition.TOP);
      game.stageCard(player1, card2, CardPosition.BOTTOM_LEFT);
      game.stageCard(player1, card3, CardPosition.BOTTOM_RIGHT);

      expect(() => game.commitCards(player1)).toThrow('Invalid equation');
    });
  });
});
