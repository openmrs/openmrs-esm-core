import React, {
  cloneElement,
  forwardRef,
  type HTMLAttributes,
  type PropsWithChildren,
  type RefObject,
  type ReactElement,
  useMemo,
  useContext,
  useCallback,
  useRef,
} from 'react';
import classNames, { type Argument } from 'classnames';
import { createCalendar, CalendarDate, CalendarDateTime, ZonedDateTime } from '@internationalized/date';
import { I18nProvider, type DateValue, useLocale, useDateField } from 'react-aria';
import { useDateFieldState } from 'react-stately';
import {
  Button,
  Calendar,
  CalendarGrid,
  CalendarCell,
  CalendarStateContext,
  DateFieldContext,
  type DateInputProps,
  DatePicker,
  type DatePickerProps,
  DatePickerStateContext,
  DateSegment,
  Dialog,
  Group,
  Input,
  Label,
  NumberField,
  Popover,
  RangeCalendarStateContext,
  useContextProps,
  DateFieldStateContext,
  InputContext,
  Provider,
  GroupContext,
  Text,
} from 'react-aria-components';
import dayjs, { type Dayjs } from 'dayjs';
import { formatDate, getDefaultCalendar, getLocale } from '@openmrs/esm-utils';
import styles from './datepicker.module.scss';
import { CalendarIcon, CaretDownIcon, CaretUpIcon, ChevronLeftIcon, ChevronRightIcon, WarningIcon } from '../icons';

/** A type for any of the acceptable date formats */
export type DateInputValue =
  | CalendarDate
  | CalendarDateTime
  | ZonedDateTime
  | Date
  | Dayjs
  | string
  | number
  | null
  | undefined;

/**
 * Properties for the OpenmrsDatePicker
 */
export interface OpenmrsDatePickerProps
  // omits here for features we have custom implementations of
  extends Omit<DatePickerProps<CalendarDate>, 'className' | 'defaultValue' | 'value'> {
  /**
   * Any CSS classes to add to the outer div of the date picker
   */
  className?: Argument;
  /**
   * The default value (uncontrolled)
   */
  defaultValue?: DateInputValue;
  /**
   * Text to show if the input is invalid e.g. an error message
   */
  invalidText?: string;
  /**
   * Specifies if the input is required. Used to add an asterisk to the label.
   */
  isRequired?: boolean;
  /**
   * The label for this DatePicker element
   * @deprecated Use labelText instead
   */
  label?: string | ReactElement;
  /**
   * The label for this DatePicker element
   */
  labelText?: string | ReactElement;
  /**
   * 'true' to use the light version.
   */
  light?: boolean;
  /**
   * The latest date it is possible to select
   */
  maxDate?: DateInputValue;
  /**
   * The earliest date it is possible to select
   */
  minDate?: DateInputValue;
  /**
   * Specifies the size of the input. Currently supports either `sm`, `md`, or `lg` as an option.
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * 'true' to use the short version.
   */
  short?: boolean;
  /**
   * The value (controlled)
   */
  value?: DateInputValue;
}

const defaultProps: OpenmrsDatePickerProps = {
  short: false,
  size: 'md',
};

/**
 * Function to convert relatively arbitrary date values into a React Aria `DateValue`,
 * normally a `CalendarDate`, which represents a date without time or timezone.
 */
function dateToInternationalizedDate(date: DateInputValue): DateValue | undefined {
  if (!date) {
    return undefined;
  }

  if (date instanceof CalendarDate || date instanceof CalendarDateTime || date instanceof ZonedDateTime) {
    return date;
  } else {
    const date_ = dayjs(date).toDate();
    return new CalendarDate(date_.getFullYear(), date_.getMonth() + 1, date_.getDate());
  }
}

function getYearAsNumber(date: Date, intlLocale: Intl.Locale) {
  return parseInt(
    formatDate(date, {
      calendar: intlLocale.calendar,
      locale: intlLocale.baseName,
      day: false,
      month: false,
      noToday: true,
      numberingSystem: 'latn',
    }),
  );
}

const MonthYear = forwardRef<Element, PropsWithChildren<HTMLAttributes<HTMLSpanElement>>>(
  function MonthYear(props, ref) {
    const { className } = props;
    const calendarState = useContext(CalendarStateContext);
    const rangeCalendarState = useContext(RangeCalendarStateContext);

    const state = calendarState ?? rangeCalendarState;

    const locale = useLocale();
    const intlLocale = new Intl.Locale(locale.locale);
    const tz = Intl.DateTimeFormat(intlLocale.toString()).resolvedOptions().timeZone;

    const month = formatDate(state.visibleRange.start.toDate(tz), {
      calendar: intlLocale.calendar,
      locale: intlLocale.baseName,
      day: false,
      year: false,
      noToday: true,
    });

    const year = getYearAsNumber(state.visibleRange.start.toDate(tz), intlLocale);

    const maxYear = state.maxValue ? getYearAsNumber(state.maxValue.toDate(tz), intlLocale) : undefined;
    const minYear = state.minValue ? getYearAsNumber(state.minValue.toDate(tz), intlLocale) : undefined;

    const changeHandler = useCallback((value: number) => {
      state.setFocusedDate(state.focusedDate.cycle('year', value - state.focusedDate.year));
    }, []);

    return (
      state && (
        <span ref={ref as RefObject<HTMLSpanElement>} className={className}>
          <span>{month}</span>
          <NumberField
            formatOptions={{ useGrouping: false }}
            maxValue={maxYear}
            minValue={minYear}
            onChange={changeHandler}
            value={year}
          >
            <Input />
            <Group>
              <Button slot="increment">
                <CaretUpIcon size={8} />
              </Button>
              <Button slot="decrement">
                <CaretDownIcon size={8} />
              </Button>
            </Group>
          </NumberField>
        </span>
      )
    );
  },
);

