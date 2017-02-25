import debug from 'debug';
import Deck from './deck';
import Discard from './discard';
import { Hand } from '../constants';
import { InvalidInputError } from '../errors';

const log = debug('SecretHitler:CardManager');

export default class {
  initialize() {
    log('Initializing');
    this.hand = [];
    this.deck = new Deck();
    this.discardPile = new Discard();
  }

  drawHand() {
    this.hand = this.getCards(Hand.HAND_SIZE);
    return this.getHand();
  }

  getHand() {
    return this.hand;
  }

  getTopCard() {
    return this.getCards(1)[0];
  }

  checkDeckSize(num) {
    if (this.deck.cardsLeft() < num) {
      log('Combining deck and discard pile');
      this.deck.addCards(this.discardPile.contents());
      this.discardPile.empty();
      this.deck.shuffle();
    }
  }

  peekCards(num) {
    this.checkDeckSize(num);
    return this.deck.peek(num);
  }

  getCards(num) {
    this.checkDeckSize(num);
    return this.deck.drawHand(num);
  }

  play(card) {
    if (!this.hand.some(c => c.type === card.type)) {
      throw new InvalidInputError('Card type not in hand');
    }

    const idx = this.hand.findIndex(c => c.type === card.type);
    this.hand.splice(idx, 1);
    this.discardHand();
    return this.getHand();
  }

  discard(card) {
    if (!this.hand.some(c => c.type === card.type)) {
      throw new InvalidInputError('Card type not in hand');
    }

    const idx = this.hand.findIndex(c => c.type === card.type);
    this.hand.splice(idx, 1);
    this.discardPile.add(card);
    return this.getHand();
  }

  discardHand() {
    [...this.hand].forEach(card => this.discard(card));
  }
}
