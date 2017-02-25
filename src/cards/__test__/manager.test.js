import CardManager from '../';
import Card from '../card';
import { CardType } from '../../constants';
import { InvalidInputError } from '../../errors';

describe('CardManager', () => {
  beforeEach(() => CardManager.initialize());

  test('initialize should reset state', () => {
    CardManager.hand = [0, 1, 3];
    CardManager.deck = false;
    CardManager.discardPile = false;
    CardManager.initialize();

    expect(CardManager.hand).toEqual([]);
    expect(CardManager.deck).not.toBe(false);
    expect(CardManager.discardPile).not.toBe(false);
  });

  test('should keep track of current hand', () => {
    const hand = CardManager.getHand();
    const newHand = CardManager.drawHand();
    expect(newHand).not.toEqual(hand);
    expect(newHand).toEqual(CardManager.hand);
  });

  test('getTopCard should return a single card', () => {
    const card = CardManager.getTopCard();
    expect(card.isFascist() || card.isLiberal()).toBe(true);
  });

  test('peekCards should return correct number of cards', () => {
    const cards = CardManager.peekCards(7);
    expect(cards.length).toBe(7);
  });

  test('checkDeckSize should not do anything when Deck is full', () => {
    const mock = jest.fn();
    CardManager.deck.addCards = mock;
    CardManager.discardPile.contents = mock;
    CardManager.discardPile.empty = mock;
    CardManager.checkDeckSize(1);

    expect(mock).not.toHaveBeenCalled();
  });

  test('checkDeckSize should combine discard pile and shuffle when deck is low', () => {
    const mock = jest.fn();
    CardManager.deck.addCards = mock;
    CardManager.discardPile.contents = mock;
    CardManager.discardPile.empty = mock;

    CardManager.checkDeckSize(CardManager.deck.cardsLeft() + 1);
    expect(mock).toHaveBeenCalled();
  });

  test('discard should error if card not in hand', () => {
    const card = new Card(CardType.LIBERAL);
    expect(() => CardManager.discard(card)).toThrow(InvalidInputError);
  });

  test('discard should remove card from hand', () => {
    const [discard, ...hand] = CardManager.drawHand();
    CardManager.discard(discard);
    expect(CardManager.getHand()).toEqual(hand);
  });

  test('discard should add card to discard', () => {
    const [discard] = CardManager.drawHand();
    CardManager.discard(discard);
    expect(CardManager.discardPile.contents()).toHaveLength(1);
    expect(CardManager.discardPile.contents()).toEqual([discard]);
  });

  test('discardHand should empty cards in hand', () => {
    CardManager.drawHand();
    expect(CardManager.getHand()).toHaveLength(3);
    CardManager.discardHand();
    expect(CardManager.getHand()).toHaveLength(0);
    expect(CardManager.discardPile.contents()).toHaveLength(3);
  });

  test('play should error if card not in hand', () => {
    const card = new Card(CardType.LIBERAL);
    expect(() => CardManager.play(card)).toThrow(InvalidInputError);
  });

  test('play should discard remaining hand', () => {
    const mock = jest.fn();
    const [card] = CardManager.drawHand();
    CardManager.discardPile.add = mock;
    CardManager.play(card);
    expect(CardManager.getHand()).toEqual([]);
    expect(mock).toHaveBeenCalledTimes(2);
  });

  test('should remove card from circulation', () => {
    const liberal = (card) => card.type === CardType.LIBERAL;
    const fascist = (card) => card.type === CardType.FASCIST;

    const liberalCards = CardManager.deck.cards.filter(liberal);
    const fascistCards = CardManager.deck.cards.filter(fascist);
    const [card] = CardManager.drawHand();
    CardManager.play(card);

    const cardCount = CardManager.deck.cards.length + CardManager.discardPile.cards.length;
    expect(cardCount).toBe(liberalCards.length + fascistCards.length - 1);

    const newLiberalTotal = CardManager.deck.cards.filter(liberal).length +
                            CardManager.discardPile.cards.filter(liberal).length;
    const newFascistTotal = CardManager.deck.cards.filter(fascist).length +
                            CardManager.discardPile.cards.filter(fascist).length;

    if (card.type === CardType.LIBERAL) {
      expect(newLiberalTotal).toBe(liberalCards.length - 1);
      expect(newFascistTotal).toBe(fascistCards.length);
    } else {
      expect(newLiberalTotal).toBe(liberalCards.length);
      expect(newFascistTotal).toBe(fascistCards.length - 1);
    }
  });
});
