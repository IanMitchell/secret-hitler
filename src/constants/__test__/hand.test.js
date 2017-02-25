import Hand from '../hand';

describe('Hand', () => {
  test('should contain a number', () => {
    expect(typeof Hand.HAND_SIZE).toBe('number');
  });
});
