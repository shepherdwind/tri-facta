import { GameMode, CardType, ActionType } from '../constants/gameConstants';

export interface Card {
  id: string;
  type: CardType;
  value: number;
  isWildcard: boolean;
}

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  score?: number;
}

export interface GameState {
  id: string;
  mode: GameMode;
  players: Player[];
  currentPlayerIndex: number;
  deck: Card[];
  placedCards: Card[];
  stagingArea: Card[];
  isGameStarted: boolean;
  isGameEnded: boolean;
  winner: string | null;
  lastAction: GameAction;
  createdAt: Date;
  updatedAt: Date;
}

export interface StartGamePayload {
  mode: GameMode;
  players: Player[];
}

export interface PlaceCardPayload {
  playerId: string;
  card: Card;
}

export interface CommitCardsPayload {
  playerId: string;
}

export interface ReplaceCardsPayload {
  playerId: string;
  oldCards: Card[];
  newCards: Card[];
}

export interface DrawCardPayload {
  playerId: string;
  card: Card;
}

export interface EndGamePayload {
  winnerId: string;
}

export type GameAction =
  | {
      type: ActionType.START_GAME;
      payload: StartGamePayload;
    }
  | {
      type: ActionType.PLACE_CARD;
      payload: PlaceCardPayload;
    }
  | {
      type: ActionType.COMMIT_CARDS;
      payload: CommitCardsPayload;
    }
  | {
      type: ActionType.REPLACE_CARDS;
      payload: ReplaceCardsPayload;
    }
  | {
      type: ActionType.DRAW_CARD;
      payload: DrawCardPayload;
    }
  | {
      type: ActionType.END_TURN;
      payload: {};
    }
  | {
      type: ActionType.END_GAME;
      payload: EndGamePayload;
    };
