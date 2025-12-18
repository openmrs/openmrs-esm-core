import dayjs from 'dayjs';
import {
  CalendarDate,
  CalendarDateTime,
  getLocalTimeZone,
  toCalendar,
  ZonedDateTime,
  type Calendar,
  type DateValue,
} from '@internationalized/date';
import { type DateInputValue } from './OpenmrsDatePicker';

/**
 * Function to convert relatively arbitrary date values into a React Aria `DateValue`,
 * normally a `CalendarDate`, which represents a date without time or timezone.
 */
export function dateToInternationalizedDate(
  date: DateInputValue,
  calendar: Calendar | undefined,
  allowNull: true,
): DateValue | null | undefined;
export function dateToInternationalizedDate(
  date: DateInputValue,
  calendar: Calendar | undefined,
  allowNull: false,
): DateValue | undefined;
export function dateToInternationalizedDate(
  date: DateInputValue,
  calendar: Calendar | undefined,
): DateValue | undefined;
export function dateToInternationalizedDate(
  date: DateInputValue,
  calendar: Calendar | undefined,
  allowNull: boolean = false,
) {
  if (typeof date === 'undefined' || date === null) {
    return allowNull ? date : undefined;
  }

  if (typeof date === 'string' && !date) {
    return allowNull ? null : undefined;
  }

  if (date instanceof CalendarDate || date instanceof CalendarDateTime || date instanceof ZonedDateTime) {
    return calendar ? toCalendar(date, calendar) : date;
  } else {
    const date_ = dayjs(date).toDate();
    const calendarDate = new CalendarDate(date_.getFullYear(), date_.getMonth() + 1, date_.getDate());
    return calendar ? toCalendar(calendarDate, calendar) : calendarDate;
  }
}

/**
 * Function to convert a `DateValue` (from React Aria) into a standard JS `Date`.
 */
export function internationalizedDateToDate(date: DateValue): Date | undefined {
  if (!date) {
    return undefined;
  }
  return date.toDate(getLocalTimeZone());
}

/** Removes any data attributes from an object */
export function removeDataAttributes<T>(props: T): T {
  const prefix = /^(data-.*)$/;
  let filteredProps = {} as T;

  for (const prop in props) {
    if (!prefix.test(prop)) {
      filteredProps[prop] = props[prop];
    }
  }

  return filteredProps;
}
