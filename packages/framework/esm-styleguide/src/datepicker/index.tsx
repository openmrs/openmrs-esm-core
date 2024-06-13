import React, {
  forwardRef,
  type HTMLAttributes,
  type PropsWithChildren,
  useMemo,
  useRef,
  useImperativeHandle,
  type RefObject,
  useContext,
  useCallback,
} from 'react';
import classNames, { type Argument } from 'classnames';
import { CalendarDate, CalendarDateTime, ZonedDateTime } from '@internationalized/date';
import { type AriaButtonOptions, I18nProvider, useButton, useLocale } from 'react-aria';
import {
  ButtonContext,
  Calendar,
  CalendarGrid,
  CalendarCell,
  CalendarStateContext,
  DateInput,
  DatePicker,
  type DateValue,
  DateSegment,
  Dialog,
  Group,
  Label,
  Popover,
  useContextProps,
  type SlotProps,
  RangeCalendarStateContext,
  NumberField,
  Input,
  Button,
} from 'react-aria-components';
import dayjs, { type Dayjs } from 'dayjs';
import { formatDate, getDefaultCalendar, getLocale } from '@openmrs/esm-utils';
import styles from './datepicker.scss';
import { CalendarIcon, CaretDownIcon, CaretUpIcon, ChevronLeftIcon, ChevronRightIcon } from '../icons';

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

export interface OpenmrsDatePickerProps {
  /**
   * Any CSS classes to add to the outer div of the date picker
   */
  className?: Argument;
  /**
   * The default value (uncontrolled)
   */
  defaultValue?: DateInputValue;
  /**
   * A callback that can be used to implement arbitrary logic to mark certain dates as
   * unavailable to be selected.
   */
  isDateUnavailable?: (date: DateValue) => boolean;
  /**
   * The label for this DatePicker element
   */
  label?: string;
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
   * Handler that is called when the value changes
   */
  onChange?: (date: DateValue) => void;
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
    // TODO need this casting because DateValue doesn't seem to work as-is'
    return date as unknown as DateValue;
  } else {
    const date_ = dayjs(date).toDate();
    return new CalendarDate(date_.getFullYear(), date_.getMonth(), date_.getDay()) as unknown as DateValue;
  }
}

function toYearNumeric(date: Date, calendar: string | undefined, locale: string | undefined) {
  return parseInt(
    formatDate(date, {
      calendar: calendar,
      locale: locale,
      day: false,
      month: false,
      noToday: true,
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

    const year = toYearNumeric(state.visibleRange.start.toDate(tz), intlLocale.calendar, intlLocale.baseName);
    const maxYear = state.maxValue
      ? toYearNumeric(state.maxValue.toDate(tz), intlLocale.calendar, intlLocale.baseName)
      : undefined;
    const minYear = state.minValue
      ? toYearNumeric(state.minValue.toDate(tz), intlLocale.calendar, intlLocale.baseName)
      : undefined;

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

/**
 * Component to render a <div /> as a button taking advantage of React Aria's button capabilites.
 *
 * Basically, this allows the easy rendering of buttons without the standard "button" styles
 */
const FlatButton = forwardRef<Element, PropsWithChildren<AriaButtonOptions<'div'> & SlotProps>>(
  function FlatButton(props, ref) {
    // This gets cast a lot in here; it's really a limitation of Typescript and a series of broken types
    let divRef: RefObject<Element> = useRef<Element>(null);
    useImperativeHandle(ref, () => divRef.current!);

    [props, divRef] = useContextProps(props, divRef as RefObject<HTMLButtonElement>, ButtonContext);
    const { buttonProps } = useButton(props, divRef);
    const className = classNames(buttonProps.className, styles.flatButton);

    return (
      <div ref={divRef as RefObject<HTMLDivElement>} role="button" {...buttonProps} className={className}>
        {props.children}
      </div>
    );
  },
);

/**
 * A date picker component to select a single date. Based on React Aria, but styled to look like Carbon.
 */
export const OpenmrsDatePicker = forwardRef<HTMLDivElement, OpenmrsDatePickerProps>(
  function OpenmrsDatePicker(props, ref) {
    const {
      className,
      defaultValue: rawDefaultValue,
      isDateUnavailable,
      label,
      light,
      maxDate: rawMaxDate,
      minDate: rawMinDate,
      onChange,
      short,
      size,
      value: rawValue,
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
            isDateUnavailable={isDateUnavailable}
            maxValue={maxDate}
            minValue={minDate}
            onChange={onChange}
            value={value}
          >
            <div className="cds--date-picker-container">
              {label && <Label className="cds--label">{label}</Label>}
              <Group className={styles.inputGroup}>
                <DateInput
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
                </DateInput>
                <FlatButton>
                  <CalendarIcon size={16} />
                </FlatButton>
              </Group>
            </div>
            <Popover className={styles.popover} placement="bottom" offset={1}>
              <Dialog className={styles.dialog}>
                <Calendar className={classNames('cds--date-picker__calendar')}>
                  <header className={styles.header}>
                    <FlatButton slot="previous">
                      <ChevronLeftIcon size={16} />
                    </FlatButton>
                    <MonthYear className={styles.monthYear} />
                    <FlatButton slot="next">
                      <ChevronRightIcon size={16} />
                    </FlatButton>
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
