import { Game } from '../Game';
import { Player } from '../Player';
import { Card } from '../Card';
import { CardPosition, GameMode } from '../../types';

describe('Game Integration', () => {
  let game: Game;
  let player1: Player;
  let player2: Player;

  beforeEach(() => {
    player1 = new Player('player1', 'Player 1');
    player2 = new Player('player2', 'Player 2');
    game = new Game(GameMode.ADDITION, [player1, player2]);
    game.start(); // Start the game
  });

  it('should simulate a complete game with multiple rounds', () => {
    // Clear existing hands
    player1.clearHand();
    player2.clearHand();

    // Round 1: Player 1's turn
    // Player 1 has cards: 5, 2, 3 (forming 5 = 2 + 3)
    const card1 = new Card(5);
    const card2 = new Card(2);
    const card3 = new Card(3);
    player1.addCard(card1);
    player1.addCard(card2);
    player1.addCard(card3);

    // Player 1 stages and commits cards
    game.stageCard(player1, card1, CardPosition.TOP);
    game.stageCard(player1, card2, CardPosition.BOTTOM_LEFT);
    game.stageCard(player1, card3, CardPosition.BOTTOM_RIGHT);
    game.playCards(player1.getId());

    // Verify Player 1's state
    expect(player1.getHand()).toHaveLength(0);
    expect(player1.getStagedCards().size).toBe(0);
    expect(game.getCurrentPlayer()).toBe(player2);

    // Round 2: Player 2's turn
    // Player 2 has cards: 6, 2, 4 (forming 6 = 2 + 4)
    const card4 = new Card(6);
    const card5 = new Card(2);
    const card6 = new Card(4);
    player2.addCard(card4);
    player2.addCard(card5);
    player2.addCard(card6);

    // Player 2 stages and commits cards
    game.stageCard(player2, card4, CardPosition.TOP);
    game.stageCard(player2, card5, CardPosition.BOTTOM_LEFT);
    game.stageCard(player2, card6, CardPosition.BOTTOM_RIGHT);
    game.playCards(player2.getId());

    // Verify Player 2's state
    expect(player2.getHand()).toHaveLength(0);
    expect(player2.getStagedCards().size).toBe(0);
    expect(game.getCurrentPlayer()).toBe(player1);
  });

  it('should handle scenarios where players cannot form valid equations', () => {
    // Clear existing hands
    player1.clearHand();
    player2.clearHand();

    // Round 1: Player 1's turn
    // Player 1 has cards: 5, 2, 4 (cannot form valid equation)
    const card1 = new Card(5);
    const card2 = new Card(2);
    const card3 = new Card(4);
    player1.addCard(card1);
    player1.addCard(card2);
    player1.addCard(card3);

    // Player 1 tries to stage and commit cards
    game.stageCard(player1, card1, CardPosition.TOP);
    game.stageCard(player1, card2, CardPosition.BOTTOM_LEFT);
    game.stageCard(player1, card3, CardPosition.BOTTOM_RIGHT);

    // Should throw error for invalid equation
    expect(() => game.playCards(player1.getId())).toThrow('Invalid card combination');

    // Verify cards are returned to hand
    expect(player1.getHand()).toHaveLength(3);
    expect(player1.getStagedCards().size).toBe(0);

    // Player 1 draws a new card and tries again with valid equation
    const newCard = new Card(3);
    player1.addCard(newCard);

    // Now Player 1 can form a valid equation: 5 = 2 + 3
    game.stageCard(player1, card1, CardPosition.TOP);
    game.stageCard(player1, card2, CardPosition.BOTTOM_LEFT);
    game.stageCard(player1, newCard, CardPosition.BOTTOM_RIGHT);
    game.playCards(player1.getId());

    // Verify Player 1's state
    expect(player1.getHand()).toHaveLength(1); // Should still have card3
    expect(player1.getStagedCards().size).toBe(0);
    expect(game.getCurrentPlayer()).toBe(player2);
  });

  it('should handle wild card usage', () => {
    // Clear existing hands
    player1.clearHand();
    player2.clearHand();

    // Round 1: Player 1's turn with wild card
    const card1 = new Card(5);
    const card2 = new Card(2);
    const wildCard = new Card(null, true);
    wildCard.setValue(3);
    player1.addCard(card1);
    player1.addCard(card2);
    player1.addCard(wildCard);

    // Player 1 stages cards
    game.stageCard(player1, card1, CardPosition.TOP);
    game.stageCard(player1, card2, CardPosition.BOTTOM_LEFT);
    game.stageCard(player1, wildCard, CardPosition.BOTTOM_RIGHT);

    // Commit cards
    game.playCards(player1.getId());

    // Verify Player 1's state
    expect(player1.getHand()).toHaveLength(0);
    expect(player1.getStagedCards().size).toBe(0);
    expect(game.getCurrentPlayer()).toBe(player2);
  });
});
