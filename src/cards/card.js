import { CardType } from '../constants';

export default class Card {
  constructor(type) {
    this.type = type;
  }

  isFascist() {
    return this.type === CardType.FASCIST;
  }

  isLiberal() {
    return this.type === CardType.LIBERAL;
  }
}
