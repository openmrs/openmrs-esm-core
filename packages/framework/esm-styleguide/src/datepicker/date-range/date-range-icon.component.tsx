import React, { useContext, forwardRef } from 'react';
import { DateRangePickerStateContext } from 'react-aria-components';
import { CalendarIcon, WarningIcon } from '../../icons';

export const DateRangePickerIcon = /*#__PURE__*/ forwardRef<SVGSVGElement>(function DateRangePickerIcon(props, ref) {
  const state = useContext(DateRangePickerStateContext)!;

  return state.isInvalid ? (
    <WarningIcon ref={ref} size={16} {...props} />
  ) : (
    <CalendarIcon ref={ref} size={16} {...props} />
  );
});
