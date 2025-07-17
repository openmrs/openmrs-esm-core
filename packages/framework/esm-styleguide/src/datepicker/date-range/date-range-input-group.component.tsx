import React, { useContext } from 'react';
import { DateRangePickerStateContext, Group } from 'react-aria-components';
import { useOnClickOutside } from '@openmrs/esm-react-utils';
import styles from './date-range-picker.module.scss';

interface DateRangeInputGroupProps {
  children: React.ReactNode;
}

export function DateRangeInputGroup({ children }: DateRangeInputGroupProps) {
  const state = useContext(DateRangePickerStateContext);
  const boundaryRef = useOnClickOutside<HTMLDivElement>(() => state?.close());
  return (
    <Group className={styles.inputGroup} ref={boundaryRef}>
      {children}
    </Group>
  );
}
