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
