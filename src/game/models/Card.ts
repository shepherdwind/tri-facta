import { CardJSON } from '../types/serialization';
import { makeAutoObservable } from 'mobx';

export class Card {
  private value: number | null;
  isWildcard: boolean;

  constructor(value: number | null = null, isWildcard: boolean = false) {
    this.value = value;
    this.isWildcard = !value || isWildcard;
    makeAutoObservable(this);
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

  isWildCard(): boolean {
    return this.isWildcard;
  }

  setWildValue(value: number) {
    if (!this.isWildcard) {
      throw new Error('Cannot set wild value for non-wild card');
    }
    return new Card(value, true);
  }

  toString(): string {
    if (this.isWildcard) {
      return 'Wildcard';
    }
    return this.value?.toString() || '';
  }

  toJSON(): CardJSON {
    return {
      value: this.value,
      isWildcard: this.isWildcard,
    };
  }

  static fromJSON(json: CardJSON): Card {
    return new Card(json.value, json.isWildcard);
  }
}
