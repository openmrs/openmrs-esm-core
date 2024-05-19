import { displayName } from './patient-helpers';
import { mockPatient, mockPatientWithoutFormattedName } from './patient-helpers.test.data';

describe('Patient display name', () => {
  it.each([
    [mockPatient, 'Wilson, John'],
    [mockPatientWithoutFormattedName, 'given middle family name'],
  ])('Is formatted display name if present else default display name', (patient, expected) => {
    const result = displayName(patient);
    expect(result).toBe(expected);
  });
});
