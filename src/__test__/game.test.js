import Game from '../../';
import { playerNames } from './player-names';
import BoardManager from '../board';
import CardManager from '../cards';
import EventManager from '../events';
import PlayerManager from '../players';
import { Event, Target } from '../constants';

const managerStubs = new Map();
const managerList = [BoardManager, CardManager, EventManager, PlayerManager];

describe('Game', () => {
  // We use singletons, which means things break when I stub them out for tests.
  // Jest appears to not reset things; we do it manually here.
  beforeEach(() => {
    managerList.forEach(manager => {
      managerStubs.set(manager, new Map());
      Object.getOwnPropertyNames(Object.getPrototypeOf(manager)).forEach(key => {
        managerStubs.get(manager).set(key, manager[key]);
      });
    });
  });

  afterEach(() => {
    managerList.forEach(manager => {
      Object.getOwnPropertyNames(Object.getPrototypeOf(manager)).forEach(key => {
        // eslint-disable-next-line no-param-reassign
        manager[key] = managerStubs.get(manager).get(key);
      });
    });
  });

  describe('newGame', () => {
    test('should initialize managers', () => {
      const initMock = jest.fn();
      BoardManager.initialize = initMock;
      CardManager.initialize = initMock;
      EventManager.initialize = initMock;
      PlayerManager.initialize = initMock;

      Game.newTurn = jest.fn();
      EventManager.addEvent = jest.fn();
      EventManager.getNewEvents = jest.fn().mockReturnValueOnce([]);
      PlayerManager.addPlayer = jest.fn();
      PlayerManager.assignRoles = jest.fn();
      PlayerManager.assignTurnOrder = jest.fn();
      PlayerManager.getNumberOfPlayers = jest.fn();
      PlayerManager.getLiberals = jest.fn().mockReturnValueOnce([]);
      PlayerManager.getFascists = jest.fn().mockReturnValueOnce([]);
      PlayerManager.getHitler = jest.fn().mockReturnValueOnce({});
      PlayerManager.players = [];

      Game.newGame(playerNames);

      expect(initMock).toHaveBeenCalledTimes(4);
    });

    test('should reset GameState');
    test('should reset votes');
    test('should assign roles');
    test('should assign turn order');
    test('should alert fascists to roles');
    test('should alert Hitler to roles when player count is low');
    test('should alert all players to new game');
    test('should start new turn');
  });

  describe('newTurn', () => {
    test('should get next president');
    test('should allow president override');
    test('should reset Veto request');
    test('should ask President to nominate Chancellor');
  });

  describe('nominateChancellor', () => {
    test('should only trigger during correct GameState');
    test('should error for invalid Chancellor');
    test('should set player as chancellor');
    test('should progress to next game state');
  });

  describe('electionVote', () => {
    test('should only trigger during correct GameState');
    test('should silently return until vote finished');
    test('should have correct vote record');
    test('should progress to Policy discard on success');
    test('should draw hand on success');
    test('should increase veto on failure');
    test('should progress to next turn on failure');
    test('should reset vote record after result');
  });

  describe('presidentDiscard', () => {
    test('should only trigger during correct GameState');
    test('should discard card');
    test('should pass remaining cards to Chancellor');
    test('should progress GameState');
  });

  describe('enactPolicy', () => {
    test('should only trigger during correct GameState');
    test('should update last successful government');
    test('should play and enact card');
    test('should alert all players to play');
    test('should check for game over');
    test('should prompt action if one exists');
    test('should move to new turn if no action exists');
    test('should update GameState');
  });

  describe('vetoRequest', () => {
    test('should only trigger during correct GameState');
    test('should only trigger when Veto available');
    test('should mark veto as requested');
    test('should update GameState');
  });

  describe('vetoDecision', () => {
    test('should only trigger during correct GameState');
    test('should increase veto if confirmed');
    test('should discard hand if confirmed');
    test('should move to new turn if confirmed');
    test('should revert GameState if denied');
  });

  describe('enactAction', () => {
    test('should only trigger during correct GameState');
    test('should call correct action');
    test('should override next President in special election');
  });

  describe('isGameOver', () => {
    beforeEach(() => EventManager.initialize());

    test('should trigger when Hitler is dead', () => {
      PlayerManager.isHitlerDead = jest.fn().mockReturnValueOnce(true);

      expect(Game.isGameOver()).toBe(true);
      expect(EventManager.getNewEvents()).toEqual([{
        type: Event.GAME_OVER,
        target: Target.ALL,
        data: {
          type: Event.HITLER_KILLED,
        },
      }]);
    });

    test('should trigger when Hitler is Chancellor', () => {
      PlayerManager.isHitlerDead = jest.fn().mockReturnValueOnce(false);
      PlayerManager.isHitlerChancellor = jest.fn().mockReturnValueOnce(true);

      expect(Game.isGameOver()).toBe(true);
      expect(EventManager.getNewEvents()).toEqual([{
        type: Event.GAME_OVER,
        target: Target.ALL,
        data: {
          type: Event.HITLER_ELECTED,
        },
      }]);
    });

    test('should trigger when enough Liberal policies pass', () => {
      PlayerManager.isHitlerDead = jest.fn().mockReturnValueOnce(false);
      PlayerManager.isHitlerChancellor = jest.fn().mockReturnValueOnce(false);
      BoardManager.liberalPolicyWin = jest.fn().mockReturnValueOnce(true);

      expect(Game.isGameOver()).toBe(true);
      expect(EventManager.getNewEvents()).toEqual([{
        type: Event.GAME_OVER,
        target: Target.ALL,
        data: {
          type: Event.LIBERAL_POLICY,
        },
      }]);
    });

    test('should trigger when enough Fascist policies pass', () => {
      PlayerManager.isHitlerDead = jest.fn().mockReturnValueOnce(false);
      PlayerManager.isHitlerChancellor = jest.fn().mockReturnValueOnce(false);
      BoardManager.liberalPolicyWin = jest.fn().mockReturnValueOnce(false);
      BoardManager.fascistPolicyWin = jest.fn().mockReturnValueOnce(true);

      expect(Game.isGameOver()).toBe(true);
      expect(EventManager.getNewEvents()).toEqual([{
        type: Event.GAME_OVER,
        target: Target.ALL,
        data: {
          type: Event.FASCIST_POLICY,
        },
      }]);
    });

    test('should not otherwise trigger', () => {
      PlayerManager.isHitlerDead = jest.fn().mockReturnValueOnce(false);
      PlayerManager.isHitlerChancellor = jest.fn().mockReturnValueOnce(false);
      BoardManager.liberalPolicyWin = jest.fn().mockReturnValueOnce(false);
      BoardManager.fascistPolicyWin = jest.fn().mockReturnValueOnce(false);

      expect(Game.isGameOver()).toBe(false);
      expect(EventManager.getNewEvents()).toEqual([]);
    });
  });
});
