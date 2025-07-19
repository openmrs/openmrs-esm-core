/**
 * @module
 * @category Date and Time
 */
import {
  type CalendarDate,
  type CalendarDateTime,
  type CalendarIdentifier,
  type ZonedDateTime,
  createCalendar,
  toCalendar,
} from '@internationalized/date';
import { DurationFormat } from '@formatjs/intl-durationformat';
import { attempt } from 'any-date-parser';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday.js';
import objectSupport from 'dayjs/plugin/objectSupport.js';
import utc from 'dayjs/plugin/utc.js';
import { isNil, omit } from 'lodash-es';
import { getLocale } from '../';
import type { DurationFormatOptions, DurationInput } from '@formatjs/intl-durationformat/src/types';

dayjs.extend(isToday);
dayjs.extend(utc);
dayjs.extend(objectSupport);

export type DateInput = string | number | Date;

const isoFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZZ';

/**
 * This function checks whether a date string is the OpenMRS ISO format.
 * The format should be YYYY-MM-DDTHH:mm:ss.SSSZZ
 */
export function isOmrsDateStrict(omrsPayloadString: string): boolean {
  // omrs format 2018-03-19T00:00:00.000+0300
  if (omrsPayloadString === null || omrsPayloadString === undefined || omrsPayloadString.trim().length !== 28) {
    return false;
  }
  omrsPayloadString = omrsPayloadString.trim();

  // 11th character will always be T
  if (omrsPayloadString[10] !== 'T') {
    return false;
  }

  // checking time format
  if (omrsPayloadString[13] !== ':' || omrsPayloadString[16] !== ':' || omrsPayloadString[19] !== '.') {
    return false;
  }

  // checking UTC offset format
  if (!(omrsPayloadString[23] === '+' || omrsPayloadString[23] === '-')) {
    return false;
  }

  return dayjs(omrsPayloadString, isoFormat).isValid();
}

/**
 *
 * @param date Checks if the provided date is today.
 */
export function isOmrsDateToday(date: DateInput) {
  return dayjs(date).isToday();
}

/**
 * Converts the object to a date object if it is an OpenMRS ISO date time string.
 * Otherwise returns null.
 */
export function toDateObjectStrict(omrsDateString: string): Date | null {
  if (!isOmrsDateStrict(omrsDateString)) {
    return null;
  }

  return dayjs(omrsDateString, isoFormat).toDate();
}

/**
 * Formats the input to OpenMRS ISO format: "YYYY-MM-DDTHH:mm:ss.SSSZZ".
 */
export function toOmrsIsoString(date: DateInput, toUTC = false): string {
  let d = dayjs(date);

  if (toUTC) {
    d = d.utc();
  }

  return d.format(isoFormat);
}

/**
 * Utility function to parse an arbitrary string into a date.
 * Uses `dayjs(dateString)`.
 */
export function parseDate(dateString: string) {
  return dayjs(dateString).toDate();
}

/**
 * Internal cache for per-locale calendars
 */
class LocaleCalendars {
  #registry = new Map<string, CalendarIdentifier>();

  constructor() {}

  register(locale: string, calendar: CalendarIdentifier) {
    this.#registry.set(locale, calendar);
  }

  getCalendar(locale: Intl.Locale): CalendarIdentifier | undefined {
    if (!Boolean(locale)) {
      return undefined;
    }

    if (locale.calendar) {
      return locale.calendar as CalendarIdentifier;
    }

    if (locale.region) {
      const key = `${locale.language}-${locale.region}`;
      if (this.#registry.has(key)) {
        return this.#registry.get(key);
      }
    }

    if (locale.language && this.#registry.has(locale.language)) {
      return this.#registry.get(locale.language);
    }

    const defaultCalendar = new Intl.DateTimeFormat(locale.toString()).resolvedOptions().calendar as CalendarIdentifier;

    // cache this result
    this.#registry.set(`${locale.language}${locale.region ? `-${locale.region}` : ''}`, defaultCalendar);

    return defaultCalendar;
  }
}

const registeredLocaleCalendars = new LocaleCalendars();

/**
 * Provides the name of the calendar to associate, as a default, with the given base locale.
 *
 * @example
 * ```
 * registerDefaultCalendar('en', 'buddhist') // sets the default calendar for the 'en' locale to Buddhist.
 * ```
 *
 * @param locale the locale to register this calendar for
 * @param calendar the calendar to use for this registration
 */
