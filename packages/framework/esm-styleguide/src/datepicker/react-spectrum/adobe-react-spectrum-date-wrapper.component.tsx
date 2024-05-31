import React, { type ReactElement, useMemo } from 'react';
import { parseDate } from '@internationalized/date';
import { DatePicker } from '@react-spectrum/datepicker';
import { Provider } from '@react-spectrum/provider';
import { theme as defaultTheme } from '@react-spectrum/theme-default';
import { useConfig } from '@openmrs/esm-react-utils';
import { convertToLocaleCalendar } from '@openmrs/esm-utils';
import dayjs from 'dayjs';

interface ReactSpectrumDatePickerWrapperProps {
  id: string;
  value?: Date | string;
  labelText?: string | ReactElement;
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

function parseToCalendarDate(date: string | Date | undefined, locale?: string | Intl.Locale) {
  if (!date) {
    return undefined;
  }

  const parsedCalendarDate = parseDate(dayjs(date).format('YYYY-MM-DD'));
  if (locale) {
    return convertToLocaleCalendar(parsedCalendarDate, locale);
  }

  return parsedCalendarDate;
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
      });
    }
    return currentLocale;
  }, [currentLocale, preferredCalendar]);

  return (
    <Provider locale={locale.toString()} colorScheme="light" theme={defaultTheme}>
      <DatePicker
        id={id}
        label={labelText}
        value={parseToCalendarDate(value)}
        onChange={(calendarDate) => {
          onChange?.(new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day));
        }}
        defaultValue={parseToCalendarDate(defaultValue, locale)}
        minValue={parseToCalendarDate(minDate, locale)}
        maxValue={parseToCalendarDate(maxDate, locale)}
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
