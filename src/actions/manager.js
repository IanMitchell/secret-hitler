import BoardManager from '../board';
import CardManager from '../cards';
import EventManager from '../events';
import PlayerManager from '../players';
import { Action, Event, Hand, Status, Target } from '../constants';
import { InvalidInputError } from '../errors';

export default class {
  promptAction() {
    const type = BoardManager.nextActionType();
    const payload = { type };

    switch (type) {
      case Action.INVESTIGATE:
        payload.targets = PlayerManager.getInvestigateTargets();
        break;
      case Action.SPECIAL_ELECTION:
        payload.targets = PlayerManager.getSpecialElectionCandidates();
        break;
      case Action.KILL:
        payload.targets = PlayerManager.getExecutionTargets();
        break;
      case Action.PEEK:
      default:
        break;
    }

    EventManager.addEvent(Event.EXECUTIVE_ACTION, Target.PRESIDENT, payload);
  }

  peek() {
    const hand = CardManager.peekCards(Hand.HAND_SIZE);
    EventManager.addEvent(Event.PEEK, Target.PRESIDENT, { hand });
  }

  investigate(player) {
    if (player === PlayerManager.getPresident()) {
      throw new InvalidInputError('Cannot investigate self');
    }

    if (player.status === Status.DEAD) {
      throw new InvalidInputError('Player deceased');
    }

    if (player.investigated) {
      throw new InvalidInputError('Cannot investigate same player twice');
    }

    PlayerManager.investigatePlayer(player);

    EventManager.addEvent(Event.INVESTIGATE, Target.PRESIDENT, {
      player,
    });
  }

  specialElection(player) {
    if (!PlayerManager.getSpecialElectionCandidates().includes(player)) {
      throw new InvalidInputError('Invalid Presidential pick');
    }

    EventManager.addEvent(Event.SPECIAL_ELECTION, Target.ALL, {
      president: player,
    });
  }

  kill(player) {
    if (player.status === Status.DEAD) {
      throw new InvalidInputError('Player already deceased');
    }

    player.setStatusDead();

    EventManager.addEvent(Event.KILL, Target.ALL, {
      target: player,
    });
  }
}
