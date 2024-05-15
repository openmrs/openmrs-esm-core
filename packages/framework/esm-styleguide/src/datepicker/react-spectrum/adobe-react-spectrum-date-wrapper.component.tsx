import React, { useMemo } from 'react';
import { CalendarDate, EthiopicCalendar, toCalendar } from '@internationalized/date';
import { parseDate } from '@internationalized/date';
import { DatePicker } from '@react-spectrum/datepicker';
import { Provider } from '@react-spectrum/provider';
import { theme as defaultTheme } from '@react-spectrum/theme-default';
import { useConfig } from '@openmrs/esm-react-utils';
import { parseDate as parseDateString } from '@openmrs/esm-utils';

interface ReactSpectrumDatePickerWrapperProps {
  id: string;
  value?: Date | string;
  labelText?: string;
  locale: string;
  defaultValue?: Date | string;
  minDate?: Date | string;
  maxDate?: Date | string;
  readonly?: boolean;
  isDisabled?: boolean;
  invalid?: boolean;
  invalidText?: string;
  onChange?: (value: Date) => void;
}

function toLocalDateString(dateValue: Date) {
  const year = dateValue.getFullYear();
  const month = (dateValue.getMonth() + 1).toString().padStart(2, '0');
  const date = dateValue.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${date}`;
}
function gregToEth(gregdate: string) {
  const ymd = gregdate.split('-');

  const year = parseInt(ymd[0], 10);
  const month = parseInt(ymd[1], 10);
  const day = parseInt(ymd[2], 10);
  const gregorianDate = new CalendarDate(year, month, day);
  const ethiopianDate = toCalendar(gregorianDate, new EthiopicCalendar());

  return ethiopianDate;
}

function parseToCalendarDate(date: string | Date | undefined, locale?: string, isGregorianDateValue?: boolean) {
  if (!date) {
    return undefined;
  }

  const localDateString = toLocalDateString(typeof date === 'string' ? parseDateString(date) : date);
  if (locale === 'am-u-ca-ethiopic' && isGregorianDateValue) {
    return gregToEth(localDateString);
  }

  return parseDate(localDateString);
}

function constructValidationState(invalid: boolean | undefined) {
  return invalid !== undefined ? (invalid ? 'invalid' : 'valid') : undefined;
}

function constructErrorMessage(id: string, message: string | undefined) {
  return message ? <span className={id + '-invalid'}>{message}</span> : undefined;
}

const ReactSpectrumDatePickerWrapper: React.FC<ReactSpectrumDatePickerWrapperProps> = ({
  id,
  value,
  labelText,
  locale: currentLocale,
  defaultValue,
  minDate,
  maxDate,
  readonly,
  isDisabled,
  invalid,
  invalidText,
  onChange,
}) => {
  const { preferredCalendar } = useConfig({
    externalModuleName: '@openmrs/esm-styleguide',
  });

  const locale = useMemo(() => {
    if (preferredCalendar?.[currentLocale]) {
      return new Intl.Locale(currentLocale, {
        calendar: preferredCalendar[currentLocale],
      }).toString();
    }
    return currentLocale;
  }, [currentLocale, preferredCalendar]);

  return (
    <Provider locale={locale} colorScheme="light" theme={defaultTheme}>
      <DatePicker
        id={id}
        label={labelText}
        value={parseToCalendarDate(value)}
        onChange={(calendarDate) => {
          onChange?.(new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day));
        }}
        defaultValue={defaultValue ? (parseToCalendarDate(defaultValue, locale, true) as CalendarDate) : undefined}
        minValue={minDate ? (parseToCalendarDate(minDate, locale, true) as CalendarDate) : undefined}
        maxValue={maxDate ? (parseToCalendarDate(maxDate, locale, true) as CalendarDate) : undefined}
        isReadOnly={readonly}
        isDisabled={isDisabled}
        validationState={constructValidationState(invalid)}
        errorMessage={constructErrorMessage(id, invalidText)}
        isQuiet
      ></DatePicker>
    </Provider>
  );
};

export default ReactSpectrumDatePickerWrapper;
