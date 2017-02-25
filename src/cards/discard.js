import debug from 'debug';

const log = debug('SecretHitler:Discard');

export default class Discard {
  constructor() {
    this.cards = [];
  }

  empty() {
    log('Emptying pile');
    this.cards = [];
  }

  contents() {
    return this.cards;
  }

  add(card) {
    log(`Adding ${Symbol.keyFor(card.type)}`);
    this.cards.push(card);
  }
}
