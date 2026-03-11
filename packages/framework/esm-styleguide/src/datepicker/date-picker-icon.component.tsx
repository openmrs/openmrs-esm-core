import React, { forwardRef, useContext } from 'react';
import { DatePickerStateContext, DateRangePickerStateContext } from 'react-aria-components';
import { CalendarIcon, WarningIcon } from '../icons';

/**
 * Renders a calendar or warning icon depending on the validation state
 * of the enclosing picker. Works in both DatePicker and DateRangePicker
 * contexts by trying both React Aria state contexts — the same approach
 * used by MonthYear for CalendarStateContext vs RangeCalendarStateContext.
 */
export const DatePickerIcon = /*#__PURE__*/ forwardRef<SVGSVGElement>(function PickerIcon(props, ref) {
  const datePickerState = useContext(DatePickerStateContext);
  const rangePickerState = useContext(DateRangePickerStateContext);
  const state = (datePickerState ?? rangePickerState)!;

  return state.isInvalid ? (
    <WarningIcon ref={ref} size={16} {...props} />
  ) : (
    <CalendarIcon ref={ref} size={16} {...props} />
  );
});
