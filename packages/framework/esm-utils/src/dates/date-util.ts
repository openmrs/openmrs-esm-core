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
import { attempt } from 'any-date-parser';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday.js';
import objectSupport from 'dayjs/plugin/objectSupport.js';
import utc from 'dayjs/plugin/utc.js';
import { isNil, omit } from 'lodash-es';
import { getLocale } from '../';

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
 * Checks if the provided date is today.
 *
 * @param date The date to check.
 * @returns `true` if the date is today, `false` otherwise.
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
 *
 * @param dateString The date string to parse and format.
 * @param options Optional formatting options.
 * @returns The formatted date string, or `null` if the input cannot be parsed.
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
 *
 * @param date The date to format.
 * @param options Optional formatting options.
 * @returns The formatted date string.
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
 *
 * @param date The date whose time portion should be formatted.
 * @returns The formatted time string (e.g., "2:30 PM" or "14:30").
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
 *
 * @param date The date to format.
 * @param options Optional formatting options (same as formatDate, except time is always included).
 * @returns The formatted date and time string.
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
export function formatDuration(duration: Intl.DurationInput, options?: Intl.DurationFormatOptions) {
  const formatter = new Intl.DurationFormat(getLocale(), options);
  return formatter.format(duration);
}

/**
 * Parses a date input into a dayjs object. String inputs are interpreted using
 * any-date-parser with corrections for its month/day representation differences
 * with dayjs. Non-string inputs are passed directly to dayjs.
 *
 * @param dateInput The date to parse.
 * @param referenceDate Used as the base when resolving partial string dates (e.g., '2000' resolves missing fields from this date).
 * @returns A dayjs object, or null if the string could not be parsed.
 */
export function parseDateInput(dateInput: dayjs.ConfigType, referenceDate: dayjs.Dayjs): dayjs.Dayjs | null {
  if (dateInput == null) {
    return null;
  }

  if (typeof dateInput === 'string') {
    const locale = getLocale();
    let parsedDate = attempt(dateInput, locale);
    if (parsedDate.invalid) {
      console.warn(`Could not interpret '${dateInput}' as a date`);
      return null;
    }

    // hack here but any date interprets 2000-01, etc. as yyyy-dd rather than yyyy-mm
    if (parsedDate.day && !parsedDate.month) {
      parsedDate = { ...omit(parsedDate, 'day'), ...{ month: parsedDate.day } };
    }

    // dayjs' object support uses 0-based months, whereas any-date-parser uses 1-based months
    if (parsedDate.month) {
      parsedDate.month -= 1;
    }

    // in dayjs day is day of week; in any-date-parser, its day of month, so we need to convert them
    if (parsedDate.day) {
      parsedDate = { ...omit(parsedDate, 'day'), ...{ date: parsedDate.day } };
    }

    return dayjs(referenceDate).set(parsedDate);
  }

  return dayjs(dateInput);
}

type DurationUnitPlural = 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years';
type DurationUnitSingular = 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year';

/** Accepts both singular ('year') and plural ('years') forms, mirroring Temporal.Duration.round(). */
export type DurationUnit = DurationUnitPlural | DurationUnitSingular;

export interface DurationOptions {
  /** Override auto-selection thresholds. Each value is in the unit's own terms (e.g., seconds: 30 means "use seconds if < 30 seconds"). */
  thresholds?: Partial<Record<DurationUnit, number>>;
  /**
   * Coarsest unit to include. Accepts 'auto' (default when smallestUnit is set),
   * which resolves to the largest non-zero unit or smallestUnit, whichever is greater.
   * Mirrors Temporal.Duration.round() behavior.
   */
  largestUnit?: DurationUnit | 'auto';
  /** Finest unit to include. Defaults to largestUnit when largestUnit is an explicit unit, giving a single-unit result. */
  smallestUnit?: DurationUnit;
}

