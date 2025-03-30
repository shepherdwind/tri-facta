import { Card } from '../models/Card';

export enum GameMode {
  ADDITION = 'ADDITION',
  MULTIPLICATION = 'MULTIPLICATION',
}

export enum GameState {
  INIT = 'INIT',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  FINISHED = 'FINISHED',
}

export enum CardPosition {
  TOP = 'top',
  BOTTOM_LEFT = 'bottomLeft',
  BOTTOM_RIGHT = 'bottomRight',
}

export interface CardGroupState {
  topCard: Card | null;
  bottomLeftCard: Card | null;
  bottomRightCard: Card | null;
  playerId: string | null;
}

export interface GameEvent {
  type:
    | 'GameStarted'
    | 'CardPlayed'
    | 'TurnEnded'
    | 'GameFinished'
    | 'GamePaused'
    | 'GameResumed'
    | 'CardsDrawn'
    | 'CardsReplaced'
    | 'InvalidPlayAttempted'
    | 'WildCardUsed';
  payload?: Record<string, unknown>;
}
