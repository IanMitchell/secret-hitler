import Role from '../role';

describe('Role', () => {
  test('should have unique values', () => {
    const values = new Set();
    const keys = Object.keys(Role);
    keys.forEach(key => values.add(Role[key]));
    expect(values.size).toBe(keys.length);
  });
});
