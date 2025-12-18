import { describe, expect, it } from 'vitest';
import { type NameUse } from '@openmrs/esm-globals';
import { formatPatientName, getPatientName, selectPreferredName } from './patient-helpers';
import {
  mockPatientWithNoName,
  mockPatientWithOfficialName,
  nameWithFormat,
  nameWithoutFormat,
  familyNameOnly,
  givenNameOnly,
  mockPatientWithMultipleNames,
  mockPatientWithNickAndOfficialName,
} from './patient-helpers.test.data';

describe('Formatted display name', () => {
  it.each([
    [nameWithFormat, 'Wilson, John'],
    [nameWithoutFormat, 'given middle family name'],
    [familyNameOnly, 'family name'],
    [givenNameOnly, 'given'],
    [mockPatientWithNoName, ''],
  ])('Is formatted name text if present else default name format', (name, expected) => {
    const result = formatPatientName(name);
    expect(result).toBe(expected);
  });
});

describe('Patient display name', () => {
  it.each([
    [mockPatientWithMultipleNames, 'Smith, John Murray'],
    [mockPatientWithOfficialName, 'my actual name'],
    [mockPatientWithNickAndOfficialName, 'my official name'],
  ])('Is selected from usual name or official name', (patient, expected) => {
    const result = getPatientName(patient);
    expect(result).toBe(expected);
  });
});

const usual: NameUse = 'usual';
const official: NameUse = 'official';
const maiden: NameUse = 'maiden';
const nickname: NameUse = 'nickname';
const temp: NameUse = 'temp';

describe('Preferred patient name', () => {
  it.each([
    [mockPatientWithMultipleNames, [], 'id-of-usual-name-1'],
    [mockPatientWithMultipleNames, [usual], 'id-of-usual-name-1'],
    [mockPatientWithMultipleNames, [usual, official], 'id-of-usual-name-1'],
    [mockPatientWithMultipleNames, [official], 'id-of-official-name-1'],
    [mockPatientWithMultipleNames, [official, usual], 'id-of-official-name-1'],
    [mockPatientWithMultipleNames, [maiden, usual, official], 'id-of-maiden-name-1'],
    [mockPatientWithOfficialName, [usual, official], 'id-of-usual-name-1'],
    [mockPatientWithNickAndOfficialName, [nickname, official], 'id-of-nickname-1'],
  ])('Is selected according to preferred usage', (patient, preferredUsage, expectedNameId) => {
    const result = selectPreferredName(patient, ...preferredUsage);
    expect(result?.id).toBe(expectedNameId);
  });
});

describe('Preferred patient name', () => {
  it.each([
    [mockPatientWithMultipleNames, [temp]],
    [mockPatientWithNoName, [usual]],
    [mockPatientWithNoName, []],
  ])('Is empty if preferred name is not present.', (patient, preferredUsage) => {
    const result = selectPreferredName(patient, ...preferredUsage);
    expect(result).toBeUndefined();
  });
});
