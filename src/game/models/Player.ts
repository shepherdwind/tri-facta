import { Card } from './Card';
import { CardPosition } from '../types';
import { CardGroup } from './CardGroup';
import { makeAutoObservable } from 'mobx';
import { PlayerJSON } from '../types/serialization';

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
    makeAutoObservable(this);
  }

  addCard(card: Card): void {
    this.hand.push(card);
  }

  removeCard(card: Card): void {
    const index = this.hand.findIndex((c) => c === card);
    if (index !== -1) {
      this.hand.splice(index, 1);
    }
  }

  stageCard(card: Card, position: CardPosition): void {
    if (!this.hasCard(card)) {
      throw new Error('Player does not have this card');
    }
    if (this.stagingArea.has(position)) {
      this.unstageCard(position);
    }
    this.stagingArea.set(position, card);
  }

  unstageCard(position: CardPosition): void {
    this.stagingArea.delete(position);
  }

  clearStagingArea(): void {
    this.stagingArea.clear();
  }

  commitToCardGroup(cardGroup: CardGroup): void {
    cardGroup.placeCards(this.getStagedCards(), this.id);
    cardGroup.commit();

    // Remove cards from hand
    for (const card of this.stagingArea.values()) {
      this.removeCard(card);
    }

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
    return this.hand.length === 0;
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

  discardStagedCards(): void {
    for (const card of this.stagingArea.values()) {
      this.removeCard(card);
    }
    this.stagingArea.clear();
  }

  setWildcardValue(card: Card, value: number): void {
    if (!card.isWildCard()) {
      throw new Error('Cannot set wild value for non-wild card');
    }
    card.setValue(value);
  }

  clearHand(): void {
    this.hand = [];
  }

  toJSON(): PlayerJSON {
    return {
      id: this.id,
      name: this.name,
      hand: this.hand.map((card) => card.toJSON()),
      isCurrentTurn: this.isCurrentTurn,
      stagingArea: Array.from(this.stagingArea.entries()).map(([position, card]) => ({
        position,
        card: card.toJSON(),
      })),
    };
  }

  private findMatchingCard(cardToFind: Card): Card | undefined {
    return this.hand.find(
      (card) =>
        card.getValue() === cardToFind.getValue() && card.isWildCard() === cardToFind.isWildCard()
    );
  }

  static fromJSON(json: PlayerJSON): Player {
    const player = new Player(json.id, json.name);
    player.isCurrentTurn = json.isCurrentTurn;

    // Restore hand first
    player.hand = json.hand.map((cardJson) => Card.fromJSON(cardJson));

    // Restore staging area using references from hand
    for (const { position, card: cardJson } of json.stagingArea) {
      const card = Card.fromJSON(cardJson);
      const matchingCard = player.findMatchingCard(card);
      if (matchingCard) {
        player.stagingArea.set(position, matchingCard);
      }
    }

    return player;
  }
}
