export class Card {
  private value: number;
  private isWild: boolean;
  private wildValue?: number;

  constructor(value: number, isWild: boolean = false) {
    this.value = value;
    this.isWild = isWild;
  }

  setWildValue(value: number): Card {
    if (!this.isWild) {
      throw new Error('Cannot set wild value for non-wild card');
    }
    const newCard = new Card(this.value, true);
    newCard.wildValue = value;
    return newCard;
  }

  getValue(): number {
    if (this.isWild && this.wildValue !== undefined) {
      return this.wildValue;
    }
    return this.value;
  }

  isWildCard(): boolean {
    return this.isWild;
  }
}
