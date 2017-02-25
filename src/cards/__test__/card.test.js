import Card from '../card';
import { CardType } from '../../constants';

describe('Card', () => {
  test('should identify Fascist types as Fascist', () => {
    const card = new Card(CardType.FASCIST);
    expect(card.isFascist()).toBe(true);
    expect(card.isLiberal()).toBe(false);
  });

  test('should identify Liberal types as Liberal', () => {
    const card = new Card(CardType.LIBERAL);
    expect(card.isLiberal()).toBe(true);
    expect(card.isFascist()).toBe(false);
  });
});
