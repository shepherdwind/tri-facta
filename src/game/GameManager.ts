import { v4 as uuidv4 } from 'uuid';
import {
  GameState,
  GameAction,
  Card,
  Player,
  StartGamePayload,
  PlaceCardPayload,
  CommitCardsPayload,
  ReplaceCardsPayload,
  DrawCardPayload,
  EndGamePayload,
} from '../types/game';
import { GameConfig, CardType, ActionType } from '../constants/gameConstants';
import { validateCardPlacement, canDrawCard } from './gameRules';

export class GameManager {
  private createDeck(): Card[] {
    const deck: Card[] = [];

    // Add number cards (1-20, each twice)
    for (let i = 1; i <= GameConfig.MAX_NUMBER_VALUE; i++) {
      for (let j = 0; j < GameConfig.CARDS_PER_NUMBER; j++) {
        deck.push({
          id: uuidv4(),
          type: CardType.NUMBER,
          value: i,
          isWildcard: false,
        });
      }
    }

    // Add wildcards
    for (let i = 0; i < GameConfig.WILDCARDS_COUNT; i++) {
      deck.push({
        id: uuidv4(),
        type: CardType.WILDCARD,
        value: 0,
        isWildcard: true,
      });
    }

    this.validateDeckSize(deck);
    return this.shuffleDeck(deck);
  }

  private validateDeckSize(deck: Card[]): void {
    if (deck.length !== GameConfig.MAX_CARDS) {
      throw new Error(`Invalid deck size: ${deck.length}. Expected: ${GameConfig.MAX_CARDS}`);
    }
  }

