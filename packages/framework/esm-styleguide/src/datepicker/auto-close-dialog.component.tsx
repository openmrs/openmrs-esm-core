import React, { useContext } from 'react';
import { DatePickerStateContext, DateRangePickerStateContext, Dialog } from 'react-aria-components';
import { useOnClickOutside } from '@openmrs/esm-framework';
import styles from './datepicker.module.scss';

interface AutoCloseDialogProps {
  children: React.ReactNode;
  isRangePicker?: boolean;
}

export function AutoCloseDialog({ children, isRangePicker = false }: AutoCloseDialogProps) {
  const datePickerState = useContext(DatePickerStateContext);
  const rangePickerState = useContext(DateRangePickerStateContext);

  const state = isRangePicker ? rangePickerState : datePickerState;

  const boundaryRef = useOnClickOutside<HTMLDivElement>(() => state?.close());

  return (
    <Dialog className={styles.dialog} ref={boundaryRef}>
      {children}
    </Dialog>
  );
}
