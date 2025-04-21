import React from 'react';
import classNames from 'classnames';
import { parseDate, type CalendarDate } from '@internationalized/date';
import {
  Button,
  CalendarCell,
  CalendarGrid,
  DateInput,
  DateRangePicker,
  DateSegment,
  Dialog,
  Group,
  Heading,
  Label,
  Popover,
  RangeCalendar,
} from 'react-aria-components';

type AriaDateRange = { start: CalendarDate; end: CalendarDate };

interface DateRangePickerFieldProps {
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

export const DateRangePickerField: React.FC<DateRangePickerFieldProps> = ({
  label = 'Trip dates',
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
    <DateRangePicker
      className={classNames(
        'bx--form-item',
        'bx--date-picker',
        'bx--date-picker--range',
        {
          'bx--date-picker--light': true,
          'bx--date-picker--disabled': disabled,
        },
        className,
      )}
      value={internalValue}
      onChange={handleChange}
      minValue={minValue}
      maxValue={maxValue}
      isDisabled={disabled}
      isReadOnly={readOnly}
      autoFocus={autoFocus}
      isRequired={required}
    >
      <Label>{label}</Label>

      <Group className="react-aria-Group">
        <DateInput slot="start">{(segment) => <DateSegment segment={segment} />}</DateInput>

        <span aria-hidden="true">–</span>

        <DateInput slot="end">{(segment) => <DateSegment segment={segment} />}</DateInput>

        <Button className="react-aria-Button">▼</Button>
      </Group>

      <Popover className="react-aria-Popover" data-trigger="DateRangePicker">
        <Dialog>
          <RangeCalendar minValue={minValue} maxValue={maxValue}>
            <header className="flex justify-between items-center">
              <Button slot="previous">◀</Button>
              <Heading />
              <Button slot="next">▶</Button>
            </header>
            <CalendarGrid>{(date) => <CalendarCell date={date} />}</CalendarGrid>
          </RangeCalendar>
        </Dialog>
      </Popover>
    </DateRangePicker>
  );
};
