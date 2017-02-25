import debug from 'debug';

const log = debug('SecretHitler:EventManager');

export default class {
  initialize() {
    log('Initializing');
    this.marker = 0;
    this.log = [];
  }

  addEvent(type, target, data) {
    this.log.push({ type, target, data });
  }

  getNewEvents() {
    const idx = this.marker;
    this.marker = this.log.length;
    return this.log.slice(idx);
  }
}