export function registerDefaultCalendar(locale: string, calendar: CalendarIdentifier) {
  registeredLocaleCalendars.register(locale, calendar);
}

/**
 * Retrieves the default calendar for the specified locale if any.
 *
 * @param locale the locale to look-up
 */
export function getDefaultCalendar(locale: Intl.Locale | string | undefined) {
  const locale_ = locale ?? getLocale();

  return registeredLocaleCalendars.getCalendar(locale_ instanceof Intl.Locale ? locale_ : new Intl.Locale(locale_));
}

export type FormatDateMode = 'standard' | 'wide';

export type FormatDateOptions = {
  /**
   * The calendar to use when formatting this date.
   */
  calendar?: string;
  /**
   * The locale to use when formatting this date
   */
  locale?: string;
  /**
   * - `standard`: "03 Feb 2022"
   * - `wide`:     "03 — Feb — 2022"
   */
  mode: FormatDateMode;
  /**
   * Whether the time should be included in the output always (`true`),
   * never (`false`), or only when the input date is today (`for today`).
   */
  time: true | false | 'for today';
  /** Whether to include the day number */
  day: boolean;
  /** Whether to include the month number */
  month: boolean;
  /** Whether to include the year */
  year: boolean;
  /** The unicode numbering system to use */
  numberingSystem?: string;
  /**
   * Disables the special handling of dates that are today. If false
   * (the default), then dates that are today will be formatted as "Today"
   * in the locale language. If true, then dates that are today will be
   * formatted the same as all other dates.
   */
  noToday: boolean;
};

const defaultOptions: FormatDateOptions = {
  mode: 'standard',
  time: 'for today',
  day: true,
  month: true,
  year: true,
  noToday: false,
};

/**
 * Formats the string representing a date, including partial representations of dates, according to the current
 * locale and the given options.
 *
 * Default options:
 *  - mode: "standard",
 *  - time: "for today",
 *  - day: true,
 *  - month: true,
 *  - year: true
 *  - noToday: false
 *
 * If the date is today then "Today" is produced (in the locale language).
 * This behavior can be disabled with `noToday: true`.
 *
 * When time is included, it is appended with a comma and a space. This
 * agrees with the output of `Date.prototype.toLocaleString` for *most*
 * locales.
 */
// TODO: Shouldn't throw on null input
export function formatPartialDate(dateString: string, options: Partial<FormatDateOptions> = {}) {
  const locale = getLocale();
  let parsed: ReturnType<typeof attempt> & { date?: number } = attempt(dateString, locale);

  if (parsed.invalid) {
    console.warn(`Could not parse invalid date '${dateString}'`);
    return null;
  }

  // hack here but any date interprets 2000-01, etc. as yyyy-dd rather than yyyy-mm
  if (!isNil(parsed.day) && isNil(parsed.month)) {
    parsed = Object.assign({}, omit(parsed, 'day'), { month: parsed.day });
  }

  // dayjs' object support uses 0-based months, whereas any-date-parser uses 1-based months
  if (parsed.month) {
    parsed.month -= 1;
  }

  // in dayjs day is day of week; in any-date-parser, its day of month, so we need to convert them
  if (parsed.day) {
    parsed = Object.assign({}, omit(parsed, 'day'), { date: parsed.day });
  }

  const date = dayjs().set(parsed).toDate();

  if (isNil(parsed.year)) {
    options.year = false;
  }

  if (isNil(parsed.month)) {
    options.month = false;
  }

  if (isNil(parsed.date)) {
    options.day = false;
  }

  return formatDate(date, options);
}

/**
 * Formats the input date according to the current locale and the
 * given options.
 *
 * Default options:
 *  - mode: "standard",
 *  - time: "for today",
 *  - day: true,
 *  - month: true,
 *  - year: true
 *  - noToday: false
 *
 * If the date is today then "Today" is produced (in the locale language).
 * This behavior can be disabled with `noToday: true`.
 *
 * When time is included, it is appended with a comma and a space. This
 * agrees with the output of `Date.prototype.toLocaleString` for *most*
 * locales.
 */
