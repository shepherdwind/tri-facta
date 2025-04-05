import { Card } from '../Card';
import { CardPosition, GameMode } from '../../types';
import { CardPlacementSuggestion } from './types';
import { generateExplanation } from './utils';

interface CardPlacement {
  position1: CardPosition;
  position2: CardPosition;
  card1: Card;
  card2: Card;
}

export class TwoCardPlacementHelper {
  private readonly committedCards: Map<CardPosition, Card>;
  private readonly gameMode: GameMode;
  private readonly emptyPositions: CardPosition[];
  private suggestions: CardPlacementSuggestion[];

  constructor(
    committedCards: Map<CardPosition, Card>,
    gameMode: GameMode,
    emptyPositions: CardPosition[]
  ) {
    this.committedCards = committedCards;
    this.gameMode = gameMode;
    this.emptyPositions = emptyPositions;
    this.suggestions = [];
  }

  private createSuggestion(placement: CardPlacement): CardPlacementSuggestion {
    const cards = new Map<CardPosition, Card>(this.committedCards);
    const newCards = new Map<CardPosition, Card>();

    cards.set(placement.position1, placement.card1);
    newCards.set(placement.position1, placement.card1);
    cards.set(placement.position2, placement.card2);
    newCards.set(placement.position2, placement.card2);

    const explanation = generateExplanation(cards, this.gameMode);
    return { explanation, cards: newCards };
  }

  private isValidPlacement(position1: CardPosition, position2: CardPosition): boolean {
    return this.emptyPositions.includes(position1) && this.emptyPositions.includes(position2);
  }

  private findValidCardCombinations(
    playerHand: Card[],
    targetValue: number,
    position1: CardPosition,
    position2: CardPosition
  ): void {
    if (!this.isValidPlacement(position1, position2)) {
      return;
    }

    const validPairs = playerHand.flatMap((card1, i) =>
      playerHand.slice(i + 1).map((card2) => ({ card1, card2 }))
    );

    validPairs.forEach(({ card1, card2 }) => {
      const value1 = card1.getValue();
      const value2 = card2.getValue();

      if (value1 === null || value2 === null) return;

      const isValidOrder1 = value1 === value2 + targetValue;
      const isValidOrder2 = value2 === value1 + targetValue;

      if (isValidOrder1) {
        this.suggestions.push(this.createSuggestion({ position1, position2, card1, card2 }));
      }

      if (isValidOrder2) {
        this.suggestions.push(
          this.createSuggestion({ position1, position2, card1: card2, card2: card1 })
        );
      }
    });
  }

  private findValidCardCombinationsForTop(playerHand: Card[], topValue: number): void {
    const validPairs = playerHand.flatMap((card1, i) =>
      playerHand.slice(i + 1).map((card2) => ({ card1, card2 }))
    );

    validPairs.forEach(({ card1, card2 }) => {
      const value1 = card1.getValue();
      const value2 = card2.getValue();

      if (value1 === null || value2 === null) return;

      const isBottomPositionsValid = this.isValidPlacement(
        CardPosition.BOTTOM_LEFT,
        CardPosition.BOTTOM_RIGHT
      );
      const isSumEqualToTop = value1 + value2 === topValue;
      const isReverseSumEqualToTop = value2 + value1 === topValue;

      if (isSumEqualToTop && isBottomPositionsValid) {
        this.suggestions.push(
          this.createSuggestion({
            position1: CardPosition.BOTTOM_LEFT,
            position2: CardPosition.BOTTOM_RIGHT,
            card1,
            card2,
          })
        );
      }

      if (isReverseSumEqualToTop && isBottomPositionsValid) {
        this.suggestions.push(
          this.createSuggestion({
            position1: CardPosition.BOTTOM_LEFT,
            position2: CardPosition.BOTTOM_RIGHT,
            card1: card2,
            card2: card1,
          })
        );
      }
    });
  }

  private findValidCardCombinationsForBottomLeft(
    playerHand: Card[],
    bottomLeftValue: number
  ): void {
    const validPairs = playerHand.flatMap((card1, i) =>
      playerHand.slice(i + 1).map((card2) => ({ card1, card2 }))
    );

    validPairs.forEach(({ card1, card2 }) => {
      const value1 = card1.getValue();
      const value2 = card2.getValue();

      if (value1 === null || value2 === null) return;

      const isTopAndBottomRightValid = this.isValidPlacement(
        CardPosition.TOP,
        CardPosition.BOTTOM_RIGHT
      );
      const isDifferenceEqualToBottomLeft = value1 === value2 + bottomLeftValue;
      const isReverseDifferenceEqualToBottomLeft = value2 === value1 + bottomLeftValue;

      if (isDifferenceEqualToBottomLeft && isTopAndBottomRightValid) {
        this.suggestions.push(
          this.createSuggestion({
            position1: CardPosition.TOP,
            position2: CardPosition.BOTTOM_RIGHT,
            card1,
            card2,
          })
        );
      }

      if (isReverseDifferenceEqualToBottomLeft && isTopAndBottomRightValid) {
        this.suggestions.push(
          this.createSuggestion({
            position1: CardPosition.TOP,
            position2: CardPosition.BOTTOM_RIGHT,
            card1: card2,
            card2: card1,
          })
        );
      }
    });
  }

  public findTwoCardPlacements(playerHand: Card[]): CardPlacementSuggestion[] {
    const bottomRightCard = this.committedCards.get(CardPosition.BOTTOM_RIGHT);
    const topCard = this.committedCards.get(CardPosition.TOP);
    const bottomLeftCard = this.committedCards.get(CardPosition.BOTTOM_LEFT);

    if (!bottomRightCard && !topCard && !bottomLeftCard) return [];

    if (bottomRightCard) {
      const bottomRightValue = bottomRightCard.getValue();
      if (bottomRightValue !== null) {
        this.findValidCardCombinations(
          playerHand,
          bottomRightValue,
          CardPosition.TOP,
          CardPosition.BOTTOM_LEFT
        );
      }
    }

    if (topCard) {
      const topValue = topCard.getValue();
      if (topValue !== null) {
        this.findValidCardCombinationsForTop(playerHand, topValue);
      }
    }

    if (bottomLeftCard) {
      const bottomLeftValue = bottomLeftCard.getValue();
      if (bottomLeftValue !== null) {
        this.findValidCardCombinationsForBottomLeft(playerHand, bottomLeftValue);
      }
    }

    return this.suggestions;
  }
}

// Export a factory function for backward compatibility
export function tryTwoCardPlacements(
  playerHand: Card[],
  emptyPositions: CardPosition[],
  committedCards: Map<CardPosition, Card>,
  gameMode: GameMode,
  suggestions: CardPlacementSuggestion[]
): void {
  const helper = new TwoCardPlacementHelper(committedCards, gameMode, emptyPositions);
  const newSuggestions = helper.findTwoCardPlacements(playerHand);
  suggestions.push(...newSuggestions);
}
