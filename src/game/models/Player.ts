import { Card } from './Card';
import { CardPosition } from '../types';
import { CardGroup } from './CardGroup';

export class Player {
  private id: string;
  private name: string;
  private hand: Card[];
  private isCurrentTurn: boolean;
  private stagingArea: Map<CardPosition, Card>;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.hand = [];
    this.isCurrentTurn = false;
    this.stagingArea = new Map();
  }

  addCard(card: Card): void {
    this.hand.push(card);
  }

  stageCard(card: Card, position: CardPosition): void {
    if (!this.hasCard(card)) {
      throw new Error('Player does not have this card');
    }
    this.stagingArea.set(position, card);
    this.hand = this.hand.filter((c) => c !== card);
  }

  unstageCard(position: CardPosition): void {
    const card = this.stagingArea.get(position);
    if (card) {
      this.hand.push(card);
      this.stagingArea.delete(position);
    }
  }

  clearStagingArea(): void {
    for (const [, card] of this.stagingArea) {
      this.hand.push(card);
    }
    this.stagingArea.clear();
  }

  commitToCardGroup(cardGroup: CardGroup): void {
    cardGroup.placeCards(this.getStagedCards(), this.id);
    cardGroup.commit();
    this.stagingArea.clear();
  }

  getStagedCards(): Map<CardPosition, Card> {
    return new Map(this.stagingArea);
  }

  hasCard(card: Card): boolean {
    return this.hand.includes(card) || Array.from(this.stagingArea.values()).includes(card);
  }

  getHand(): Card[] {
    return [...this.hand];
  }

  setCurrentTurn(isCurrent: boolean): void {
    this.isCurrentTurn = isCurrent;
  }

  hasWon(): boolean {
    return this.hand.length === 0 && this.stagingArea.size === 0;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  isCurrentPlayer(): boolean {
    return this.isCurrentTurn;
  }

  clearHand(): void {
    this.hand = [];
  }

  discardStagedCards(): void {
    this.stagingArea.clear();
  }
}
