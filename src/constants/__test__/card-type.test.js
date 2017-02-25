import CardType from '../card-type';

describe('CardType', () => {
  test('should have unique values', () => {
    const values = new Set();
    const keys = Object.keys(CardType);
    keys.forEach(key => values.add(CardType[key]));
    expect(values.size).toBe(keys.length);
  });
});
