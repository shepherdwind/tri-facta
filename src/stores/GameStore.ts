import { makeAutoObservable } from 'mobx';
import { Game } from '../game/models/Game';
import { Player } from '../game/models/Player';
import { Card } from '../game/models/Card';
import { CardPosition } from '../game/types';

export class GameStore {
  game: Game;
  currentPlayer: Player;
  selectedCards: Map<CardPosition, Card>;
  errorMessage: string | null;
  isWildcardModalOpen: boolean;
  selectedWildcard: Card | null;
  wildcardValue: number;

  constructor(game: Game) {
    this.game = game;
    this.currentPlayer = game.getCurrentPlayer();
    this.selectedCards = new Map();
    this.errorMessage = null;
    this.isWildcardModalOpen = false;
    this.selectedWildcard = null;
    this.wildcardValue = 1;

    makeAutoObservable(this);
  }

  drawCard() {
    try {
      this.game.drawCard(this.currentPlayer.getId());
      this.currentPlayer = this.game.getCurrentPlayer();
      this.errorMessage = null;
    } catch (error) {
      this.errorMessage = 'game.errors.deckEmpty';
      console.error('Failed to draw card:', error);
    }
  }

  playCards() {
    try {
      this.game.playCards(this.currentPlayer.getId());
      this.currentPlayer = this.game.getCurrentPlayer();
      this.selectedCards = new Map();
      this.errorMessage = null;
    } catch (error) {
      this.errorMessage = 'game.errors.invalidPlay';
      console.error('Failed to play cards:', error);
    }
  }

  endTurn() {
    this.game.endTurn();
    this.currentPlayer = this.game.getCurrentPlayer();
    this.selectedCards = new Map();
    this.errorMessage = null;
  }

  handleCardClick(card: Card, position: CardPosition) {
    if (this.currentPlayer.getId() !== this.game.getCurrentPlayer().getId()) {
      this.errorMessage = 'game.errors.notYourTurn';
      return;
    }

    try {
      if (card.getValue() === null) {
        this.selectedWildcard = card;
        this.isWildcardModalOpen = true;
        return;
      }

      this.game.stageCard(this.currentPlayer, card, position);
      this.selectedCards = new Map(this.game.getCurrentPlayer().getStagedCards());
      this.errorMessage = null;
    } catch (error) {
      this.errorMessage = 'game.errors.invalidCard';
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
    } catch (error) {
      this.errorMessage = 'game.errors.invalidWildcardValue';
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
}
