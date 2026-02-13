const backendObservationInterpretations = [
  'NORMAL',
  'HIGH',
  'CRITICALLY_HIGH',
  'OFF_SCALE_HIGH',
  'LOW',
  'CRITICALLY_LOW',
  'OFF_SCALE_LOW',
] as const;

const observationInterpretations = [
  'critically_low',
  'critically_high',
  'high',
  'low',
  'normal',
  'off_scale_low',
  'off_scale_high',
] as const;

export type OBSERVATION_INTERPRETATION = (typeof backendObservationInterpretations)[number];

export type ObservationInterpretation = (typeof observationInterpretations)[number];

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
  interpretation: ObservationInterpretation | OBSERVATION_INTERPRETATION | '--' | undefined,
): ObservationInterpretation | undefined {
  if (!interpretation) {
    return undefined;
  }

  if (interpretation === '--') {
    return 'normal';
  }

  if (backendObservationInterpretations.includes(interpretation as OBSERVATION_INTERPRETATION)) {
    return interpretation.toLowerCase() as ObservationInterpretation;
  }

  if (observationInterpretations.includes(interpretation as ObservationInterpretation)) {
    return interpretation as ObservationInterpretation;
  }

  return 'normal';
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
