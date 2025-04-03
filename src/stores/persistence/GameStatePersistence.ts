import { GameJSON } from '../../game/types/serialization';

const STORAGE_KEY = 'game_state';

interface StoredGameState {
  game: GameJSON;
  hasDrawnCard: boolean;
}

export class GameStatePersistence {
  private static instance: GameStatePersistence | null = null;

  private constructor() {}

  public static getInstance(): GameStatePersistence {
    if (!GameStatePersistence.instance) {
      GameStatePersistence.instance = new GameStatePersistence();
    }
    return GameStatePersistence.instance;
  }

  public saveState(game: GameJSON, hasDrawnCard: boolean): void {
    const state: StoredGameState = {
      game,
      hasDrawnCard,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  public loadState(): StoredGameState | null {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  }

  public clearState(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
