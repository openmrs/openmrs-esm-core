import { type ReactElement } from 'react';
import { type Argument } from 'classnames';
import { type ConfigType as DayjsConfigType } from 'dayjs';
import { type CalendarDate, type CalendarDateTime, type ZonedDateTime } from '@internationalized/date';

/** A type for any of the acceptable date formats */
export type DateInputValue = CalendarDate | CalendarDateTime | ZonedDateTime | DayjsConfigType;

/**
 * Common props shared by both OpenmrsDatePicker and OpenmrsDateRangePicker.
 */
export interface DatePickerBaseProps {
  /** Any CSS classes to add to the outer div of the date picker */
  className?: Argument;
  /** Whether the input value is invalid. */
  invalid?: boolean;
  /** Text to show if the input is invalid e.g. an error message */
  invalidText?: string;
  /**
   * The label for this DatePicker element
   * @deprecated Use labelText instead
   */
  label?: string | ReactElement;
  /** The label for this DatePicker element. */
  labelText?: string | ReactElement;
  /** 'true' to use the light version. */
  light?: boolean;
  /** The latest date it is possible to select */
  maxDate?: DateInputValue;
  /** The earliest date it is possible to select */
  minDate?: DateInputValue;
}
