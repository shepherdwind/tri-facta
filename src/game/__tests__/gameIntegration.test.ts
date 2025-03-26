import { gameReducer } from '../gameReducer';
import { GameState, Card, GameAction } from '../../types/game';
import { GameMode, CardType, ActionType } from '../../constants/gameConstants';
import {
  validateCardPlacement,
  validateCardReplacement,
  canReplaceCards,
  canDrawCard,
} from '../gameRules';

describe('Game Integration', () => {
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

  describe('Complete Game Flow', () => {
    it('should handle a complete valid game flow', () => {
      let state = createInitialState();

      // Place first card
      const placeAction1: GameAction = {
        type: ActionType.PLACE_CARD,
        payload: {
          playerId: 'player1',
          card: mockCard1,
        },
      };
      state = gameReducer(state, placeAction1);

      expect(state.stagingArea).toHaveLength(1);
      expect(state.stagingArea).toContainEqual(mockCard1);

      // Place second card
      const placeAction2: GameAction = {
        type: ActionType.PLACE_CARD,
        payload: {
          playerId: 'player1',
          card: mockCard2,
        },
      };
      state = gameReducer(state, placeAction2);

      expect(state.stagingArea).toHaveLength(2);
      expect(state.stagingArea).toContainEqual(mockCard2);

      // Place third card
      const placeAction3: GameAction = {
        type: ActionType.PLACE_CARD,
        payload: {
          playerId: 'player1',
          card: mockCard3,
        },
      };
      state = gameReducer(state, placeAction3);

      expect(state.stagingArea).toHaveLength(3);
      expect(state.stagingArea).toContainEqual(mockCard3);

      // Validate card placement
      expect(validateCardPlacement(state.stagingArea, state.mode)).toBe(true);

      // Commit cards
      const commitAction: GameAction = {
        type: ActionType.COMMIT_CARDS,
        payload: {
          playerId: 'player1',
        },
      };
      state = gameReducer(state, commitAction);

      expect(state.stagingArea).toHaveLength(0);
      expect(state.placedCards).toHaveLength(3);
      expect(state.placedCards).toContainEqual(mockCard1);
      expect(state.placedCards).toContainEqual(mockCard2);
      expect(state.placedCards).toContainEqual(mockCard3);

      // End turn
      const endTurnAction: GameAction = {
        type: ActionType.END_TURN,
        payload: {},
      };
      state = gameReducer(state, endTurnAction);

      expect(state.currentPlayerIndex).toBe(0); // Only one player, so it wraps back to 0
    });

    it('should handle invalid actions', () => {
      let state = createInitialState();

      // Try to place a card that's not in hand
      const invalidCard: Card = {
        id: 'invalid',
        type: CardType.NUMBER,
        value: 10,
        isWildcard: false,
      };

      const invalidPlaceAction: GameAction = {
        type: ActionType.PLACE_CARD,
        payload: {
          playerId: 'player1',
          card: invalidCard,
        },
      };
      state = gameReducer(state, invalidPlaceAction);

      // State should remain unchanged
      expect(state.stagingArea).toHaveLength(0);
      expect(state.placedCards).toHaveLength(0);
      expect(state.players[0].hand).toHaveLength(3);

      // Try to commit without enough cards
      const invalidCommitAction: GameAction = {
        type: ActionType.COMMIT_CARDS,
        payload: {
          playerId: 'player1',
        },
      };
      state = gameReducer(state, invalidCommitAction);

      // State should remain unchanged
      expect(state.stagingArea).toHaveLength(0);
      expect(state.placedCards).toHaveLength(0);
      expect(state.players[0].hand).toHaveLength(3);
    });

    it('should handle a complete game flow with two players and wildcard', () => {
      // Initial setup
      const mockWildcard: Card = {
        id: 'wildcard1',
        type: CardType.NUMBER,
        value: 5, // This will be the target value
        isWildcard: true,
      };

      const mockCard1Duplicate: Card = {
        id: 'card1_duplicate',
        type: CardType.NUMBER,
        value: 1,
        isWildcard: false,
      };

      const player1 = {
        id: 'player1',
        name: 'Player 1',
        hand: [mockCard1, mockCard2, mockCard3, mockCard4],
      };

      const player2 = {
        id: 'player2',
        name: 'Player 2',
        hand: [mockCard1, mockCard1Duplicate, mockCard3], // Two cards with value 1
      };

      let state: GameState = {
        id: 'game1',
        mode: GameMode.STANDARD,
        players: [player1, player2],
        currentPlayerIndex: 0,
        deck: [mockWildcard],
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

      // Step 1: Player 1 places three cards (1 + 2 = 3)
      const placeAction1: GameAction = {
        type: ActionType.PLACE_CARD,
        payload: {
          playerId: 'player1',
          card: mockCard1,
        },
      };
      state = gameReducer(state, placeAction1);
      expect(state.stagingArea).toHaveLength(1);
      expect(state.stagingArea).toContainEqual(mockCard1);

      const placeAction2: GameAction = {
        type: ActionType.PLACE_CARD,
        payload: {
          playerId: 'player1',
          card: mockCard2,
        },
      };
      state = gameReducer(state, placeAction2);
      expect(state.stagingArea).toHaveLength(2);
      expect(state.stagingArea).toContainEqual(mockCard2);

      const placeAction3: GameAction = {
        type: ActionType.PLACE_CARD,
        payload: {
          playerId: 'player1',
          card: mockCard3,
        },
      };
      state = gameReducer(state, placeAction3);
      expect(state.stagingArea).toHaveLength(3);
      expect(state.stagingArea).toContainEqual(mockCard3);

      // Commit cards
      const commitAction1: GameAction = {
        type: ActionType.COMMIT_CARDS,
        payload: {
          playerId: 'player1',
        },
      };
      state = gameReducer(state, commitAction1);
      expect(state.stagingArea).toHaveLength(0);
      expect(state.placedCards).toHaveLength(3);
      expect(state.placedCards).toContainEqual(mockCard1);
      expect(state.placedCards).toContainEqual(mockCard2);
      expect(state.placedCards).toContainEqual(mockCard3);

      // End turn
      const endTurnAction1: GameAction = {
        type: ActionType.END_TURN,
        payload: {},
      };
      state = gameReducer(state, endTurnAction1);
      expect(state.currentPlayerIndex).toBe(1);

      // Step 2: Player 2 places two identical cards (1 + 1)
      const placeAction4: GameAction = {
        type: ActionType.PLACE_CARD,
        payload: {
          playerId: 'player2',
          card: mockCard1,
        },
      };
      state = gameReducer(state, placeAction4);
      expect(state.stagingArea).toHaveLength(1);
      expect(state.stagingArea[0]).toEqual(mockCard1);

      const placeAction5: GameAction = {
        type: ActionType.PLACE_CARD,
        payload: {
          playerId: 'player2',
          card: mockCard1Duplicate,
        },
      };
      state = gameReducer(state, placeAction5);
      expect(state.stagingArea).toHaveLength(2);
      expect(state.stagingArea[1]).toEqual(mockCard1Duplicate);

      // Commit cards
      const commitAction2: GameAction = {
        type: ActionType.COMMIT_CARDS,
        payload: {
          playerId: 'player2',
        },
      };
      state = gameReducer(state, commitAction2);
      expect(state.stagingArea).toHaveLength(0);
      expect(state.placedCards).toHaveLength(5); // 3 from player 1 + 2 from player 2
      expect(state.placedCards.slice(-2)).toEqual([mockCard1, mockCard1Duplicate]); // Last two cards should be the ones just placed

      // End turn
      const endTurnAction2: GameAction = {
        type: ActionType.END_TURN,
        payload: {},
      };
      state = gameReducer(state, endTurnAction2);
      expect(state.currentPlayerIndex).toBe(0);

      // Step 3: Player 1 draws a wildcard
      const drawAction: GameAction = {
        type: ActionType.DRAW_CARD,
        payload: {
          playerId: 'player1',
          card: mockWildcard,
        },
      };
      state = gameReducer(state, drawAction);
      expect(state.players[0].hand).toContain(mockWildcard);
      expect(state.deck).not.toContain(mockWildcard);

      // Log player 1's hand before placing cards
      console.log('Player 1 hand before placing cards:', state.players[0].hand);

      // Step 4: Player 1 places two cards (card4 + wildcard = 10)
      const placeAction6: GameAction = {
        type: ActionType.PLACE_CARD,
        payload: {
          playerId: 'player1',
          card: mockCard4, // Use mockCard4 (value: 5)
        },
      };
      state = gameReducer(state, placeAction6);
      expect(state.stagingArea).toHaveLength(1);
      expect(state.stagingArea).toContainEqual(mockCard4);

      const placeAction7: GameAction = {
        type: ActionType.PLACE_CARD,
        payload: {
          playerId: 'player1',
          card: mockWildcard, // Use wildcard (value: 5)
        },
      };
      state = gameReducer(state, placeAction7);
      expect(state.stagingArea).toHaveLength(2);
      expect(state.stagingArea).toContainEqual(mockWildcard);

      // Commit cards
      const commitAction3: GameAction = {
        type: ActionType.COMMIT_CARDS,
        payload: {
          playerId: 'player1',
        },
      };
      state = gameReducer(state, commitAction3);
      expect(state.stagingArea).toHaveLength(0);
      expect(state.placedCards).toHaveLength(7); // 3 from player 1's first turn + 2 from player 2 + 2 from player 1's second turn
      expect(state.placedCards.slice(-2)).toEqual([mockCard4, mockWildcard]); // Last two cards should be the ones just placed

      // End turn
      const endTurnAction3: GameAction = {
        type: ActionType.END_TURN,
        payload: {},
      };
      state = gameReducer(state, endTurnAction3);
      expect(state.currentPlayerIndex).toBe(1);

      // Verify final state
      expect(state.players[0].hand).toHaveLength(0); // Player 1 has no cards left
      expect(state.players[1].hand).toHaveLength(1); // Player 2 has one card left
      expect(state.deck).toHaveLength(0); // Deck is empty
      expect(state.placedCards).toHaveLength(7); // All placed cards
    });
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

  describe('Deck Management', () => {
    it('should handle drawing cards correctly', () => {
      const state = createInitialState();
      const cardToDraw = mockCard1;

      // Add card to deck
      state.deck = [cardToDraw];

      // Validate card drawing
      expect(canDrawCard(state.deck)).toBe(true);

      // Draw card
      const drawAction: GameAction = {
        type: ActionType.DRAW_CARD,
        payload: {
          playerId: 'player1',
          card: cardToDraw,
        },
      };
      const newState = gameReducer(state, drawAction);

      // Verify card was drawn
      expect(newState.players[0].hand).toContain(cardToDraw);
      expect(newState.deck).not.toContain(cardToDraw);
    });

    it('should handle empty deck', () => {
      const state = createInitialState();

      // Validate empty deck
      expect(canDrawCard(state.deck)).toBe(false);

      // Try to draw from empty deck
      const drawAction: GameAction = {
        type: ActionType.DRAW_CARD,
        payload: {
          playerId: 'player1',
          card: mockCard1,
        },
      };
      const newState = gameReducer(state, drawAction);

      // Verify state remains unchanged
      expect(newState).toEqual(state);
    });
  });
});
