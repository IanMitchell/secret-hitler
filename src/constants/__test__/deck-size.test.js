import DeckSize from '../deck-size';

describe('DeckSize', () => {
  test('should have two numbers', () => {
    expect(typeof DeckSize.LIBERAL_CARDS).toBe('number');
    expect(typeof DeckSize.FASCIST_CARDS).toBe('number');
  });
});
