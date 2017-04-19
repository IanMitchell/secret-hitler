import debug from 'debug';
import '../util/array';
import Player from './player';
import { Role, Status } from '../constants';

const log = debug('SecretHitler:PlayerManager');

export default class {
  initialize() {
    log('Initializing');
    this.players = [];
    this.turnOrder = [];
    this.lastGovernment = {
      president: null,
      chancellor: null,
    };
  }

  addPlayer(name) {
    log(`Adding ${name}`);
    this.players.push(new Player(name));
  }

  getNumberOfLiberals() {
    switch (this.players.length) {
      case 5:
        return 3;
      case 6:
      case 7:
        return 4;
      case 8:
      case 9:
        return 5;
      case 10:
        return 6;
      default:
        return 0;
    }
  }

  getNumberOfFascists() {
    switch (this.players.length) {
      case 5:
      case 6:
        return 1;
      case 7:
      case 8:
        return 2;
      case 9:
      case 10:
        return 3;
      default:
        return 0;
    }
  }

  assignRoles() {
    log('Assigning roles');
    const liberals = this.getNumberOfLiberals();
    this.players.shuffle();

    this.players.slice(0, liberals).forEach(player => player.setLiberal());
    this.players.slice(liberals).forEach(player => player.setFascist());
    this.players[this.players.length - 1].setHitler();
  }

  assignTurnOrder() {
    log('Assigning Turn Order');
    this.players.shuffle();
    this.players.forEach(player => this.turnOrder.push(player));
  }

  getNextPresident() {
    const formerPresident = this.getPresident();

    if (formerPresident) {
      formerPresident.unsetStatus();
    }

    this.turnOrder = this.turnOrder.filter(
      player => player.status !== Status.DEAD,
    );

    const president = this.turnOrder.shift();
    this.turnOrder.push(president);
    president.setStatusPresident();

    return president;
  }

  getValidChancellorList() {
    return this.players.filter(player => this.validChancellor(player));
  }

  validChancellor(player) {
    if (player.status === Status.PRESIDENT || player.status === Status.DEAD) {
      return false;
    }

    // TODO: Move to Constant
    if (this.getNumberOfPlayers() <= 5) {
      return player !== this.lastGovernment.chancellor;
    }

    return (
      player !== this.lastGovernment.president &&
      player !== this.lastGovernment.chancellor
    );
  }

  setLastSuccessfulGovernment(override = false) {
    this.lastGovernment = {
      president: override ? null : this.getPresident(),
      chancellor: override ? null : this.getChancellor(),
    };
  }

  investigatePlayer(player) {
    player.setInvestigated();
  }

  getNumberOfPlayers() {
    return this.players.length;
  }

  getPlayerByName(name) {
    return this.players.find(player => player.name === name);
  }

  getLiberals() {
    return this.players.filter(player => player.role === Role.LIBERAL);
  }

  getFascists() {
    return this.players.filter(player => player.role === Role.FASCIST);
  }

  getHitler() {
    return this.players.find(player => player.role === Role.HITLER);
  }

  getPresident() {
    return this.players.find(player => player.status === Status.PRESIDENT);
  }

  getChancellor() {
    return this.players.find(player => player.status === Status.CHANCELLOR);
  }

  getSpecialElectionCandidates() {
    return this.players.filter(
      player =>
        player.status !== Status.PRESIDENT && player.status !== Status.DEAD,
    );
  }

  getInvestigateTargets() {
    return this.players.filter(
      player =>
        player.investigated === false &&
        player.status !== Status.PRESIDENT &&
        player.status !== Status.DEAD,
    );
  }

  getExecutionTargets() {
    return this.players.filter(
      player =>
        player.status !== Status.DEAD && player.status !== Status.PRESIDENT,
    );
  }

  isHitlerDead() {
    return this.getHitler().status === Status.DEAD;
  }

  isHitlerChancellor() {
    return this.getHitler().status === Status.CHANCELLOR;
  }
}
