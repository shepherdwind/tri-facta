import { Card } from './Card';
import { DeckJSON } from '../types/serialization';

export class Deck {
  private cards: Card[];

  constructor() {
    this.cards = [];
    this.initialize();
  }

  private initialize(): void {
    // Add number cards (1-20, each twice)
    for (let i = 1; i <= 20; i++) {
      for (let j = 0; j < 2; j++) {
        this.cards.push(new Card(i));
      }
    }

    // Add wildcards (2 cards)
    for (let i = 0; i < 2; i++) {
      this.cards.push(new Card(null));
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
    };
  }

  static fromJSON(json: DeckJSON): Deck {
    const deck = new Deck();
    deck.cards = json.cards.map((cardJson) => Card.fromJSON(cardJson));
    return deck;
  }
}
