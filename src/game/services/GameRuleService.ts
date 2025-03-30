import { Card } from '../models/Card';
import { CardGroup } from '../models/CardGroup';
import { GameMode } from '../types';

export class GameRuleService {
  validateCardGroup(cards: Card[], mode: GameMode): boolean {
    if (cards.length !== 3) {
      return false;
    }

    const [, bottomLeft, bottomRight] = cards;
    const bottomLeftValue = bottomLeft.getValue();
    const bottomRightValue = bottomRight.getValue();

    if (mode === GameMode.ADDITION) {
      return bottomLeftValue + bottomRightValue === cards[0].getValue();
    } else {
      return bottomLeftValue * bottomRightValue === cards[0].getValue();
    }
  }

  calculateResult(cards: Card[], mode: GameMode): number {
    if (cards.length !== 3) {
      throw new Error('Invalid number of cards');
    }

    const [, bottomLeft, bottomRight] = cards;
    const bottomLeftValue = bottomLeft.getValue();
    const bottomRightValue = bottomRight.getValue();

    if (mode === GameMode.ADDITION) {
      return bottomLeftValue + bottomRightValue;
    } else {
      return bottomLeftValue * bottomRightValue;
    }
  }

  isValidPlay(lastPlay: CardGroup, currentPlay: CardGroup): boolean {
    // In this game, any valid card combination is allowed
    // The only requirement is that the mathematical relationship must be correct
    return currentPlay.validate(GameMode.ADDITION); // Default to addition mode for now
  }
}
