/** @module @category API */
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-api';
import { type VisitType } from './types';

export function toVisitTypeObject(openmrsRestForm: any): VisitType {
  return {
    uuid: openmrsRestForm.uuid,
    display: openmrsRestForm.display,
    name: openmrsRestForm.name,
  };
}

/** The endpoint {@link getVisitTypes} reads from. Use it as the SWR key when caching visit types. */
export const visitTypesUrl = `${restBaseUrl}/visittype`;

/**
 * Fetches all available visit types from the OpenMRS REST API.
 *
 * @param url The endpoint to read from, defaulting to {@link visitTypesUrl}. This exists so that the
 *   function can be passed straight to SWR as a fetcher, which calls it with the cache key.
 * @returns A Promise that resolves with an array of VisitType objects.
 *
 * @example
 * ```ts
 * import { getVisitTypes } from '@openmrs/esm-framework';
 * const visitTypes = await getVisitTypes();
 * console.log('Available visit types:', visitTypes);
 * ```
 */
export function getVisitTypes(url: string = visitTypesUrl): Promise<Array<VisitType>> {
  return openmrsFetch<{ results: Array<any> }>(url).then((response) => response.data.results.map(toVisitTypeObject));
}
