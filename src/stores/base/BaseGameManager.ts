import { makeObservable, observable, action, computed } from 'mobx';
import { Game } from '../../game/models/Game';
import { Player } from '../../game/models/Player';
import { Card } from '../../game/models/Card';
import { CardPosition } from '../../game/types';
import { GameStatePersistence } from '../persistence/GameStatePersistence';
import { ToastManager } from '../../utils/ToastManager';

export class BaseGameManager {
  game: Game;
  protected gameStatePersistence: GameStatePersistence;
  protected toastManager: ToastManager;
  protected hasDrawnCard: boolean;
  protected draggedCard: Card | null;
  protected draggedCardPosition: CardPosition | null;
  protected isVictoryAnimationPlaying: boolean;
  protected winner: Player | null;

  constructor(game: Game) {
    this.game = game;
    this.hasDrawnCard = false;
    this.draggedCard = null;
    this.draggedCardPosition = null;
    this.isVictoryAnimationPlaying = false;
    this.winner = null;

    this.gameStatePersistence = GameStatePersistence.getInstance();
    this.toastManager = ToastManager.getInstance();

    makeObservable<
      BaseGameManager,
      | 'hasDrawnCard'
      | 'draggedCard'
      | 'draggedCardPosition'
      | 'isVictoryAnimationPlaying'
      | 'winner'
      | 'saveToLocalStorage'
      | 'showError'
      | 'showSuccess'
      | 'currentPlayer'
      | 'selectedCards'
      | 'canDrawCard'
      | 'canEndTurn'
      | 'getTriFactaCard'
      | 'drawCard'
      | 'playCards'
      | 'endTurn'
      | 'endVictoryAnimation'
    >(this, {
      hasDrawnCard: observable,
      draggedCard: observable,
      draggedCardPosition: observable,
      isVictoryAnimationPlaying: observable,
      winner: observable,
      saveToLocalStorage: action,
      showError: action,
      showSuccess: action,
      currentPlayer: computed,
      selectedCards: computed,
      canDrawCard: computed,
      canEndTurn: computed,
      getTriFactaCard: action,
      drawCard: action,
      playCards: action,
      endTurn: action,
      endVictoryAnimation: action,
    });
  }

  protected saveToLocalStorage() {
    this.gameStatePersistence.saveState(this.game.toJSON(), this.hasDrawnCard);
  }

  protected showError(message: string) {
    this.toastManager.showError(message);
  }

  protected showSuccess(message: string) {
    this.toastManager.showSuccess(message);
  }

  get currentPlayer(): Player {
    return this.game.getCurrentPlayer();
  }

  get selectedCards(): Map<CardPosition, Card> {
    return this.game.getCurrentPlayer().getStagedCards();
  }

  get canDrawCard(): boolean {
    return !this.hasDrawnCard;
  }

  get canEndTurn(): boolean {
    return this.hasDrawnCard;
  }

  getTriFactaCard() {
    return this.game.getTriFactaCard();
  }

  drawCard() {
    try {
      if (this.hasDrawnCard) {
        this.showError('game.errors.alreadyDrawn');
        return;
      }
      this.game.drawCard(this.currentPlayer.getId());
      this.hasDrawnCard = true;
      this.saveToLocalStorage();
    } catch (error) {
      this.showError('game.errors.deckEmpty');
      console.error('Failed to draw card:', error);
    }
  }

  playCards() {
    try {
      if (this.selectedCards.size < 2) {
        this.showError('game.errors.minimumCards');
        return;
      }
      this.game.playCards(this.currentPlayer.getId());
      this.hasDrawnCard = false;
      this.saveToLocalStorage();

      if (this.currentPlayer.hasWon()) {
        this.winner = this.currentPlayer;
        this.isVictoryAnimationPlaying = true;
        this.showSuccess(`${this.currentPlayer.getName()} has won the game!`);
        this.saveToLocalStorage();
      }
    } catch (error) {
      this.showError('game.errors.invalidPlay');
      console.error('Failed to play cards:', error);
    }
  }

  endTurn() {
    if (!this.hasDrawnCard) {
      this.showError('game.errors.mustDrawFirst');
      return;
    }
    this.game.endTurn();
    this.hasDrawnCard = false;
    this.saveToLocalStorage();
  }

  endVictoryAnimation() {
    this.isVictoryAnimationPlaying = false;
    this.saveToLocalStorage();
  }

  getDraggedCard(): Card | null {
    return this.draggedCard;
  }

  setDraggedCard(card: Card | null) {
    this.draggedCard = card;
  }
}
