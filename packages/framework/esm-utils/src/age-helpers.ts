/** @module @category Utility */
import dayjs from 'dayjs';
import { DurationFormat } from '@formatjs/intl-durationformat';
import { type DurationFormatOptions, type DurationInput } from '@formatjs/intl-durationformat/src/types';
import { getLocale } from './get-locale';
/**
 * Gets a human readable and locale supported representation of a person's age, given their birthDate,
 * The representation logic follows the guideline here:
 * https://webarchive.nationalarchives.gov.uk/ukgwa/20160921162509mp_/http://systems.digital.nhs.uk/data/cui/uig/patben.pdf
 * (See Tables 7 and 8)
 *
 * @param birthDate The birthDate. If birthDate is null, returns null.
 * @param currentDate Optional. If provided, calculates the age of the person at the provided currentDate (instead of now).
 * @returns A human-readable string version of the age.
 */
export function age(birthDate: dayjs.ConfigType, currentDate: dayjs.ConfigType = dayjs()): string | null {
  if (birthDate == null) {
    return null;
  }

  const to = dayjs(currentDate);
  const from = dayjs(birthDate);

  const hourDiff = to.diff(from, 'hours');
  const dayDiff = to.diff(from, 'days');
  const weekDiff = to.diff(from, 'weeks');
  const monthDiff = to.diff(from, 'months');
  const yearDiff = to.diff(from, 'years');

  const duration: DurationInput = {};

  const locale = getLocale();

  const options: DurationFormatOptions = { style: 'short', localeMatcher: 'lookup' };

  if (hourDiff < 2) {
    const minuteDiff = to.diff(from, 'minutes');
    duration['minutes'] = minuteDiff;
    if (minuteDiff == 0) {
      options.minutesDisplay = 'always';
    }
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

  return new DurationFormat(locale, options).format(duration);
}
