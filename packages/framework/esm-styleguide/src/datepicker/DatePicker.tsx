import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { useDatePicker, useFocusRing } from 'react-aria';
import {
  type DatePickerProps,
  type DateValue,
  useContextProps,
  DatePickerContext,
  useSlottedContext,
  FormContext,
  Provider,
  DatePickerStateContext,
  GroupContext,
  DateFieldContext,
  ButtonContext,
  LabelContext,
  CalendarContext,
  PopoverContext,
  OverlayTriggerStateContext,
  DialogContext,
  TextContext,
  FieldErrorContext,
} from 'react-aria-components';
import { useDatePickerState } from 'react-stately';
import { useOnClickOutside } from '@openmrs/esm-react-utils';
import { filterDOMProps, useResizeObserver } from '@react-aria/utils';
import { useRenderProps, useSlot } from './hooks';
import { removeDataAttributes } from './utils';

/**
 * This is a lightly-customized version of the DatePicker component from react-aria-components.
 * Primarily, it handles closing the calendar when clicking outside of the DatePicker.
 */
export const DatePicker = /*#__PURE__*/ forwardRef<HTMLDivElement, DatePickerProps<DateValue>>(
  function DatePicker(props, ref) {
    [props, ref] = useContextProps(props, ref, DatePickerContext);
    let { validationBehavior: formValidationBehavior } = useSlottedContext(FormContext) || {};
    let validationBehavior: (typeof props)['validationBehavior'] =
      props.validationBehavior ?? formValidationBehavior ?? 'native';
    let state = useDatePickerState({
      ...props,
      validationBehavior,
    });

    let groupRef = useRef<HTMLDivElement>(null);
    let [labelRef, label] = useSlot(!props['aria-label'] && !props['aria-labelledby']);
    let {
      groupProps,
      labelProps,
      fieldProps,
      buttonProps,
      dialogProps,
      calendarProps,
      descriptionProps,
      errorMessageProps,
      ...validation
    } = useDatePicker(
      {
        ...removeDataAttributes(props),
        label,
        validationBehavior,
      },
      state,
      groupRef,
    );

    // Allows calendar width to match input group
    let [groupWidth, setGroupWidth] = useState<string | null>(null);
    let onResize = useCallback(() => {
      if (groupRef.current) {
        setGroupWidth(groupRef.current.offsetWidth + 'px');
      }
    }, []);

    useResizeObserver({
      ref: groupRef,
      onResize: onResize,
    });

    const boundaryRef = useOnClickOutside<HTMLDivElement>(() => state.setOpen(false));
    useImperativeHandle(ref, () => boundaryRef.current!);

    let { focusProps, isFocused, isFocusVisible } = useFocusRing({ within: true });
    let renderProps = useRenderProps({
      ...props,
      values: {
        state,
        isFocusWithin: isFocused,
        isFocusVisible,
        isDisabled: props.isDisabled || false,
        isInvalid: state.isInvalid,
        isOpen: state.isOpen,
      },
      defaultClassName: 'react-aria-DatePicker',
    });

    let DOMProps = filterDOMProps(props);
    delete DOMProps.id;

    return (
      <Provider
        values={[
          [DatePickerStateContext, state],
          [GroupContext, { ...groupProps, ref: groupRef, isInvalid: state.isInvalid }],
          [DateFieldContext, fieldProps],
          [ButtonContext, { ...buttonProps, isPressed: state.isOpen }],
          [LabelContext, { ...labelProps, ref: labelRef, elementType: 'span' }],
          [CalendarContext, calendarProps],
          [OverlayTriggerStateContext, state],
          [
            PopoverContext,
            {
              trigger: 'DatePicker',
              triggerRef: groupRef,
              placement: 'bottom start',
              style: { '--trigger-width': groupWidth } as React.CSSProperties,
            },
          ],
          [DialogContext, dialogProps],
          [
            TextContext,
            {
              slots: {
                description: descriptionProps,
                errorMessage: errorMessageProps,
              },
            },
          ],
          [FieldErrorContext, validation],
        ]}
      >
        <div
          {...focusProps}
          {...DOMProps}
          {...renderProps}
          ref={boundaryRef}
          slot={props.slot || undefined}
          data-focus-within={isFocused || undefined}
          data-invalid={state.isInvalid || undefined}
          data-focus-visible={isFocusVisible || undefined}
          data-disabled={props.isDisabled || undefined}
          data-open={state.isOpen || undefined}
        />
      </Provider>
    );
  },
);
