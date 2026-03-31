import React from 'react';
import { StructuredListCell, StructuredListRow, InlineLoading } from '@carbon/react';
import { useOpenmrsSWR } from '@openmrs/esm-framework';
import styles from './display-value.scss';

export interface DisplayValueProps {
  value: any;
}

/**
 * Utility function to safely extract a valid UUID (Standard or Legacy CIEL)
 * from highly inconsistent, stringified configuration values.
 * * OpenMRS configuration values sometimes arrive as:
 * 1. Clean UUIDs: '8d49f56e-c2cc...'
 * 2. Stringified with quotes: '"f4620bfa..."'
 * 3. Escaped stringified: '\"5085AAAA...\"'
 * 4. Inside stringified arrays: '[\"161643AAAA...\"]'
 * * Instead of stripping arbitrary characters, this uses extraction via matching.
 * The word boundaries (\b) ensure we don't accidentally slice 36 characters
 * out of a completely unrelated, continuous long configuration string.
 *
 * @param val The raw configuration value to inspect.
 * @returns The clean 36-character UUID if found, otherwise null.
 */
const cleanAndCheckUuid = (val: any): string | null => {
  if (typeof val !== 'string') return null;
  const match = val.match(/\b([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[a-z0-9]{36})\b/i);
  return match ? match[0] : null;
};

/**
 * Component responsible for fetching and displaying the human-readable
 * Concept Name based on a provided Concept UUID.
 * * @param uuid The clean Concept UUID extracted from the configuration.
 */
function ConceptNameDisplay({ uuid }: { uuid: string }) {
  const { data, error, isLoading: swrIsLoading } = useOpenmrsSWR(`/ws/rest/v1/concept/${uuid}?v=custom:(display)`);

  /** * Fallback logic for older versions of the SWR library (v1.x) used in the framework,
   * which do not natively export an 'isLoading' boolean.
   */
  const isLoading = swrIsLoading ?? (!data && !error);

  if (isLoading) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        {uuid} <InlineLoading status="active" iconDescription="Fetching concept name..." />
      </span>
    );
  }

  // If the API request fails, or the UUID is not a concept (e.g., it's a Location UUID),
  // fallback to displaying the raw UUID safely.
  if (error || !data?.data?.display) {
    return <>{uuid}</>;
  }

  return (
    <span>
      <strong>{data.data.display}</strong> <span style={{ color: 'gray', fontSize: '0.85em' }}>({uuid})</span>
    </span>
  );
}

export function DisplayValue({ value }: DisplayValueProps) {
  // Check if the current value contains a valid UUID that needs resolving
  const extractedUuid = cleanAndCheckUuid(value);

  return (
    <div>
      {Array.isArray(value) ? (
        typeof value[0] === 'object' ? (
          value.map((v, i) => (
            <StructuredListRow key={`${v}-${i}`}>
              <StructuredListCell className={styles.smallListCell}>{i + 1}</StructuredListCell>
              <StructuredListCell className={styles.smallListCell}>
                <DisplayValue value={v} />
              </StructuredListCell>
            </StructuredListRow>
          ))
        ) : (
          `[ ${value.join(', ')} ]`
        )
      ) : typeof value === 'object' && value !== null ? (
        Object.entries(value).map(([k, v], i) => (
          <StructuredListRow key={`${k}-${i}`}>
            <StructuredListCell className={styles.smallListCell}>{k}</StructuredListCell>
            <StructuredListCell className={styles.smallListCell}>
              <DisplayValue value={v} />
            </StructuredListCell>
          </StructuredListRow>
        ))
      ) : typeof value === 'string' || typeof value === 'number' ? (
        extractedUuid ? (
          <ConceptNameDisplay uuid={extractedUuid} />
        ) : (
          value
        )
      ) : value == null ? (
        'none'
      ) : (
        JSON.stringify(value)
      )}
    </div>
  );
}
