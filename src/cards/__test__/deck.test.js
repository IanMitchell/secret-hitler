import Deck from '../deck';
import { CardType, DeckSize } from '../../constants';

describe('Deck', () => {
  test('initializes with correct contents', () => {
    const deck = new Deck();
    expect(deck.cardsLeft()).toBe(17);

    const liberalCards = deck.cards.filter(card => card.type === CardType.LIBERAL);
    const fascistCards = deck.cards.filter(card => card.type === CardType.FASCIST);

    expect(liberalCards.length).toBe(DeckSize.LIBERAL_CARDS);
    expect(fascistCards.length).toBe(DeckSize.FASCIST_CARDS);
  });

  test('shuffles deck after initializing', () => {
    const deck = new Deck();
    const sortedDeck = new Deck();

    sortedDeck.cards.sort((a, b) => {
      if (a.type === CardType.LIBERAL) {
        return -1;
      }

      return 1;
    });

    expect(deck.cards).not.toEqual(sortedDeck.cards);
  });

  test('peek should not modify deck', () => {
    const deck = new Deck();
    const cards = deck.cards;
    const size = deck.cardsLeft();
    deck.peek(5);
    expect(deck.cards).toEqual(cards);
    expect(deck.cardsLeft()).toBe(size);
  });

  test('draw hand should modify deck', () => {
    const deck = new Deck();
    const [one, two, three, ...cards] = deck.cards;
    const hand = deck.drawHand(3);
    expect(hand).toEqual([one, two, three]);
    expect(deck.cards).toEqual(cards);
  });

  test('add cards should modify deck', () => {
    const deck = new Deck();
    const size = deck.cardsLeft();
    deck.addCard('card');
    expect(deck.cardsLeft()).toBe(size + 1);
    expect(deck.cards).toContain('card');
  });
});