// TODO: Shouldn't throw on null input
export function formatDate(date: Date, options?: Partial<FormatDateOptions>) {
  let locale = options?.locale ?? getLocale();
  const _locale = new Intl.Locale(locale);

  const { calendar, mode, time, day, month, year, noToday, numberingSystem }: FormatDateOptions = {
    ...defaultOptions,
    ...{ noToday: _locale.language === 'am' ? true : false },
    ...options,
  };

  const formatCalendar = calendar ?? getDefaultCalendar(_locale);

  const formatterOptions: Intl.DateTimeFormatOptions = {
    calendar: formatCalendar,
    year: year ? 'numeric' : undefined,
    month: month ? 'short' : undefined,
    day: day ? '2-digit' : undefined,
    numberingSystem,
  };

  let localeString: string;
  const isToday = dayjs(date).isToday();
  if (isToday && !noToday) {
    // This produces the word "Today" in the language of `locale`
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    localeString = rtf.format(0, 'day');
    localeString = localeString[0].toLocaleUpperCase(locale) + localeString.slice(1);
  } else {
    if (_locale.language === 'en') {
      // This locale override is here rather than in `getLocale`
      // because Americans should see AM/PM for times.
      locale = 'en-GB';
    }

    const formatter = new Intl.DateTimeFormat(locale, formatterOptions);
    let parts = formatter.formatToParts(date);

    if ((_locale.language === 'en' || _locale.language === 'am') && mode == 'standard' && year && day) {
      // Custom formatting for English and Amharic. Use hyphens instead of spaces.
      parts = parts.map(formatParts('-'));
    }

    if (mode == 'wide') {
      parts = parts.map(formatParts(' — ')); // space-emdash-space
    }

    // omit the era when using the Ethiopic calendar
    if (formatterOptions.calendar === 'ethiopic') {
      parts = parts.filter((part, idx, values) => {
        if (
          part.type === 'era' ||
          (part.type === 'literal' && idx < values.length - 1 && values[idx + 1].type === 'era')
        ) {
          return false;
        }

        return true;
      });
    }

    localeString = parts.map((p) => p.value).join('');
  }
  if (time === true || (isToday && time === 'for today')) {
    localeString += `, ${formatTime(date)}`;
  }
  return localeString;
}

// Internal curried call-back for map()
const formatParts = (separator: string) => {
  return (part: Intl.DateTimeFormatPart, idx: number, values: Array<Intl.DateTimeFormatPart>) => {
    if (part.type !== 'literal' || part.value !== ' ') {
      return part;
    }

    if (idx < values.length - 1 && values[idx + 1].type === 'era') {
      return part;
    }

    return { type: 'literal', value: separator } as Intl.DateTimeFormatPart;
  };
};

/**
 * Formats the input as a time, according to the current locale.
 * 12-hour or 24-hour clock depends on locale.
 */
export function formatTime(date: Date) {
  return date.toLocaleTimeString(getLocale(), {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formats the input into a string showing the date and time, according
 * to the current locale. The `mode` parameter is as described for
 * `formatDate`.
 *
 * This is created by concatenating the results of `formatDate`
 * and `formatTime` with a comma and space. This agrees with the
 * output of `Date.prototype.toLocaleString` for *most* locales.
 */
export function formatDatetime(date: Date, options?: Partial<Omit<FormatDateOptions, 'time'>>) {
  return formatDate(date, { ...options, time: true });
}

/**
 * Converts a calendar date to the equivalent locale calendar date.
 * @returns CalendarDate
 */
export function convertToLocaleCalendar(
  date: CalendarDate | CalendarDateTime | ZonedDateTime,
  locale: string | Intl.Locale,
) {
  let locale_ = typeof locale === 'string' ? new Intl.Locale(locale) : locale;
  const localCalendarName = getDefaultCalendar(locale_);

  return localCalendarName ? toCalendar(date, createCalendar(localCalendarName)) : date;
}

/**
 * Formats the input duration according to the current locale.
 *
 * @param duration The duration to format (DurationInput object).
 * @param options Optional options for formatting.
 * @returns The formatted duration string.
 */
export function formatDuration(duration: DurationInput, options?: DurationFormatOptions) {
  const formatter = new DurationFormat(getLocale(), options);
  return formatter.format(duration);
}
