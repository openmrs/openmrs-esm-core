/** @module @category Utility */
import dayjs from 'dayjs';
import { getLocale } from './omrs-dates';

/**
 * Gets a human readable and locale supported representation of a duration between 2 dates,
 * fromDate and toDate. toDate is Optional, defaulting to the current date.
 * Note that `age(birthDate)` gets the age representation of a person with the specified `birthDate`.
 * The representation logic follows the guideline here:
 * https://webarchive.nationalarchives.gov.uk/ukgwa/20160921162509mp_/http://systems.digital.nhs.uk/data/cui/uig/patben.pdf
 * (See Tables 7 and 8)
 *
 * @param fromDate The left bound of the duration.
 * @param toDate Optional. The right bound of the duration. Defaults to the current date
 * @returns A human-readable string version of the age.
 */
export function age(fromDate: dayjs.ConfigType, toDate: dayjs.ConfigType = dayjs()): string {
  const to = dayjs(toDate);
  const from = dayjs(fromDate);

  const hourDiff = to.diff(from, 'hours');
  const dayDiff = to.diff(from, 'days');
  const weekDiff = to.diff(from, 'weeks');
  const monthDiff = to.diff(from, 'months');
  const yearDiff = to.diff(from, 'years');

  const locale = getLocale();
  const isLtr = 'ltr' == window.i18next.dir();

  if (hourDiff < 2) {
    const minuteDiff = to.diff(from, 'minutes');
    return new Intl.NumberFormat(locale, {
      style: 'unit',
      unit: 'minute',
      unitDisplay: 'short',
    }).format(minuteDiff);
  } else if (dayDiff < 2) {
    return new Intl.NumberFormat(locale, {
      style: 'unit',
      unit: 'hour',
      unitDisplay: 'short',
    }).format(hourDiff);
  } else if (weekDiff < 4) {
    return new Intl.NumberFormat(locale, {
      style: 'unit',
      unit: 'day',
      unitDisplay: 'short',
    }).format(dayDiff);
  } else if (yearDiff < 1) {
    const week = new Intl.NumberFormat(locale, {
      style: 'unit',
      unit: 'week',
      unitDisplay: 'short',
    }).format(weekDiff);

    const remainderDayDiff = to.subtract(weekDiff, 'weeks').diff(from, 'days');
    if (remainderDayDiff > 0) {
      const day = new Intl.NumberFormat(locale, {
        style: 'unit',
        unit: 'day',
        unitDisplay: 'short',
      }).format(remainderDayDiff);

      return isLtr ? week + ' ' + day : day + ' ' + week;
    } else {
      return week;
    }
  } else if (yearDiff < 2) {
    const month = new Intl.NumberFormat(locale, {
      style: 'unit',
      unit: 'month',
      unitDisplay: 'short',
    }).format(monthDiff);

    const remainderDayDiff = to.subtract(monthDiff, 'months').diff(from, 'days');

    if (remainderDayDiff > 0) {
      const day = new Intl.NumberFormat(locale, {
        style: 'unit',
        unit: 'day',
        unitDisplay: 'short',
      }).format(remainderDayDiff);

      return isLtr ? month + ' ' + day : day + ' ' + month;
    } else {
      return month;
    }
  } else if (yearDiff < 18) {
    const year = new Intl.NumberFormat(locale, {
      style: 'unit',
      unit: 'year',
      unitDisplay: 'short',
    }).format(yearDiff);

    const remainderMonthDiff = to.subtract(yearDiff, 'year').diff(from, 'months');

    if (remainderMonthDiff > 0) {
      const month = new Intl.NumberFormat(locale, {
        style: 'unit',
        unit: 'month',
        unitDisplay: 'short',
      }).format(remainderMonthDiff);

      return isLtr ? year + ' ' + month : month + ' ' + year;
    } else {
      return year;
    }
  } else {
    return new Intl.NumberFormat(locale, {
      style: 'unit',
      unit: 'year',
      unitDisplay: 'short',
    }).format(yearDiff);
  }
}
