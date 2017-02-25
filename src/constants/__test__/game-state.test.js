import GameState from '../game-state';

describe('GameState', () => {
  test('should have unique values', () => {
    const values = new Set();
    const keys = Object.keys(GameState);
    keys.forEach(key => values.add(GameState[key]));
    expect(values.size).toBe(keys.length);
  });
});
