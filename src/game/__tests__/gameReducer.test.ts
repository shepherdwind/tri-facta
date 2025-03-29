import { gameReducer } from '../gameReducer';
import { GameState, GameAction, EndTurnPayload } from '../../types/game';
import { GameMode, CardType, ActionType } from '../../constants/gameConstants';
import { Card } from '../../types/game';

const mockCard1: Card = {
  id: '1',
  type: CardType.NUMBER,
  value: 1,
  isWildcard: false,
};

const mockCard2: Card = {
  id: '2',
  type: CardType.NUMBER,
  value: 2,
  isWildcard: false,
};

const mockCard3: Card = {
  id: '3',
  type: CardType.NUMBER,
  value: 3,
  isWildcard: false,
};

const mockCard4: Card = {
  id: '4',
  type: CardType.NUMBER,
  value: 5,
  isWildcard: false,
};

const mockCard5: Card = {
  id: '5',
  type: CardType.NUMBER,
  value: 10,
  isWildcard: false,
};

const mockPlayer1 = {
  id: 'player1',
  name: 'Player 1',
  hand: [mockCard1, mockCard2, mockCard3],
};

const mockPlayer2 = {
  id: 'player2',
  name: 'Player 2',
  hand: [mockCard4],
};

const initialState: GameState = {
  id: 'game1',
  mode: GameMode.STANDARD,
  players: [mockPlayer1, mockPlayer2],
  currentPlayerIndex: 0,
  deck: [],
  placedCards: [],
  stagingArea: [],
  isGameStarted: false,
  isGameEnded: false,
  winner: null,
  lastAction: {
    type: ActionType.START_GAME,
    payload: {
      mode: GameMode.STANDARD,
      players: [mockPlayer1, mockPlayer2],
    },
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('gameReducer', () => {
  it('should initialize game state correctly', () => {
    const startAction: GameAction = {
      type: ActionType.START_GAME,
      payload: {
        mode: GameMode.STANDARD,
        players: [mockPlayer1, mockPlayer2],
      },
    };

    const newState = gameReducer(initialState, startAction);

    expect(newState.isGameStarted).toBe(true);
    expect(newState.mode).toBe(GameMode.STANDARD);
    expect(newState.players.length).toBe(2);
    // After dealing initial hands (6 cards each), the deck should have remaining cards
    // Total cards: 42 (20 numbers × 2 + 2 wildcards)
    // Initial hands: 6 cards × 2 players = 12 cards
    // Remaining: 42 - 12 = 30 cards
    expect(newState.deck.length).toBe(30);
  });

  it('should handle placing cards correctly', () => {
    const testState: GameState = {
      ...initialState,
      players: [
        {
          ...mockPlayer1,
          hand: [mockCard1, mockCard2, mockCard3],
        },
        mockPlayer2,
      ],
    };

    // Place first card
    const placeAction1: GameAction = {
      type: ActionType.PLACE_CARD,
      payload: {
        playerId: mockPlayer1.id,
        card: mockCard1,
      },
    };
    let newState = gameReducer(testState, placeAction1);

    expect(newState.players[0].hand).toHaveLength(2);
    expect(newState.stagingArea).toHaveLength(1);
    expect(newState.stagingArea).toContainEqual(mockCard1);

    // Place second card
    const placeAction2: GameAction = {
      type: ActionType.PLACE_CARD,
      payload: {
        playerId: mockPlayer1.id,
        card: mockCard2,
      },
    };
    newState = gameReducer(newState, placeAction2);

    expect(newState.players[0].hand).toHaveLength(1);
    expect(newState.stagingArea).toHaveLength(2);
    expect(newState.stagingArea).toContainEqual(mockCard2);

    // Place third card
    const placeAction3: GameAction = {
      type: ActionType.PLACE_CARD,
      payload: {
        playerId: mockPlayer1.id,
        card: mockCard3,
      },
    };
    newState = gameReducer(newState, placeAction3);

    expect(newState.players[0].hand).toHaveLength(0);
    expect(newState.stagingArea).toHaveLength(3);
    expect(newState.stagingArea).toContainEqual(mockCard3);

    // Commit cards
    const commitAction: GameAction = {
      type: ActionType.COMMIT_CARDS,
      payload: {
        playerId: mockPlayer1.id,
      },
    };
    newState = gameReducer(newState, commitAction);

    expect(newState.stagingArea).toHaveLength(0);
    expect(newState.placedCards).toHaveLength(3);
    expect(newState.placedCards).toContainEqual(mockCard1);
    expect(newState.placedCards).toContainEqual(mockCard2);
    expect(newState.placedCards).toContainEqual(mockCard3);
  });

  it('should handle invalid card placement', () => {
    const testState: GameState = {
      ...initialState,
      players: [
        {
          ...mockPlayer1,
          hand: [mockCard1, mockCard2, mockCard3, mockCard4],
        },
        mockPlayer2,
      ],
    };

    // Place first card (value 1)
    const placeAction1: GameAction = {
      type: ActionType.PLACE_CARD,
      payload: {
        playerId: mockPlayer1.id,
        card: mockCard1,
      },
    };
    let newState = gameReducer(testState, placeAction1);

    expect(newState.stagingArea).toHaveLength(1);
    expect(newState.stagingArea).toContainEqual(mockCard1);

    // Place second card (value 2)
    const placeAction2: GameAction = {
      type: ActionType.PLACE_CARD,
      payload: {
        playerId: mockPlayer1.id,
        card: mockCard2,
      },
    };
    newState = gameReducer(newState, placeAction2);

    expect(newState.stagingArea).toHaveLength(2);
    expect(newState.stagingArea).toContainEqual(mockCard1);
    expect(newState.stagingArea).toContainEqual(mockCard2);

    // Place third card (value 5, which makes an invalid combination)
    const placeAction3: GameAction = {
      type: ActionType.PLACE_CARD,
      payload: {
        playerId: mockPlayer1.id,
        card: mockCard4,
      },
    };
    newState = gameReducer(newState, placeAction3);

    expect(newState.stagingArea).toHaveLength(3);
    expect(newState.stagingArea).toContainEqual(mockCard1);
    expect(newState.stagingArea).toContainEqual(mockCard2);
    expect(newState.stagingArea).toContainEqual(mockCard4);

    // Try to commit invalid combination
    const commitAction: GameAction = {
      type: ActionType.COMMIT_CARDS,
      payload: {
        playerId: mockPlayer1.id,
      },
    };
    newState = gameReducer(newState, commitAction);

    // Cards should be returned to player's hand
    expect(newState.stagingArea).toHaveLength(0);
    expect(newState.placedCards).toHaveLength(0);
    expect(newState.players[0].hand).toContainEqual(mockCard1);
    expect(newState.players[0].hand).toContainEqual(mockCard2);
    expect(newState.players[0].hand).toContainEqual(mockCard4);
  });

  it('should handle replacing cards', () => {
    const testState: GameState = {
      ...initialState,
      players: [
        {
          ...mockPlayer1,
          hand: [mockCard1, mockCard2, mockCard3, mockCard4],
        },
        mockPlayer2,
      ],
      placedCards: [mockCard1, mockCard2, mockCard3],
      currentPlayerIndex: 0,
      isGameStarted: true,
    };

    const action: GameAction = {
      type: ActionType.REPLACE_CARDS,
      payload: {
        playerId: mockPlayer1.id,
        cardId: mockCard4.id,
        targetCardId: mockCard1.id,
      },
    };

    const newState = gameReducer(testState, action);

    // 验证卡牌被正确替换
    expect(newState.placedCards).toContainEqual(mockCard4);
    expect(newState.placedCards).not.toContainEqual(mockCard1);
    expect(newState.players[0].hand).toContainEqual(mockCard1);
    expect(newState.players[0].hand).not.toContainEqual(mockCard4);
  });

  it('should not replace cards with invalid combination', () => {
    const testState: GameState = {
      ...initialState,
      players: [
        {
          ...mockPlayer1,
          hand: [mockCard1, mockCard2, mockCard3, mockCard5],
        },
        mockPlayer2,
      ],
      placedCards: [mockCard1, mockCard2, mockCard3],
      currentPlayerIndex: 0,
      isGameStarted: true,
    };

    const action: GameAction = {
      type: ActionType.REPLACE_CARDS,
      payload: {
        playerId: mockPlayer1.id,
        cardId: mockCard5.id,
        targetCardId: mockCard1.id,
      },
    };

    const newState = gameReducer(testState, action);

    // 验证无效组合时卡牌没有被替换
    expect(newState.placedCards).toEqual(testState.placedCards);
    expect(newState.players[0].hand).toEqual(testState.players[0].hand);
  });

  it('should handle drawing cards correctly', () => {
    const state = { ...initialState };
    const cardToDraw = mockCard1;

    const drawAction: GameAction = {
      type: ActionType.DRAW_CARD,
      payload: {
        playerId: 'player1',
        card: cardToDraw,
      },
    };

    const newState = gameReducer(state, drawAction);

    // Verify card was drawn
    expect(newState.players[0].hand).toContainEqual(cardToDraw);
  });

  it('should handle ending turn correctly', () => {
    // First start the game
    const startAction: GameAction = {
      type: ActionType.START_GAME,
      payload: {
        mode: GameMode.STANDARD,
        players: [mockPlayer1, mockPlayer2],
      },
    };
    const state = gameReducer(initialState, startAction);

    const endTurnAction: GameAction = {
      type: ActionType.END_TURN,
      payload: {} as EndTurnPayload,
    };

    const newState = gameReducer(state, endTurnAction);

    expect(newState.currentPlayerIndex).toBe(1);
  });

  it('should handle ending game correctly', () => {
    const endGameAction: GameAction = {
      type: ActionType.END_GAME,
      payload: {
        winnerId: 'player1',
      },
    };

    const newState = gameReducer(initialState, endGameAction);

    expect(newState.isGameEnded).toBe(true);
    expect(newState.winner).toBe('player1');
  });

  it('should handle game end', () => {
    const testState: GameState = {
      ...initialState,
      isGameStarted: true,
    };

    const action: GameAction = {
      type: ActionType.END_GAME,
      payload: {
        winnerId: 'player1',
      },
    };

    const newState = gameReducer(testState, action);

    expect(newState.isGameEnded).toBe(true);
    expect(newState.winner).toBe('player1');
  });
});
