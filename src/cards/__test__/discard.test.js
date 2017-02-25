import Discard from '../discard';

describe('Discard', () => {
  test('should track state', () => {
    const discard = new Discard();
    discard.add({ type: Symbol.for('test') });
    discard.add({ type: Symbol.for('another') });
    discard.add({ type: Symbol.for('type') });

    expect(discard.contents()).toEqual([
      { type: Symbol.for('test') },
      { type: Symbol.for('another') },
      { type: Symbol.for('type') },
    ]);

    discard.empty();

    expect(discard.contents()).toEqual([]);
  });
});
