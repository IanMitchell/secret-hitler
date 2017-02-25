import Manager from './manager';
import Deck from './deck';
import Discard from './discard';
import Card from './card';

const CardManager = (function () {
  return new Manager();
}());

export default CardManager;
export {
  Deck,
  Discard,
  Card,
};
