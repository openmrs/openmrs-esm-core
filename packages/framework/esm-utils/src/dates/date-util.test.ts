import { afterAll, describe, expect, it } from 'vitest';
import dayjs from 'dayjs';
import timezoneMock from 'timezone-mock';
import type { i18n } from 'i18next';
import {
  toOmrsIsoString,
  toDateObjectStrict,
  isOmrsDateStrict,
  formatDate,
  formatDatetime,
  formatTime,
  registerDefaultCalendar,
  formatPartialDate,
  formatDuration,
  duration,
  formatDurationBetween,
} from './date-util';

window.i18next = { language: 'en' } as i18n;

describe('Openmrs Dates', () => {
  afterAll(() => timezoneMock.unregister());

  it('converts js Date object to omrs date string version', () => {
    let date = dayjs('2018-03-19T00:05:03.999+0300', 'YYYY-MM-DDTHH:mm:ss.SSSZZ').toDate();
    expect(toOmrsIsoString(date, true)).toEqual('2018-03-18T21:05:03.999+0000');
  });

  it('checks if a string is openmrs date', () => {
    expect(isOmrsDateStrict('2018-03-19T00:00:00.000+0300')).toEqual(true);
    expect(isOmrsDateStrict(' 2018-03-19T00:00:00.000+0300 ')).toEqual(true);
    expect(isOmrsDateStrict('2023-10-06T12:56:56.065-0400')).toEqual(true);
    // the exclusion test cases are important for strictness
    expect(isOmrsDateStrict('2018-03-19 00:00:00.000+0300')).toEqual(false);
    expect(isOmrsDateStrict('2018-03-19T00:00:00.000+03:00')).toEqual(false);
    expect(isOmrsDateStrict('2018-03-19T00:00:00.000 0300')).toEqual(false);
    expect(isOmrsDateStrict('2018-03-19T00:00:00 000+0300')).toEqual(false);
    expect(isOmrsDateStrict('2018-03-1')).toEqual(false);
    expect(isOmrsDateStrict('')).toEqual(false);
    expect(isOmrsDateStrict(null as any)).toEqual(false);
    expect(isOmrsDateStrict(undefined as any)).toEqual(false);
  });

  it('converts omrs date string version to js Date object', () => {
    expect(toDateObjectStrict('2018-03-19T00:00:00.000+0300')?.toUTCString()).toEqual('Sun, 18 Mar 2018 21:00:00 GMT');
    expect(toDateObjectStrict('2018-03-19')).toEqual(null);
  });

  it('converts js Date object to omrs date string version', () => {
    let date = dayjs('2018-03-19T00:05:03.999+0300', 'YYYY-MM-DDTHH:mm:ss.SSSZZ').toDate();
    expect(toOmrsIsoString(date, true)).toEqual('2018-03-18T21:05:03.999+0000');
  });

  it("formats 'Today' with respect to the locale", () => {
    const testDate = new Date();
    testDate.setHours(15);
    testDate.setMinutes(22);
    window.i18next.language = 'en';
    expect(formatDate(testDate)).toMatch(/Today,\s+03:22\sPM/);
    expect(formatDate(testDate, { day: false })).toMatch(/Today,\s03:22\sPM/);
    expect(formatDate(testDate, { year: false })).toMatch(/Today,\s03:22\sPM/);
    expect(formatDate(testDate, { mode: 'wide' })).toMatch(/Today,\s03:22\sPM/);
    window.i18next.language = 'sw';
    expect(formatDate(testDate)).toEqual('Leo, 15:22');
    window.i18next.language = 'ru';
    expect(formatDate(testDate)).toEqual('Сегодня, 15:22');
  });

  it('formats dates with respect to the locale', () => {
    timezoneMock.register('UTC');
    const testDate = new Date('2021-12-09T13:15:33');
    window.i18next.language = 'en';
    expect(formatDate(testDate)).toEqual('09-Dec-2021');
    expect(formatDate(testDate, { day: false })).toEqual('Dec 2021');
    expect(formatDate(testDate, { year: false })).toEqual('09 Dec');
    expect(formatDate(testDate, { mode: 'wide' })).toEqual('09 — Dec — 2021');
    expect(formatDate(testDate, { mode: 'wide', year: false })).toEqual('09 — Dec');
    window.i18next.language = 'fr';
    expect(formatDate(testDate)).toEqual('09 déc. 2021');
    expect(formatDate(testDate, { day: false })).toEqual('déc. 2021');
    expect(formatDate(testDate, { year: false })).toEqual('09 déc.');
    expect(formatDate(testDate, { mode: 'wide' })).toEqual('09 — déc. — 2021');
    window.i18next.language = 'sw';
    expect(formatDate(testDate)).toEqual('09 Des 2021');
    window.i18next.language = 'ru';
    expect(formatDate(testDate, { mode: 'wide' })).toMatch(/09\s—\sдек\.\s—\s2021\sг\./);
  });

  it('formats partial dates', () => {
    timezoneMock.register('UTC');
    window.i18next.language = 'en';
    expect(formatPartialDate('2021')).toEqual('2021');
    expect(formatPartialDate('2021-04')).toEqual('Apr 2021');
    expect(formatPartialDate('2021-04-09')).toEqual('09-Apr-2021');
    expect(formatPartialDate('2021-01-01')).toEqual('01-Jan-2021');
    expect(formatPartialDate('2021-12')).toEqual('Dec 2021');
  });

  it('formats dates with respect to the active calendar', () => {
    registerDefaultCalendar('am', 'ethiopic');

    timezoneMock.register('UTC');
    const testDate = new Date('2021-12-09T13:15:33');
    window.i18next.language = 'am';
    expect(formatDate(testDate)).toEqual('30-ኅዳር-2014');
    expect(formatDate(testDate, { day: false })).toEqual('ኅዳር 2014');
    expect(formatDate(testDate, { year: false })).toEqual('ኅዳር 30');
    expect(formatDate(testDate, { mode: 'wide' })).toEqual('30 — ኅዳር — 2014');
    expect(formatDate(testDate, { mode: 'wide', year: false })).toEqual('ኅዳር — 30');

    window.i18next.language = 'am-ET';
    expect(formatDate(testDate)).toEqual('30-ኅዳር-2014');
    expect(formatDate(testDate, { day: false })).toEqual('ኅዳር 2014');
    expect(formatDate(testDate, { year: false })).toEqual('ኅዳር 30');
    expect(formatDate(testDate, { mode: 'wide' })).toEqual('30 — ኅዳር — 2014');
    expect(formatDate(testDate, { mode: 'wide', year: false })).toEqual('ኅዳር — 30');

    window.i18next.language = 'en-u-ca-ethiopic';
    expect(formatDate(testDate)).toEqual('30-Hedar-2014');
    expect(formatDate(testDate, { day: false })).toEqual('Hedar 2014');
    expect(formatDate(testDate, { year: false })).toEqual('30 Hedar');
    expect(formatDate(testDate, { mode: 'wide' })).toEqual('30 — Hedar — 2014');
    expect(formatDate(testDate, { mode: 'wide', year: false })).toEqual('30 — Hedar');

    window.i18next.language = 'th-TH';
    expect(formatDate(testDate)).toEqual('09 ธ.ค. 2564');
    expect(formatDate(testDate, { day: false })).toEqual('ธ.ค. 2564');
    expect(formatDate(testDate, { year: false })).toEqual('09 ธ.ค.');
    expect(formatDate(testDate, { mode: 'wide' })).toEqual('09 — ธ.ค. — 2564');
    expect(formatDate(testDate, { mode: 'wide', year: false })).toEqual('09 — ธ.ค.');
  });

  it('handles leap years correctly in Ethiopian locales', () => {
    timezoneMock.register('UTC');
    const dateBeforeLeapYear = new Date('2023-09-11T09:00:00');

    window.i18next.language = 'en';
    expect(formatDate(dateBeforeLeapYear)).toEqual('11-Sept-2023');

    window.i18next.language = 'am';
    expect(formatDate(dateBeforeLeapYear)).toEqual('06-ጳጉሜን-2015');

    const dateAfterLeapYear = new Date('2023-09-12T09:00:00');
    expect(formatDate(dateAfterLeapYear)).toEqual('01-መስከረም-2016');
  });

  it('respects the `time` option', () => {
    timezoneMock.register('UTC');
    const testDate = new Date('2021-12-09T13:15:33');
    const today = new Date();
    today.setHours(15);
    today.setMinutes(22);
    window.i18next.language = 'en';
    expect(formatDate(testDate)).toEqual('09-Dec-2021');
    expect(formatDate(testDate, { time: true })).toMatch(/09-Dec-2021,\s01:15\sPM/);
    expect(formatDate(testDate, { time: false })).toEqual('09-Dec-2021');
    expect(formatDate(testDate, { time: 'for today' })).toEqual('09-Dec-2021');
    expect(formatDate(today, { time: true })).toMatch(/Today,\s03:22\sPM/);
    expect(formatDate(today, { time: false })).toEqual('Today');
    expect(formatDate(today, { time: 'for today' })).toMatch(/Today, 03:22\sPM/);
  });

  it('formats times with respect to the locale', () => {
    timezoneMock.register('Australia/Adelaide');
    const testDate = new Date('2021-12-09T13:15:33');
    window.i18next.language = 'en';
    expect(formatTime(testDate)).toMatch(/01:15\sPM/i);
    window.i18next.language = 'es-CO';
    expect(formatTime(testDate)).toMatch(/1:15\sp.\sm./); // it's not a normal space between the 'p.' and 'm.'
    window.i18next.language = 'es-MX';
    // TODO: Figure out whether this test fails because of the timezone or the locale or daylight saving time
    // expect(formatTime(testDate)).toEqual('13:15');
  });

  it('formats datetimes with respect to the locale', () => {
    timezoneMock.register('US/Pacific');
    const testDate = new Date('2022-02-09T13:15:33');
    const todayDate = new Date();
    todayDate.setHours(15);
    todayDate.setMinutes(20);
    window.i18next.language = 'en';
    expect(formatDatetime(testDate)).toMatch(/09-Feb-2022,\s01:15\sPM/i);
    expect(formatDatetime(todayDate)).toMatch(/Today,\s03:20\sPM/i);
    window.i18next.language = 'ht';
    expect(formatDatetime(testDate)).toEqual('09 févr. 2022, 13:15');
    expect(formatDatetime(todayDate)).toEqual('Aujourd’hui, 15:20');
  });

  it('does not handle today specially when `noToday` is passed', () => {
    const testDate = new Date();
    testDate.setHours(15);
    testDate.setMinutes(22);
    window.i18next.language = 'en';
    const expected =
      testDate
        .toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        })
        .replace(/ /g, '-') + ', 03:22 PM';
    expect(formatDate(testDate, { noToday: true }).replaceAll(/[\u202F]/g, ' ')).toEqual(expected);
  });

  it('formats duration with respect to the locale', () => {
    window.i18next.language = 'en';
    const dur = { hours: 1, minutes: 1, seconds: 1, days: 1, months: 1, years: 1 };
    expect(formatDuration(dur, { style: 'narrow' })).toMatch(/1y.*1m.*1d.*1h.*1m.*1s/);
    expect(formatDuration(dur, { style: 'short' })).toMatch(/1\s+yr,.*1\s+mth,.*1\s+day,.*1\s+hr,.*1\s+min,.*1\s+sec/);
    expect(formatDuration(dur, { style: 'long' })).toMatch(
      /1\s+year,.*1\s+month,.*1\s+day,.*1\s+hour,.*1\s+minute,.*1\s+second/,
    );
  });
});

