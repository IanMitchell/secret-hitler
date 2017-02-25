import debug from 'debug';
import CardManager from '../cards';
import EventManager from '../events';
import PlayerManager from '../players';
import { Action, Board, CardType, Event, Target, Veto } from '../constants';

const log = debug('SecretHitler:BoardManager');

export default class {
  initialize() {
    log('Initializing');
    this.actionMap = new Map();
    this.vetoRequested = false;
    this.vetoCount = 0;
    this.policyCount = {
      liberal: 0,
      fascist: 0,
    };
  }

  createBoard() {
    log('Constructing Board');
    switch (PlayerManager.getNumberOfPlayers()) {
      case 5:
      case 6:
        this.actionMap.set(3, Action.PEEK);
        this.actionMap.set(4, Action.KILL);
        this.actionMap.set(5, Action.KILL);
        break;
      case 7:
      case 8:
        this.actionMap.set(2, Action.INVESTIGATE);
        this.actionMap.set(3, Action.SPECIAL_ELECTION);
        this.actionMap.set(4, Action.KILL);
        this.actionMap.set(5, Action.KILL);
        break;
      case 9:
      case 10:
      default:
        this.actionMap.set(1, Action.INVESTIGATE);
        this.actionMap.set(2, Action.INVESTIGATE);
        this.actionMap.set(3, Action.SPECIAL_ELECTION);
        this.actionMap.set(4, Action.KILL);
        this.actionMap.set(5, Action.KILL);
        break;
    }
  }

  enactPolicy(type) {
    if (type === CardType.LIBERAL) {
      log('Enacting Liberal Policy');
      this.policyCount.liberal += 1;
    } else if (type === CardType.FASCIST) {
      log('Enacting Fascist Policy');
      this.policyCount.fascist += 1;
    }
  }

  hasAction() {
    return this.actionMap.has(this.policyCount.fascist);
  }

  nextActionType() {
    if (!this.hasAction()) {
      return null;
    }

    const type = this.actionMap.get(this.policyCount.fascist);
    return type;
  }

  triggerAction() {
    this.actionMap.delete(this.policyCount.fascist);
  }

  increaseVeto() {
    log('Increasing Veto');
    this.vetoCount += 1;

    if (this.vetoCount >= Veto.LIMIT) {
      log('Veto limit reached. Top Decking Policy');
      EventManager.addEvent(Event.VETO_LIMIT, Target.ALL);

      this.enactPolicy(CardManager.getTopCard());
      // Any triggered actions are lost
      this.triggerNextAction();
      PlayerManager.setLastSuccessfulGovernment(true);
      this.resetVeto();
    }
  }

  liberalPolicyWin() {
    return this.policyCount.liberal >= Board.LIBERAL_POLICY_MAX;
  }

  fascistPolicyWin() {
    return this.policyCount.fascist >= Board.FASCIST_POLICY_MAX;
  }

  resetVeto() {
    log('Resetting Veto');
    this.vetoCount = 0;
  }

  resetVetoRequested() {
    this.vetoRequested = false;
  }

  setVetoRequested() {
    this.vetoRequested = true;
  }

  isChancellorVetoEnabled() {
    return !this.vetoRequested && this.policyCount.fascist >= Board.VETO_REQUEST_ENABLED;
  }

  isHitlerChancellorWinEnabled() {
    return this.policyCount.fascist >= Board.HITLER_ELECTION_ENABLED;
  }
}
