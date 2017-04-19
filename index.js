import 'babel-polyfill';
import GameManager from './src';
import Target from './src/constants/target';
import { GameStateError, InvalidInputError } from './src/errors';

// eslint-disable-next-line func-names
const Game = (function() {
  return new GameManager();
})();

export default Game;
export { Target, GameStateError, InvalidInputError };
