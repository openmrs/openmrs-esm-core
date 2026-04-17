/**
 * Defines the minimum required versions of OpenMRS backend modules that the
 * frontend framework depends on. These versions are checked at startup to ensure
 * compatibility between the frontend and backend.
 */
export const backendDependencies = {
  'webservices.rest': '2.24.0',
  fhir2: '1.0.0-SNAPSHOT',
};
