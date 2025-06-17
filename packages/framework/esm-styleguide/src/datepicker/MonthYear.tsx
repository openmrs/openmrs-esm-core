import React, { forwardRef, type HTMLAttributes, type PropsWithChildren, useCallback, useContext } from 'react';
import {
  Button,
  CalendarStateContext,
  Group,
  Input,
  NumberField,
  RangeCalendarStateContext,
} from 'react-aria-components';
import { getLocalTimeZone } from '@internationalized/date';
import { formatDate } from '@openmrs/esm-utils';
import { useIntlLocale } from './locale-context';
import { CaretDownIcon, CaretUpIcon } from '../icons';

function getYearAsNumber(date: Date, intlLocale: Intl.Locale) {
  return parseInt(
    formatDate(date, {
      calendar: intlLocale.calendar,
      locale: intlLocale.baseName,
      day: false,
      month: false,
      noToday: true,
      numberingSystem: 'latn',
    }),
  );
}

/**
 * Custom component to render the month and year on the DatePicker and provide the standard Carbon
 * UI to change them.
 *
 * Should work with any calendar system supported by the @internationalized/date package.
 */
export const MonthYear = /*#__PURE__*/ forwardRef<HTMLSpanElement, PropsWithChildren<HTMLAttributes<HTMLSpanElement>>>(
  function MonthYear(props, ref) {
    const { className } = props;
    const calendarState = useContext(CalendarStateContext);
    const rangeCalendarState = useContext(RangeCalendarStateContext);

    const state = (calendarState ?? rangeCalendarState)!;

    const intlLocale = useIntlLocale();
    const tz = getLocalTimeZone();

    const month = formatDate(state.visibleRange.start.toDate(tz), {
      calendar: intlLocale.calendar,
      locale: intlLocale.baseName,
      day: false,
      year: false,
      noToday: true,
    });

    const year = getYearAsNumber(state.visibleRange.start.toDate(tz), intlLocale);

    const maxYear = state.maxValue ? getYearAsNumber(state.maxValue.toDate(tz), intlLocale) : undefined;
    const minYear = state.minValue ? getYearAsNumber(state.minValue.toDate(tz), intlLocale) : undefined;

    const changeHandler = useCallback((value: number) => {
      state.setFocusedDate(state.focusedDate.cycle('year', value - state.focusedDate.year));
    }, []);

    return (
      state && (
        <span ref={ref} className={className}>
          <span>{month}</span>
          <NumberField
            formatOptions={{ useGrouping: false }}
            maxValue={maxYear}
            minValue={minYear}
            onChange={changeHandler}
            value={year}
          >
            <Input />
            <Group>
              <Button slot="increment">
                <CaretUpIcon size={8} />
              </Button>
              <Button slot="decrement">
                <CaretDownIcon size={8} />
              </Button>
            </Group>
          </NumberField>
        </span>
      )
    );
  },
);
