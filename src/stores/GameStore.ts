import { makeAutoObservable } from 'mobx';
import { Game } from '../game/models/Game';
import { Player } from '../game/models/Player';
import { Card } from '../game/models/Card';
import { CardPosition, GameMode } from '../game/types';

export class GameStore {
  private static instance: GameStore | null = null;

  game: Game;
  currentPlayer: Player;
  selectedCards: Map<CardPosition, Card>;
  isWildcardModalOpen: boolean;
  selectedWildcard: Card | null;
  wildcardValue: number;
  hasDrawnCard: boolean;
  draggedCard: Card | null;
  draggedCardPosition: CardPosition | null;
  toast: any;
  isVictoryAnimationPlaying: boolean;
  winner: Player | null;

  private constructor(game: Game) {
    this.game = game;
    this.currentPlayer = game.getCurrentPlayer();
    this.selectedCards = new Map();
    this.isWildcardModalOpen = false;
    this.selectedWildcard = null;
    this.wildcardValue = 1;
    this.hasDrawnCard = false;
    this.draggedCard = null;
    this.draggedCardPosition = null;
    this.toast = null;
    this.isVictoryAnimationPlaying = false;
    this.winner = null;

    makeAutoObservable(this);
  }

  public static getInstance(): GameStore {
    if (!GameStore.instance) {
      const game = new Game(GameMode.ADDITION, [
        new Player('player1', 'Player 1'),
        new Player('player2', 'Player 2'),
      ]);
      GameStore.instance = new GameStore(game);
      game.start();
    }
    return GameStore.instance;
  }

  public static initialize(game: Game): void {
    if (GameStore.instance) {
      throw new Error('GameStore has already been initialized');
    }
    GameStore.instance = new GameStore(game);
    game.start();
  }

  public static reset() {
    GameStore.instance = null;
  }

  setToast(toast: any) {
    this.toast = toast;
  }

  showError(message: string) {
    if (this.toast) {
      this.toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
        variant: 'solid',
      });
    }
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
      this.currentPlayer = this.game.getCurrentPlayer();
      this.hasDrawnCard = true;
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
      this.currentPlayer = this.game.getCurrentPlayer();
      this.selectedCards = new Map();
      this.hasDrawnCard = false;

      // Check for winner
      if (this.currentPlayer.hasWon()) {
        this.winner = this.currentPlayer;
        this.isVictoryAnimationPlaying = true;
        // Show victory toast
        if (this.toast) {
          this.toast({
            title: 'Victory!',
            description: `${this.currentPlayer.getName()} has won the game!`,
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top',
            variant: 'solid',
          });
        }
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
    this.currentPlayer = this.game.getCurrentPlayer();
    this.selectedCards = new Map();
    this.hasDrawnCard = false;
  }

  handleCardClick(card: Card) {
    if (this.currentPlayer.getId() !== this.game.getCurrentPlayer().getId()) {
      this.showError('game.errors.notYourTurn');
      return;
    }

    // 检查卡片是否已经被选中
    for (const [position, selectedCard] of this.selectedCards.entries()) {
      if (selectedCard === card) {
        // 如果卡片已经被选中，则取消选中
        this.game.getCurrentPlayer().unstageCard(position);
        this.selectedCards = new Map(this.game.getCurrentPlayer().getStagedCards());
        return;
      }
    }

    // 如果卡片未被选中，则显示万能牌选择框或位置选择菜单
    if (card.getValue() === null) {
      this.selectedWildcard = card;
      this.isWildcardModalOpen = true;
    }
  }

  handlePositionSelect(card: Card, position: CardPosition) {
    if (this.currentPlayer.getId() !== this.game.getCurrentPlayer().getId()) {
      this.showError('game.errors.notYourTurn');
      return;
    }

    // 如果卡片正在被拖拽，检查是否放在正确的位置
    if (this.draggedCard && this.draggedCardPosition) {
      if (position !== this.draggedCardPosition) {
        this.showError('game.errors.invalidDropPosition');
        return;
      }
    }

    try {
      this.game.stageCard(this.currentPlayer, card, position);
      this.selectedCards = new Map(this.game.getCurrentPlayer().getStagedCards());
      // 放置成功后清除拖拽状态
      this.draggedCard = null;
      this.draggedCardPosition = null;
    } catch (error) {
      if (error instanceof Error) {
        this.showError(error.message);
      } else {
        this.showError('game.errors.invalidCard');
      }
      console.error('Failed to stage card:', error);
    }
  }

  setWildcardValue() {
    if (!this.selectedWildcard) return;

    try {
      this.currentPlayer.setWildcardValue(this.selectedWildcard, this.wildcardValue);
      this.selectedWildcard.setValue(this.wildcardValue);
      this.selectedCards = new Map(this.currentPlayer.getStagedCards());
      this.isWildcardModalOpen = false;
      this.selectedWildcard = null;
    } catch (error) {
      if (error instanceof Error) {
        this.showError(error.message);
      } else {
        this.showError('game.errors.invalidWildcardValue');
      }
      console.error('Failed to set wildcard value:', error);
    }
  }

  closeWildcardModal() {
    this.isWildcardModalOpen = false;
    this.selectedWildcard = null;
  }

  setWildcardValueInput(value: number) {
    this.wildcardValue = value;
  }

  setSelectedCard(card: Card, position: CardPosition) {
    if (this.currentPlayer.getId() !== this.game.getCurrentPlayer().getId()) {
      this.showError('game.errors.notYourTurn');
      return;
    }

    // 如果卡片正在被拖拽，检查是否放在正确的位置
    if (this.draggedCard && this.draggedCardPosition) {
      if (position !== this.draggedCardPosition) {
        this.showError('game.errors.invalidDropPosition');
        return;
      }
    }

    try {
      this.game.stageCard(this.currentPlayer, card, position);
      this.selectedCards = new Map(this.game.getCurrentPlayer().getStagedCards());
      // 放置成功后清除拖拽状态
      this.draggedCard = null;
      this.draggedCardPosition = null;
    } catch (error) {
      if (error instanceof Error) {
        this.showError(error.message);
      } else {
        this.showError('game.errors.invalidCard');
      }
      console.error('Failed to stage card:', error);
    }
  }

  setDraggedCard(card: Card | null, position: CardPosition | null = null) {
    this.draggedCard = card;
    this.draggedCardPosition = position;
  }

  endVictoryAnimation() {
    this.isVictoryAnimationPlaying = false;
  }
}
