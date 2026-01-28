import React, {
  forwardRef,
  type HTMLAttributes,
  type PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';
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
import styles from './datepicker.module.scss';

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

function getLocalizedMonthNames(intlLocale: Intl.Locale): string[] {
  const formatter = new Intl.DateTimeFormat(intlLocale.baseName, {
    month: 'short',
    calendar: intlLocale.calendar,
  });

  return Array.from({ length: 12 }, (_, i) => formatter.format(new Date(2024, i, 1)));
}

export const MonthYear = /*#__PURE__*/ forwardRef<HTMLSpanElement, PropsWithChildren<HTMLAttributes<HTMLSpanElement>>>(
  function MonthYear(props, ref) {
    const { className } = props;
    const calendarState = useContext(CalendarStateContext);
    const rangeCalendarState = useContext(RangeCalendarStateContext);

    const state = (calendarState ?? rangeCalendarState)!;

    const intlLocale = useIntlLocale();
    const tz = getLocalTimeZone();

    const [showMonthPicker, setShowMonthPicker] = useState(false);

    const monthNames = getLocalizedMonthNames(intlLocale);
    const currentMonthIndex = state.focusedDate.month - 1;

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

    const changeYearHandler = useCallback(
      (value: number) => {
        state.setFocusedDate(state.focusedDate.cycle('year', value - state.focusedDate.year));
      },
      [state],
    );

    const handleMonthSelect = useCallback(
      (monthIndex: number) => {
        state.setFocusedDate(state.focusedDate.set({ month: monthIndex + 1 }));
        setShowMonthPicker(false);
      },
      [state],
    );

    return (
      state && (
        <span ref={ref} className={className}>
          <span className={styles.monthPickerContainer}>
            <button type="button" className={styles.monthButton} onClick={() => setShowMonthPicker((open) => !open)}>
              {month}
            </button>

            {showMonthPicker && (
              <div className={styles.monthPickerGrid}>
                {monthNames.map((name, index) => (
                  <button
                    key={name}
                    type="button"
                    className={index === currentMonthIndex ? styles.monthPickerItemSelected : styles.monthPickerItem}
                    onClick={() => handleMonthSelect(index)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </span>

          <NumberField
            formatOptions={{ useGrouping: false }}
            maxValue={maxYear}
            minValue={minYear}
            onChange={changeYearHandler}
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