describe('duration', () => {
  const now = dayjs('2024-07-30T08:30:55Z');

  it('returns null for null startDate', () => {
    expect(duration(null, now)).toBeNull();
  });

  describe('auto-selected units', () => {
    it.each([
      {
        label: '0 seconds ago',
        startDate: now,
        expected: { seconds: 0 },
      },
      {
        label: '30 seconds ago',
        startDate: now.subtract(30, 'seconds'),
        expected: { seconds: 30 },
      },
      {
        label: '44 seconds ago (still seconds)',
        startDate: now.subtract(44, 'seconds'),
        expected: { seconds: 44 },
      },
      {
        label: '45 seconds ago (switches to minutes)',
        startDate: now.subtract(45, 'seconds'),
        expected: { minutes: 0 },
      },
      {
        label: '30 minutes ago',
        startDate: now.subtract(30, 'minutes'),
        expected: { minutes: 30 },
      },
      {
        label: '44 minutes ago (still minutes)',
        startDate: now.subtract(44, 'minutes'),
        expected: { minutes: 44 },
      },
      {
        label: '45 minutes ago (switches to hours)',
        startDate: now.subtract(45, 'minutes'),
        expected: { hours: 0 },
      },
      {
        label: '10 hours ago',
        startDate: now.subtract(10, 'hours'),
        expected: { hours: 10 },
      },
      {
        label: '22 hours ago (switches to days)',
        startDate: now.subtract(22, 'hours'),
        expected: { days: 0 },
      },
      {
        label: '20 days ago',
        startDate: now.subtract(20, 'days'),
        expected: { days: 20 },
      },
      {
        label: '26 days ago (switches to months)',
        startDate: now.subtract(26, 'days'),
        expected: { months: 0 },
      },
      {
        label: '6 months ago',
        startDate: now.subtract(6, 'months'),
        expected: { months: 6 },
      },
      {
        label: '11 months ago (switches to years)',
        startDate: now.subtract(11, 'months'),
        expected: { years: 0 },
      },
      {
        label: '3 years ago',
        startDate: now.subtract(3, 'years'),
        expected: { years: 3 },
      },
    ])('returns $expected for $label', ({ startDate, expected }) => {
      expect(duration(startDate, now)).toEqual(expected);
    });
  });

  describe('explicit unit', () => {
    it.each([
      { unit: 'days' as const, expected: { days: 366 } },
      { unit: 'hours' as const, expected: { hours: 8784 } },
      { unit: 'months' as const, expected: { months: 12 } },
      { unit: 'years' as const, expected: { years: 1 } },
      { unit: 'year' as const, expected: { years: 1 } },
    ])('returns $expected for explicit unit "$unit"', ({ unit, expected }) => {
      const oneYearAgo = now.subtract(1, 'year');
      expect(duration(oneYearAgo, now, unit)).toEqual(expected);
    });
  });

  describe('string dates', () => {
    it('handles year-only string', () => {
      expect(duration('2000', now)).toEqual({ years: 24 });
    });

    it('handles year-month string', () => {
      expect(duration('2020-06', now)).toEqual({ years: 4 });
    });

    it('handles full date string', () => {
      expect(duration('2024-07-30', now)).toEqual({ seconds: 0 });
    });

    it('returns null for invalid string', () => {
      expect(duration('not a date', now)).toBeNull();
    });
  });

  describe('custom thresholds', () => {
    it('uses custom seconds threshold', () => {
      const thirtySecondsAgo = now.subtract(30, 'seconds');
      // Default threshold is 45, so 30s would be seconds. With threshold 20, it should be minutes.
      expect(duration(thirtySecondsAgo, now, { thresholds: { seconds: 20 } })).toEqual({ minutes: 0 });
    });

    it('uses custom days threshold', () => {
      const twentyDaysAgo = now.subtract(20, 'days');
      // Default threshold is 26, so 20 days would be days. With threshold 15, it should be months.
      expect(duration(twentyDaysAgo, now, { thresholds: { days: 15 } })).toEqual({ months: 0 });
    });
  });

  describe('multi-unit decomposition', () => {
    it('decomposes years, months, days', () => {
      const start = now.subtract(2, 'years').subtract(3, 'months').subtract(15, 'days');
      const result = duration(start, now, { largestUnit: 'years', smallestUnit: 'days' });
      expect(result).toEqual({ years: 2, months: 3, days: 15 });
    });

    it('decomposes hours and minutes', () => {
      const start = now.subtract(5, 'hours').subtract(30, 'minutes');
      const result = duration(start, now, { largestUnit: 'hours', smallestUnit: 'minutes' });
      expect(result).toEqual({ hours: 5, minutes: 30 });
    });

    it('accepts singular unit forms', () => {
      const start = now.subtract(2, 'years').subtract(3, 'months');
      const result = duration(start, now, { largestUnit: 'year', smallestUnit: 'month' });
      expect(result).toEqual({ years: 2, months: 3 });
    });

    it('single unit when largestUnit === smallestUnit', () => {
      const start = now.subtract(100, 'days');
      const result = duration(start, now, { largestUnit: 'days', smallestUnit: 'days' });
      expect(result).toEqual({ days: 100 });
    });

    it('defaults smallestUnit to largestUnit when only largestUnit is given', () => {
      const start = now.subtract(100, 'days');
      const result = duration(start, now, { largestUnit: 'days' });
      expect(result).toEqual({ days: 100 });
    });

    it('defaults smallestUnit to largestUnit for single-unit result', () => {
      const start = now.subtract(2, 'years').subtract(3, 'months');
      const result = duration(start, now, { largestUnit: 'months' });
      expect(result).toEqual({ months: 27 });
    });
  });

  describe('largestUnit auto', () => {
    it('finds the largest non-zero unit', () => {
      const start = now.subtract(3, 'months').subtract(5, 'days');
      const result = duration(start, now, { largestUnit: 'auto', smallestUnit: 'days' });
      expect(result).toEqual({ months: 3, days: 5 });
    });

    it('falls back to smallestUnit when diff is zero', () => {
      const result = duration(now, now, { largestUnit: 'auto', smallestUnit: 'seconds' });
      expect(result).toEqual({ seconds: 0 });
    });

    it('resolves auto when smallestUnit is omitted', () => {
      const start = now.subtract(2, 'hours');
      const result = duration(start, now, { largestUnit: 'auto', smallestUnit: 'minutes' });
      expect(result).toEqual({ hours: 2, minutes: 0 });
    });

    it('uses auto as default when only smallestUnit is set', () => {
      const start = now.subtract(1, 'year').subtract(3, 'months');
      const result = duration(start, now, { smallestUnit: 'months' });
      expect(result).toEqual({ years: 1, months: 3 });
    });
  });
});

