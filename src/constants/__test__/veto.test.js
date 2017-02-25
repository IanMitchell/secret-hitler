import Veto from '../veto';

describe('Veto', () => {
  test('should contain a number', () => {
    expect(typeof Veto.LIMIT).toBe('number');
  });
});
