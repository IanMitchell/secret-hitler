import Target from '../target';

describe('Target', () => {
  test('should have unique values', () => {
    const values = new Set();
    const keys = Object.keys(Target);
    keys.forEach(key => values.add(Target[key]));
    expect(values.size).toBe(keys.length);
  });

  test('should have string values', () => {
    Object.keys(Target).forEach(key => {
      expect(typeof Target[key]).toBe('string');
    });
  });
});
