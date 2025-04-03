import { makeObservable, action } from 'mobx';
import { Game } from '../game/models/Game';
import { GameMode } from '../game/types';
import { Player } from '../game/models/Player';
import { CardManager } from './card/CardManager';
import { UseToastOptions } from '@chakra-ui/react';
import { GameStatePersistence } from './persistence/GameStatePersistence';

export class GameStore extends CardManager {
  private static instance: GameStore | null = null;

  private constructor(game: Game) {
    super(game);
    makeObservable(this, {
      setToast: action,
    });
  }

  public static getInstance(): GameStore {
    if (!GameStore.instance) {
      const gameStatePersistence = GameStatePersistence.getInstance();
      const storedState = gameStatePersistence.loadState();

      if (storedState) {
        const game = Game.fromJSON(storedState.game);
        GameStore.instance = new GameStore(game);
        GameStore.instance.hasDrawnCard = storedState.hasDrawnCard;
      } else {
        const game = new Game(GameMode.ADDITION, [
          new Player('player1', 'Player 1'),
          new Player('player2', 'Player 2'),
        ]);
        GameStore.instance = new GameStore(game);
        game.start();
        GameStore.instance.saveToLocalStorage();
      }
    }
    return GameStore.instance;
  }

  public static initialize(game: Game): void {
    if (GameStore.instance) {
      throw new Error('GameStore has already been initialized');
    }
    GameStore.instance = new GameStore(game);
    game.start();
    GameStore.instance.saveToLocalStorage();
  }

  public static reset() {
    GameStore.instance = null;
    GameStatePersistence.getInstance().clearState();
  }

  setToast(toast: (options: UseToastOptions) => void) {
    this.toastManager.setToast(toast);
  }
}
