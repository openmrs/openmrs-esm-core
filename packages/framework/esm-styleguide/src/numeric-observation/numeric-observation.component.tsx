/** @module @category UI */
import React, { useMemo, useId } from 'react';
import classNames from 'classnames';
import { getCoreTranslation } from '@openmrs/esm-translations';
import {
  calculateInterpretation,
  normalizeInterpretation,
  type ObservationInterpretation,
  type OBSERVATION_INTERPRETATION,
  type ObsReferenceRanges,
} from './interpretation-utils';
import { useConceptReferenceRange } from './use-concept-reference-range';
import styles from './numeric-observation.module.scss';

export interface NumericObservationProps {
  /** The observation value to display */
  value: string | number;
  /** Unit of measurement */
  unit?: string;
  /** Label for the observation (only shown for card variant)*/
  label?: string;
  /** Pre-calculated interpretation (either ObservationInterpretation or OBSERVATION_INTERPRETATION format) */
  interpretation?: ObservationInterpretation | OBSERVATION_INTERPRETATION;
  /** Reference range for calculating interpretation */
  referenceRange?: ObsReferenceRanges;
  /** Concept UUID to fetch reference range from */
  conceptUuid?: string;
  /**
   * Display style variant
   * - 'card': Card-style container with colored borders and backgrounds, typically used in header/summary views (e.g., vitals header)
   * - 'cell': Table cell styling with background colors, typically used in data tables (e.g., test results table). If using the cell variant inside a Carbon Table Cell, make sure to set the padding to 0.
   */
  variant?: 'card' | 'cell';
  patientUuid: string;
}

/**
 * Generic numeric observation component for displaying numeric observation values with interpretation-based styling.
 * Supports both vitals and test results display patterns.
 */
export const NumericObservation: React.FC<NumericObservationProps> = ({
  value,
  unit,
  label,
  interpretation: providedInterpretation,
  referenceRange: providedReferenceRange,
  conceptUuid,
  variant = 'card',
  patientUuid,
}) => {
  const generatedId = useId();

  const { referenceRange: fetchedReferenceRange, isLoading: isLoadingConcept } = useConceptReferenceRange(
    providedReferenceRange ? undefined : conceptUuid,
    patientUuid,
  );

  const referenceRange = providedReferenceRange ?? fetchedReferenceRange;

  const calculatedInterpretation = useMemo(() => {
    if (providedInterpretation) {
      return normalizeInterpretation(providedInterpretation);
    }

    if (referenceRange && !isLoadingConcept) {
      return calculateInterpretation(value, referenceRange);
    }

    return 'normal';
  }, [providedInterpretation, referenceRange, value, isLoadingConcept]);

  const interpretation = calculatedInterpretation ?? 'normal';

  const flaggedCritical =
    interpretation === 'critically_low' ||
    interpretation === 'critically_high' ||
    interpretation === 'off_scale_low' ||
    interpretation === 'off_scale_high';
  const flaggedAbnormal = interpretation !== 'normal';

  const labelId = label
    ? `omrs-numeric-obs-label-${label.replaceAll(/\s+/g, '-').toLowerCase()}-${generatedId}`
    : undefined;
  const valueId = `omrs-numeric-obs-value-${generatedId}`;
  const unitId = `omrs-numeric-obs-unit-${generatedId}`;

  const displayValue = value || getCoreTranslation('notAvailable', 'Not available');

  const interpretationClasses = classNames({
    [styles['critically-low']]: interpretation === 'critically_low' || interpretation === 'off_scale_low',
    [styles['critically-high']]: interpretation === 'critically_high' || interpretation === 'off_scale_high',
    [styles.low]: interpretation === 'low',
    [styles.high]: interpretation === 'high',
    [styles['off-scale-low']]: interpretation === 'off_scale_low',
    [styles['off-scale-high']]: interpretation === 'off_scale_high',
  });

  const cardContainerClasses = classNames({
    [styles.container]: true,
    [styles.card]: true,
    [styles['critical-value']]: flaggedCritical,
    [styles['abnormal-value']]: flaggedAbnormal && !flaggedCritical,
  });

  const cellClasses = classNames({
    [styles.cell]: true,
    [interpretationClasses]: true,
  });

  if (variant === 'cell') {
    return (
      <div className={cellClasses}>
        {displayValue} {unit ? ` ${unit}` : ''}
      </div>
    );
  }

  return (
    <section className={cardContainerClasses} data-testid="numeric-observation-card">
      {label && (
        <div className={styles['label-container']}>
          <span id={labelId} className={styles.label}>
            {label}
          </span>
          {flaggedAbnormal && (
            <span
              className={styles[interpretation.replace('_', '-')]}
              title={getCoreTranslation('abnormalValue', 'Abnormal value')}
            />
          )}
        </div>
      )}
      <div className={styles['value-container']}>
        <span
          id={valueId}
          aria-labelledby={labelId && unitId ? `${labelId} ${unitId}` : labelId || unitId || undefined}
          className={styles.value}
        >
          {displayValue}
        </span>
        {value && unit && (
          <span id={unitId} className={styles.units}>
            {unit}
          </span>
        )}
      </div>
    </section>
  );
};
