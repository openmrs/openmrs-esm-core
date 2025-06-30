import React from 'react';
import classNames from 'classnames';
import { parseDate, type CalendarDate } from '@internationalized/date';
import {
  Button,
  CalendarCell,
  CalendarGrid,
  DateInput,
  DateRangePicker,
  Dialog,
  Group,
  Heading,
  Label,
  Popover,
  RangeCalendar,
} from 'react-aria-components';
import { DateSegment } from './DateSegment';
import styles from './datepicker.module.scss';

type AriaDateRange = { start: CalendarDate; end: CalendarDate };

interface OpenmrsDateRangePickerProps {
  label?: string;
  className?: string;
  value?: [Date, Date];
  onChange?: (range: [Date, Date]) => void;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  required?: boolean;
}

function toCalendarDate(date: Date): CalendarDate {
  return parseDate(date.toISOString().split('T')[0]);
}

function toNativeDate(cd: CalendarDate): Date {
  return new Date(cd.year, cd.month - 1, cd.day);
}

export const OpenmrsDateRangePicker: React.FC<OpenmrsDateRangePickerProps> = ({
  label = '',
  className = '',
  value,
  onChange,
  min,
  max,
  disabled = false,
  readOnly = false,
  autoFocus = false,
  required = false,
}) => {
  const internalValue: AriaDateRange | undefined = value
    ? {
        start: toCalendarDate(value[0]),
        end: toCalendarDate(value[1]),
      }
    : undefined;

  const handleChange = (range: AriaDateRange) => {
    if (onChange) {
      onChange([toNativeDate(range.start), toNativeDate(range.end)]);
    }
  };

  const minValue = min ? toCalendarDate(min) : undefined;
  const maxValue = max ? toCalendarDate(max) : undefined;

  return (
    <div className={classNames('cds--form-item', className)}>
      <DateRangePicker
        className={classNames('cds--date-picker', 'cds--date-picker--range', {
          'cds--date-picker--light': true,
          'cds--date-picker--disabled': disabled,
        })}
        value={internalValue}
        onChange={handleChange}
        minValue={minValue}
        maxValue={maxValue}
        isDisabled={disabled}
        isReadOnly={readOnly}
        autoFocus={autoFocus}
        isRequired={required}
      >
        {(label || label === '') && (
          <Label className={classNames('cds--label', { 'cds--label--disabled': disabled })}>{label}</Label>
        )}

        <Group className={styles.inputGroup}>
          <DateInput slot="start" className={styles.inputWrapper}>
            {(segment) => <DateSegment className={styles.inputSegment} segment={segment} />}
          </DateInput>
          <span aria-hidden="true">–</span>
          <DateInput slot="end" className={styles.inputWrapper}>
            {(segment) => <DateSegment className={styles.inputSegment} segment={segment} />}
          </DateInput>
          <Button className={classNames(styles.flatButton, styles.flatButtonMd)}>▼</Button>
        </Group>

        <Popover className={styles.popover} placement="bottom start" offset={1} isNonModal={true}>
          <Dialog className={styles.dialog}>
            <RangeCalendar minValue={minValue} maxValue={maxValue} className="cds--date-picker__calendar">
              <header className={styles.header}>
                <Button className={classNames(styles.flatButton, styles.flatButtonMd)} slot="previous">
                  ◀
                </Button>
                <Heading className={styles.monthYear} />
                <Button className={classNames(styles.flatButton, styles.flatButtonMd)} slot="next">
                  ▶
                </Button>
              </header>
              <CalendarGrid className={styles.calendarGrid}>
                {(date) => (
                  <CalendarCell key={date.toString()} className={classNames('cds--date-picker__day')} date={date} />
                )}
              </CalendarGrid>
            </RangeCalendar>
          </Dialog>
        </Popover>
      </DateRangePicker>
    </div>
  );
};
