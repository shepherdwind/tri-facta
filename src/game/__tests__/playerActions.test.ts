import { gameReducer } from '../gameReducer';
import { GameState, Card, GameAction } from '../../types/game';
import { GameMode, CardType, ActionType } from '../../constants/gameConstants';
import { validateCardPlacement, validateCardReplacement, canReplaceCards } from '../gameRules';

describe('Player Actions', () => {
  const mockCard1: Card = {
    id: 'card1',
    type: CardType.NUMBER,
    value: 1,
    isWildcard: false,
  };

  const mockCard2: Card = {
    id: 'card2',
    type: CardType.NUMBER,
    value: 2,
    isWildcard: false,
  };

  const mockCard3: Card = {
    id: 'card3',
    type: CardType.NUMBER,
    value: 3,
    isWildcard: false,
  };

  const mockCard4: Card = {
    id: 'card4',
    type: CardType.NUMBER,
    value: 5,
    isWildcard: false,
  };

  const mockPlayer = {
    id: 'player1',
    name: 'Player 1',
    hand: [mockCard1, mockCard2, mockCard3],
  };

  const createInitialState = (): GameState => ({
    id: 'game1',
    mode: GameMode.STANDARD,
    players: [mockPlayer],
    currentPlayerIndex: 0,
    deck: [],
    placedCards: [],
    stagingArea: [],
    isGameStarted: true,
    isGameEnded: false,
    winner: null,
    lastAction: {
      type: ActionType.START_GAME,
      payload: {
        mode: GameMode.STANDARD,
        players: [{ ...mockPlayer, hand: [] }],
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  describe('Invalid Actions', () => {
    it('should handle invalid card placement', () => {
      const player = {
        id: 'player1',
        name: 'Player 1',
        hand: [mockCard1, mockCard2, mockCard3],
      };

      const state: GameState = {
        id: 'game1',
        mode: GameMode.STANDARD,
        players: [player],
        currentPlayerIndex: 0,
        deck: [],
        placedCards: [],
        stagingArea: [],
        isGameStarted: true,
        isGameEnded: false,
        winner: null,
        lastAction: {
          type: ActionType.START_GAME,
          payload: {
            mode: GameMode.STANDARD,
            players: [player],
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const invalidCards = [mockCard1, mockCard2, mockCard4];

      // Validate invalid placement
      expect(validateCardPlacement(invalidCards, state.mode)).toBe(false);

      // Try to place invalid cards
      const placeAction: GameAction = {
        type: ActionType.PLACE_CARD,
        payload: {
          playerId: player.id,
          card: invalidCards[0],
        },
      };
      const newState = gameReducer(state, placeAction);

      // Verify state remains unchanged
      expect(newState.placedCards).toHaveLength(0);
    });

    it('should handle invalid card replacement', () => {
      const state = createInitialState();
      const player = state.players[0];
      const invalidReplacement = {
        oldCards: [mockCard1],
        newCards: [mockCard2, mockCard3],
      };

      // Validate invalid replacement
      expect(validateCardReplacement(mockCard4, invalidReplacement.oldCards, state.mode)).toBe(
        false
      );
      expect(canReplaceCards(player, invalidReplacement.oldCards)).toBe(true);

      // Try to replace cards
      const replaceAction: GameAction = {
        type: ActionType.REPLACE_CARDS,
        payload: {
          playerId: player.id,
          cardId: mockCard4.id,
          targetCardId: mockCard4.id,
        },
      };
      const newState = gameReducer(state, replaceAction);

      // Verify state remains unchanged
      expect(newState).toEqual(state);
    });
  });

  describe('Player Hand Management', () => {
    it('should end game when a player has no cards left', () => {
      const player1 = {
        id: 'player1',
        name: 'Player 1',
        hand: [mockCard1], // Only one card left
      };

      const player2 = {
        id: 'player2',
        name: 'Player 2',
        hand: [mockCard2, mockCard3],
      };

      let state: GameState = {
        id: 'game1',
        mode: GameMode.STANDARD,
        players: [player1, player2],
        currentPlayerIndex: 0,
        deck: [],
        placedCards: [],
        stagingArea: [],
        isGameStarted: true,
        isGameEnded: false,
        winner: null,
        lastAction: {
          type: ActionType.START_GAME,
          payload: {
            mode: GameMode.STANDARD,
            players: [player1, player2],
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Player 1 places their last card
      const placeAction: GameAction = {
        type: ActionType.PLACE_CARD,
        payload: {
          playerId: 'player1',
          card: mockCard1,
        },
      };
      state = gameReducer(state, placeAction);

      // Commit the card
      const commitAction: GameAction = {
        type: ActionType.COMMIT_CARDS,
        payload: {
          playerId: 'player1',
        },
      };
      state = gameReducer(state, commitAction);

      // Verify game has ended
      expect(state.isGameEnded).toBe(true);
      expect(state.winner).toBe('player1');
    });

    it('should not allow actions after game has ended', () => {
      const player1 = {
        id: 'player1',
        name: 'Player 1',
        hand: [],
      };

      const player2 = {
        id: 'player2',
        name: 'Player 2',
        hand: [mockCard1],
      };

      let state: GameState = {
        id: 'game1',
        mode: GameMode.STANDARD,
        players: [player1, player2],
        currentPlayerIndex: 0,
        deck: [],
        placedCards: [],
        stagingArea: [],
        isGameStarted: true,
        isGameEnded: true,
        winner: 'player1',
        lastAction: {
          type: ActionType.END_GAME,
          payload: {
            winnerId: 'player1',
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Try to place a card
      const placeAction: GameAction = {
        type: ActionType.PLACE_CARD,
        payload: {
          playerId: 'player2',
          card: mockCard1,
        },
      };
      state = gameReducer(state, placeAction);

      // Verify state remains unchanged
      expect(state.stagingArea).toHaveLength(0);
      expect(state.placedCards).toHaveLength(0);
      expect(state.players[1].hand).toHaveLength(1);
    });
  });

  describe('Turn End and Card Drawing', () => {
    it('should handle drawing cards at turn end', () => {
      const player1 = {
        id: 'player1',
        name: 'Player 1',
        hand: [mockCard1],
      };

      const player2 = {
        id: 'player2',
        name: 'Player 2',
        hand: [mockCard2],
      };

      let state: GameState = {
        id: 'game1',
        mode: GameMode.STANDARD,
        players: [player1, player2],
        currentPlayerIndex: 0,
        deck: [mockCard3], // One card in deck
        placedCards: [],
        stagingArea: [],
        isGameStarted: true,
        isGameEnded: false,
        winner: null,
        lastAction: {
          type: ActionType.START_GAME,
          payload: {
            mode: GameMode.STANDARD,
            players: [player1, player2],
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // End turn
      const endTurnAction: GameAction = {
        type: ActionType.END_TURN,
        payload: {},
      };
      state = gameReducer(state, endTurnAction);

      // Verify turn has changed
      expect(state.currentPlayerIndex).toBe(1);

      // Player 2 draws a card
      const drawAction: GameAction = {
        type: ActionType.DRAW_CARD,
        payload: {
          playerId: 'player2',
          card: mockCard3,
        },
      };
      state = gameReducer(state, drawAction);

      // Verify card was drawn
      expect(state.players[1].hand).toContain(mockCard3);
      expect(state.deck).toHaveLength(0);
    });

    it('should handle empty deck at turn end', () => {
      const player1 = {
        id: 'player1',
        name: 'Player 1',
        hand: [mockCard1],
      };

      const player2 = {
        id: 'player2',
        name: 'Player 2',
        hand: [mockCard2],
      };

      let state: GameState = {
        id: 'game1',
        mode: GameMode.STANDARD,
        players: [player1, player2],
        currentPlayerIndex: 0,
        deck: [], // Empty deck
        placedCards: [],
        stagingArea: [],
        isGameStarted: true,
        isGameEnded: false,
        winner: null,
        lastAction: {
          type: ActionType.START_GAME,
          payload: {
            mode: GameMode.STANDARD,
            players: [player1, player2],
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // End turn
      const endTurnAction: GameAction = {
        type: ActionType.END_TURN,
        payload: {},
      };
      state = gameReducer(state, endTurnAction);

      // Verify turn has changed but no cards were drawn
      expect(state.currentPlayerIndex).toBe(1);
      expect(state.players[1].hand).toHaveLength(1);
      expect(state.deck).toHaveLength(0);
    });
  });
});
