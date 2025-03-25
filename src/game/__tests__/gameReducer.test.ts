import { gameReducer } from '../gameReducer';
import { GameState, GameAction, GameMode, Card, Player } from '../../types/game';

describe('gameReducer', () => {
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

  let initialState: GameState;

  beforeEach(() => {
    initialState = {
      id: 'game1',
      mode: 'addition',
      players: mockPlayers,
      currentPlayerIndex: 0,
      deck: [mockCard1, mockCard2, mockCard3],
      placedCards: [],
      isGameStarted: false,
      isGameEnded: false,
      winner: null,
      lastAction: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  it('should initialize game state correctly', () => {
    const startAction: GameAction = {
      type: 'START_GAME',
      payload: {
        mode: 'addition',
        players: mockPlayers,
      },
    };

    const newState = gameReducer(initialState, startAction);

    expect(newState.isGameStarted).toBe(true);
    expect(newState.mode).toBe('addition');
    expect(newState.players.length).toBe(2);
    // After dealing initial hands (6 cards each), the deck should have 30 cards
    expect(newState.deck.length).toBe(30); // 42 - (2 players * 6 cards)
  });

  it('should handle placing cards correctly', () => {
    // First start the game
    const startAction: GameAction = {
      type: 'START_GAME',
      payload: {
        mode: 'addition',
        players: mockPlayers,
      },
    };
    let state = gameReducer(initialState, startAction);

    // Add cards to player's hand
    state.players[0].hand = [mockCard1, mockCard2, mockCard3];

    const placeAction: GameAction = {
      type: 'PLACE_CARDS',
      payload: {
        playerId: '1',
        cards: [mockCard1, mockCard2, mockCard3],
      },
    };

    const newState = gameReducer(state, placeAction);

    expect(newState.players[0].hand).toHaveLength(0);
    expect(newState.placedCards).toHaveLength(3);
    expect(newState.placedCards).toContainEqual(mockCard1);
    expect(newState.placedCards).toContainEqual(mockCard2);
    expect(newState.placedCards).toContainEqual(mockCard3);
  });

  it('should handle replacing cards correctly', () => {
    // First start the game
    const startAction: GameAction = {
      type: 'START_GAME',
      payload: {
        mode: 'addition',
        players: mockPlayers,
      },
    };
    let state = gameReducer(initialState, startAction);

    // Add cards to player's hand and deck
    state.players[0].hand = [mockCard1, mockCard2];
    state.deck = [mockCard3];

    const replaceAction: GameAction = {
      type: 'REPLACE_CARDS',
      payload: {
        playerId: '1',
        oldCards: [mockCard1, mockCard2],
        newCards: [mockCard3],
      },
    };

    const newState = gameReducer(state, replaceAction);

    // After replacing 2 cards with 1 card, the hand should have 1 card
    expect(newState.players[0].hand).toHaveLength(1);
    expect(newState.players[0].hand).toContainEqual(mockCard3);
    expect(newState.deck).toHaveLength(0);
  });

  it('should handle drawing a card correctly', () => {
    // First start the game
    const startAction: GameAction = {
      type: 'START_GAME',
      payload: {
        mode: 'addition',
        players: mockPlayers,
      },
    };
    let state = gameReducer(initialState, startAction);

    // Set up deck
    state.deck = [mockCard1];

    const drawAction: GameAction = {
      type: 'DRAW_CARD',
      payload: {
        playerId: '1',
        card: mockCard1,
      },
    };

    const newState = gameReducer(state, drawAction);

    expect(newState.players[0].hand).toContainEqual(mockCard1);
    expect(newState.deck).toHaveLength(0);
  });

  it('should handle ending turn correctly', () => {
    // First start the game
    const startAction: GameAction = {
      type: 'START_GAME',
      payload: {
        mode: 'addition',
        players: mockPlayers,
      },
    };
    let state = gameReducer(initialState, startAction);

    const endTurnAction: GameAction = {
      type: 'END_TURN',
      payload: {
        playerId: '1',
      },
    };

    const newState = gameReducer(state, endTurnAction);

    expect(newState.currentPlayerIndex).toBe(1);
  });

  it('should handle ending game correctly', () => {
    const endGameAction: GameAction = {
      type: 'END_GAME',
      payload: {
        winnerId: '1',
      },
    };

    const newState = gameReducer(initialState, endGameAction);

    expect(newState.isGameEnded).toBe(true);
    expect(newState.winner).toBe('1');
  });
});
