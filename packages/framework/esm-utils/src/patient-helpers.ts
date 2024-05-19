/**
 * Gets the display name for a patient.
 * @param fhirPatient The patient details in FHIR format.
 * @returns The patient's display name.
 */
export function displayName(fhirPatient): string {
  return fhirPatient.name?.[0]?.text ?? fallbackDisplayName(fhirPatient);
}

function fallbackDisplayName(fhirPatient): string {
  return `${fhirPatient.name?.[0].given?.join(' ')} ${fhirPatient?.name?.[0].family}`;
}
