import { makeObservable, observable, action } from 'mobx';
import { Game } from '../../game/models/Game';
import { Card } from '../../game/models/Card';
import { CardPosition } from '../../game/types';
import { BaseGameManager } from '../base/BaseGameManager';

export class CardManager extends BaseGameManager {
  isWildcardModalOpen: boolean;
  selectedWildcard: Card | null;
  wildcardValue: number;

  constructor(game: Game) {
    super(game);
    this.isWildcardModalOpen = false;
    this.selectedWildcard = null;
    this.wildcardValue = 1;

    makeObservable(this, {
      isWildcardModalOpen: observable,
      selectedWildcard: observable,
      wildcardValue: observable,
      handleCardClick: action,
      handlePositionSelect: action,
      setSelectedCard: action,
      setWildcardValue: action,
      closeWildcardModal: action,
      setWildcardValueInput: action,
      setDraggedCard: action,
    });
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
        this.saveToLocalStorage();
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
      // 放置成功后清除拖拽状态
      this.draggedCard = null;
      this.draggedCardPosition = null;
      this.saveToLocalStorage();
    } catch (error) {
      if (error instanceof Error) {
        this.showError(error.message);
      } else {
        this.showError('game.errors.invalidCard');
      }
      console.error('Failed to stage card:', error);
    }
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
      // 放置成功后清除拖拽状态
      this.draggedCard = null;
      this.draggedCardPosition = null;
      this.saveToLocalStorage();
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
      this.isWildcardModalOpen = false;
      this.selectedWildcard = null;
      this.saveToLocalStorage();
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
    this.saveToLocalStorage();
  }

  setWildcardValueInput(value: number) {
    this.wildcardValue = value;
  }

  setDraggedCard(card: Card | null, position: CardPosition | null = null) {
    this.draggedCard = card;
    this.draggedCardPosition = position;
    this.saveToLocalStorage();
  }
}
