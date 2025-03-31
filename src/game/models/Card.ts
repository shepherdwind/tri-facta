export class Card {
  private value: number | null;
  isWildcard: boolean;

  constructor(value: number | null = null) {
    this.value = value;
    this.isWildcard = value === null;
  }

  getValue(): number | null {
    return this.value;
  }

  setValue(value: number): void {
    if (!this.isWildcard) {
      throw new Error('Cannot set value for non-wildcard');
    }
    if (value < 1 || value > 20) {
      throw new Error('Value must be between 1 and 20');
    }
    this.value = value;
  }

  toString(): string {
    if (this.isWildcard) {
      return 'Wildcard';
    }
    return this.value?.toString() || '';
  }
}
