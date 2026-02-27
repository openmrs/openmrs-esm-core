import React, { forwardRef, useId, useMemo } from 'react';
import classNames from 'classnames';
import { type DateValue } from 'react-aria';
import { Button, DatePicker, type DatePickerProps, FieldError, Group, Provider, Label } from 'react-aria-components';
import { type CalendarDate } from '@internationalized/date';
import { type DateInputValue, type DatePickerBaseProps } from './types';
import { I18nWrapper } from './i18n-wrapper.component';
import { dateToInternationalizedDate, internationalizedDateToDate } from './utils';
import { OpenmrsIntlLocaleContext, useDatepickerContext } from './hooks';
import { CalendarPopover } from './calendar-popover.component';
import { DatePickerInput } from './date-picker-input.component';
import { DatePickerIcon } from './date-picker-icon.component';
import { DateSegment } from './date-segment.component';
import styles from './datepicker.module.scss';

/**
 * Properties for the OpenmrsDatePicker
 */
export interface OpenmrsDatePickerProps
  extends Omit<DatePickerProps<CalendarDate>, 'className' | 'onChange' | 'defaultValue' | 'value'>,
    DatePickerBaseProps {
  /** The default value (uncontrolled) */
  defaultValue?: DateInputValue;
  /** Handler that is called when the value changes. */
  onChange?: (value: Date | null | undefined) => void;
  /** Handler that is called when the value changes. Note that this provides types from @internationalized/date. */
  onChangeRaw?: (value: DateValue | null) => void;
  /** Specifies the size of the input. Currently supports either `sm`, `md`, or `lg` as an option */
  size?: 'sm' | 'md' | 'lg';
  /** 'true' to use the short version. */
  short?: boolean;
  /** The value (controlled) */
  value?: DateInputValue;
}

const defaultProps: OpenmrsDatePickerProps = {
  short: false,
  size: 'md',
};

/**
 * A date picker component to select a single date. Based on React Aria, but styled to look like Carbon.
 */
export const OpenmrsDatePicker = /*#__PURE__*/ forwardRef<HTMLDivElement, OpenmrsDatePickerProps>(
  function OpenmrsDatePicker(props, ref) {
    const {
      className,
      defaultValue: rawDefaultValue,
      isDisabled,
      invalid,
      invalidText,
      isInvalid: isInvalidRaw,
      label,
      labelText,
      light,
      maxDate: rawMaxDate,
      minDate: rawMinDate,
      onChange: rawOnChange,
      onChangeRaw,
      short,
      size,
      value: rawValue,
      ...datePickerProps
    } = { ...defaultProps, ...props };

    const { calendar, intlLocale, today_ } = useDatepickerContext();

    const id = useId();
    const hasVisibleLabel = !!(labelText ?? label);

    // Warn in development if no accessible label is provided
    if (process.env.NODE_ENV !== 'production') {
      if (!hasVisibleLabel && !datePickerProps['aria-label'] && !datePickerProps['aria-labelledby']) {
        console.warn(
          'OpenmrsDatePicker: You must provide either a visible label (labelText/label) or an aria-label for accessibility.',
        );
      }
    }

    const defaultValue = useMemo(() => dateToInternationalizedDate(rawDefaultValue, calendar), [rawDefaultValue]);
    const value = useMemo(() => dateToInternationalizedDate(rawValue, calendar, true), [rawValue]);
    const maxDate = useMemo(() => dateToInternationalizedDate(rawMaxDate, calendar), [rawMaxDate]);
    const minDate = useMemo(() => dateToInternationalizedDate(rawMinDate, calendar), [rawMinDate]);
    const isInvalid = useMemo(() => invalid ?? isInvalidRaw, [invalid, isInvalidRaw]);

    const onChange = useMemo(() => {
      if (onChangeRaw && rawOnChange) {
        console.error(
          'An OpenmrsDatePicker component was created with both onChange and onChangeRaw handlers defined. Only onChangeRaw will be used.',
        );
      }
      return onChangeRaw ?? ((value: DateValue) => rawOnChange?.(internationalizedDateToDate(value)));
    }, [onChangeRaw, rawOnChange]);

    return (
      <I18nWrapper locale={intlLocale.toString()}>
        <div className={classNames('cds--form-item', className)}>
          <Provider values={[[OpenmrsIntlLocaleContext, intlLocale]]}>
            <DatePicker
              className={classNames('cds--date-picker', 'cds--date-picker--single', {
                ['cds--date-picker--short']: short,
                ['cds--date-picker--light']: light,
              })}
              defaultValue={defaultValue}
              isDisabled={isDisabled}
              isInvalid={isInvalid}
              maxValue={maxDate}
              minValue={minDate}
              value={value}
              shouldForceLeadingZeros={intlLocale.language === 'en' ? true : undefined}
              {...datePickerProps}
              onChange={onChange}
            >
              <div className="cds--date-picker-container">
                {hasVisibleLabel && (
                  <Label className={classNames('cds--label', { 'cds--label--disabled': isDisabled })} htmlFor={id}>
                    {labelText ?? label}
                  </Label>
                )}
                <Group className={styles.inputGroup}>
                  <DatePickerInput
                    id={hasVisibleLabel ? id : undefined}
                    ref={ref}
                    className={classNames('cds--date-picker-input__wrapper', styles.inputWrapper, {
                      [styles.inputWrapperMd]: size === 'md' || !size || size.length === 0,
                    })}
                  >
                    {(segment) => {
                      return segment.type !== 'era' ? (
                        <DateSegment className={styles.inputSegment} segment={segment} />
                      ) : (
                        <React.Fragment />
                      );
                    }}
                  </DatePickerInput>
                  <Button className={classNames(styles.flatButton, styles.flatButtonMd)}>
                    <DatePickerIcon />
                  </Button>
                </Group>
                {isInvalid && invalidText && <FieldError className={styles.invalidText}>{invalidText}</FieldError>}
              </div>
              <CalendarPopover variant="single" today_={today_} />
            </DatePicker>
          </Provider>
        </div>
      </I18nWrapper>
    );
  },
);
