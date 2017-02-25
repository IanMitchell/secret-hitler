import BoardManager from '../';

describe('BoardManager', () => {
  beforeEach(() => BoardManager.initialize());

  test('should initialize correctly');

  test('should have accurate action map');

  test('should track enacted policies');

  test('should identify when action is available');

  test('should return next action type');

  test('should remove current action type');

  test('should track veto counter', () => {
    expect(BoardManager.vetoCount).toBe(0);

    BoardManager.increaseVeto();
    expect(BoardManager.vetoCount).toBe(1);
  });

  test('should trigger a veto and topdeck a policy');

  test('should override last successful government in a veto');

  test('should identify a liberal policy win', () => {
    // TODO: Stub Board.LIBERAL_POLICY_MAX to 5
    // BoardManager.policyCount.liberal = 5;
    // expect(BoardManager.liberalPolicyWin()).toBe(true);
  });

  test('should identify a fascist policy win', () => {
    // expect(BoardManager.fascistPolicyWin()).toBe(true);
  });

  test('should reset the veto counter', () => {
    BoardManager.vetoCount = 7;
    BoardManager.resetVeto();
    expect(BoardManager.vetoCount).toBe(0);
  });

  test('should track veto request state');

  test('should identify when veto is enabled');

  test('should identify when Hitler Chancellor win condition is enabled');
});
