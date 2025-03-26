import { Card } from '../types/game';
import { GameMode } from '../constants/gameConstants';

export function validateCardPlacement(cards: Card[], mode: GameMode): boolean {
  if (cards.length !== 3) return false;

  // Check for duplicate values
  const values = cards.map((card) => card.value);
  const uniqueValues = new Set(values);
  if (uniqueValues.size !== values.length) return false;

  if (mode === GameMode.STANDARD) {
    // For standard mode: a + b = c
    // 尝试所有可能的组合
    return (
      values[0] + values[1] === values[2] ||
      values[1] + values[2] === values[0] ||
      values[0] + values[2] === values[1]
    );
  } else {
    // For advanced mode: a × b = c
    // 尝试所有可能的组合
    return (
      values[0] * values[1] === values[2] ||
      values[1] * values[2] === values[0] ||
      values[0] * values[2] === values[1]
    );
  }
}

export const validateCardReplacement = (
  newCard: Card,
  placedCards: Card[],
  gameMode: GameMode
): boolean => {
  // 找到要替换的卡牌在已放置卡牌中的位置
  const cardToReplaceIndex = placedCards.findIndex((card) => card.id === newCard.id);
  if (cardToReplaceIndex === -1) return false;

  // 创建替换后的新卡牌组合
  const newCombination = [...placedCards];
  newCombination[cardToReplaceIndex] = newCard;

  // 验证新的组合是否有效
  return validateCardPlacement(newCombination, gameMode);
};

export function checkGameEnd(players: { id: string; hand: Card[] }[]): string | null {
  // Game ends when a player has no cards left
  const winnerIndex = players.findIndex((player) => player.hand.length === 0);

  if (winnerIndex === -1) return null;

  return players[winnerIndex].id;
}

export function canReplaceCards(player: { hand: Card[] }, oldCards: Card[]): boolean {
  // Check if all old cards are in player's hand
  return oldCards.every((card) => player.hand.some((handCard) => handCard.id === card.id));
}

export function canDrawCard(deck: Card[]): boolean {
  return deck.length > 0;
}
