import React, {
  type CSSProperties,
  type ForwardedRef,
  type HTMLAttributes,
  type MouseEvent,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
  createContext,
  cloneElement,
  forwardRef,
  memo,
  useContext,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
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
import dayjs, { type ConfigType as DayjsConfigType } from 'dayjs';
import { useConfig, useOnClickOutside } from '@openmrs/esm-react-utils';
import { getLocale, formatDate, getDefaultCalendar } from '@openmrs/esm-utils';
import { CalendarIcon, CaretDownIcon, CaretUpIcon, ChevronLeftIcon, ChevronRightIcon, WarningIcon } from '../icons';
import styles from './datepicker.module.scss';
import { type StyleguideConfigObject } from '../config-schema';

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
    const calendarDate = new CalendarDate(date_.getFullYear(), date_.getMonth() + 1, date_.getDate());
    return calendar ? toCalendar(calendarDate, calendar) : calendarDate;
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

const MonthYear = /*#__PURE__*/ forwardRef<HTMLSpanElement, PropsWithChildren<HTMLAttributes<HTMLSpanElement>>>(
  function MonthYear(props, ref) {
    const { className } = props;
    const calendarState = useContext(CalendarStateContext);
    const rangeCalendarState = useContext(RangeCalendarStateContext);

    const state = (calendarState ?? rangeCalendarState)!;

    const intlLocale = useIntlLocale();
    const tz = getLocalTimeZone();

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
        <span ref={ref} className={className}>
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

const DatePickerIcon = /*#__PURE__*/ forwardRef<SVGSVGElement>(function DatePickerIcon(props, ref) {
  const state = useContext(DatePickerStateContext)!;

  return state.isInvalid ? (
    <WarningIcon ref={ref} size={16} {...props} />
  ) : (
    <CalendarIcon ref={ref} size={16} {...props} />
  );
});

interface OpenmrsDateInputProps {
  id?: string;
  onClick: () => void;
}

// The main reason for this component is to allow us to click inside the date field and trigger the popover
const DatePickerInput = /*#__PURE__*/ forwardRef<HTMLDivElement, DateInputProps & OpenmrsDateInputProps>(
  function DatePickerInput(props, ref) {
    const [dateFieldProps, fieldRef] = useContextProps({ slot: props.slot }, ref, DateFieldContext);
    const { locale } = useLocale();
    const state = useDateFieldState({
      ...dateFieldProps,
      locale,
      createCalendar,
    });

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
          id={props.id}
          ref={ref}
          slot={props.slot || undefined}
          className={props.className}
          isInvalid={state.isInvalid}
          onClick={props.onClick}
        >
          {state.segments.map((segment, i) => cloneElement(props.children(segment), { key: i }))}
        </Group>
        <Input />
      </Provider>
    );
  },
);

interface RenderPropsHookOptions<T> extends DOMProps, AriaLabelingProps {
  /** The CSS [className](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) for the element. A function may be provided to compute the class based on component state. */
  className?: string | ((values: T & { defaultClassName: string | undefined }) => string);
  /** The inline [style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) for the element. A function may be provided to compute the style based on component state. */
  style?: CSSProperties | ((values: T & { defaultStyle: CSSProperties }) => CSSProperties | undefined);
  /** The children of the component. A function may be provided to alter the children based on component state. */
  children?: ReactNode | ((values: T & { defaultChildren: ReactNode | undefined }) => ReactNode);
  values: T;
  defaultChildren?: ReactNode;
  defaultClassName?: string;
  defaultStyle?: CSSProperties;
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

const DateSegment = /*#__PURE__*/ forwardRef(function DateSegment(
  { segment, ...otherProps }: DateSegmentProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const state = useContext(DateFieldStateContext)!;
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

  const onClick = useCallback((event: MouseEvent) => {
    event.stopPropagation();
  }, []);

  return (
    <span
      {...mergeProps(
        filterDOMProps(otherProps as unknown as Parameters<typeof filterDOMProps>[0]),
        segmentProps,
        focusProps,
        hoverProps,
      )}
      {...renderProps}
      ref={domRef}
      style={segmentProps.style}
      data-placeholder={segment.isPlaceholder || undefined}
      data-invalid={state.isInvalid || undefined}
      data-readonly={!segment.isEditable || undefined}
      data-disabled={state.isDisabled || undefined}
      data-type={segment.type}
      data-hovered={isHovered || undefined}
      data-focused={isFocused || undefined}
      data-focus-visible={isFocusVisible || undefined}
      onClick={onClick}
    />
  );
});

interface OpenmrsDatePickerLabelProps {
  labelText: OpenmrsDatePickerProps['labelText'];
  htmlFor: string;
}

const DatePickerLabel = /*#__PURE__*/ memo(function DatePickerLabel({
  labelText,
  htmlFor,
}: OpenmrsDatePickerLabelProps) {
  if (labelText === null || typeof labelText === 'undefined' || typeof labelText === 'boolean') {
    return null;
  }

  return (
    <Label className="cds--label" htmlFor={htmlFor}>
      {labelText}
    </Label>
  );
});

const OpenmrsIntlLocaleContext = createContext<Intl.Locale | null>(null);

const useIntlLocale = () => useContext(OpenmrsIntlLocaleContext)!;

/**
 * A date picker component to select a single date. Based on React Aria, but styled to look like Carbon.
 */
export const OpenmrsDatePicker = /*#__PURE__*/ forwardRef<HTMLDivElement, OpenmrsDatePickerProps>(
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

    const config = useConfig<StyleguideConfigObject>({ externalModuleName: '@openmrs/esm-styleguide' });
    const preferredDateLocaleMap = config.preferredDateLocale;

    const id = useId();

    const locale = useMemo(() => {
      let locale = getLocale();

      if (preferredDateLocaleMap[locale]) {
        locale = preferredDateLocaleMap[locale];
      }

      return locale;
    }, []);

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

    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const togglePopover = useCallback(() => {
      setPopoverOpen(!isPopoverOpen);
    }, [isPopoverOpen]);

    const boundaryRef = useOnClickOutside<HTMLDivElement>(() => setPopoverOpen(false));

    const onChange = useMemo(() => {
      if (onChangeRaw && rawOnChange) {
        console.error(
          'An OpenmrsDatePicker component was created with both onChange and onChangeRaw handlers defined. Only onChangeRaw will be used.',
        );
      }
      return onChangeRaw ? onChangeRaw : (value: DateValue) => rawOnChange?.(internationalizedDateToDate(value));
    }, [onChangeRaw, rawOnChange]);

    return (
      <I18nProvider locale={intlLocale.toString()}>
        <div className={classNames('cds--form-item', className)}>
          <Provider values={[[OpenmrsIntlLocaleContext, intlLocale]]}>
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
              <div className="cds--date-picker-container" ref={boundaryRef}>
                {(labelText ?? label) && <DatePickerLabel labelText={labelText ?? label} htmlFor={id} />}
                <Group className={styles.inputGroup}>
                  <DatePickerInput
                    id={id}
                    ref={ref}
                    className={classNames('cds--date-picker-input__wrapper', styles.inputWrapper, {
                      [styles.inputWrapperMd]: size === 'md' || !size || size.length === 0,
                    })}
                    onClick={togglePopover}
                  >
                    {(segment) => {
                      return segment.type !== 'era' ? (
                        <DateSegment className={styles.inputSegment} segment={segment} />
                      ) : (
                        <React.Fragment />
                      );
                    }}
                  </DatePickerInput>
                  <Button className={classNames(styles.flatButton, styles.flatButtonMd)} onPress={togglePopover}>
                    <DatePickerIcon />
                  </Button>
                </Group>
                {isInvalid && invalidText && <FieldError className={styles.invalidText}>{invalidText}</FieldError>}
              </div>
              <Popover
                className={styles.popover}
                placement="bottom"
                offset={1}
                isNonModal={true}
                isOpen={isPopoverOpen}
              >
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
                          key={date.toString()}
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
          </Provider>
        </div>
      </I18nProvider>
    );
  },
);
