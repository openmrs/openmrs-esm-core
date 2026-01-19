/**
 * Observation interpretation type from test results (uppercase with underscores)
 */
export type OBSERVATION_INTERPRETATION =
  | 'NORMAL'
  | 'HIGH'
  | 'CRITICALLY_HIGH'
  | 'OFF_SCALE_HIGH'
  | 'LOW'
  | 'CRITICALLY_LOW'
  | 'OFF_SCALE_LOW'
  | '--';

/**
 * Observation interpretation type from vitals app (lowercase with underscores)
 */
export type ObservationInterpretation =
  | 'critically_low'
  | 'critically_high'
  | 'high'
  | 'low'
  | 'normal'
  | 'off_scale_low'
  | 'off_scale_high';

/**
 * Reference range values for calculating interpretation
 */
export type ReferenceRangeValue = number | null | undefined;

export interface ObsReferenceRanges {
  hiAbsolute: ReferenceRangeValue;
  hiCritical: ReferenceRangeValue;
  hiNormal: ReferenceRangeValue;
  lowNormal: ReferenceRangeValue;
  lowCritical: ReferenceRangeValue;
  lowAbsolute: ReferenceRangeValue;
}

/**
 * Normalizes interpretation between lowercase (ObservationInterpretation) and uppercase (OBSERVATION_INTERPRETATION) formats
 */
export function normalizeInterpretation(
  interpretation: ObservationInterpretation | OBSERVATION_INTERPRETATION | undefined,
): ObservationInterpretation | undefined {
  if (!interpretation) {
    return undefined;
  }

  if (
    interpretation === 'critically_low' ||
    interpretation === 'critically_high' ||
    interpretation === 'high' ||
    interpretation === 'low' ||
    interpretation === 'normal' ||
    interpretation === 'off_scale_low' ||
    interpretation === 'off_scale_high'
  ) {
    return interpretation;
  }

  switch (interpretation) {
    case 'CRITICALLY_LOW':
      return 'critically_low';
    case 'OFF_SCALE_LOW':
      return 'off_scale_low';
    case 'CRITICALLY_HIGH':
      return 'critically_high';
    case 'OFF_SCALE_HIGH':
      return 'off_scale_high';
    case 'HIGH':
      return 'high';
    case 'LOW':
      return 'low';
    case 'NORMAL':
    case '--':
      return 'normal';
    default:
      return 'normal';
  }
}

/**
 * Calculates interpretation from a numeric value and reference range
 * Returns lowercase ObservationInterpretation format
 */
export function calculateInterpretation(
  value: string | number | undefined,
  range?: ObsReferenceRanges,
): ObservationInterpretation {
  if (!range || value === undefined || value === null || value === '') {
    return 'normal';
  }

  const numericValue = typeof value === 'string' ? Number.parseFloat(value) : value;

  if (Number.isNaN(numericValue)) {
    return 'normal';
  }

  if (range.hiAbsolute !== null && range.hiAbsolute !== undefined && numericValue > range.hiAbsolute) {
    return 'off_scale_high';
  }

  if (range.hiCritical !== null && range.hiCritical !== undefined && numericValue >= range.hiCritical) {
    return 'critically_high';
  }

  if (range.hiNormal !== null && range.hiNormal !== undefined && numericValue > range.hiNormal) {
    return 'high';
  }

  if (range.lowAbsolute !== null && range.lowAbsolute !== undefined && numericValue < range.lowAbsolute) {
    return 'off_scale_low';
  }

  if (range.lowCritical !== null && range.lowCritical !== undefined && numericValue <= range.lowCritical) {
    return 'critically_low';
  }

  if (range.lowNormal !== null && range.lowNormal !== undefined && numericValue < range.lowNormal) {
    return 'low';
  }

  return 'normal';
}
