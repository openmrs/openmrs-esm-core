import React from 'react';
import { StructuredListCell, StructuredListRow } from '@carbon/react';
import styles from './display-value.scss';

export interface DisplayValueProps {
  value: any;
  isTranslationOverride?: boolean;
}

export function DisplayValue({ value, isTranslationOverride = false }: DisplayValueProps) {
  // TODO: Make this show the concept name for ConceptUUID type values
  return (
    <div>
      {Array.isArray(value)
        ? typeof value[0] === 'object'
          ? value.map((v, i) => (
              <StructuredListRow key={`${v}-${i}`}>
                <StructuredListCell className={styles.smallListCell}>{i + 1}</StructuredListCell>
                <StructuredListCell className={styles.smallListCell}>
                  <DisplayValue value={v} isTranslationOverride={isTranslationOverride} />
                </StructuredListCell>
              </StructuredListRow>
            ))
          : `[ ${value.join(', ')} ]`
        : typeof value === 'object' && value !== null
          ? (() => {
              if (isTranslationOverride) {
                const filteredEntries = Object.entries(value).filter(
                  ([key]) => !key.startsWith('_') && key !== 'source' && key !== 'default',
                );

                if (filteredEntries.length === 0 && value.hasOwnProperty('_value')) {
                  return <DisplayValue value={value._value} isTranslationOverride={isTranslationOverride} />;
                }

                return filteredEntries.map(([k, v], i) => (
                  <StructuredListRow key={`${k}-${i}`}>
                    <StructuredListCell className={styles.smallListCell}>{k}</StructuredListCell>
                    <StructuredListCell className={styles.smallListCell}>
                      <DisplayValue value={v} isTranslationOverride={isTranslationOverride} />
                    </StructuredListCell>
                  </StructuredListRow>
                ));
              } else {
                return Object.entries(value).map(([k, v], i) => (
                  <StructuredListRow key={`${k}-${i}`}>
                    <StructuredListCell className={styles.smallListCell}>{k}</StructuredListCell>
                    <StructuredListCell className={styles.smallListCell}>
                      <DisplayValue value={v} />
                    </StructuredListCell>
                  </StructuredListRow>
                ));
              }
            })()
          : typeof value === 'string' || typeof value === 'number'
            ? value
            : value == null
              ? 'none'
              : JSON.stringify(value)}
    </div>
  );
}
