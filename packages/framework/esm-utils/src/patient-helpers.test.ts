import { displayName, formattedName, selectPreferredName } from './patient-helpers';
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
import { type NameUse } from '../../esm-api';

describe('Formatted display name', () => {
  it.each([
    [nameWithFormat, 'Wilson, John'],
    [nameWithoutFormat, 'given middle family name'],
    [familyNameOnly, 'family name'],
    [givenNameOnly, 'given'],
    [mockPatientWithNoName, ''],
  ])('Is formatted name text if present else default name format', (name, expected) => {
    const result = formattedName(name);
    expect(result).toBe(expected);
  });
});

describe('Patient display name', () => {
  it.each([
    [mockPatientWithMultipleNames, 'Smith, John Murray'],
    [mockPatientWithOfficialName, 'my actual name'],
    [mockPatientWithNickAndOfficialName, 'my official name'],
  ])('Is selected from usual name or official name', (patient, expected) => {
    const result = displayName(patient);
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
    [mockPatientWithMultipleNames, [], 'efdb246f-4142-4c12-a27a-9be60b2261bb'],
    [mockPatientWithMultipleNames, [usual], 'efdb246f-4142-4c12-a27a-9be60b2261bb'],
    [mockPatientWithMultipleNames, [usual, official], 'efdb246f-4142-4c12-a27a-9be60b2261bb'],
    [mockPatientWithMultipleNames, [official, usual], 'efdb246f-4142-4c12-a27a-9be60b2261aa'],
    [mockPatientWithMultipleNames, [official, usual], 'efdb246f-4142-4c12-a27a-9be60b2261aa'],
    [mockPatientWithMultipleNames, [maiden, usual, official], 'efdb246f-4142-4c12-a27a-9be60b2261cc'],
    [mockPatientWithOfficialName, [usual, official], 'efdb246f-4142-4c12-a27a-9be60b226111'],
    [mockPatientWithNickAndOfficialName, [nickname, official], 'efdb246f-4142-4c12-a27a-9be60b226111'],
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
