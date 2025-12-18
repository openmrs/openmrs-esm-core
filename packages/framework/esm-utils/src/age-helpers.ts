/** @module @category Utility */
import { DurationFormat } from '@formatjs/intl-durationformat';
import { type DurationFormatOptions, type DurationInput } from '@formatjs/intl-durationformat/src/types';
import { attempt } from 'any-date-parser';
import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport.js';
import { omit } from 'lodash-es';
import { getLocale } from './get-locale';

dayjs.extend(objectSupport);

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

  const locale = getLocale();

  const to = dayjs(currentDate);
  let from: dayjs.Dayjs;

  if (typeof birthDate === 'string') {
    let parsedDate = attempt(birthDate, locale);
    if (parsedDate.invalid) {
      console.warn(`Could not interpret '${birthDate}' as a date`);
      return null;
    }

    // hack here but any date interprets 2000-01, etc. as yyyy-dd rather than yyyy-mm
    if (parsedDate.day && !parsedDate.month) {
      parsedDate = Object.assign({}, omit(parsedDate, 'day'), { month: parsedDate.day });
    }

    // dayjs' object support uses 0-based months, whereas any-date-parser uses 1-based months
    if (parsedDate.month) {
      parsedDate.month -= 1;
    }

    // in dayjs day is day of week; in any-date-parser, its day of month, so we need to convert them
    if (parsedDate.day) {
      parsedDate = Object.assign({}, omit(parsedDate, 'day'), { date: parsedDate.day });
    }

    from = dayjs(to).set(parsedDate);
  } else {
    from = dayjs(birthDate);
  }

  const hourDiff = to.diff(from, 'hours');
  const dayDiff = to.diff(from, 'days');
  const weekDiff = to.diff(from, 'weeks');
  const monthDiff = to.diff(from, 'months');
  const yearDiff = to.diff(from, 'years');

  const duration: DurationInput = {};
  const options: DurationFormatOptions = { style: 'short', localeMatcher: 'lookup' };

  if (hourDiff < 2) {
    const minuteDiff = to.diff(from, 'minutes');
    duration['minutes'] = minuteDiff;
    if (minuteDiff === 0) {
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
