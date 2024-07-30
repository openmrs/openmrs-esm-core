import React, {
  type CSSProperties,
  type ForwardedRef,
  type HTMLAttributes,
  type PropsWithChildren,
  type RefObject,
  type ReactElement,
  type ReactNode,
  cloneElement,
  forwardRef,
  useMemo,
  useContext,
  useCallback,
  useRef,
} from 'react';
import classNames, { type Argument } from 'classnames';
import {
  type Calendar as CalendarType,
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
  createCalendar,
  getLocalTimeZone,
  toCalendar,
  today,
} from '@internationalized/date';
import { type AriaLabelingProps, type DOMProps } from '@react-types/shared';
import { filterDOMProps } from '@react-aria/utils';
import {
  I18nProvider,
  type DateValue,
  mergeProps,
  useLocale,
  useDateField,
  useDateSegment,
  useFocusRing,
  useHover,
  useObjectRef,
} from 'react-aria';
import { useDateFieldState } from 'react-stately';
import {
  Button,
  Calendar,
  CalendarGrid,
  CalendarCell,
  CalendarStateContext,
  DateFieldContext,
  DateFieldStateContext,
  type DateInputProps,
  DatePicker,
  type DatePickerProps,
  DatePickerStateContext,
  type DateSegmentProps,
  Dialog,
  FieldError,
  Group,
  GroupContext,
  Input,
  InputContext,
  Label,
  NumberField,
  Popover,
  Provider,
  RangeCalendarStateContext,
  useContextProps,
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

/**
 * Function to convert relatively arbitrary date values into a React Aria `DateValue`,
 * normally a `CalendarDate`, which represents a date without time or timezone.
 */
function dateToInternationalizedDate(
  date: DateInputValue,
  calendar: CalendarType | undefined,
  allowNull: true,
): DateValue | null | undefined;
function dateToInternationalizedDate(
  date: DateInputValue,
  calendar: CalendarType | undefined,
  allowNull: false,
): DateValue | undefined;
function dateToInternationalizedDate(date: DateInputValue, calendar: CalendarType | undefined): DateValue | undefined;
function dateToInternationalizedDate(
  date: DateInputValue,
  calendar: CalendarType | undefined,
  allowNull: boolean = false,
) {
  if (typeof date === 'undefined' || date === null) {
    return allowNull ? date : undefined;
  }

  if (typeof date === 'string' && !date) {
    return allowNull ? null : undefined;
  }

  if (date instanceof CalendarDate || date instanceof CalendarDateTime || date instanceof ZonedDateTime) {
    return calendar ? toCalendar(date, calendar) : date;
  } else {
    const date_ = dayjs(date).toDate();
    return calendar
      ? toCalendar(new CalendarDate(date_.getFullYear(), date_.getMonth() + 1, date_.getDate()), calendar)
      : new CalendarDate(date_.getFullYear(), date_.getMonth() + 1, date_.getDate());
  }
}

function internationalizedDateToDate(date: DateValue): Date | undefined {
  if (!date) {
    return undefined;
  }
  return date.toDate(getLocalTimeZone());
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

const DatePickerIcon = forwardRef<SVGSVGElement>(function DatePickerIcon(props, ref) {
  const state = useContext(DatePickerStateContext);

  return state.isInvalid ? <WarningIcon ref={ref} size={16} /> : <CalendarIcon ref={ref} size={16} />;
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
        onClick={() => {
          datePickerState.setOpen(!datePickerState.isOpen);
        }}
      >
        {state.segments.map((segment, i) => cloneElement(props.children(segment), { key: i }))}
      </Group>
      <Input />
    </Provider>
  );
});

interface RenderPropsHookOptions<T> extends DOMProps, AriaLabelingProps {
  children?: ReactNode | ((values: T & { defaultChildren: ReactNode | undefined }) => ReactNode);
  values: T;
  defaultChildren?: ReactNode;
  defaultClassName?: string;
  defaultStyle?: CSSProperties;
  className?: string | ((values: T & { defaultClassName: string | undefined }) => string);
  style?: CSSProperties | ((values: T & { defaultStyle: CSSProperties }) => CSSProperties);
}

function useRenderProps<T>(props: RenderPropsHookOptions<T>) {
  const {
    className,
    style,
    children,
    defaultClassName = undefined,
    defaultChildren = undefined,
    defaultStyle,
    values,
  } = props;

  return useMemo(() => {
    let computedClassName: string | undefined;
    let computedStyle: React.CSSProperties | undefined;
    let computedChildren: React.ReactNode | undefined;

    if (typeof className === 'function') {
      computedClassName = className({ ...values, defaultClassName });
    } else {
      computedClassName = className;
    }

    if (typeof style === 'function') {
      computedStyle = style({ ...values, defaultStyle: defaultStyle || {} });
    } else {
      computedStyle = style;
    }

    if (typeof children === 'function') {
      computedChildren = children({ ...values, defaultChildren });
    } else if (children == null) {
      computedChildren = defaultChildren;
    } else {
      computedChildren = children;
    }

    return {
      className: computedClassName ?? defaultClassName,
      style: computedStyle || defaultStyle ? { ...defaultStyle, ...computedStyle } : undefined,
      children: computedChildren ?? defaultChildren,
      'data-rac': '',
    };
  }, [className, style, children, defaultClassName, defaultChildren, defaultStyle, values]);
}

const DateSegment = forwardRef(function DateSegment(
  { segment, ...otherProps }: DateSegmentProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const state = useContext(DateFieldStateContext);
  const domRef = useObjectRef(ref);
  const { segmentProps } = useDateSegment(segment, state, domRef);
  const { focusProps, isFocused, isFocusVisible } = useFocusRing();
  const { hoverProps, isHovered } = useHover({
    ...otherProps,
    isDisabled: state.isDisabled || segment.type === 'literal',
  });
  const renderProps = useRenderProps({
    ...otherProps,
    values: {
      ...segment,
      isReadOnly: !segment.isEditable,
      isInvalid: state.isInvalid,
      isDisabled: state.isDisabled,
      isHovered,
      isFocused,
      isFocusVisible,
    },
    defaultChildren: segment.text,
  });

  return (
    <div
      {...mergeProps(
        filterDOMProps(otherProps as unknown as Parameters<typeof filterDOMProps>[0]),
        segmentProps,
        focusProps,
        hoverProps,
      )}
      {...renderProps}
      ref={domRef}
      data-placeholder={segment.isPlaceholder || undefined}
      data-invalid={state.isInvalid || undefined}
      data-readonly={!segment.isEditable || undefined}
      data-disabled={state.isDisabled || undefined}
      data-type={segment.type}
      data-hovered={isHovered || undefined}
      data-focused={isFocused || undefined}
      data-focus-visible={isFocusVisible || undefined}
      onClick={(event) => event.stopPropagation()}
    />
  );
});

function DatePickerLabel({ labelText }: Pick<OpenmrsDatePickerProps, 'labelText'>) {
  if (labelText === null || typeof labelText === 'undefined' || typeof labelText === 'boolean') {
    return null;
  }

  return <Label className="cds--label">{labelText}</Label>;
}

/**
 * A date picker component to select a single date. Based on React Aria, but styled to look like Carbon.
 */
export const OpenmrsDatePicker = forwardRef<HTMLDivElement, OpenmrsDatePickerProps>(
  function OpenmrsDatePicker(props, ref) {
    const {
      className,
      defaultValue: rawDefaultValue,
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

    const locale = useMemo(() => {
      let locale = getLocale();
      let intlLocale = new Intl.Locale(locale);

      if (intlLocale.language === 'en' && !intlLocale.region) {
        locale = 'en-GB';
      }

      return locale;
    }, []);

    const calendar = useMemo(() => {
      const cal = getDefaultCalendar(locale);
      return typeof cal !== 'undefined' ? createCalendar(cal) : undefined;
    }, [locale]);

    const intlLocale = useMemo(() => new Intl.Locale(locale, { calendar: calendar?.identifier }), [locale, calendar]);

    const localeWithCalendar = useMemo(() => intlLocale.toString(), [intlLocale]);

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
      <I18nProvider locale={localeWithCalendar}>
        <div className={classNames('cds--form-item', className)}>
          <DatePicker
            className={classNames('cds--date-picker', 'cds--date-picker--single', {
              ['cds--date-picker--short']: short,
              ['cds--date-picker--light']: light,
            })}
            defaultValue={defaultValue}
            isInvalid={isInvalid}
            maxValue={maxDate}
            minValue={minDate}
            value={value}
            shouldForceLeadingZeros={intlLocale.language === 'en' ? true : undefined}
            {...datePickerProps}
            onChange={onChange}
          >
            <div className="cds--date-picker-container">
              <DatePickerLabel labelText={labelText ?? label} />
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
              {isInvalid && invalidText && <FieldError className={styles.invalidText}>{invalidText}</FieldError>}
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
                    {(date) => (
                      <CalendarCell
                        className={classNames('cds--date-picker__day', {
                          [styles.today]: today_.compare(date) === 0,
                        })}
                        date={date}
                      />
                    )}
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
