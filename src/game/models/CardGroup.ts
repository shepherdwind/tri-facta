import { Card } from './Card';
import { CardPosition, CardGroupState, GameMode } from '../types';

export class CardGroup {
  // Working area stores cards that are currently being placed
  private workingArea: CardGroupState;
  // Committed state stores cards that have been validated and committed
  private committedState: CardGroupState;
  private gameMode: GameMode;

  constructor(gameMode: GameMode) {
    this.workingArea = {
      topCard: null,
      bottomLeftCard: null,
      bottomRightCard: null,
      playerId: null,
    };
    this.committedState = {
      topCard: null,
      bottomLeftCard: null,
      bottomRightCard: null,
      playerId: null,
    };
    this.gameMode = gameMode;
  }

  private getCardPropertyName(
    position: CardPosition
  ): 'topCard' | 'bottomLeftCard' | 'bottomRightCard' {
    switch (position) {
      case CardPosition.TOP:
        return 'topCard';
      case CardPosition.BOTTOM_LEFT:
        return 'bottomLeftCard';
      case CardPosition.BOTTOM_RIGHT:
        return 'bottomRightCard';
      default:
        throw new Error('Invalid card position');
    }
  }

  /**
   * Check if cards can be placed in the working area
   * Only checks working area positions, allowing placement in committed positions
   */
  canPlaceCards(cards: Map<CardPosition, Card>): boolean {
    if (!this.arePositionsAvailable(cards)) {
      return false;
    }

    const tempWorkingArea = this.createTemporaryWorkingArea(cards);
    return this.isValidEquation(tempWorkingArea);
  }

  /**
   * Check if all positions to be placed are empty in working area
   */
  private arePositionsAvailable(cards: Map<CardPosition, Card>): boolean {
    for (const [position] of cards) {
      const propertyName = this.getCardPropertyName(position);
      if (this.workingArea[propertyName] !== null) {
        return false;
      }
    }
    return true;
  }

  /**
   * Create a temporary working area with committed top card and new cards
   */
  private createTemporaryWorkingArea(cards: Map<CardPosition, Card>): CardGroupState {
    const tempWorkingArea = { ...this.workingArea };
    if (this.committedState.topCard !== null) {
      tempWorkingArea.topCard = this.committedState.topCard;
    }

    for (const [position, card] of cards) {
      const propertyName = this.getCardPropertyName(position);
      tempWorkingArea[propertyName] = card;
    }

    return tempWorkingArea;
  }

  /**
   * Check if the equation is valid in the given working area
   */
  private isValidEquation(workingArea: CardGroupState): boolean {
    if (!this.hasAllCards(workingArea)) {
      return true;
    }

    const cardsArray = [
      workingArea.topCard!,
      workingArea.bottomLeftCard!,
      workingArea.bottomRightCard!,
    ];

    if (this.hasWildCard(cardsArray)) {
      return true;
    }

    return this.isValidMathEquation(workingArea);
  }

  /**
   * Check if all three positions have cards
   */
  private hasAllCards(workingArea: CardGroupState): boolean {
    return (
      workingArea.topCard !== null &&
      workingArea.bottomLeftCard !== null &&
      workingArea.bottomRightCard !== null
    );
  }

  /**
   * Check if any of the cards is a wild card
   */
  private hasWildCard(cards: Card[]): boolean {
    return cards.some((card) => card.isWildCard());
  }

  /**
   * Check if the mathematical equation is valid
   */
  private isValidMathEquation(workingArea: CardGroupState): boolean {
    const top = workingArea.topCard!.getValue();
    const bottomLeft = workingArea.bottomLeftCard!.getValue();
    const bottomRight = workingArea.bottomRightCard!.getValue();

    if (this.gameMode === GameMode.ADDITION) {
      return top === bottomLeft + bottomRight;
    } else {
      return top === bottomLeft * bottomRight;
    }
  }

  /**
   * Place cards in the working area
   * Throws error if any position in working area is occupied
   */
  placeCards(cards: Map<CardPosition, Card>, playerId: string): void {
    if (!this.canPlaceCards(cards)) {
      throw new Error('Invalid card combination');
    }

    // If there's a committed state, copy the top card to working area
    if (this.committedState.topCard) {
      this.workingArea.topCard = this.committedState.topCard;
    }

    // Place cards in working area
    for (const [position, card] of cards) {
      switch (position) {
        case CardPosition.TOP:
          this.workingArea.topCard = card;
          break;
        case CardPosition.BOTTOM_LEFT:
          this.workingArea.bottomLeftCard = card;
          break;
        case CardPosition.BOTTOM_RIGHT:
          this.workingArea.bottomRightCard = card;
          break;
      }
    }

    this.workingArea.playerId = playerId;
  }

  /**
   * Commit the current working area to committed state
   * Throws error if working area is incomplete
   */
  commit(): void {
    if (!this.isComplete()) {
      throw new Error('Cannot commit incomplete card group');
    }
    this.committedState = { ...this.workingArea };
    this.clearWorkingArea();
  }

  /**
   * Get card at specified position
   * Returns working area card if available, otherwise returns committed card
   */
  getCard(position: CardPosition): Card | null {
    const propertyName = this.getCardPropertyName(position);
    return this.workingArea[propertyName] || this.committedState[propertyName];
  }

  /**
   * Check if working area has all positions filled
   */
  isComplete(): boolean {
    return (
      this.workingArea.topCard !== null &&
      this.workingArea.bottomLeftCard !== null &&
      this.workingArea.bottomRightCard !== null
    );
  }

  /**
   * Validate the current working area against the game mode
   * Returns false if working area is incomplete
   */
  validate(): boolean {
    if (!this.isComplete()) {
      return false;
    }

    const top = this.workingArea.topCard!.getValue();
    const bottomLeft = this.workingArea.bottomLeftCard!.getValue();
    const bottomRight = this.workingArea.bottomRightCard!.getValue();

    if (this.gameMode === GameMode.ADDITION) {
      return top === bottomLeft + bottomRight;
    } else {
      return top === bottomLeft * bottomRight;
    }
  }

  /**
   * Get the current player ID
   * Returns working area player ID if available, otherwise returns committed player ID
   */
  getPlayerId(): string | null {
    return this.workingArea.playerId || this.committedState.playerId;
  }

  /**
   * Clear the working area
   */
  private clearWorkingArea(): void {
    this.workingArea = {
      topCard: null,
      bottomLeftCard: null,
      bottomRightCard: null,
      playerId: null,
    };
  }
}
