import { Card } from '../models/Card';
import { CardGroup } from '../models/CardGroup';
import { GameMode, CardPosition } from '../types';

export class GameRuleService {
  validateCardGroup(cards: Card[], mode: GameMode): boolean {
    if (cards.length !== 3) {
      return false;
    }

    const [, bottomLeft, bottomRight] = cards;
    const bottomLeftValue = bottomLeft.getValue();
    const bottomRightValue = bottomRight.getValue();
    const topValue = cards[0].getValue();

    if (bottomLeftValue === null || bottomRightValue === null || topValue === null) {
      return false;
    }

    if (mode === GameMode.ADDITION) {
      return bottomLeftValue + bottomRightValue === topValue;
    } else {
      return bottomLeftValue * bottomRightValue === topValue;
    }
  }

  calculateResult(cards: Card[], mode: GameMode): number {
    if (cards.length !== 3) {
      throw new Error('Invalid number of cards');
    }

    const [, bottomLeft, bottomRight] = cards;
    const bottomLeftValue = bottomLeft.getValue();
    const bottomRightValue = bottomRight.getValue();

    if (bottomLeftValue === null || bottomRightValue === null) {
      throw new Error('Invalid card values');
    }

    if (mode === GameMode.ADDITION) {
      return bottomLeftValue + bottomRightValue;
    } else {
      return bottomLeftValue * bottomRightValue;
    }
  }

  isValidPlay(_lastPlay: CardGroup, currentPlay: CardGroup): boolean {
    // In this game, any valid card combination is allowed
    // The only requirement is that the mathematical relationship must be correct
    const cards = [
      currentPlay.getCard(CardPosition.TOP),
      currentPlay.getCard(CardPosition.BOTTOM_LEFT),
      currentPlay.getCard(CardPosition.BOTTOM_RIGHT),
    ].filter((card): card is Card => card !== null);

    return this.validateCardGroup(cards, GameMode.ADDITION);
  }
}
