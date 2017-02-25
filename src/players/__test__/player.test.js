import Player from '../player';
import { Role, Status } from '../../constants';

describe('Player', () => {
  test('should initialize', () => {
    const player = new Player('Ian');
    expect(player.name).toBe('Ian');
  });

  test('should update role', () => {
    const player = new Player('Ian');
    expect(player.role).toBe(Role.PENDING);
    player.setLiberal();
    expect(player.role).toBe(Role.LIBERAL);
    player.setFascist();
    expect(player.role).toBe(Role.FASCIST);
    player.setHitler();
    expect(player.role).toBe(Role.HITLER);
  });

  test('should update status', () => {
    const player = new Player('Ian');
    expect(player.status).toBe(Status.PLAYER);

    player.setStatusDead();
    expect(player.status).toBe(Status.DEAD);

    player.setStatusPresident();
    expect(player.status).toBe(Status.PRESIDENT);

    player.setStatusChancellor();
    expect(player.status).toBe(Status.CHANCELLOR);

    player.unsetStatus();
    expect(player.status).toBe(Status.PLAYER);
  });

  test('should update investigated', () => {
    const player = new Player('Ian');
    expect(player.investigated).toBe(false);
    player.setInvestigated();
    expect(player.investigated).toBe(true);
  });
});
