import debug from 'debug';
import ActionManager from './actions';
import BoardManager from './board';
import CardManager from './cards';
import EventManager from './events';
import PlayerManager from './players';
import { Action, GameState, Event, Player, Target } from './constants';
import { GameStateError, InvalidInputError } from './errors';

const log = debug('SecretHitler:Game');

export default class {
  initialize(playerNames) {
    this.newGame(playerNames);
  }

  newGame(playerNames) {
    this.gameState = GameState.NEW_GAME;
    this.votes = new Map();

    EventManager.initialize();
    PlayerManager.initialize();
    CardManager.initialize();
    BoardManager.initialize();

    playerNames.forEach(name => PlayerManager.addPlayer(name));
    PlayerManager.assignRoles();
    PlayerManager.assignTurnOrder();

    EventManager.addEvent(Event.ROLE_INFORMATION, Target.FASCISTS, {
      liberals: PlayerManager.getLiberals().map(player => player.name),
      fascists: PlayerManager.getFascists().map(player => player.name),
      hitler: PlayerManager.getHitler().name,
    });

    if (
      PlayerManager.getNumberOfPlayers() <= Player.INFORMED_HITLER_PLAYER_LIMIT
    ) {
      EventManager.addEvent(Event.ROLE_INFORMATION, Target.HITLER, {
        liberals: PlayerManager.getLiberals().map(player => player.name),
        fascists: PlayerManager.getFascists().map(player => player.name),
        hitler: PlayerManager.getHitler().name,
      });
    }

    EventManager.addEvent(Event.GAME_START, Target.ALL, {
      turnOrder: PlayerManager.players.map(player => player.name),
    });

    this.newTurn();

    return EventManager.getNewEvents();
  }

  newTurn(president = PlayerManager.getNextPresident()) {
    this.gameState = GameState.NOMINATE_CHANCELLOR;
    BoardManager.resetVetoRequested();
    EventManager.addEvent(Event.NEW_TURN, Target.ALL, { president });
    EventManager.addEvent(Event.NOMINATE_CHANCELLOR, Target.PRESIDENT, {
      validPlayers: PlayerManager.getValidChancellorList(),
    });
  }

  nominateChancellor(playerName) {
    if (this.gameState !== GameState.NOMINATE_CHANCELLOR) {
      throw new GameStateError();
    }

    const player = PlayerManager.getPlayerByName(playerName);

    if (!PlayerManager.validChancellor(player)) {
      throw new InvalidInputError('Invalid Chancellor choice');
    }

    player.setStatusChancellor();
    this.gameState = GameState.ELECT_GOVERNMENT;
    EventManager.addEvent(Event.NOMINATE_CHANCELLOR, Target.ALL, {
      chancellor: player,
    });

    return EventManager.getNewEvents();
  }

  electionVote(playerName, vote) {
    if (this.gameState !== GameState.ELECT_GOVERNMENT) {
      throw new GameStateError();
    }

    this.voteMap.set(PlayerManager.getPlayerByName(playerName), vote);

    if (this.voteMap.size >= PlayerManager.getNumberOfPlayers()) {
      const ayes = [...this.voteMap.entries()]
        .filter(entry => entry[1] === true)
        .map(entry => entry[0]);
      const nays = [...this.voteMap.entries()]
        .filter(entry => entry[1] === false)
        .map(entry => entry[0]);

      EventManager.addEvent(Event.ELECTION_RESULT, Target.ALL, {
        ayes,
        nays,
      });

      if (ayes.length > nays.length) {
        this.gameState = GameState.POLICY_DISCARD;
        CardManager.drawHand();
        EventManager.addEvent(Event.POLICY_DISCARD, Target.PRESIDENT, {
          hand: CardManager.getHand(),
        });
      } else {
        PlayerManager.increaseVeto();
        this.newTurn();
      }

      this.voteMap = new Map();
      this.isGameOver();
    }

    return EventManager.getNewEvents();
  }

