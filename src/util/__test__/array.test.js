import '../array';

describe('Array', () => {
  test('should add new method to Array', () => {
    expect(typeof [].shuffle).toBe('function');
  });

  test('should randomize array elements', () => {
    expect([].shuffle()).toEqual([]);
    expect([0].shuffle()).toEqual([0]);

    const MAX = 10;
    const MIN = -10;

    const validateArray = arr => {
      if ([...new Set(arr)].length !== arr.length) {
        return false;
      }

      return !arr.some(val => val > MAX || val < MIN);
    };

    const results = [];
    const arr = [];
    for (let i = MIN; i < MAX; i++) {
      arr.push(i);
    }

    for (let i = 0; i < 10; i++) {
      arr.shuffle();
      expect(validateArray(arr)).toBe(true);
      results.forEach(result => expect(result).not.toEqual(arr));
      results.push([...arr]);
    }
  });
});
