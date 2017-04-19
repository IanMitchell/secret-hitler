import Manager from './manager';
import Player from './player';

// eslint-disable-next-line func-names
const PlayerManager = (function() {
  return new Manager();
})();

export default PlayerManager;
export { Player };
