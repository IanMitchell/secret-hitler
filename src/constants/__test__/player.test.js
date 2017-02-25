import Player from '../player';

describe('Player', () => {
  test('should contain a number', () => {
    expect(typeof Player.INFORMED_HITLER_PLAYER_LIMIT).toBe('number');
  });
});
