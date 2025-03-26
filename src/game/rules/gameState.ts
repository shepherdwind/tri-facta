import { Card } from '../../types/game';

export class GameStateValidator {
  checkGameEnd(players: { id: string; hand: Card[] }[]): string | null {
    // Game ends when a player has no cards left
    const winnerIndex = players.findIndex((player) => player.hand.length === 0);

    if (winnerIndex === -1) return null;

    return players[winnerIndex].id;
  }

  canReplaceCards(player: { hand: Card[] }, oldCards: Card[]): boolean {
    // Check if all old cards are in player's hand
    return oldCards.every((card) => player.hand.some((handCard) => handCard.id === card.id));
  }
}