const DatePickerIcon = forwardRef<Element>(function DatePickerIcon(props, ref) {
  const state = useContext(DatePickerStateContext);
  return state.isInvalid ? (
    <WarningIcon className="cds--date-picker__icon--invalid" size={16} />
  ) : (
    <CalendarIcon size={16} />
  );
});

// The main reason for this component is to allow us to click inside the date field and trigger the popover
const DatePickerInput = forwardRef<HTMLDivElement, DateInputProps>(function DatePickerInput(props, ref) {
  const [dateFieldProps, fieldRef] = useContextProps({ slot: props.slot }, ref, DateFieldContext);
  const { locale } = useLocale();
  const state = useDateFieldState({
    ...dateFieldProps,
    locale,
    createCalendar,
  });
  const datePickerState = useContext(DatePickerStateContext);

  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldProps, inputProps } = useDateField({ ...dateFieldProps, inputRef }, state, fieldRef);

  return (
    <Provider
      values={[
        [DateFieldStateContext, state],
        [InputContext, { ...inputProps, ref: inputRef }],
        [GroupContext, { ...fieldProps, ref: fieldRef, isInvalid: state.isInvalid }],
      ]}
    >
      <Group
        {...props}
        ref={ref}
        slot={props.slot || undefined}
        className={props.className ?? 'react-aria-DateInput'}
        isInvalid={state.isInvalid}
        onClick={() => datePickerState.setOpen(!datePickerState.isOpen)}
      >
        {state.segments.map((segment, i) => cloneElement(props.children(segment), { key: i }))}
      </Group>
      <Input />
    </Provider>
  );
});

function DatePickerLabel({ labelText, isRequired = false }: Pick<OpenmrsDatePickerProps, 'labelText' | 'isRequired'>) {
  if (labelText === null || typeof labelText === 'undefined' || typeof labelText === 'boolean') {
    return null;
  }

  return (
    <Label className="cds--label">
      {typeof labelText === 'string' && isRequired ? (
        <>
          {labelText} <span className={styles.isRequired}>*</span>
        </>
      ) : (
        labelText
      )}
    </Label>
  );
}

/**
 * A date picker component to select a single date. Based on React Aria, but styled to look like Carbon.
 */
export const OpenmrsDatePicker = forwardRef<HTMLDivElement, OpenmrsDatePickerProps>(
  function OpenmrsDatePicker(props, ref) {
    const {
      className,
      defaultValue: rawDefaultValue,
      invalidText,
      isRequired,
      label,
      labelText,
      light,
      maxDate: rawMaxDate,
      minDate: rawMinDate,
      short,
      size,
      value: rawValue,
      ...datePickerProps
    } = Object.assign({}, defaultProps, props);

    const defaultValue = useMemo(() => dateToInternationalizedDate(rawDefaultValue), [rawDefaultValue]);
    const value = useMemo(() => dateToInternationalizedDate(rawValue), [rawValue]);
    const maxDate = useMemo(() => dateToInternationalizedDate(rawMaxDate), [rawMaxDate]);
    const minDate = useMemo(() => dateToInternationalizedDate(rawMinDate), [rawMinDate]);

    const locale = getLocale();

    const localeWithCalendar = useMemo(() => {
      const calendar = getDefaultCalendar(locale);

      if (typeof calendar === 'undefined') {
        return locale;
      }
      return `${locale}-u-ca-${calendar}`;
    }, [locale]);

    return (
      <I18nProvider locale={localeWithCalendar}>
        <div className={classNames('cds--form-item', className)}>
          <DatePicker
            className={classNames('cds--date-picker', 'cds--date-picker--single', {
              ['cds--date-picker--short']: short,
              ['cds--date-picker--light']: light,
            })}
            defaultValue={defaultValue}
            isRequired={isRequired}
            maxValue={maxDate}
            minValue={minDate}
            value={value}
            {...datePickerProps}
          >
            <div className="cds--date-picker-container">
              <DatePickerLabel labelText={labelText ?? label} isRequired={isRequired} />
              <Group className={styles.inputGroup}>
                <DatePickerInput
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
              {invalidText && (
                <Text slot="errorMessage" className={styles.invalidText}>
                  {invalidText}
                </Text>
              )}
            </div>
            <Popover className={styles.popover} placement="bottom" offset={1}>
              <Dialog className={styles.dialog}>
                <Calendar className={classNames('cds--date-picker__calendar')}>
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
                    {(date) => <CalendarCell className="cds--date-picker__day" date={date} />}
                  </CalendarGrid>
                </Calendar>
              </Dialog>
            </Popover>
          </DatePicker>
        </div>
      </I18nProvider>
    );
  },
);
