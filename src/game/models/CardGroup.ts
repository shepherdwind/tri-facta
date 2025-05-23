import { Card } from './Card';
import { CardPosition, CardGroupState, GameMode } from '../types';
import { CardGroupJSON } from '../types/serialization';

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

    // Copy all committed cards to temporary working area
    if (this.committedState.topCard !== null) {
      tempWorkingArea.topCard = this.committedState.topCard;
    }
    if (this.committedState.bottomLeftCard !== null) {
      tempWorkingArea.bottomLeftCard = this.committedState.bottomLeftCard;
    }
    if (this.committedState.bottomRightCard !== null) {
      tempWorkingArea.bottomRightCard = this.committedState.bottomRightCard;
    }

    // Place new cards in the temporary working area
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
   * Check if the mathematical equation is valid
   */
  private isValidMathEquation(workingArea: CardGroupState): boolean {
    const top = workingArea.topCard?.getValue();
    const bottomLeft = workingArea.bottomLeftCard?.getValue();
    const bottomRight = workingArea.bottomRightCard?.getValue();

    if (top === null || bottomLeft === null || bottomRight === null) {
      return false;
    }

    // At this point, TypeScript knows these values are not null
    const topValue = top as number;
    const bottomLeftValue = bottomLeft as number;
    const bottomRightValue = bottomRight as number;

    if (this.gameMode === GameMode.ADDITION) {
      return topValue === bottomLeftValue + bottomRightValue;
    } else {
      return topValue === bottomLeftValue * bottomRightValue;
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

    // Copy all committed cards to working area
    if (this.committedState.topCard !== null) {
      this.workingArea.topCard = this.committedState.topCard;
    }
    if (this.committedState.bottomLeftCard !== null) {
      this.workingArea.bottomLeftCard = this.committedState.bottomLeftCard;
    }
    if (this.committedState.bottomRightCard !== null) {
      this.workingArea.bottomRightCard = this.committedState.bottomRightCard;
    }

    // Place new cards in working area
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

    const top = this.workingArea.topCard?.getValue();
    const bottomLeft = this.workingArea.bottomLeftCard?.getValue();
    const bottomRight = this.workingArea.bottomRightCard?.getValue();

    if (top === null || bottomLeft === null || bottomRight === null) {
      return false;
    }

    // At this point, TypeScript knows these values are not null
    const topValue = top as number;
    const bottomLeftValue = bottomLeft as number;
    const bottomRightValue = bottomRight as number;

    if (this.gameMode === GameMode.ADDITION) {
      return topValue === bottomLeftValue + bottomRightValue;
    } else {
      return topValue === bottomLeftValue * bottomRightValue;
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

  /**
   * Get the committed state of the card group
   */
  getCommittedState(): CardGroupState {
    return { ...this.committedState };
  }

  /**
   * Get the game mode of the card group
   */
  getGameMode(): GameMode {
    return this.gameMode;
  }

  toJSON(): CardGroupJSON {
    return {
      workingArea: {
        topCard: this.workingArea.topCard?.toJSON() || null,
        bottomLeftCard: this.workingArea.bottomLeftCard?.toJSON() || null,
        bottomRightCard: this.workingArea.bottomRightCard?.toJSON() || null,
        playerId: this.workingArea.playerId,
      },
      committedState: {
        topCard: this.committedState.topCard?.toJSON() || null,
        bottomLeftCard: this.committedState.bottomLeftCard?.toJSON() || null,
        bottomRightCard: this.committedState.bottomRightCard?.toJSON() || null,
        playerId: this.committedState.playerId,
      },
      gameMode: this.gameMode,
    };
  }

  static fromJSON(json: CardGroupJSON): CardGroup {
    const cardGroup = new CardGroup(json.gameMode);

    // Restore working area
    cardGroup.workingArea = {
      topCard: json.workingArea.topCard ? Card.fromJSON(json.workingArea.topCard) : null,
      bottomLeftCard: json.workingArea.bottomLeftCard
        ? Card.fromJSON(json.workingArea.bottomLeftCard)
        : null,
      bottomRightCard: json.workingArea.bottomRightCard
        ? Card.fromJSON(json.workingArea.bottomRightCard)
        : null,
      playerId: json.workingArea.playerId,
    };

    // Restore committed state
    cardGroup.committedState = {
      topCard: json.committedState.topCard ? Card.fromJSON(json.committedState.topCard) : null,
      bottomLeftCard: json.committedState.bottomLeftCard
        ? Card.fromJSON(json.committedState.bottomLeftCard)
        : null,
      bottomRightCard: json.committedState.bottomRightCard
        ? Card.fromJSON(json.committedState.bottomRightCard)
        : null,
      playerId: json.committedState.playerId,
    };

    return cardGroup;
  }
}
