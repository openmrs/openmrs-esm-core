import { CalendarDate } from '@internationalized/date';

/**
 * Default lower bound used when consumers do not provide `minDate`.
 *
 * React Aria date pickers otherwise allow effectively unbounded past
 * entry/navigation (e.g., year 1), which can produce nonsensical values.
 * 1793-01-01 is used as a practical historical floor for OpenMRS.
 */
export const DEFAULT_MIN_DATE_FLOOR = new CalendarDate(1793, 1, 1);
