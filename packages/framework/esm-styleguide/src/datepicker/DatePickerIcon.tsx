import React, { forwardRef, useContext } from 'react';
import { DatePickerStateContext } from 'react-aria-components';
import { CalendarIcon, WarningIcon } from '../icons';

/**
 * Component to render the Calendar icon for the DatePicker component with the same styling as
 * the Carbon DatePicker component.
 */
export const DatePickerIcon = /*#__PURE__*/ forwardRef<SVGSVGElement>(function DatePickerIcon(props, ref) {
  const state = useContext(DatePickerStateContext)!;

  return state.isInvalid ? (
    <WarningIcon ref={ref} size={16} {...props} />
  ) : (
    <CalendarIcon ref={ref} size={16} {...props} />
  );
});