export interface DurationOptionsWithFormat extends DurationOptions {
  /** Options passed to Intl.DurationFormat. Defaults to { style: 'short', localeMatcher: 'lookup' }. */
  formatOptions?: Intl.DurationFormatOptions;
}

const UNIT_ORDER: DurationUnitPlural[] = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'];

const SINGULAR_TO_PLURAL: Record<DurationUnitSingular, DurationUnitPlural> = {
  second: 'seconds',
  minute: 'minutes',
  hour: 'hours',
  day: 'days',
  month: 'months',
  year: 'years',
};

function normalizeUnit(unit: DurationUnit): DurationUnitPlural {
  return SINGULAR_TO_PLURAL[unit as DurationUnitSingular] ?? (unit as DurationUnitPlural);
}

/**
 * Normalizes threshold keys from singular/plural to plural, then merges with defaults.
 */
function normalizeThresholds(thresholds?: Partial<Record<DurationUnit, number>>): Record<DurationUnitPlural, number> {
  const result = { ...DEFAULT_THRESHOLDS };
  if (thresholds) {
    for (const [key, value] of Object.entries(thresholds)) {
      if (value !== undefined) {
        result[normalizeUnit(key as DurationUnit)] = value;
      }
    }
  }
  return result;
}

const DEFAULT_THRESHOLDS: Record<DurationUnitPlural, number> = {
  seconds: 45,
  minutes: 45,
  hours: 22,
  days: 26,
  months: 11,
  years: Infinity,
};

/**
 * Auto-selects the appropriate unit based on the magnitude of the duration,
 * using the provided thresholds (or defaults).
 */
function autoSelectUnit(
  from: dayjs.Dayjs,
  to: dayjs.Dayjs,
  thresholds?: Partial<Record<DurationUnit, number>>,
): DurationUnitPlural {
  const t = normalizeThresholds(thresholds);

  if (to.diff(from, 'seconds') < t.seconds) return 'seconds';
  if (to.diff(from, 'minutes') < t.minutes) return 'minutes';
  if (to.diff(from, 'hours') < t.hours) return 'hours';
  if (to.diff(from, 'days') < t.days) return 'days';
  if (to.diff(from, 'months') < t.months) return 'months';
  return 'years';
}

/**
 * Finds the largest unit with a non-zero diff, or falls back to smallestUnit.
 * Mirrors the Temporal.Duration.round() 'auto' behavior for largestUnit.
 */
function autoLargestUnit(from: dayjs.Dayjs, to: dayjs.Dayjs, smallestUnit: DurationUnitPlural): DurationUnitPlural {
  const smallestIdx = UNIT_ORDER.indexOf(smallestUnit);

  for (let i = 0; i < UNIT_ORDER.length; i++) {
    const unit = UNIT_ORDER[i];
    if (to.diff(from, unit) > 0) {
      // Return this unit or smallestUnit, whichever is coarser (lower index)
      return i <= smallestIdx ? unit : smallestUnit;
    }
  }

  return smallestUnit;
}

/**
 * Decomposes the duration between two dates across a range of units, from
 * largestUnit down to smallestUnit. Each unit's value is the remainder after
 * subtracting all larger units.
 */
function decompose(
  from: dayjs.Dayjs,
  to: dayjs.Dayjs,
  largestUnit: DurationUnitPlural,
  smallestUnit: DurationUnitPlural,
): Intl.DurationInput {
  const startIdx = UNIT_ORDER.indexOf(largestUnit);
  const endIdx = UNIT_ORDER.indexOf(smallestUnit);
  const units = UNIT_ORDER.slice(startIdx, endIdx + 1);

  const result: Intl.DurationInput = {};
  let current = from;

  for (const unit of units) {
    const diff = to.diff(current, unit);
    result[unit] = diff;
    current = current.add(diff, unit);
  }

  return result;
}

