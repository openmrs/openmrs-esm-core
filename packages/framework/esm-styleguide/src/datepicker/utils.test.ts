import { describe, expect, it } from 'vitest';
import { CalendarDate, CalendarDateTime, EthiopicCalendar } from '@internationalized/date';
import { dateToInternationalizedDate, internationalizedDateToDate, removeDataAttributes } from './utils';

describe('dateToInternationalizedDate', () => {
  it('returns undefined for undefined input', () => {
    expect(dateToInternationalizedDate(undefined, undefined)).toBeUndefined();
  });

  it('returns undefined for null input when allowNull is false', () => {
    expect(dateToInternationalizedDate(null, undefined, false)).toBeUndefined();
  });

  it('returns null for null input when allowNull is true', () => {
    expect(dateToInternationalizedDate(null, undefined, true)).toBeNull();
  });

  it('returns undefined for empty string input', () => {
    expect(dateToInternationalizedDate('', undefined)).toBeUndefined();
  });

  it('returns null for empty string input when allowNull is true', () => {
    expect(dateToInternationalizedDate('', undefined, true)).toBeNull();
  });

  it('passes through CalendarDate unchanged when no calendar is provided', () => {
    const date = new CalendarDate(2025, 3, 15);
    const result = dateToInternationalizedDate(date, undefined);
    expect(result).toBe(date);
  });

  it('passes through CalendarDateTime unchanged when no calendar is provided', () => {
    const date = new CalendarDateTime(2025, 3, 15, 10, 30);
    const result = dateToInternationalizedDate(date, undefined);
    expect(result).toBe(date);
  });

  it('converts CalendarDate to a different calendar system', () => {
    const date = new CalendarDate(2025, 3, 15);
    const calendar = new EthiopicCalendar();
    const result = dateToInternationalizedDate(date, calendar);
    expect(result).toBeDefined();
    expect(result!.calendar.identifier).toBe('ethiopic');
  });

  it('converts a JS Date to CalendarDate', () => {
    const jsDate = new Date(2025, 2, 15); // March 15, 2025
    const result = dateToInternationalizedDate(jsDate, undefined);
    expect(result).toBeDefined();
    expect(result!.year).toBe(2025);
    expect(result!.month).toBe(3);
    expect(result!.day).toBe(15);
  });

  it('converts an ISO date string to CalendarDate', () => {
    const result = dateToInternationalizedDate('2025-03-15', undefined);
    expect(result).toBeDefined();
    expect(result!.year).toBe(2025);
    expect(result!.month).toBe(3);
    expect(result!.day).toBe(15);
  });

  it('converts a JS Date to a non-Gregorian calendar', () => {
    const jsDate = new Date(2025, 2, 15);
    const calendar = new EthiopicCalendar();
    const result = dateToInternationalizedDate(jsDate, calendar);
    expect(result).toBeDefined();
    expect(result!.calendar.identifier).toBe('ethiopic');
  });
});

describe('internationalizedDateToDate', () => {
  it('returns undefined for falsy input', () => {
    expect(internationalizedDateToDate(null as any)).toBeUndefined();
    expect(internationalizedDateToDate(undefined as any)).toBeUndefined();
  });

  it('converts a CalendarDate to a JS Date', () => {
    const calendarDate = new CalendarDate(2025, 3, 15);
    const result = internationalizedDateToDate(calendarDate);
    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(2025);
    expect(result!.getMonth()).toBe(2); // JS months are 0-indexed
    expect(result!.getDate()).toBe(15);
  });

  it('converts a CalendarDateTime to a JS Date', () => {
    const dateTime = new CalendarDateTime(2025, 6, 18, 14, 30);
    const result = internationalizedDateToDate(dateTime);
    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(2025);
    expect(result!.getMonth()).toBe(5);
    expect(result!.getDate()).toBe(18);
  });
});

describe('removeDataAttributes', () => {
  it('removes data-* attributes from an object', () => {
    const props = {
      id: 'test',
      className: 'foo',
      'data-testid': 'bar',
      'data-custom': 'baz',
    };
    const result = removeDataAttributes(props);
    expect(result).toEqual({ id: 'test', className: 'foo' });
  });

  it('preserves all non-data attributes', () => {
    const props = { onClick: () => {}, style: {}, role: 'button' };
    const result = removeDataAttributes(props);
    expect(result).toEqual(props);
  });

  it('returns empty object when all props are data attributes', () => {
    const result = removeDataAttributes({ 'data-a': 1, 'data-b': 2 });
    expect(result).toEqual({});
  });

  it('handles empty object', () => {
    expect(removeDataAttributes({})).toEqual({});
  });
});
