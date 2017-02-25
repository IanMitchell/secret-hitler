import debug from 'debug';
import { Role, Status } from '../constants';

const log = debug('SecretHitler:Player');

export default class {
  constructor(name) {
    this.name = name;
    this.investigated = false;
    this.role = Role.PENDING;
    this.status = Status.PLAYER;
  }

  setInvestigated() {
    this.investigated = true;
  }

  setLiberal() {
    log(`${this.name} set to Liberal`);
    this.role = Role.LIBERAL;
  }

  setFascist() {
    log(`${this.name} set to Fascist`);
    this.role = Role.FASCIST;
  }

  setHitler() {
    log(`${this.name} set to Hitler`);
    this.role = Role.HITLER;
  }

  setStatusDead() {
    this.status = Status.DEAD;
  }

  setStatusPresident() {
    this.status = Status.PRESIDENT;
  }

  setStatusChancellor() {
    this.status = Status.CHANCELLOR;
  }

  unsetStatus() {
    this.status = Status.PLAYER;
  }
}
