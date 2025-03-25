import { GameMode, Card } from '../types/game';

export function validateCardPlacement(cards: Card[], mode: GameMode): boolean {
  if (cards.length !== 3) return false;

  const values = cards.map((card) => card.value);

  if (mode === 'addition') {
    // For addition mode: a + b = c
    return (
      values[0] + values[1] === values[2] ||
      values[1] + values[2] === values[0] ||
      values[0] + values[2] === values[1]
    );
  } else {
    // For multiplication mode: a × b = c
    return (
      values[0] * values[1] === values[2] ||
      values[1] * values[2] === values[0] ||
      values[0] * values[2] === values[1]
    );
  }
}

export function validateCardReplacement(oldCards: Card[], newCards: Card[]): boolean {
  // Must replace 2 or 3 cards with 1 card
  if (oldCards.length < 2 || oldCards.length > 3) return false;
  if (newCards.length !== 1) return false;

  return true;
}

export function checkGameEnd(players: { id: string; hand: Card[] }[]): string | null {
  // Game ends when a player has no cards left
  const winnerIndex = players.findIndex((player) => player.hand.length === 0);

  if (winnerIndex === -1) return null;

  return players[winnerIndex].id;
}

export function canPlaceCards(player: { hand: Card[] }, cards: Card[]): boolean {
  // Check if all cards are in player's hand
  return cards.every((card) => player.hand.some((handCard) => handCard.id === card.id));
}

export function canReplaceCards(player: { hand: Card[] }, oldCards: Card[]): boolean {
  // Check if all old cards are in player's hand
  return oldCards.every((card) => player.hand.some((handCard) => handCard.id === card.id));
}

export function canDrawCard(deck: Card[]): boolean {
  return deck.length > 0;
}
