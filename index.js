import 'babel-polyfill';
import GameManager from './src';

const Game = (function () {
  return new GameManager();
}());

export default Game;
