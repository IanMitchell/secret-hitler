import ActionManager from '../';
import BoardManager from '../../board';
import CardManager from '../../cards';
import EventManager from '../../events';
import PlayerManager, { Player } from '../../players';
import { InvalidInputError } from '../../errors';
import { Action, Event, Status, Target } from '../../constants';

describe('ActionManager', () => {
  beforeEach(() => EventManager.initialize());

  test('should prompt for correct action', () => {
    const mock = jest.fn();
    mock.mockReturnValueOnce(Action.INVESTIGATE);
    BoardManager.nextActionType = mock;

    const investigateTargets = jest.fn();
    investigateTargets.mockReturnValueOnce([1, 2, 3]);
    PlayerManager.getInvestigateTargets = investigateTargets;

    const electionTargets = jest.fn();
    electionTargets.mockReturnValueOnce([4, 5, 6]);
    PlayerManager.getSpecialElectionCandidates = electionTargets;

    const executionTargets = jest.fn();
    executionTargets.mockReturnValueOnce([7, 8, 9]);
    PlayerManager.getExecutionTargets = executionTargets;

    ActionManager.promptAction();
    expect(EventManager.getNewEvents()).toEqual([{
      type: Event.EXECUTIVE_ACTION,
      target: Target.PRESIDENT,
      data: {
        type: Action.INVESTIGATE,
        targets: [1, 2, 3],
      },
    }]);

    mock.mockReturnValueOnce(Action.SPECIAL_ELECTION);
    ActionManager.promptAction();
    expect(EventManager.getNewEvents()).toEqual([{
      type: Event.EXECUTIVE_ACTION,
      target: Target.PRESIDENT,
      data: {
        type: Action.SPECIAL_ELECTION,
        targets: [4, 5, 6],
      },
    }]);

    mock.mockReturnValueOnce(Action.KILL);
    ActionManager.promptAction();
    expect(EventManager.getNewEvents()).toEqual([{
      type: Event.EXECUTIVE_ACTION,
      target: Target.PRESIDENT,
      data: {
        type: Action.KILL,
        targets: [7, 8, 9],
      },
    }]);

    mock.mockReturnValueOnce(Action.PEEK);
    ActionManager.promptAction();
    expect(EventManager.getNewEvents()).toEqual([{
      type: Event.EXECUTIVE_ACTION,
      target: Target.PRESIDENT,
      data: {
        type: Action.PEEK,
      },
    }]);
  });

  test('should show next hand to president', () => {
    const mock = jest.fn();
    mock.mockReturnValueOnce([1, 2, 3]);
    CardManager.peekCards = mock;
    ActionManager.peek();

    expect(EventManager.getNewEvents()).toEqual([{
      type: Event.PEEK,
      target: Target.PRESIDENT,
      data: {
        hand: [1, 2, 3],
      },
    }]);
  });

  test('should not modify deck with peek', () => {
    const mock = jest.fn();
    CardManager.peekCards = mock;

    ActionManager.peek();
    expect(mock).toHaveBeenCalled();
  });

  test('should not allow President to investigate self', () => {
    const mock = jest.fn();
    const player = new Player('Ian');

    mock.mockReturnValueOnce(player);
    PlayerManager.getPresident = mock;

    expect(() => ActionManager.investigate(player)).toThrow(InvalidInputError);
  });

  test('should not allow President to investigate dead', () => {
    const mock = jest.fn();
    mock.mockReturnValueOnce(new Player('Obama'));
    PlayerManager.getPresident = mock;

    const player = new Player('Ian');
    player.setStatusDead();

    expect(() => ActionManager.investigate(player)).toThrow(InvalidInputError);
  });

  test('should not allow player to be investigated twice', () => {
    const mock = jest.fn();
    mock.mockReturnValueOnce(new Player('Obama'));
    PlayerManager.getPresident = mock;

    const player = new Player('Ian');
    ActionManager.investigate(player);

    expect(() => ActionManager.investigate(player)).toThrow(InvalidInputError);
  });

  test('should alert President to party allegiance', () => {
    const mock = jest.fn();
    mock.mockReturnValueOnce(new Player('Obama'));
    PlayerManager.getPresident = mock;

    const player = new Player('Ian');
    player.setLiberal();
    ActionManager.investigate(player);

    expect(EventManager.getNewEvents()).toEqual([{
      type: Event.INVESTIGATE,
      target: Target.PRESIDENT,
      data: {
        player,
      },
    }]);
  });

  test('should mark player as investigated', () => {
    const mock = jest.fn();
    mock.mockReturnValueOnce(new Player('Obama'));
    PlayerManager.getPresident = mock;

    const player = new Player('Ian');
    expect(player.investigated).toBe(false);
    ActionManager.investigate(player);
    expect(player.investigated).toBe(true);
  });

  test('should validate Special Election appointment', () => {
    const mock = jest.fn();
    const player = new Player('Ian');

    mock.mockReturnValueOnce([]);
    PlayerManager.getSpecialElectionCandidates = mock;

    expect(() => ActionManager.specialElection(player)).toThrow(InvalidInputError);
  });

  test('should alert people to Special Election appointment', () => {
    const mock = jest.fn();
    const player = new Player('Ian');

    mock.mockReturnValueOnce([player]);
    PlayerManager.getSpecialElectionCandidates = mock;

    ActionManager.specialElection(player);

    expect(EventManager.getNewEvents()).toEqual([{
      type: Event.SPECIAL_ELECTION,
      target: Target.ALL,
      data: {
        president: player,
      },
    }]);
  });

  test('should not allow President to double tap a player', () => {
    const player = new Player('Ian');
    player.setStatusDead();

    expect(() => ActionManager.kill(player)).toThrow(InvalidInputError);
  });

  test('should mark player as dead', () => {
    const player = new Player('Ian');
    ActionManager.kill(player);

    expect(player.status).toBe(Status.DEAD);
  });

  test('should alert players to execution', () => {
    const player = new Player('Ian');
    ActionManager.kill(player);

    expect(EventManager.getNewEvents()).toEqual([{
      type: Event.KILL,
      target: Target.ALL,
      data: {
        target: player,
      },
    }]);
  });
});