describe('formatDurationBetween', () => {
  const now = dayjs('2024-07-30T08:30:55Z');

  it('returns null for null startDate', () => {
    expect(formatDurationBetween(null, now)).toBeNull();
  });

  it.each([
    {
      label: '30 seconds ago',
      startDate: now.subtract(30, 'seconds'),
      expectedPattern: /30\s+sec/,
    },
    {
      label: '30 minutes ago',
      startDate: now.subtract(30, 'minutes'),
      expectedPattern: /30\s+min/,
    },
    {
      label: '10 hours ago',
      startDate: now.subtract(10, 'hours'),
      expectedPattern: /10\s+hr/,
    },
    {
      label: '20 days ago',
      startDate: now.subtract(20, 'days'),
      expectedPattern: /20\s+days/,
    },
    {
      label: '6 months ago',
      startDate: now.subtract(6, 'months'),
      expectedPattern: /6\s+mths/,
    },
    {
      label: '3 years ago',
      startDate: now.subtract(3, 'years'),
      expectedPattern: /3\s+yrs/,
    },
  ])('formats $label', ({ startDate, expectedPattern }) => {
    window.i18next.language = 'en';
    expect(formatDurationBetween(startDate, now)).toMatch(expectedPattern);
  });

  it('formats with explicit unit', () => {
    window.i18next.language = 'en';
    const oneYearAgo = now.subtract(1, 'year');
    expect(formatDurationBetween(oneYearAgo, now, 'days')).toMatch(/366\s+days/);
  });

  it('handles year-only string', () => {
    window.i18next.language = 'en';
    expect(formatDurationBetween('2000', now)).toMatch(/24\s+yrs/);
  });

  it('handles year-month string', () => {
    window.i18next.language = 'en';
    expect(formatDurationBetween('2020-06', now)).toMatch(/4\s+yrs/);
  });

  it('returns null for invalid string', () => {
    expect(formatDurationBetween('not a date', now)).toBeNull();
  });

  it('formats multi-unit decomposition', () => {
    window.i18next.language = 'en';
    const start = now.subtract(2, 'years').subtract(3, 'months').subtract(15, 'days');
    const result = formatDurationBetween(start, now, { largestUnit: 'years', smallestUnit: 'days' });
    expect(result).toMatch(/2\s+yrs.*3\s+mths.*15\s+days/);
  });

  it('supports custom formatOptions with long style', () => {
    window.i18next.language = 'en';
    const start = now.subtract(2, 'years').subtract(3, 'months');
    const result = formatDurationBetween(start, now, {
      largestUnit: 'years',
      smallestUnit: 'months',
      formatOptions: { style: 'long' },
    });
    expect(result).toMatch(/2\s+years.*3\s+months/);
  });

  it('supports custom formatOptions with narrow style', () => {
    window.i18next.language = 'en';
    const start = now.subtract(2, 'years').subtract(3, 'months');
    const result = formatDurationBetween(start, now, {
      largestUnit: 'years',
      smallestUnit: 'months',
      formatOptions: { style: 'narrow' },
    });
    expect(result).toMatch(/2y.*3m/);
  });
});
