import { Card } from '../types/game';
import { GameMode } from '../constants/gameConstants';
import { CardValidator, GameStateValidator, DeckValidator } from './rules';

// Create singleton instances
const cardValidator = new CardValidator();
const gameStateValidator = new GameStateValidator();
const deckValidator = new DeckValidator();

// Export functions that use the validator instances
export const validateCardPlacement = (cards: Card[], mode: GameMode): boolean => {
  return cardValidator.validateCardPlacement(cards, mode);
};

export const validateCardReplacement = (
  newCard: Card,
  placedCards: Card[],
  gameMode: GameMode
): boolean => {
  return cardValidator.validateCardReplacement(newCard, placedCards, gameMode);
};

export const checkGameEnd = (players: { id: string; hand: Card[] }[]): string | null => {
  return gameStateValidator.checkGameEnd(players);
};

export const canReplaceCards = (player: { hand: Card[] }, oldCards: Card[]): boolean => {
  return gameStateValidator.canReplaceCards(player, oldCards);
};

export const canDrawCard = (deck: Card[]): boolean => {
  return deckValidator.canDrawCard(deck);
};
