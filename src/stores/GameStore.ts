import { makeObservable, action } from 'mobx';
import { Game } from '../game/models/Game';
import { GameMode } from '../game/types';
import { Player } from '../game/models/Player';
import { CardManager } from './card/CardManager';
import { GameStatePersistence } from './persistence/GameStatePersistence';
import { ToastOptions } from '../utils/ToastManager';
import { findValidPlacements } from '../game/models/GameHelper/index';

export class GameStore extends CardManager {
  private static instance: GameStore | null = null;

  private constructor(game: Game) {
    super(game);
    makeObservable(this, {
      setToast: action,
      helpPlaceCards: action,
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

  setToast(toast: (options: ToastOptions) => void) {
    this.toastManager.setToast(toast);
  }

  /**
   * Help the current player by finding a valid card placement and setting it in the staging area
   * @returns true if a valid placement was found and set, false otherwise
   */
  helpPlaceCards(): boolean {
    const currentPlayer = this.currentPlayer;
    const cardGroup = this.game.getCardGroup();
    const playerHand = currentPlayer.getHand();

    // Find valid placements
    const suggestions = findValidPlacements(playerHand, cardGroup);

    if (suggestions.length === 0) {
      return false;
    }

    // Use the first suggestion
    const suggestion = suggestions[0];

    // Clear current selections
    this.selectedCards.clear();

    // Place cards according to the suggestion, but only stage cards from player's hand
    for (const [position, card] of suggestion.cards.entries()) {
      // Only stage the card if it's in the player's hand
      if (playerHand.includes(card)) {
        this.setSelectedCard(card, position);
      }
    }

    return true;
  }

  /**
   * Display an error message
   * @param message The error message to display
   */
  displayError(message: string): void {
    this.showError(message);
  }
}
