import React, { useMemo, useState } from "react";
import { CalendarDate, parseDate } from "@internationalized/date";
import { theme as defaultTheme } from "@react-spectrum/theme-default";
import { Provider } from "@react-spectrum/provider";
import { DatePicker } from "@react-spectrum/datepicker";
import {
  getConfigStore,
  getLocale,
  parseDate as parseDateString,
} from "@openmrs/esm-framework";

interface OpenmrsDatePickerProps {
  id: string;
  value?: Date | string;
  labelText?: string;
  locale?: string;
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
  const month = (dateValue.getMonth() + 1).toString().padStart(2, "0");
  const date = dateValue.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${date}`;
}

function parseToCalendarDate(date: string | Date | undefined) {
  if (!date) {
    return undefined;
  }
  return parseDate(
    toLocalDateString(typeof date === "string" ? parseDateString(date) : date)
  );
}

function constructValidationState(invalid: boolean | undefined) {
  return invalid !== undefined ? (invalid ? "invalid" : "valid") : undefined;
}

function constructErrorMessage(id: string, message: string | undefined) {
  return message ? (
    <span className={id + "-invalid"}>{message}</span>
  ) : undefined;
}

export const OpenmrsDatePicker: React.FC<OpenmrsDatePickerProps> = ({
  id,
  value,
  labelText,
  locale: preferredLocale,
  defaultValue,
  minDate,
  maxDate,
  readonly,
  isDisabled,
  invalid,
  invalidText,
  onChange,
}) => {
  const [preferredCalendar, setPreferredCalendar] = useState();

  const locale = useMemo(() => {
    const currentLocale = preferredLocale || getLocale();
    if (preferredCalendar?.[currentLocale]) {
      return new Intl.Locale(currentLocale, {
        calendar: preferredCalendar[currentLocale],
      }).toString();
    }
    return currentLocale;
  }, [preferredLocale, preferredCalendar]);

  getConfigStore("@openmrs/esm-styleguide").subscribe((store) => {
    if (store.loaded && store.config) {
      setPreferredCalendar(store.config["preferredCalendar"]);
    }
  });

  return (
    <Provider locale={locale} colorScheme="light" theme={defaultTheme}>
      <DatePicker
        id={id}
        label={labelText}
        value={parseToCalendarDate(value)}
        onChange={(calendarDate) => {
          onChange?.(
            new Date(calendarDate.year, calendarDate.month, calendarDate.day)
          );
        }}
        defaultValue={parseToCalendarDate(defaultValue)}
        minValue={
          minDate ? (parseToCalendarDate(minDate) as CalendarDate) : undefined
        }
        maxValue={
          maxDate ? (parseToCalendarDate(maxDate) as CalendarDate) : undefined
        }
        isReadOnly={readonly}
        isDisabled={isDisabled}
        validationState={constructValidationState(invalid)}
        errorMessage={constructErrorMessage(id, invalidText)}
        isQuiet
      ></DatePicker>
    </Provider>
  );
};
