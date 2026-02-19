import {
  createContext,
  type CSSProperties,
  type ReactNode,
  type RefCallback,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createCalendar, getLocalTimeZone, toCalendar, today, type Calendar } from '@internationalized/date';
import { type AriaLabelingProps, type DOMProps } from '@react-types/shared';
import { useConfig } from '@openmrs/esm-react-utils';
import { getLocale, getDefaultCalendar } from '@openmrs/esm-utils';
import { type StyleguideConfigObject } from '../config-schema';

export const OpenmrsIntlLocaleContext = createContext<Intl.Locale | null>(null);

export const useIntlLocale = () => useContext(OpenmrsIntlLocaleContext)!;

/**
 * This is the context provided to the OpenmrsDatePicker and OpenmrsDateRangePicker
 */
interface DatepickerContext {
  calendar: Calendar | undefined;
  intlLocale: Intl.Locale;
  today_: ReturnType<typeof today>;
}

/**
 * Resolves the active locale, calendar system, and "today" value for use
 * in both OpenmrsDatePicker and OpenmrsDateRangePicker.
 *
 * The locale is resolved from i18next, mapped through the user's preferred
 * date locale config, and then used to derive the calendar system. This
 * supports non-Gregorian calendars (e.g., Ethiopic) based on locale settings.
 *
 * Depends on `window.i18next.language` to re-compute when the UI language changes.
 */
export function useDatepickerContext(): DatepickerContext {
  const config = useConfig<StyleguideConfigObject>({ externalModuleName: '@openmrs/esm-styleguide' });
  const preferredDateLocaleMap = config.preferredDateLocale;

  const locale = useMemo(() => {
    let loc = getLocale();
    if (preferredDateLocaleMap[loc]) {
      loc = preferredDateLocaleMap[loc];
    }
    return loc;
  }, [window.i18next.language]);

  const calendar = useMemo(() => {
    const cal = getDefaultCalendar(locale);
    return typeof cal !== 'undefined' ? createCalendar(cal) : undefined;
  }, [locale]);

  const intlLocale = useMemo(() => new Intl.Locale(locale, { calendar: calendar?.identifier }), [locale, calendar]);

  const today_ = calendar ? toCalendar(today(getLocalTimeZone()), calendar) : today(getLocalTimeZone());

  return { calendar, intlLocale, today_ };
}

// These are largely copied from non-exported hooks that are part of
// React Aria Components which we need versions of for some of our components.

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

/**
 * Hook to provide standard handling for certain properties, especially className, style, and children.
 */
export function useRenderProps<T>(props: RenderPropsHookOptions<T>) {
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
    let computedStyle: CSSProperties | undefined;
    let computedChildren: ReactNode | undefined;

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
