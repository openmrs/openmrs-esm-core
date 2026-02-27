import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { Button, Calendar, CalendarCell, CalendarGrid, Popover, RangeCalendar } from 'react-aria-components';
import { type CalendarDate, type DateValue } from '@internationalized/date';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';
import { MonthYear } from './month-year.component';
import { AutoCloseDialog } from './auto-close-dialog.component';
import styles from './datepicker.module.scss';

type CalendarPopoverProps = {
  /** The current date */
  today_: CalendarDate;
} & (
  | {
      /** Either 'single' (for a Calendar) or 'range' (for a RangeCalendar) */
      variant: 'single';
      /** The minimum selectable date (only used for RangeCalendar) */
      minDate?: never;
      /** The maximum selectable date (only used for RangeCalendar) */
      maxDate?: never;
    }
  | {
      /** Either 'single' (for a Calendar) or 'range' (for a range) */
      variant: 'range';
      /** The minimum selectable date (only used for RangeCalendar) */
      minDate?: DateValue | null;
      /** The maximum selectable date (only used for RangeCalendar) */
      maxDate?: DateValue | null;
    }
);

/**
 * The calendar dropdown content shared between the single and range date pickers.
 * Renders the popover, auto-close dialog, navigation header, and calendar grid.
 * The `variant` prop selects between Calendar (single) and RangeCalendar (range).
 */
export const CalendarPopover = /*#__PURE__*/ forwardRef<HTMLDivElement, CalendarPopoverProps>(function CalendarPopover(
  { variant, today_, minDate = undefined, maxDate = undefined },
  ref,
) {
  const isRange = variant === 'range';
  const CalendarComponent = isRange ? RangeCalendar : Calendar;

  // RangeCalendar needs explicit min/max values and a className;
  // Calendar inherits these from its parent DatePicker context.
  const calendarProps = isRange
    ? { minValue: minDate, maxValue: maxDate, className: 'cds--date-picker__calendar' }
    : {};

  return (
    <Popover ref={ref} className={styles.popover} placement="bottom start" offset={1} isNonModal={true}>
      <AutoCloseDialog>
        <CalendarComponent {...calendarProps}>
          <header className={styles.header}>
            <Button className={classNames(styles.flatButton, styles.flatButtonMd)} slot="previous">
              <ChevronLeftIcon size={16} />
            </Button>
            <MonthYear className={styles.monthYear} />
            <Button className={classNames(styles.flatButton, styles.flatButtonMd)} slot="next">
              <ChevronRightIcon size={16} />
            </Button>
          </header>
          <CalendarGrid className={styles.calendarGrid}>
            {(date) => (
              <CalendarCell
                key={date.toString()}
                className={classNames('cds--date-picker__day', {
                  [styles.today]: today_.compare(date) === 0,
                })}
                date={date}
              />
            )}
          </CalendarGrid>
        </CalendarComponent>
      </AutoCloseDialog>
    </Popover>
  );
});
