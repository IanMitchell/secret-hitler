import PlayerManager from '../';
import { playerNames } from '../../__test__/player-names';
import { Role, Status } from '../../constants';

function addPlayers() {
  playerNames.forEach(name => PlayerManager.addPlayer(name));
}

describe('PlayerManager', () => {
  beforeEach(() => PlayerManager.initialize());

  test('should initialize', () => {
    expect(PlayerManager.players).toEqual([]);
    expect(PlayerManager.turnOrder).toEqual([]);
    expect(PlayerManager.lastGovernment).toEqual({
      president: null,
      chancellor: null,
    });
  });

  test('should add player', () => {
    playerNames.forEach((name, idx) => {
      PlayerManager.addPlayer(name);
      expect(PlayerManager.players).toHaveLength(idx + 1);
    });
  });

  test('should return correct number of roles', () => {
    playerNames.slice(0, 4).forEach(name => {
      PlayerManager.addPlayer(name);
    });

    playerNames.slice(4).forEach(name => {
      PlayerManager.addPlayer(name);
      const liberals = PlayerManager.getNumberOfLiberals();
      const fascists = PlayerManager.getNumberOfFascists();
      expect(liberals + fascists).toBe(PlayerManager.getNumberOfPlayers() - 1);
    });
  });

  test('should correctly assign roles', () => {
    addPlayers();
    PlayerManager.players.forEach(player => expect(player.role).toBe(Role.PENDING));
    PlayerManager.assignRoles();

    const roleCount = {
      hitler: 0,
      fascist: 0,
      liberal: 0,
    };

    PlayerManager.players.forEach(player => {
      expect(player.role).not.toBe(Role.PENDING);

      switch (player.role) {
        case Role.LIBERAL:
          roleCount.liberal++;
          break;
        case Role.FASCIST:
          roleCount.fascist++;
          break;
        case Role.HITLER:
          roleCount.hitler++;
          break;
        default:
          // Fail on unexpected role
          expect(true).toBe(false);
      }
    });

    expect(roleCount.hitler).toBe(1);
    expect(roleCount.liberal).toBeGreaterThan(roleCount.fascist);
  });

  test('should randomize turn order', () => {
    addPlayers();
    const players = [...PlayerManager.players];
    PlayerManager.assignTurnOrder();
    expect(PlayerManager.players).not.toEqual(players);
  });

  test('should track next president', () => {
    addPlayers();
    PlayerManager.assignTurnOrder();
    const players = PlayerManager.players;
    let dead = null;
    let alsoDead = null;
    let lastPresident = players[players.length - 1];
    const turnSet = new Set();

    for (let i = 0; i <= playerNames.length * 3; i++) {
      if (i === Math.round(playerNames.length * 1.5)) {
        [dead, alsoDead] = PlayerManager.players;
        dead.setStatusDead();
        alsoDead.setStatusDead();
      } else if (i === playerNames.length) {
        expect(turnSet.size).toBe(playerNames.length);
        turnSet.clear();
      } else if (i === playerNames.length * 2) {
        expect(turnSet.size).toBe(playerNames.length);
        turnSet.clear();
      } else if (i === playerNames.length * 3) {
        expect(turnSet.size).toBe(playerNames.length - 2);
      }

      const president = PlayerManager.getNextPresident();

      expect(president.status).toBe(Status.PRESIDENT);
      expect(president).not.toBe(lastPresident);
      expect(lastPresident.status).toBe(Status.PLAYER);
      expect(president).not.toBe(dead);
      expect(president).not.toBe(alsoDead);
      lastPresident = president;
      turnSet.add(president);
    }
  });

  test('should track valid chancellors', () => {
    addPlayers();
    const [president, chancellor, dead, newPresident, ...list] = PlayerManager.players;
    dead.setStatusDead();
    newPresident.setStatusPresident();
    PlayerManager.lastGovernment = { president, chancellor };

    expect(PlayerManager.getValidChancellorList()).toEqual(list);
  });

  test('should correctly validate potential chancellor for small games', () => {
    addPlayers();
    PlayerManager.players.length = 5;

    const [president, dead, chancellor, newPresident, valid] = PlayerManager.players;
    newPresident.setStatusPresident();
    dead.setStatusDead();
    PlayerManager.lastGovernment = { president, chancellor };

    expect(PlayerManager.validChancellor(newPresident)).toBe(false);
    expect(PlayerManager.validChancellor(dead)).toBe(false);
    expect(PlayerManager.validChancellor(chancellor)).toBe(false);
    expect(PlayerManager.validChancellor(president)).toBe(true);
    expect(PlayerManager.validChancellor(valid)).toBe(true);
  });

  test('should correctly validate potential chancellor for large games', () => {
    addPlayers();

    const [president, dead, chancellor, newPresident, valid] = PlayerManager.players;
    newPresident.setStatusPresident();
    dead.setStatusDead();
    PlayerManager.lastGovernment = { president, chancellor };

    expect(PlayerManager.validChancellor(newPresident)).toBe(false);
    expect(PlayerManager.validChancellor(dead)).toBe(false);
    expect(PlayerManager.validChancellor(chancellor)).toBe(false);
    expect(PlayerManager.validChancellor(president)).toBe(false);
    expect(PlayerManager.validChancellor(valid)).toBe(true);
  });

  test('should track last government', () => {
    addPlayers();
    PlayerManager.assignRoles();
    const [president, chancellor] = PlayerManager.players;
    president.setStatusPresident();
    chancellor.setStatusChancellor();

    PlayerManager.setLastSuccessfulGovernment();
    expect(PlayerManager.lastGovernment).toEqual({ president, chancellor });
  });

  test('should override last government', () => {
    addPlayers();
    PlayerManager.assignRoles();
    const [president, chancellor] = PlayerManager.players;
    president.setStatusPresident();
    chancellor.setStatusChancellor();

    PlayerManager.lastGovernment = { president, chancellor };
    PlayerManager.setLastSuccessfulGovernment(true);
    expect(PlayerManager.lastGovernment).toEqual({ president: null, chancellor: null });
  });

  test('should investigate player', () => {
    addPlayers();
    expect(PlayerManager.players[0].investigated).toBe(false);
    PlayerManager.investigatePlayer(PlayerManager.players[0]);
    expect(PlayerManager.players[0].investigated).toBe(true);
  });

  test('should return correct number of players', () => {
    expect(PlayerManager.getNumberOfPlayers()).toBe(0);
    addPlayers();
    expect(PlayerManager.getNumberOfPlayers()).toBe(playerNames.length);
  });

  test('should return a player by name', () => {
    addPlayers();
    expect(PlayerManager.getPlayerByName(playerNames[0]).name).toBe('Ian');
  });

  test('should return liberals', () => {
    addPlayers();
    PlayerManager.assignRoles();
    PlayerManager.getLiberals().forEach(player => expect(player.role).toBe(Role.LIBERAL));
    expect(PlayerManager.getLiberals()).toHaveLength(PlayerManager.getNumberOfLiberals());
  });

  test('should return fascists', () => {
    addPlayers();
    PlayerManager.assignRoles();
    PlayerManager.getFascists().forEach(player => expect(player.role).toBe(Role.FASCIST));
    expect(PlayerManager.getFascists()).toHaveLength(PlayerManager.getNumberOfFascists());
  });

  test('should return player assigned hitler', () => {
    addPlayers();
    PlayerManager.assignRoles();
    expect(PlayerManager.getHitler().role).toBe(Role.HITLER);
  });

  test('should return player currently president', () => {
    addPlayers();
    PlayerManager.players[0].setStatusPresident();
    expect(PlayerManager.getPresident().status).toBe(Status.PRESIDENT);
  });

  test('should return player currently chancellor', () => {
    addPlayers();
    PlayerManager.assignRoles();
    PlayerManager.players[1].setStatusChancellor();
    expect(PlayerManager.getChancellor().status).toBe(Status.CHANCELLOR);
  });

  test('should return list of valid special election candidates', () => {
    addPlayers();
    PlayerManager.assignTurnOrder();
    PlayerManager.getNextPresident();

    const [, dead, ...players] = PlayerManager.players;
    dead.setStatusDead();

    expect(PlayerManager.getSpecialElectionCandidates()).toEqual(players);
  });

  test('should return list of valid investigate targets', () => {
    addPlayers();
    PlayerManager.assignTurnOrder();
    PlayerManager.getNextPresident();

    const [, investigate, otherInvestigated, dead, ...players] = PlayerManager.players;
    investigate.setInvestigated();
    otherInvestigated.setInvestigated();
    dead.setStatusDead();

    expect(PlayerManager.getInvestigateTargets()).toEqual(players);
  });

  test('should return list of valid execution targets', () => {
    addPlayers();
    PlayerManager.assignTurnOrder();
    PlayerManager.getNextPresident();

    const [, dead, otherDead, ...players] = PlayerManager.players;
    dead.setStatusDead();
    otherDead.setStatusDead();

    expect(PlayerManager.getExecutionTargets()).toEqual(players);
  });

  test('should return true if hitler is dead', () => {
    addPlayers();
    PlayerManager.assignRoles();
    expect(PlayerManager.isHitlerDead()).toBe(false);
    PlayerManager.getHitler().setStatusDead();
    expect(PlayerManager.isHitlerDead()).toBe(true);
  });

  test('should return true if hitler is chancellor', () => {
    addPlayers();
    PlayerManager.assignRoles();
    expect(PlayerManager.isHitlerChancellor()).toBe(false);
    PlayerManager.getHitler().setStatusChancellor();
    expect(PlayerManager.isHitlerChancellor()).toBe(true);
  });
});