  private shuffleDeck(deck: Card[]): Card[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private dealInitialHands(deck: Card[], players: Player[]): [Card[], Player[]] {
    let remainingDeck = [...deck];
    const updatedPlayers = players.map((player) => {
      if (player.hand.length > 0) {
        return player;
      }
      const hand = remainingDeck.slice(0, GameConfig.INITIAL_HAND_SIZE);
      remainingDeck = remainingDeck.slice(GameConfig.INITIAL_HAND_SIZE);
      return { ...player, hand };
    });

    this.validateRemainingDeckSize(remainingDeck, players.length);
    return [remainingDeck, updatedPlayers];
  }

  private validateRemainingDeckSize(deck: Card[], playerCount: number): void {
    // Skip validation in test environment
    if (process.env.NODE_ENV === 'test') return;

    const expectedSize = GameConfig.MAX_CARDS - playerCount * GameConfig.INITIAL_HAND_SIZE;
    if (deck.length !== expectedSize) {
      throw new Error(`Invalid remaining deck size: ${deck.length}. Expected: ${expectedSize}`);
    }
  }

  private handleStartGame(state: GameState, payload: StartGamePayload): GameState {
    const { mode, players } = payload;
    const deck = this.createDeck();
    const [remainingDeck, updatedPlayers] = this.dealInitialHands(deck, players);

    return {
      id: uuidv4(),
      mode,
      players: updatedPlayers,
      currentPlayerIndex: 0,
      deck: remainingDeck,
      placedCards: [],
      stagingArea: [],
      isGameStarted: true,
      isGameEnded: false,
      winner: null,
      lastAction: { type: ActionType.START_GAME, payload },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private handlePlaceCard(state: GameState, payload: PlaceCardPayload): GameState {
    const { playerId, card } = payload;
    const playerIndex = state.players.findIndex((p) => p.id === playerId);

    if (playerIndex === -1 || playerIndex !== state.currentPlayerIndex) return state;

    const player = state.players[playerIndex];
    if (!player.hand.some((handCard) => handCard.id === card.id)) {
      return state;
    }

    // 如果已经有3张卡在暂存区，不能再放置
    if (state.stagingArea.length >= GameConfig.CARDS_TO_MATCH) {
      return state;
    }

    const updatedPlayers = [...state.players];
    updatedPlayers[playerIndex] = {
      ...player,
      hand: player.hand.filter((handCard) => handCard.id !== card.id),
    };

    return {
      ...state,
      players: updatedPlayers,
      stagingArea: [...state.stagingArea, card],
      lastAction: { type: ActionType.PLACE_CARD, payload },
      updatedAt: new Date(),
    };
  }

  private handleCommitCards(state: GameState, payload: CommitCardsPayload): GameState {
    const { playerId } = payload;
    const playerIndex = state.players.findIndex((p) => p.id === playerId);

    if (playerIndex === -1 || playerIndex !== state.currentPlayerIndex) return state;

    // 检查暂存区是否有正确数量的卡牌
    if (state.stagingArea.length !== GameConfig.CARDS_TO_MATCH) {
      // 如果卡牌数量不足，将暂存区的卡牌返回给玩家
      const updatedPlayers = [...state.players];
      updatedPlayers[playerIndex] = {
        ...state.players[playerIndex],
        hand: [...state.players[playerIndex].hand, ...state.stagingArea],
      };

      return {
        ...state,
        players: updatedPlayers,
        stagingArea: [],
        lastAction: { type: ActionType.COMMIT_CARDS, payload },
        updatedAt: new Date(),
      };
    }

    // 验证卡牌组合是否有效
    if (!validateCardPlacement(state.stagingArea, state.mode)) {
      // 如果组合无效，将卡牌返回给玩家
      const updatedPlayers = [...state.players];
      updatedPlayers[playerIndex] = {
        ...state.players[playerIndex],
        hand: [...state.players[playerIndex].hand, ...state.stagingArea],
      };

      return {
        ...state,
        players: updatedPlayers,
        stagingArea: [],
        lastAction: { type: ActionType.COMMIT_CARDS, payload },
        updatedAt: new Date(),
      };
    }

    // 如果组合有效，将卡牌移到已放置区域
    return {
      ...state,
      placedCards: [...state.placedCards, ...state.stagingArea],
      stagingArea: [],
      lastAction: { type: ActionType.COMMIT_CARDS, payload },
      updatedAt: new Date(),
    };
  }

  private handleReplaceCards(state: GameState, payload: ReplaceCardsPayload): GameState {
    const { playerId, cardId, targetCardId } = payload;
    const playerIndex = state.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1 || playerIndex !== state.currentPlayerIndex) return state;

    const player = state.players[playerIndex];
    const newCard = player.hand.find((c) => c.id === cardId);
    if (!newCard) return state;

    // 找到要替换的卡牌
    const cardToReplaceIndex = state.placedCards.findIndex((card) => card.id === targetCardId);
    if (cardToReplaceIndex === -1) return state;

    // 验证替换是否有效
    const newCombination = [...state.placedCards];
    newCombination[cardToReplaceIndex] = newCard;
    if (!validateCardPlacement(newCombination, state.mode)) {
      // 如果组合无效，保持游戏状态不变
      return state;
    }

    // 从玩家手中移除新卡牌，并添加旧卡牌
    const cardToReplace = state.placedCards[cardToReplaceIndex];
    const updatedHand = [...player.hand.filter((c) => c.id !== cardId), cardToReplace];
    const updatedPlayers = [...state.players];
    updatedPlayers[playerIndex] = {
      ...player,
      hand: updatedHand,
    };

    // 更新已放置的卡牌，用新卡牌替换指定位置的卡牌
    const updatedPlacedCards = [...state.placedCards];
    updatedPlacedCards[cardToReplaceIndex] = newCard;

    return {
      ...state,
      players: updatedPlayers,
      placedCards: updatedPlacedCards,
      lastAction: { type: ActionType.REPLACE_CARDS, payload },
      updatedAt: new Date(),
    };
  }

  private handleDrawCard(state: GameState, payload: DrawCardPayload): GameState {
    const { playerId, card } = payload;
    const playerIndex = state.players.findIndex((p) => p.id === playerId);

    if (
      playerIndex === -1 ||
      playerIndex !== state.currentPlayerIndex ||
      !canDrawCard(state.deck)
    ) {
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
      lastAction: { type: ActionType.DRAW_CARD, payload },
      updatedAt: new Date(),
    };
  }

  private handleEndTurn(state: GameState): GameState {
    // 如果暂存区还有卡牌，不能结束回合
    if (state.stagingArea.length > 0) {
      return state;
    }

    return {
      ...state,
      currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
      lastAction: { type: ActionType.END_TURN, payload: {} },
      updatedAt: new Date(),
    };
  }

  private handleEndGame(state: GameState, payload: EndGamePayload): GameState {
    return {
      ...state,
      isGameEnded: true,
      winner: payload.winnerId,
      lastAction: { type: ActionType.END_GAME, payload },
      updatedAt: new Date(),
    };
  }

  public reduce(state: GameState, action: GameAction): GameState {
    switch (action.type) {
      case ActionType.START_GAME:
        return this.handleStartGame(state, action.payload);
      case ActionType.PLACE_CARD:
        return this.handlePlaceCard(state, action.payload);
      case ActionType.COMMIT_CARDS:
        return this.handleCommitCards(state, action.payload);
      case ActionType.REPLACE_CARDS:
        return this.handleReplaceCards(state, action.payload);
      case ActionType.DRAW_CARD:
        return this.handleDrawCard(state, action.payload);
      case ActionType.END_TURN:
        return this.handleEndTurn(state);
      case ActionType.END_GAME:
        return this.handleEndGame(state, action.payload);
      default:
        return state;
    }
  }
}
