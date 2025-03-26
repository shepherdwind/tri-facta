import { Card } from '../../types/game';

export class DeckValidator {
  canDrawCard(deck: Card[]): boolean {
    return deck.length > 0;
  }
}