/**
 * Calculates the duration between two dates as a structured duration object.
 *
 * When called with no options or a single unit string, the unit is auto-selected
 * using dayjs relativeTime thresholds:
 * - < 45 seconds → seconds
 * - < 45 minutes → minutes
 * - < 22 hours → hours
 * - < 26 days → days
 * - < 11 months → months
 * - otherwise → years
 *
 * With a {@link DurationOptions} object, you can override thresholds and/or request
 * a multi-unit decomposition via largestUnit/smallestUnit.
 *
 * @param startDate The start date. If null, returns null.
 * @param endDate Optional. Defaults to now.
 * @param options A unit string for single-unit output, or a DurationOptions object.
 * @returns A DurationInput object, or null if either date is null or unparseable.
 *
 * @example
 * // Auto-selects the appropriate unit
 * duration('2022-01-01', '2024-07-30') // => { years: 2 }
 *
 * @example
 * // Multi-unit decomposition
 * duration('2022-01-01', '2024-07-30', { largestUnit: 'year', smallestUnit: 'day' })
 * // => { years: 2, months: 6, days: 29 }
 */
export function duration(
  startDate: dayjs.ConfigType,
  endDate: dayjs.ConfigType = dayjs(),
  options?: DurationUnit | DurationOptions,
): Intl.DurationInput | null {
  const to = dayjs(endDate);
  const from = parseDateInput(startDate, to);

  if (from == null) {
    return null;
  }

  if (typeof options === 'string') {
    const normalized = normalizeUnit(options);
    return { [normalized]: to.diff(from, normalized) };
  }

  const { thresholds, largestUnit: rawLargest, smallestUnit: rawSmallest } = options ?? {};

  if (rawLargest !== undefined || rawSmallest !== undefined) {
    const smallest = rawSmallest ? normalizeUnit(rawSmallest) : undefined;

    let largest: DurationUnitPlural;
    if (rawLargest === 'auto' || rawLargest === undefined) {
      // 'auto' or omitted: resolve to the largest non-zero unit, or smallestUnit, whichever is coarser
      const effectiveSmallest = smallest ?? 'seconds';
      largest = autoLargestUnit(from, to, effectiveSmallest);
    } else {
      largest = normalizeUnit(rawLargest);
    }

    return decompose(from, to, largest, smallest ?? largest);
  }

  const selected = autoSelectUnit(from, to, thresholds);
  return { [selected]: to.diff(from, selected) };
}

const DEFAULT_FORMAT_OPTIONS: Intl.DurationFormatOptions = { style: 'short', localeMatcher: 'lookup' };

/**
 * Calculates the duration between two dates and formats it as a locale-aware string.
 * Uses the same unit-selection logic as {@link duration} and delegates formatting
 * to {@link formatDuration}.
 *
 * @param startDate The start date. If null, returns null.
 * @param endDate Optional. Defaults to now.
 * @param options A unit string for single-unit output, or a {@link DurationOptionsWithFormat} object.
 *   The `formatOptions` field is passed to Intl.DurationFormat (defaults to short style).
 * @returns A formatted duration string, or null if either date is null or unparseable.
 *
 * @example
 * formatDurationBetween('2022-01-01', '2024-07-30') // => '2 yrs'
 *
 * @example
 * // Multi-unit with long-form formatting
 * formatDurationBetween('2022-01-01', '2024-07-30', {
 *   largestUnit: 'year',
 *   smallestUnit: 'day',
 *   formatOptions: { style: 'long' },
 * }) // => '2 years, 6 months, 29 days'
 */
export function formatDurationBetween(
  startDate: dayjs.ConfigType,
  endDate: dayjs.ConfigType = dayjs(),
  options?: DurationUnit | DurationOptionsWithFormat,
): string | null {
  const durationInput = duration(startDate, endDate, options);

  if (durationInput == null) {
    return null;
  }

  const formatOpts =
    typeof options === 'object' && options.formatOptions
      ? { ...DEFAULT_FORMAT_OPTIONS, ...options.formatOptions }
      : DEFAULT_FORMAT_OPTIONS;

  return formatDuration(durationInput, formatOpts);
}
