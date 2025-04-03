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
  private wildcardValues: Map<Card, number>;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.hand = [];
    this.isCurrentTurn = false;
    this.stagingArea = new Map();
    this.wildcardValues = new Map();
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
    if (!card.isWildcard) {
      throw new Error('Card is not a wildcard');
    }
    if (value < 1 || value > 20) {
      throw new Error('Wildcard value must be between 1 and 20');
    }
    this.wildcardValues.set(card, value);
  }

  getWildcardValue(card: Card): number | undefined {
    return this.wildcardValues.get(card);
  }

  clearHand(): void {
    this.hand = [];
    this.wildcardValues.clear();
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
      wildcardValues: Array.from(this.wildcardValues.entries()).map(([card, value]) => ({
        card: card.toJSON(),
        value,
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

    // Restore wildcard values using references from hand
    for (const { card: cardJson, value } of json.wildcardValues) {
      const card = Card.fromJSON(cardJson);
      const matchingCard = player.findMatchingCard(card);
      if (matchingCard) {
        player.wildcardValues.set(matchingCard, value);
      }
    }

    return player;
  }
}
