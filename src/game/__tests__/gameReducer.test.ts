import { gameReducer } from '../gameReducer';
import { GameState, GameAction, Card, Player } from '../../types/game';
import { GameMode, CardType, ActionType } from '../../constants/gameConstants';

describe('gameReducer', () => {
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

  const mockPlayers: Player[] = [
    { id: '1', name: 'Player 1', hand: [] },
    { id: '2', name: 'Player 2', hand: [] },
  ];

  const mockPlayer = {
    id: 'player1',
    name: 'Player 1',
    hand: [mockCard1, mockCard2, mockCard3, mockCard4],
  };

  const initialState: GameState = {
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
  };

  it('should initialize game state correctly', () => {
    const startAction: GameAction = {
      type: ActionType.START_GAME,
      payload: {
        mode: GameMode.STANDARD,
        players: mockPlayers,
      },
    };

    const newState = gameReducer(initialState, startAction);

    expect(newState.isGameStarted).toBe(true);
    expect(newState.mode).toBe(GameMode.STANDARD);
    expect(newState.players.length).toBe(2);
    // After dealing initial hands (6 cards each), the deck should have 30 cards
    expect(newState.deck.length).toBe(30); // 42 - (2 players * 6 cards)
  });

  it('should handle placing cards correctly', () => {
    const state = { ...initialState };

    // Place first card
    const placeAction1: GameAction = {
      type: ActionType.PLACE_CARD,
      payload: {
        playerId: 'player1',
        card: mockCard1,
      },
    };
    let newState = gameReducer(state, placeAction1);

    expect(newState.players[0].hand).toHaveLength(3);
    expect(newState.stagingArea).toHaveLength(1);
    expect(newState.stagingArea).toContainEqual(mockCard1);

    // Place second card
    const placeAction2: GameAction = {
      type: ActionType.PLACE_CARD,
      payload: {
        playerId: 'player1',
        card: mockCard2,
      },
    };
    newState = gameReducer(newState, placeAction2);

    expect(newState.players[0].hand).toHaveLength(2);
    expect(newState.stagingArea).toHaveLength(2);
    expect(newState.stagingArea).toContainEqual(mockCard2);

    // Place third card
    const placeAction3: GameAction = {
      type: ActionType.PLACE_CARD,
      payload: {
        playerId: 'player1',
        card: mockCard3,
      },
    };
    newState = gameReducer(newState, placeAction3);

    expect(newState.players[0].hand).toHaveLength(1);
    expect(newState.stagingArea).toHaveLength(3);
    expect(newState.stagingArea).toContainEqual(mockCard3);

    // Commit cards
    const commitAction: GameAction = {
      type: ActionType.COMMIT_CARDS,
      payload: {
        playerId: 'player1',
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
    const state = { ...initialState };

    // Place first card (value 1)
    const placeAction1: GameAction = {
      type: ActionType.PLACE_CARD,
      payload: {
        playerId: 'player1',
        card: mockCard1,
      },
    };
    let newState = gameReducer(state, placeAction1);

    expect(newState.stagingArea).toHaveLength(1);
    expect(newState.stagingArea).toContainEqual(mockCard1);

    // Place second card (value 2)
    const placeAction2: GameAction = {
      type: ActionType.PLACE_CARD,
      payload: {
        playerId: 'player1',
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
        playerId: 'player1',
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
        playerId: 'player1',
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

  it('should handle replacing cards correctly', () => {
    const state = { ...initialState };
    const oldCards = [mockCard1, mockCard2];
    const newCards = [mockCard3];

    const replaceAction: GameAction = {
      type: ActionType.REPLACE_CARDS,
      payload: {
        playerId: 'player1',
        oldCards,
        newCards,
      },
    };

    const newState = gameReducer(state, replaceAction);

    // Verify cards were replaced
    expect(newState.players[0].hand).not.toContainEqual(mockCard1);
    expect(newState.players[0].hand).not.toContainEqual(mockCard2);
    expect(newState.players[0].hand).toContainEqual(mockCard3);
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
        players: mockPlayers,
      },
    };
    let state = gameReducer(initialState, startAction);

    const endTurnAction: GameAction = {
      type: ActionType.END_TURN,
      payload: {},
    };

    const newState = gameReducer(state, endTurnAction);

    expect(newState.currentPlayerIndex).toBe(1);
  });

  it('should handle ending game correctly', () => {
    const endGameAction: GameAction = {
      type: ActionType.END_GAME,
      payload: {
        winnerId: '1',
      },
    };

    const newState = gameReducer(initialState, endGameAction);

    expect(newState.isGameEnded).toBe(true);
    expect(newState.winner).toBe('1');
  });
});
