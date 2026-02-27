import React, { useContext } from 'react';
import { DatePickerStateContext, DateRangePickerStateContext, Dialog } from 'react-aria-components';
import { useOnClickOutside } from '@openmrs/esm-react-utils';
import styles from './datepicker.module.scss';

interface AutoCloseDialogProps {
  children: React.ReactNode;
}

export function AutoCloseDialog({ children }: Readonly<AutoCloseDialogProps>) {
  const datePickerState = useContext(DatePickerStateContext);
  const rangePickerState = useContext(DateRangePickerStateContext);

  const state = (datePickerState ?? rangePickerState)!;

  const boundaryRef = useOnClickOutside<HTMLDivElement>(() => state?.close());

  return (
    <Dialog className={styles.dialog} ref={boundaryRef}>
      {children}
    </Dialog>
  );
}