  presidentDiscard(discard) {
    if (this.gameState !== GameState.POLICY_DISCARD) {
      throw new GameStateError();
    }

    CardManager.discard(discard);
    EventManager.addEvent(Event.ENACT_POLICY, Target.CHANCELLOR, {
      hand: CardManager.getHand(),
    });

    this.gameState = GameState.ENACT_POLICY;

    return EventManager.getNewEvents();
  }

  enactPolicy(type) {
    if (this.gameState !== GameState.ENACT_POLICY) {
      throw new GameStateError();
    }

    PlayerManager.setLastSuccessfulGovernment();
    BoardManager.enactPolicy(type);
    CardManager.play(type);

    EventManager.addEvent(Event.NEW_POLICY, Target.ALL, { type });

    if (this.isGameOver()) {
      return EventManager.getNewEvents();
    }

    if (BoardManager.hasAction()) {
      ActionManager.promptAction();
      this.gameState = GameState.EXECUTIVE_ACTION;
    } else {
      this.newTurn();
    }

    return EventManager.getNewEvents();
  }

  vetoRequest() {
    if (this.gameState !== GameState.ENACT_POLICY) {
      throw new GameStateError();
    }

    if (!BoardManager.isChancellorVetoEnabled()) {
      return new InvalidInputError('Chancellor veto not yet enabled');
    }

    BoardManager.setVetoRequested();
    EventManager.addEvent(Event.POLICY_VETO_REQUEST, Target.ALL);
    this.gameState = GameState.PENDING_VETO_REQUEST;
    return EventManager.getNewEvents();
  }

  vetoDecision(confirm) {
    if (this.gameState !== GameState.PENDING_VETO_REQUEST) {
      throw new GameStateError();
    }

    const president = PlayerManager.getPresident();
    const chancellor = PlayerManager.getChancellor();

    if (confirm) {
      BoardManager.increaseVeto();
      EventManager.addEvent(Event.POLICY_VETO_CONFIRMED, Target.ALL, {
        president,
        chancellor,
      });

      CardManager.discardHand();
      this.newTurn();
    } else {
      EventManager.addEvent(Event.POLICY_VETO_DENIED, Target.ALL, {
        president,
        chancellor,
      });
      this.gameState = GameState.ENACT_POLICY;
    }

    return EventManager.getNewEvents();
  }

  enactAction(actionType, target) {
    if (this.gameState !== GameState.EXECUTIVE_ACTION) {
      throw new GameStateError();
    }

    const player = PlayerManager.getPlayerByName(target);

    switch (actionType) {
      case Action.PEEK:
        ActionManager.peek();
        break;
      case Action.INVESTIGATE:
        ActionManager.investigate(player);
        break;
      case Action.KILL:
        ActionManager.kill(player);
        this.isGameOver();
        break;
      case Action.SPECIAL_ELECTION:
        ActionManager.specialElection(player);
        break;
      default:
        break;
    }

    if (actionType === Action.SPECIAL_ELECTION) {
      this.newTurn(player);
    } else {
      this.newTurn();
    }

    return EventManager.getNewEvents();
  }

  isGameOver() {
    if (PlayerManager.isHitlerDead()) {
      log('Hitler Dead, Game Over');
      EventManager.addEvent(Event.GAME_OVER, Target.ALL, {
        type: Event.HITLER_KILLED,
      });

      return true;
    }

    if (PlayerManager.isHitlerChancellor()) {
      log('Hitler Chancellor, Game Over');
      EventManager.addEvent(Event.GAME_OVER, Target.ALL, {
        type: Event.HITLER_ELECTED,
      });

      return true;
    }

    if (BoardManager.liberalPolicyWin()) {
      log('Liberal Policy Win, Game Over');
      EventManager.addEvent(Event.GAME_OVER, Target.ALL, {
        type: Event.LIBERAL_POLICY,
      });

      return true;
    }

    if (BoardManager.fascistPolicyWin()) {
      log('Fascist Policy Win, Game Over');
      EventManager.addEvent(Event.GAME_OVER, Target.ALL, {
        type: Event.FASCIST_POLICY,
      });

      return true;
    }

    return false;
  }
}
