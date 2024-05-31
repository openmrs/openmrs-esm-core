import React, { type ReactElement, useEffect, useRef } from 'react';
import { supportedLocales as reactSpectrumSupportedLocales } from '../react-spectrum/locales';
import { getLocale } from '@openmrs/esm-utils';
import ReactSpectrumDatePickerWrapper from '../react-spectrum/adobe-react-spectrum-date-wrapper.component';
import { DatePicker, DatePickerInput } from '@carbon/react';
import dayjs from 'dayjs';

// TODO: should be locale sensitive
// see: https://issues.openmrs.org/browse/O3-998
const DEFAULT_DATE_FORMAT = 'd/m/Y';
const DEFAULT_PLACEHOLDER = 'dd/mm/yyyy';

export interface OpenmrsDatePickerProps {
  id: string;
  labelText: string | ReactElement;
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
    datePickerType?: 'simple' | 'single';
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
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inputElement = inputRef.current?.querySelector('input');
    if (inputElement) {
      const handleChange = (e) => {
        onChange(dayjs(e.target.value, dateFormat).toDate());
      };
      inputElement.addEventListener('change', handleChange);

      return () => {
        inputElement.removeEventListener('change', handleChange);
      };
    }
  }, [inputRef, dateFormat, onChange]);

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
      datePickerType={carbonOptions?.datePickerType || 'single'}
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
        ref={inputRef}
        id={id}
        dateFormat={dateFormat || DEFAULT_DATE_FORMAT}
        labelText={labelText}
        invalid={invalid}
        invalidText={invalidText}
        placeholder={carbonOptions?.placeholder || DEFAULT_PLACEHOLDER}
        style={carbonOptions?.pickerInputStyle}
        disabled={disabled}
        readOnly={readonly}
      />
    </DatePicker>
  );
};

export default OpenmrsDatePicker;
