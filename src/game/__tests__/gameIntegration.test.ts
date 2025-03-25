import { gameReducer } from '../gameReducer';
import { GameState, GameAction, GameMode, Card, Player } from '../../types/game';
import {
  validateCardPlacement,
  validateCardReplacement,
  checkGameEnd,
  canPlaceCards,
  canReplaceCards,
  canDrawCard,
} from '../gameRules';

describe('Game Integration', () => {
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

  const mockPlayers: Player[] = [
    { id: '1', name: 'Player 1', hand: [], score: 0 },
    { id: '2', name: 'Player 2', hand: [], score: 0 },
  ];

  let state: GameState;

  beforeEach(() => {
    state = {
      id: 'game1',
      mode: 'addition',
      players: mockPlayers,
      currentPlayerIndex: 0,
      deck: [],
      placedCards: [],
      isGameStarted: false,
      isGameEnded: false,
      winner: null,
      lastAction: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  describe('Complete Game Flow', () => {
    it('should handle a complete valid game flow', () => {
      // Player 1's turn
      const player1 = state.players[0];
      const cardsToPlace = [mockCard1, mockCard2, mockCard3];

      // Add cards to player's hand
      state.players[0].hand = [...cardsToPlace];

      // Validate card placement
      expect(validateCardPlacement(cardsToPlace, state.mode)).toBe(true);
      expect(canPlaceCards(player1, cardsToPlace)).toBe(true);

      // Place cards
      const placeAction: GameAction = {
        type: 'PLACE_CARDS',
        payload: {
          playerId: '1',
          cards: cardsToPlace,
        },
      };
      state = gameReducer(state, placeAction);

      // End turn
      const endTurnAction: GameAction = {
        type: 'END_TURN',
        payload: {
          playerId: '1',
        },
      };
      state = gameReducer(state, endTurnAction);

      // Player 2's turn
      const player2 = state.players[1];
      const cardsToReplace = [mockCard1, mockCard2];
      const newCards = [mockCard3];

      // Add cards to player's hand
      state.players[1].hand = [...cardsToReplace];

      // Validate card replacement
      expect(validateCardReplacement(cardsToReplace, newCards)).toBe(true);
      expect(canReplaceCards(player2, cardsToReplace)).toBe(true);

      // Replace cards
      const replaceAction: GameAction = {
        type: 'REPLACE_CARDS',
        payload: {
          playerId: '2',
          oldCards: cardsToReplace,
          newCards: newCards,
        },
      };
      state = gameReducer(state, replaceAction);

      // End turn
      state = gameReducer(state, endTurnAction);

      // Check game end
      const winner = checkGameEnd(state.players);
      if (winner) {
        const endGameAction: GameAction = {
          type: 'END_GAME',
          payload: {
            winnerId: winner,
          },
        };
        state = gameReducer(state, endGameAction);
      }

      // Verify final state
      expect(state.isGameEnded).toBe(true);
      expect(state.winner).toBeDefined();
    });
  });

  describe('Invalid Actions', () => {
    it('should handle invalid card placement', () => {
      const player = state.players[0];
      const invalidCards = [mockCard1, mockCard2];

      // Add cards to player's hand
      state.players[0].hand = [...invalidCards];

      // Validate invalid placement
      expect(validateCardPlacement(invalidCards, state.mode)).toBe(false);
      expect(canPlaceCards(player, invalidCards)).toBe(true);

      // Attempt invalid placement
      const placeAction: GameAction = {
        type: 'PLACE_CARDS',
        payload: {
          playerId: '1',
          cards: invalidCards,
        },
      };
      const newState = gameReducer(state, placeAction);

      // Verify state remains unchanged
      expect(newState).toEqual(state);
    });

    it('should handle invalid card replacement', () => {
      const player = state.players[0];
      const invalidReplacement = {
        oldCards: [mockCard1],
        newCards: [mockCard2, mockCard3],
      };

      // Add cards to player's hand
      state.players[0].hand = [...invalidReplacement.oldCards];

      // Validate invalid replacement
      expect(
        validateCardReplacement(invalidReplacement.oldCards, invalidReplacement.newCards)
      ).toBe(false);
      expect(canReplaceCards(player, invalidReplacement.oldCards)).toBe(true);

      // Attempt invalid replacement
      const replaceAction: GameAction = {
        type: 'REPLACE_CARDS',
        payload: {
          playerId: '1',
          oldCards: invalidReplacement.oldCards,
          newCards: invalidReplacement.newCards,
        },
      };
      const newState = gameReducer(state, replaceAction);

      // Verify state remains unchanged
      expect(newState).toEqual(state);
    });
  });

  describe('Deck Management', () => {
    it('should handle drawing cards correctly', () => {
      const player = state.players[0];
      const cardToDraw = mockCard1;

      // Add card to deck
      state.deck = [cardToDraw];

      // Validate card drawing
      expect(canDrawCard([cardToDraw])).toBe(true);

      // Draw card
      const drawAction: GameAction = {
        type: 'DRAW_CARD',
        payload: {
          playerId: '1',
          card: cardToDraw,
        },
      };
      state = gameReducer(state, drawAction);

      // Verify card was drawn
      expect(state.players[0].hand).toContain(cardToDraw);
      expect(state.deck).not.toContain(cardToDraw);
    });

    it('should handle empty deck', () => {
      const player = state.players[0];

      // Validate empty deck
      expect(canDrawCard([])).toBe(false);

      // Save the current state
      const initialState = {
        ...state,
        createdAt: state.createdAt.toISOString(),
        updatedAt: state.updatedAt.toISOString(),
      };

      // Attempt to draw from empty deck
      const drawAction: GameAction = {
        type: 'DRAW_CARD',
        payload: {
          playerId: '1',
          card: mockCard1,
        },
      };
      const newState = {
        ...gameReducer(state, drawAction),
        createdAt: state.createdAt.toISOString(),
        updatedAt: state.updatedAt.toISOString(),
      };

      // Verify state remains unchanged
      expect(newState).toEqual(initialState);
    });
  });
});
