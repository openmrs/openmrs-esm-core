/** @module @category Utility */
import dayjs from 'dayjs';
import { formatDuration, parseDateInput } from './dates/date-util';

/**
 * Gets the age of a person as a structured duration object, following NHS Digital guidelines
 * (Tables 7 and 8) for which units to include based on the person's age.
 *
 * @see https://webarchive.nationalarchives.gov.uk/ukgwa/20160921162509mp_/http://systems.digital.nhs.uk/data/cui/uig/patben.pdf
 * @param birthDate The birthDate. If null, returns null.
 * @param currentDate Optional. If provided, calculates the age at the provided date instead of now.
 * @returns A DurationInput object, or null if birthDate is null or unparseable.
 *
 * @example
 * // For infants, returns fine-grained units
 * ageAsDuration('2024-07-29', '2024-07-30') // => { hours: 24 }
 *
 * @example
 * // For adults (>= 18), returns years only
 * ageAsDuration('2000-01-15', '2024-07-30') // => { years: 24 }
 */
export function ageAsDuration(
  birthDate: dayjs.ConfigType,
  currentDate: dayjs.ConfigType = dayjs(),
): Intl.DurationInput | null {
  const to = dayjs(currentDate);
  const from = parseDateInput(birthDate, to);

  if (from == null) {
    return null;
  }

  const hourDiff = to.diff(from, 'hours');
  const dayDiff = to.diff(from, 'days');
  const weekDiff = to.diff(from, 'weeks');
  const monthDiff = to.diff(from, 'months');
  const yearDiff = to.diff(from, 'years');

  const duration: Intl.DurationInput = {};

  if (hourDiff < 2) {
    duration['minutes'] = to.diff(from, 'minutes');
  } else if (dayDiff < 2) {
    duration['hours'] = hourDiff;
  } else if (weekDiff < 4) {
    duration['days'] = dayDiff;
  } else if (yearDiff < 1) {
    const remainderDayDiff = to.subtract(weekDiff, 'weeks').diff(from, 'days');
    duration['weeks'] = weekDiff;
    duration['days'] = remainderDayDiff;
  } else if (yearDiff < 2) {
    const remainderDayDiff = to.subtract(monthDiff, 'months').diff(from, 'days');
    duration['months'] = monthDiff;
    duration['days'] = remainderDayDiff;
  } else if (yearDiff < 18) {
    const remainderMonthDiff = to.subtract(yearDiff, 'year').diff(from, 'months');
    duration['years'] = yearDiff;
    duration['months'] = remainderMonthDiff;
  } else {
    duration['years'] = yearDiff;
  }

  return duration;
}

/**
 * Gets a human readable and locale supported representation of a person's age, given their birthDate,
 * The representation logic follows the guideline here:
 * https://webarchive.nationalarchives.gov.uk/ukgwa/20160921162509mp_/http://systems.digital.nhs.uk/data/cui/uig/patben.pdf
 * (See Tables 7 and 8)
 *
 * @param birthDate The birthDate. If birthDate is null, returns null.
 * @param currentDate Optional. If provided, calculates the age of the person at the provided currentDate (instead of now).
 * @returns A human-readable string version of the age.
 *
 * @example
 * age('2020-02-29', '2024-07-30') // => '4 yrs, 5 mths'
 *
 * @example
 * // String dates with partial precision are supported
 * age('2000', '2024-07-30') // => '24 yrs'
 */
export function age(birthDate: dayjs.ConfigType, currentDate: dayjs.ConfigType = dayjs()): string | null {
  const durationInput = ageAsDuration(birthDate, currentDate);

  if (durationInput == null) {
    return null;
  }

  const options: Intl.DurationFormatOptions = { style: 'short', localeMatcher: 'lookup' };

  if ('minutes' in durationInput && durationInput.minutes === 0) {
    options.minutesDisplay = 'always';
  }

  return formatDuration(durationInput, options);
}
