export default class GameStateError extends Error {
  constructor(message = 'Wrong phase of game') {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
  }
}
