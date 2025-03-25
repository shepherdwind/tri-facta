import { GameState, GameAction } from '../types/game';
import { GameManager } from './GameManager';

const gameManager = new GameManager();

export function gameReducer(state: GameState, action: GameAction): GameState {
  return gameManager.reduce(state, action);
}
