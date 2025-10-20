import React, { type ReactElement, forwardRef, useId, useMemo } from 'react';
import classNames, { type Argument } from 'classnames';
import {
  type CalendarDate,
  type CalendarDateTime,
  type ZonedDateTime,
  createCalendar,
  getLocalTimeZone,
  toCalendar,
  today,
} from '@internationalized/date';
import { I18nProvider, type I18nProviderProps, type DateValue } from 'react-aria';
import {
  Button,
  Calendar,
  CalendarGrid,
  CalendarCell,
  DatePicker,
  type DatePickerProps,
  FieldError,
  Group,
  Popover,
  Provider,
  Label,
} from 'react-aria-components';
import { type ConfigType as DayjsConfigType } from 'dayjs';
import { useConfig } from '@openmrs/esm-react-utils';
import { getLocale, getDefaultCalendar } from '@openmrs/esm-utils';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';
import { type StyleguideConfigObject } from '../config-schema';
import { dateToInternationalizedDate, internationalizedDateToDate } from './utils';
import { OpenmrsIntlLocaleContext } from './locale-context';
import { MonthYear } from './MonthYear';
import { DatePickerInput } from './DatePickerInput';
import { DatePickerIcon } from './DatePickerIcon';
import { DateSegment } from './DateSegment';
import { AutoCloseDialog } from './auto-close-dialog.component';
import styles from './datepicker.module.scss';

/** A type for any of the acceptable date formats */
export type DateInputValue = CalendarDate | CalendarDateTime | ZonedDateTime | DayjsConfigType;

/**
 * Properties for the OpenmrsDatePicker
 */
export interface OpenmrsDatePickerProps
  // omits here for features we have custom implementations of
  extends Omit<DatePickerProps<CalendarDate>, 'className' | 'onChange' | 'defaultValue' | 'value'> {
  /** Any CSS classes to add to the outer div of the date picker */
  className?: Argument;
  /** The default value (uncontrolled) */
  defaultValue?: DateInputValue;
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

export function I18nWrapper(props: I18nProviderProps): JSX.Element {
  return React.createElement(I18nProvider as (props: I18nProviderProps) => JSX.Element, props);
}

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
    } = Object.assign({}, defaultProps, props);

    const config = useConfig<StyleguideConfigObject>({ externalModuleName: '@openmrs/esm-styleguide' });
    const preferredDateLocaleMap = config.preferredDateLocale;

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

    const locale = useMemo(() => {
      let locale = getLocale();

      if (preferredDateLocaleMap[locale]) {
        locale = preferredDateLocaleMap[locale];
      }

      return locale;
    }, [window.i18next.language]);

    const calendar = useMemo(() => {
      const cal = getDefaultCalendar(locale);
      return typeof cal !== 'undefined' ? createCalendar(cal) : undefined;
    }, [locale]);

    const intlLocale = useMemo(() => new Intl.Locale(locale, { calendar: calendar?.identifier }), [locale, calendar]);

    const defaultValue = useMemo(() => dateToInternationalizedDate(rawDefaultValue, calendar), [rawDefaultValue]);
    const value = useMemo(() => dateToInternationalizedDate(rawValue, calendar, true), [rawValue]);
    const maxDate = useMemo(() => dateToInternationalizedDate(rawMaxDate, calendar), [rawMaxDate]);
    const minDate = useMemo(() => dateToInternationalizedDate(rawMinDate, calendar), [rawMinDate]);
    const isInvalid = useMemo(() => invalid ?? isInvalidRaw, [invalid, isInvalidRaw]);
    const today_ = calendar ? toCalendar(today(getLocalTimeZone()), calendar) : today(getLocalTimeZone());

    const onChange = useMemo(() => {
      if (onChangeRaw && rawOnChange) {
        console.error(
          'An OpenmrsDatePicker component was created with both onChange and onChangeRaw handlers defined. Only onChangeRaw will be used.',
        );
      }
      return onChangeRaw ? onChangeRaw : (value: DateValue) => rawOnChange?.(internationalizedDateToDate(value));
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
              <Popover className={styles.popover} placement="bottom start" offset={1} isNonModal={true}>
                <AutoCloseDialog>
                  <Calendar>
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
                  </Calendar>
                </AutoCloseDialog>
              </Popover>
            </DatePicker>
          </Provider>
        </div>
      </I18nWrapper>
    );
  },
);
