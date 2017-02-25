import Action from '../action';

describe('Action', () => {
  test('should have unique values', () => {
    const values = new Set();
    const keys = Object.keys(Action);
    keys.forEach(key => values.add(Action[key]));
    expect(values.size).toBe(keys.length);
  });
});
