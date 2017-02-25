import EventManager from '../';

describe('EventManager', () => {
  beforeEach(() => EventManager.initialize());

  test('should track new events', () => {
    expect(EventManager.log.length).toBe(0);

    EventManager.addEvent('type', 'target', 'data');
    expect(EventManager.log.length).toBe(1);

    EventManager.addEvent('type2', 'target', 'data');
    expect(EventManager.log.length).toBe(2);
    expect(EventManager.marker).toBe(0);
  });

  test('should return correct subset of new events', () => {
    expect(EventManager.marker).toBe(0);

    EventManager.addEvent('type', 'target', 'data');
    EventManager.addEvent('type2', 'target', 'data');

    let newEvents = EventManager.getNewEvents();
    expect(newEvents.length).toBe(2);
    expect(EventManager.marker).toBe(2);

    EventManager.addEvent('type3', 'target3', 'data3');
    newEvents = EventManager.getNewEvents();
    expect(EventManager.log.length).toBe(3);
    expect(newEvents.length).toBe(1);
    expect(EventManager.marker).toBe(3);

    expect(newEvents[0].type).toBe('type3');
    expect(newEvents[0].target).toBe('target3');
    expect(newEvents[0].data).toBe('data3');
  });
});
