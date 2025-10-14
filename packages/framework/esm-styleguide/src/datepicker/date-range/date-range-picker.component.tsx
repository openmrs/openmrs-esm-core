import React, { forwardRef, type ReactElement, useId, useMemo } from 'react';
import classNames, { type Argument } from 'classnames';
import { createCalendar, getLocalTimeZone, toCalendar, today, type CalendarDate } from '@internationalized/date';
import {
  Button,
  CalendarCell,
  CalendarGrid,
  DateInput,
  DateRangePicker,
  type DateRangePickerProps,
  FieldError,
  Label,
  Popover,
  Provider,
  RangeCalendar,
  type DateRange,
  Group,
} from 'react-aria-components';
import { DateSegment } from '../DateSegment';
import styles from './date-range-picker.module.scss';
import { MonthYear } from '../MonthYear';
import { OpenmrsIntlLocaleContext } from '../locale-context';
import { type DateInputValue, I18nWrapper } from '../OpenmrsDatePicker';
import { DateRangePickerIcon } from './date-range-icon.component';
import { dateToInternationalizedDate, internationalizedDateToDate } from '../utils';
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons';
import { useConfig } from '@openmrs/esm-react-utils';
import { getDefaultCalendar, getLocale } from '@openmrs/esm-utils';
import { type StyleguideConfigObject } from '../../config-schema';
import { AutoCloseDialog } from '../auto-close-dialog.component';

export interface OpenmrsDateRangePickerProps
  extends Omit<DateRangePickerProps<CalendarDate>, 'className' | 'onChange' | 'defaultValue' | 'value'> {
  /** Any CSS classes to add to the outer div of the date picker */
  className?: Argument;
  /** The default value (uncontrolled) */
  defaultValue?: [DateInputValue, DateInputValue];
  /** Whether the input value is invalid. */
  invalid?: boolean;
  /** Text to show if the input is invalid e.g. an error message */
  invalidText?: string;
  /**
   * The label for this DatePicker element
   * @deprecated Use labelText instead
   */
  label?: string | ReactElement;
  /** The label for this DatePicker element. */
  labelText?: string | ReactElement;
  /** 'true' to use the light version. */
  light?: boolean;
  /** The latest date it is possible to select */
  maxDate?: DateInputValue;
  /** The earliest date it is possible to select */
  minDate?: DateInputValue;
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
    const config = useConfig<StyleguideConfigObject>({ externalModuleName: '@openmrs/esm-styleguide' });
    const preferredDateLocaleMap = config.preferredDateLocale;

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

    const locale = useMemo(() => {
      let locale = getLocale();
      if (preferredDateLocaleMap[locale]) {
        locale = preferredDateLocaleMap[locale];
      }

      return locale;
      // Notes: Adding a dependency on "window.i18next.language" is not ideal,
      // but it's the only way I managed to get the locale to update consistently when the language changes.
    }, [window.i18next.language]);

    const calendar = useMemo(() => {
      const cal = getDefaultCalendar(locale);
      return typeof cal !== 'undefined' ? createCalendar(cal) : undefined;
    }, [locale]);

    const intlLocale = useMemo(() => new Intl.Locale(locale, { calendar: calendar?.identifier }), [locale, calendar]);
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
    const today_ = calendar ? toCalendar(today(getLocalTimeZone()), calendar) : today(getLocalTimeZone());

    const innerOnChange = useMemo(() => {
      if (onChangeRaw && onChange) {
        console.error(
          'An OpenmrsDateRangePicker component was created with both onChange and onChangeRaw handlers defined. Only onChangeRaw will be used.',
        );
      }
      return onChangeRaw
        ? onChangeRaw
        : (range: DateRange) =>
            onChange?.([internationalizedDateToDate(range.start), internationalizedDateToDate(range.end)]);
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
                    <DateRangePickerIcon />
                  </Button>
                </Group>
                {isInvalid && invalidText && <FieldError className={styles.invalidText}>{invalidText}</FieldError>}
                <Popover className={styles.popover} placement="bottom start" offset={1} isNonModal={true}>
                  <AutoCloseDialog isRangePicker>
                    <RangeCalendar minValue={minDate} maxValue={maxDate} className="cds--date-picker__calendar">
                      <header className={styles.header}>
                        <Button className={classNames(styles.flatButton, styles.flatButtonMd)} slot="previous">
                          <ChevronLeftIcon size={16} />
                        </Button>
                        <MonthYear className={styles.monthYear} />
                        <Button className={classNames(styles.flatButton, styles.flatButtonMd)} slot="next">
                          <ChevronRightIcon size={16} />
                        </Button>
                      </header>
                      <CalendarGrid className={styles.calendarGrid}>
                        {(date) => (
                          <CalendarCell
                            key={date.toString()}
                            className={classNames('cds--date-picker__day', {
                              [styles.today]: today_.compare(date) === 0,
                            })}
                            date={date}
                          />
                        )}
                      </CalendarGrid>
                    </RangeCalendar>
                  </AutoCloseDialog>
                </Popover>
              </div>
            </DateRangePicker>
          </Provider>
        </div>
      </I18nWrapper>
    );
  },
);
