import Manager from './manager';
import Deck from './deck';
import Discard from './discard';
import Card from './card';

// eslint-disable-next-line func-names
const CardManager = (function() {
  return new Manager();
})();

export default CardManager;
export { Deck, Discard, Card };
