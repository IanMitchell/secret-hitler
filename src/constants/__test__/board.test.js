import Board from '../board';

describe('Board', () => {
  test('should contain numbers', () => {
    Object.keys(Board).forEach(key => {
      expect(typeof Board[key]).toBe('number');
    });
  });
});
