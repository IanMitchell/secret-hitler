import Event from '../event';

describe('Event', () => {
  test('should have unique values', () => {
    const values = new Set();
    const keys = Object.keys(Event);
    keys.forEach(key => values.add(Event[key]));
    expect(values.size).toBe(keys.length);
  });

  test('should have string values', () => {
    Object.keys(Event).forEach(key => {
      expect(typeof Event[key]).toBe('string');
    });
  });
});
