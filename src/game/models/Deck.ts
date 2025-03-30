import { Card } from './Card';

export class Deck {
  private cards: Card[];

  constructor() {
    this.cards = this.createDeck();
    this.shuffle();
  }

  private createDeck(): Card[] {
    const cards: Card[] = [];

    // Add number cards (1-20, each number appears 2 times)
    for (let i = 1; i <= 20; i++) {
      for (let j = 0; j < 2; j++) {
        cards.push(new Card(i));
      }
    }

    // Add wild cards (2 wild cards)
    for (let i = 0; i < 2; i++) {
      cards.push(new Card(0, true));
    }

    return cards;
  }

  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  draw(count: number): Card[] {
    if (count === 0) {
      return [];
    }

    if (count > this.cards.length) {
      throw new Error('Not enough cards in deck');
    }

    return this.cards.splice(0, count);
  }

  isEmpty(): boolean {
    return this.cards.length === 0;
  }

  reset(): void {
    this.cards = this.createDeck();
    this.shuffle();
  }

  getCards(): Card[] {
    return [...this.cards];
  }
}
