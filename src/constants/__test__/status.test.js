import Status from '../status';

describe('Status', () => {
  test('should have unique values', () => {
    const values = new Set();
    const keys = Object.keys(Status);
    keys.forEach(key => values.add(Status[key]));
    expect(values.size).toBe(keys.length);
  });
});
