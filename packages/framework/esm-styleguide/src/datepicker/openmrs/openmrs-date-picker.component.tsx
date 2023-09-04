import React from "react";
import { supportedLocales as reactSpectrumSupportedLocales } from "../react-spectrum/locales";
import { getLocale } from "@openmrs/esm-framework";
import ReactSpectrumDatePickerWrapper from "../react-spectrum/adobe-react-spectrum-date-wrapper.component";
import { DatePicker, DatePickerInput } from "@carbon/react";

// TODO: should be locale sensitive
// see: https://issues.openmrs.org/browse/O3-998
const DEFAULT_DATE_FORMAT = "d/m/Y";
const DEFAULT_PLACEHOLDER = "dd/mm/yyyy";

interface OpenmrsDatePickerProps {
  id: string;
  labelText: string;
  onChange: (value: Date) => void;
  value?: Date | string;
  /* Not supported by Carbon's picker */
  defaultValue?: Date | string;
  minDate?: Date | string;
  maxDate?: Date | string;
  readonly?: boolean;
  dateFormat?: string;
  invalid?: boolean;
  invalidText?: string;
  disabled?: boolean;
  carbonOptions?: {
    /* We currently don't support the 'range' option */
    datePickerType?: "simple" | "single";
    onClose?: Function;
    onOpen?: Function;
    light?: boolean;
    warn?: boolean;
    warnText?: string;
    className?: string;
    pickerShellStyle?: React.CSSProperties;
    pickerInputStyle?: React.CSSProperties;
    placeholder?: string;
  };
}

export const OpenmrsDatePicker: React.FC<OpenmrsDatePickerProps> = ({
  id,
  labelText,
  onChange,
  value,
  defaultValue,
  minDate,
  maxDate,
  readonly,
  dateFormat,
  invalid,
  invalidText,
  disabled,
  carbonOptions,
}) => {
  const locale = getLocale();

  return reactSpectrumSupportedLocales[locale] ? (
    <ReactSpectrumDatePickerWrapper
      value={value}
      onChange={onChange}
      labelText={labelText}
      locale={locale}
      defaultValue={defaultValue}
      minDate={minDate}
      maxDate={maxDate}
      readonly={readonly}
      id={id}
      isDisabled={disabled}
      invalid={invalid}
      invalidText={invalidText}
    />
  ) : (
    <DatePicker
      dateFormat={dateFormat}
      value={value}
      datePickerType={carbonOptions?.datePickerType || "single"}
      onChange={(val) => onChange(val[0])}
      onClose={carbonOptions?.onClose}
      onOpen={carbonOptions?.onOpen}
      maxDate={maxDate}
      style={carbonOptions?.pickerShellStyle}
      className={carbonOptions?.className}
      light={carbonOptions?.light}
      warn={carbonOptions?.warn}
      warnText={carbonOptions?.warnText}
    >
      <DatePickerInput
        id={id}
        dateFormat={dateFormat || DEFAULT_DATE_FORMAT}
        labelText={labelText}
        invalid={invalid}
        invalidText={invalidText}
        placeholder={carbonOptions?.placeholder || DEFAULT_PLACEHOLDER}
        style={carbonOptions?.pickerInputStyle}
      />
    </DatePicker>
  );
};

export default OpenmrsDatePicker;
