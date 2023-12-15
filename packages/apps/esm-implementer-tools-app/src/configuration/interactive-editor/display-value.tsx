import React from 'react';
import { StructuredListCell, StructuredListRow } from '@carbon/react';
import styles from './display-value.scss';

export interface DisplayValueProps {
  value: any;
}

export function DisplayValue({ value }: DisplayValueProps) {
  // TODO: Make this show the concept name for ConceptUUID type values
  return (
    <div>
      {Array.isArray(value)
        ? typeof value[0] === 'object'
          ? value.map((v, i) => (
              <StructuredListRow key={`${v}-${i}`}>
                <StructuredListCell className={styles.smallListCell}>{i + 1}</StructuredListCell>
                <StructuredListCell className={styles.smallListCell}>
                  <DisplayValue value={v} />
                </StructuredListCell>
              </StructuredListRow>
            ))
          : `[ ${value.join(', ')} ]`
        : typeof value === 'object' && value !== null
          ? Object.entries(value).map(([k, v], i) => (
              <StructuredListRow key={`${k}-${i}`}>
                <StructuredListCell className={styles.smallListCell}>{k}</StructuredListCell>
                <StructuredListCell className={styles.smallListCell}>
                  <DisplayValue value={v} />
                </StructuredListCell>
              </StructuredListRow>
            ))
          : typeof value === 'string' || typeof value === 'number'
            ? value
            : value == null
              ? 'none'
              : JSON.stringify(value)}
    </div>
  );
}
