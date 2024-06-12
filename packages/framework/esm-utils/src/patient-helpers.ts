/** @module @category Utility */

import { type NameUse } from '@openmrs/esm-globals';

/**
 * Gets the formatted display name for a patient.
 *
 * The display name will be taken from the patient's 'usual' name,
 * or may fall back to the patient's 'official' name.
 *
 * @param patient The patient details in FHIR format.
 * @returns The patient's display name or an empty string if name is not present.
 */
export function getPatientName(patient: fhir.Patient): string {
  const name = selectPreferredName(patient, 'usual', 'official');
  return formatPatientName(name);
}

/** @deprecated Use `getPatientName` */
export function displayName(patient: fhir.Patient): string {
  return getPatientName(patient);
}

/**
 * Get a formatted display string for an FHIR name.
 * @param name The name to be formatted.
 * @returns The formatted display name or an empty string if name is undefined.
 */
export function formatPatientName(name: fhir.HumanName | undefined): string {
  if (name) return name.text ?? defaultFormat(name);
  return '';
}

/** @deprecated Use `formatPatientName` */
export function formattedName(name: fhir.HumanName | undefined): string {
  return formatPatientName(name);
}

/**
 * Select the preferred name from the collection of names associated with a patient.
 *
 * Names may be specified with a usage such as 'usual', 'official', 'nickname', 'maiden', etc.
 * A name with no usage specified is treated as the 'usual' name.
 *
 * The chosen name will be selected according to the priority order of `preferredNames`,
 * @example
 * // normal use case; prefer usual name, fallback to official name
 * displayNameByUsage(patient, 'usual', 'official')
 * @example
 * // prefer usual name over nickname, fallback to official name
 * displayNameByUsage(patient, 'usual', 'nickname', 'official')
 *
 * @param patient The patient from whom a name will be selected.
 * @param preferredNames Optional ordered sequence of preferred name usages; defaults to 'usual' if not specified.
 * @return the preferred name for the patient, or undefined if no acceptable name could be found.
 */
export function selectPreferredName(patient: fhir.Patient, ...preferredNames: NameUse[]): fhir.HumanName | undefined {
  if (preferredNames.length == 0) {
    preferredNames = ['usual'];
  }
  for (const usage of preferredNames) {
    const name = patient.name?.find((name) => nameUsageMatches(name, usage));
    if (name) {
      return name;
    }
  }
  return undefined;
}

/**
 * Generate a display name by concatenating forenames and surname.
 * @param name the person's name.
 * @returns the person's name as a string.
 */
function defaultFormat(name: fhir.HumanName): string {
  const forenames: string[] = name.given ?? [];
  const names: string[] = name.family ? forenames.concat(name.family) : forenames;
  return names.join(' ');
}

/**
 * Determine whether the usage of a given name matches the given NameUse.
 *
 * A name with no usage is treated as the 'usual' name.
 *
 * @param name the name to test.
 * @param usage the NameUse to test for.
 */
function nameUsageMatches(name: fhir.HumanName, usage: NameUse): boolean {
  if (!name.use)
    // a name with no usage is treated as 'usual'
    return usage === 'usual';

  return name.use === usage;
}
