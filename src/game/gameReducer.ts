import { GameState, GameAction, Card, Player } from '../types/game';
import { v4 as uuidv4 } from 'uuid';
import {
  validateCardPlacement,
  validateCardReplacement,
  canPlaceCards,
  canReplaceCards,
  canDrawCard,
} from './gameRules';

const INITIAL_HAND_SIZE = 6;
const MAX_CARDS = 42; // 20 numbers × 2 + 2 wildcards

function createDeck(): Card[] {
  const deck: Card[] = [];

  // Add number cards (1-20, each twice)
  for (let i = 1; i <= 20; i++) {
    for (let j = 0; j < 2; j++) {
      deck.push({
        id: uuidv4(),
        type: 'number',
        value: i,
        isWildcard: false,
      });
    }
  }

  // Add wildcards
  for (let i = 0; i < 2; i++) {
    deck.push({
      id: uuidv4(),
      type: 'wildcard',
      value: 0,
      isWildcard: true,
    });
  }

  // Verify deck size
  if (deck.length !== MAX_CARDS) {
    throw new Error(`Invalid deck size: ${deck.length}. Expected: ${MAX_CARDS}`);
  }

  return shuffleDeck(deck);
}

function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function dealInitialHands(deck: Card[], players: Player[]): [Card[], Player[]] {
  let remainingDeck = [...deck];
  const updatedPlayers = players.map((player) => {
    // If player already has cards, keep them
    if (player.hand.length > 0) {
      return player;
    }
    // Otherwise, deal new cards
    const hand = remainingDeck.slice(0, INITIAL_HAND_SIZE);
    remainingDeck = remainingDeck.slice(INITIAL_HAND_SIZE);
    return {
      ...player,
      hand,
    };
  });

  // Verify remaining deck size
  const expectedRemainingSize = MAX_CARDS - players.length * INITIAL_HAND_SIZE;
  if (remainingDeck.length !== expectedRemainingSize) {
    throw new Error(
      `Invalid remaining deck size: ${remainingDeck.length}. Expected: ${expectedRemainingSize}`
    );
  }

  return [remainingDeck, updatedPlayers];
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const { mode, players } = action.payload;
      const deck = createDeck();
      const [remainingDeck, updatedPlayers] = dealInitialHands(deck, players);

      return {
        id: uuidv4(),
        mode,
        players: updatedPlayers,
        currentPlayerIndex: 0,
        deck: remainingDeck,
        placedCards: [],
        isGameStarted: true,
        isGameEnded: false,
        winner: null,
        lastAction: action,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    case 'PLACE_CARDS': {
      const { playerId, cards } = action.payload;
      const playerIndex = state.players.findIndex((p) => p.id === playerId);

      if (playerIndex === -1) return state;

      const player = state.players[playerIndex];

      // Validate card placement
      if (!validateCardPlacement(cards, state.mode) || !canPlaceCards(player, cards)) {
        return state;
      }

      // Create a new hand without the placed cards
      const newHand = player.hand.filter(
        (card) => !cards.some((placedCard) => placedCard.id === card.id)
      );

      const updatedPlayers = [...state.players];
      updatedPlayers[playerIndex] = {
        ...player,
        hand: newHand,
      };

      return {
        ...state,
        players: updatedPlayers,
        placedCards: [...state.placedCards, ...cards],
        lastAction: action,
        updatedAt: new Date(),
      };
    }

    case 'REPLACE_CARDS': {
      const { playerId, oldCards, newCards } = action.payload;
      const playerIndex = state.players.findIndex((p) => p.id === playerId);

      if (playerIndex === -1) return state;

      const player = state.players[playerIndex];

      // Validate card replacement
      if (!validateCardReplacement(oldCards, newCards) || !canReplaceCards(player, oldCards)) {
        return state;
      }

      // Remove old cards from hand
      const newHand = player.hand.filter(
        (card) => !oldCards.some((oldCard) => oldCard.id === card.id)
      );

      // Add new cards
      newHand.push(...newCards);

      // Verify hand size
      const expectedHandSize = player.hand.length - oldCards.length + newCards.length;
      if (newHand.length !== expectedHandSize) {
        return state;
      }

      const updatedPlayers = [...state.players];
      updatedPlayers[playerIndex] = {
        ...player,
        hand: newHand,
      };

      // Remove new cards from deck
      const updatedDeck = state.deck.filter(
        (card) => !newCards.some((newCard) => newCard.id === card.id)
      );

      return {
        ...state,
        players: updatedPlayers,
        deck: updatedDeck,
        lastAction: action,
        updatedAt: new Date(),
      };
    }

    case 'DRAW_CARD': {
      const { playerId, card } = action.payload;
      const playerIndex = state.players.findIndex((p) => p.id === playerId);

      if (playerIndex === -1) return state;

      // Validate card drawing
      if (!canDrawCard(state.deck)) {
        return state;
      }

      const updatedPlayers = [...state.players];
      updatedPlayers[playerIndex] = {
        ...state.players[playerIndex],
        hand: [...state.players[playerIndex].hand, card],
      };

      return {
        ...state,
        players: updatedPlayers,
        deck: state.deck.filter((c) => c.id !== card.id),
        lastAction: action,
        updatedAt: new Date(),
      };
    }

    case 'END_TURN': {
      const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;

      return {
        ...state,
        currentPlayerIndex: nextPlayerIndex,
        lastAction: action,
        updatedAt: new Date(),
      };
    }

    case 'END_GAME': {
      const { winnerId } = action.payload;

      return {
        ...state,
        isGameEnded: true,
        winner: winnerId,
        lastAction: action,
        updatedAt: new Date(),
      };
    }

    default:
      return state;
  }
}
