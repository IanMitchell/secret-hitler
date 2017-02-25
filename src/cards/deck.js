import debug from 'debug';
import '../util/array';
import Card from './card';
import { DeckSize, CardType } from '../constants';

const log = debug('SecretHitler:Deck');

export default class Deck {
  constructor() {
    this.cards = new Array(DeckSize.LIBERAL_CARDS + DeckSize.FASCIST_CARDS);
    this.cards.fill(new Card(CardType.LIBERAL), 0, DeckSize.LIBERAL_CARDS);
    this.cards.fill(new Card(CardType.FASCIST), DeckSize.LIBERAL_CARDS);
    this.cards.shuffle();
  }

  cardsLeft() {
    return this.cards.length;
  }

  peek(size) {
    log('Peeking');
    return this.cards.slice(0, size);
  }

  drawHand(size) {
    log('Drawing hand');
    return this.cards.splice(0, size);
  }

  addCards(cards) {
    log(`Adding ${cards.length} cards`);
    cards.forEach(card => this.cards.push(card));
  }

  addCard(card) {
    this.addCards([card]);
  }

  shuffle() {
    log('Shuffling');
    this.cards.shuffle();
  }
}

module.exports = Deck;
