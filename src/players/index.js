import Manager from './manager';
import Player from './player';

const PlayerManager = (function () {
  return new Manager();
}());

export default PlayerManager;
export {
  Player,
};
