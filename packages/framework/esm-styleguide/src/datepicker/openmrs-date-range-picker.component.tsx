import React, { forwardRef, useId, useMemo } from 'react';
import classNames from 'classnames';
import {
  Button,
  DateInput,
  DateRangePicker,
  type DateRangePickerProps,
  FieldError,
  Label,
  Provider,
  type DateRange,
  Group,
} from 'react-aria-components';
import { type CalendarDate } from '@internationalized/date';
import { DateSegment } from './date-segment.component';
import styles from './datepicker.module.scss';
import { OpenmrsIntlLocaleContext, useDatepickerContext } from './hooks';
import { type DateInputValue, type DatePickerBaseProps } from './types';
import { I18nWrapper } from './i18n-wrapper.component';
import { DatePickerIcon } from './date-picker-icon.component';
import { CalendarPopover } from './calendar-popover.component';
import { dateToInternationalizedDate, internationalizedDateToDate } from './utils';

/** Properties for the OpenmrsDateRangePicker */
export interface OpenmrsDateRangePickerProps
  extends Omit<DateRangePickerProps<CalendarDate>, 'className' | 'onChange' | 'defaultValue' | 'value'>,
    DatePickerBaseProps {
  /** The default value (uncontrolled) */
  defaultValue?: [DateInputValue, DateInputValue];
  /** Handler that is called when the value changes. */
  onChange?: (value: [Date | null | undefined, Date | null | undefined]) => void;
  /** Handler that is called when the value changes. Note that this provides types from @internationalized/date. */
  onChangeRaw?: (value: DateRange | null) => void;
  /** The value (controlled) */
  value?: [DateInputValue, DateInputValue];
}

/**
 * A date range picker to enter or select a date and time range. Based on React Aria, but styled to look like Carbon.
 */
export const OpenmrsDateRangePicker = /*#__PURE__*/ forwardRef<HTMLDivElement, OpenmrsDateRangePickerProps>(
  function OpenmrsDateRangePicker(
    {
      className,
      defaultValue: rawDefaultValue,
      invalid,
      invalidText,
      isDisabled,
      isInvalid: isInvalidRaw,
      label,
      labelText,
      light,
      maxDate: rawMaxDate,
      minDate: rawMinDate,
      onChange,
      onChangeRaw,
      value: rawValue,
      ...dateRangePickerProps
    },
    ref,
  ) {
    const { calendar, intlLocale, today_ } = useDatepickerContext();

    const id = useId();
    const hasVisibleLabel = !!(labelText ?? label);

    // Warn in development if no accessible label is provided
    if (process.env.NODE_ENV !== 'production') {
      if (!hasVisibleLabel && !dateRangePickerProps['aria-label'] && !dateRangePickerProps['aria-labelledby']) {
        console.warn(
          'OpenmrsDateRangePicker: You must provide either a visible label (labelText/label) or an aria-label for accessibility.',
        );
      }
    }

    const value = useMemo(() => {
      if (rawValue) {
        return {
          start: dateToInternationalizedDate(rawValue[0], calendar, true),
          end: dateToInternationalizedDate(rawValue[1], calendar, true),
        } as DateRange;
      }
      return undefined;
    }, [rawValue]);

    const defaultValue = useMemo(() => {
      if (rawDefaultValue) {
        return {
          start: dateToInternationalizedDate(rawDefaultValue[0], calendar, true),
          end: dateToInternationalizedDate(rawDefaultValue[1], calendar, true),
        } as DateRange;
      }
      return undefined;
    }, [rawDefaultValue]);

    const minDate = useMemo(() => dateToInternationalizedDate(rawMinDate, calendar, true), [rawMinDate]);
    const maxDate = useMemo(() => dateToInternationalizedDate(rawMaxDate, calendar, true), [rawMaxDate]);
    const isInvalid = useMemo(() => invalid ?? isInvalidRaw, [invalid, isInvalidRaw]);

    const innerOnChange = useMemo(() => {
      if (onChangeRaw && onChange) {
        console.error(
          'An OpenmrsDateRangePicker component was created with both onChange and onChangeRaw handlers defined. Only onChangeRaw will be used.',
        );
      }

      return (
        onChangeRaw ??
        ((range: DateRange) =>
          onChange?.([internationalizedDateToDate(range.start), internationalizedDateToDate(range.end)]))
      );
    }, [onChangeRaw, onChange]);

    return (
      <I18nWrapper locale={intlLocale.toString()}>
        <div className={classNames('cds--form-item', className)}>
          <Provider values={[[OpenmrsIntlLocaleContext, intlLocale]]}>
            <DateRangePicker
              id={hasVisibleLabel ? id : undefined}
              className={classNames('cds--date-picker', {
                'cds--date-picker--light': light,
                'cds--date-picker--disabled': isDisabled,
              })}
              isInvalid={isInvalid}
              shouldForceLeadingZeros={intlLocale.language === 'en' ? true : undefined}
              maxValue={maxDate}
              minValue={minDate}
              value={value}
              defaultValue={defaultValue}
              ref={ref}
              isDisabled={isDisabled}
              {...dateRangePickerProps}
              onChange={innerOnChange}
            >
              <div className="cds--date-picker-container">
                {hasVisibleLabel && (
                  <Label className={classNames('cds--label', { 'cds--label--disabled': isDisabled })} htmlFor={id}>
                    {labelText ?? label}
                  </Label>
                )}

                <Group className={styles.inputGroup}>
                  <div className={styles.inputsWrapper}>
                    <DateInput
                      className={classNames(
                        'cds--date-picker-input__wrapper',
                        styles.startInput,
                        styles.dateInputWrapper,
                      )}
                      slot="start"
                    >
                      {(segment) => <DateSegment className={styles.inputSegment} segment={segment} />}
                    </DateInput>
                    <div className={styles.separator}>
                      <span aria-hidden="true" data-readonly>
                        –
                      </span>
                    </div>
                    <DateInput
                      className={classNames(
                        'cds--date-picker-input__wrapper',
                        styles.endInput,
                        styles.dateInputWrapper,
                      )}
                      slot="end"
                    >
                      {(segment) => <DateSegment className={styles.inputSegment} segment={segment} />}
                    </DateInput>
                  </div>
                  <Button className={classNames(styles.flatButton, styles.flatButtonMd)}>
                    <DatePickerIcon />
                  </Button>
                </Group>
                {isInvalid && invalidText && <FieldError className={styles.invalidText}>{invalidText}</FieldError>}
                <CalendarPopover variant="range" today_={today_} minDate={minDate} maxDate={maxDate} />
              </div>
            </DateRangePicker>
          </Provider>
        </div>
      </I18nWrapper>
    );
  },
);
