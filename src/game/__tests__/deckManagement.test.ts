import { gameReducer } from '../gameReducer';
import { GameState, Card, GameAction } from '../../types/game';
import { GameMode, CardType, ActionType, GameConfig } from '../../constants/gameConstants';
import { canDrawCard } from '../gameRules';

describe('Deck Management', () => {
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

  describe('Player Hand Management', () => {
    it('should deal correct number of initial cards to each player', () => {
      const player1 = {
        id: 'player1',
        name: 'Player 1',
        hand: [],
      };

      const player2 = {
        id: 'player2',
        name: 'Player 2',
        hand: [],
      };

      const state: GameState = {
        id: 'game1',
        mode: GameMode.STANDARD,
        players: [player1, player2],
        currentPlayerIndex: 0,
        deck: Array(
          GameConfig.MAX_NUMBER_VALUE * GameConfig.CARDS_PER_NUMBER + GameConfig.WILDCARDS_COUNT
        )
          .fill(null)
          .map((_, index) => ({
            id: `card${index}`,
            type: CardType.NUMBER,
            value: (index % GameConfig.MAX_NUMBER_VALUE) + 1,
            isWildcard: false,
          })),
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

      // Start game
      const startAction: GameAction = {
        type: ActionType.START_GAME,
        payload: {
          mode: GameMode.STANDARD,
          players: [player1, player2],
        },
      };
      const newState = gameReducer(state, startAction);

      // Verify each player has correct number of initial cards
      expect(newState.players[0].hand).toHaveLength(GameConfig.INITIAL_HAND_SIZE);
      expect(newState.players[1].hand).toHaveLength(GameConfig.INITIAL_HAND_SIZE);

      // Verify remaining deck size
      const totalCards =
        GameConfig.MAX_NUMBER_VALUE * GameConfig.CARDS_PER_NUMBER + GameConfig.WILDCARDS_COUNT;
      const expectedDeckSize = totalCards - GameConfig.INITIAL_HAND_SIZE * 2;
      expect(newState.deck).toHaveLength(expectedDeckSize);
    });
  });
});
