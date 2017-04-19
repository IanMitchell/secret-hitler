import 'babel-polyfill';
import GameManager from './src';

// eslint-disable-next-line func-names
const Game = (function () {
  return new GameManager();
}());

export default Game;
