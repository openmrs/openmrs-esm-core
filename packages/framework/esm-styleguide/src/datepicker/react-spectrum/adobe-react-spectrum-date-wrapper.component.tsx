import React from "react";
import { CalendarDate, parseDate } from "@internationalized/date";
import { DatePicker } from "@react-spectrum/datepicker";
import { Provider } from "@react-spectrum/provider";
import { theme as defaultTheme } from "@react-spectrum/theme-default";
import { parseDate as parseArbitraryDateString } from "@openmrs/esm-framework";

const prefferedEthiopicLocaleCode = "am-AM-u-ca-ethiopic";

function parseToCalendarDate(date: string | Date | undefined) {
  if (!date) {
    return undefined;
  }
  return parseDate(
    typeof date === "string"
      ? parseArbitraryDateString(date).toISOString().split("T")[0]
      : date.toISOString().split("T")[0]
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

interface ReactSpectrumDatePickerWrapperProps {
  id: string;
  value: Date | string | undefined;
  onChange: (value: Date) => void;
  locale: string;
  defaultValue: Date | string | undefined;
  minDate: Date | string | undefined;
  maxDate: Date | string | undefined;
  readonly: boolean | undefined;
  isDisabled: boolean | undefined;
  invalid: boolean | undefined;
  invalidText: string | undefined;
}
const ReactSpectrumDatePickerWrapper: React.FC<
  ReactSpectrumDatePickerWrapperProps
> = ({
  id,
  value,
  locale,
  defaultValue,
  minDate,
  maxDate,
  readonly,
  isDisabled,
  invalid,
  invalidText,
  onChange,
}) => {
  return (
    <Provider
      locale={locale === "am" ? prefferedEthiopicLocaleCode : locale}
      colorScheme="light"
      theme={defaultTheme}
    >
      <DatePicker
        id={id}
        value={parseToCalendarDate(value)}
        onChange={(calendarDate) => {
          onChange?.(calendarDate.toDate("UTC"));
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

export default ReactSpectrumDatePickerWrapper;
