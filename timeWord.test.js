const timeWord = require('./timeWord');

describe('timeWord', () => {
  test('midnight and noon', () => {
    expect(timeWord('00:00')).toBe('midnight');
    expect(timeWord('12:00')).toBe('noon');
  });

  test('leading oh for 1-9 minutes', () => {
    expect(timeWord('06:01')).toBe('six oh one am');
    expect(timeWord('12:09')).toBe('twelve oh nine pm');
  });

  test('o’clock at exact hour', () => {
    expect(timeWord('01:00')).toBe('one o’clock am');
  });

  test('teens and tens', () => {
    expect(timeWord('06:10')).toBe('six ten am');
    expect(timeWord('06:18')).toBe('six eighteen am');
    expect(timeWord('06:30')).toBe('six thirty am');
    expect(timeWord('10:34')).toBe('ten thirty four am');
  });

  test('am/pm boundaries', () => {
    expect(timeWord('00:12')).toBe('twelve twelve am');
    expect(timeWord('11:59')).toBe('eleven fifty nine am');
    expect(timeWord('12:01')).toBe('twelve oh one pm');
    expect(timeWord('23:23')).toBe('eleven twenty three pm');
  });
});
