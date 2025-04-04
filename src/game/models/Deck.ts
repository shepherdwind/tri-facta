import { Card } from './Card';
import { DeckJSON } from '../types/serialization';
import { GameMode } from '../types';

export class Deck {
  private cards: Card[];
  private gameMode: GameMode;

  constructor(gameMode: GameMode = GameMode.ADDITION) {
    this.cards = [];
    this.gameMode = gameMode;
    this.initialize();
  }

  private initialize(): void {
    if (this.gameMode === GameMode.ADDITION) {
      this.initializeAdditionMode();
    } else {
      this.initializeMultiplicationMode();
    }

    // Add wildcards (2 cards for addition mode, 8 cards for multiplication mode)
    const wildcardCount = this.gameMode === GameMode.ADDITION ? 2 : 6;
    for (let i = 0; i < wildcardCount; i++) {
      this.cards.push(new Card(null));
    }
  }

  private initializeAdditionMode(): void {
    // Add number cards (1-20, each twice) for addition mode
    for (let i = 1; i <= 20; i++) {
      for (let j = 0; j < 2; j++) {
        this.cards.push(new Card(i));
      }
    }
  }

  private initializeMultiplicationMode(): void {
    // For multiplication mode, use a carefully selected set of numbers
    // with more repetitions of smaller numbers to make equations easier to form

    // Small numbers (1-6) appear 4 times each - these are the building blocks
    const smallNumbers = [1, 2, 3, 4, 5, 6];
    for (const num of smallNumbers) {
      for (let j = 0; j < 5; j++) {
        this.cards.push(new Card(num));
      }
    }

    // Medium numbers (8-12) appear 2 times each - these are common products
    const mediumNumbers = [8, 9, 10, 12];
    for (const num of mediumNumbers) {
      for (let j = 0; j < 3; j++) {
        this.cards.push(new Card(num));
      }
    }

    // Larger numbers (15-36) appear 1 time each - these are special targets
    const largeNumbers = [15, 16, 18, 20, 24, 25, 30, 36];
    for (const num of largeNumbers) {
      this.cards.push(new Card(num));
    }
  }

  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  draw(count: number): Card[] {
    if (count > this.cards.length) {
      throw new Error('Not enough cards in deck');
    }
    return this.cards.splice(0, count);
  }

  isEmpty(): boolean {
    return this.cards.length === 0;
  }

  getRemainingCards(): number {
    return this.cards.length;
  }

  getCards(): Card[] {
    return this.cards;
  }

  reset(): void {
    this.cards = [];
    this.initialize();
    this.shuffle();
  }

  toJSON(): DeckJSON {
    return {
      cards: this.cards.map((card) => card.toJSON()),
      gameMode: this.gameMode,
    };
  }

  static fromJSON(json: DeckJSON): Deck {
    const deck = new Deck(json.gameMode);
    deck.cards = json.cards.map((cardJson) => Card.fromJSON(cardJson));
    return deck;
  }
}
