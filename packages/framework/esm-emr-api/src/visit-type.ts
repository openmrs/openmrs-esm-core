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

/**
 * Fetches all available visit types from the OpenMRS REST API.
 *
 * @returns A Promise that resolves with an array of VisitType objects.
 *
 * @example
 * ```ts
 * import { getVisitTypes } from '@openmrs/esm-framework';
 * const visitTypes = await getVisitTypes();
 * console.log('Available visit types:', visitTypes);
 * ```
 */
export function getVisitTypes(): Promise<Array<VisitType>> {
  return openmrsFetch<{ results: Array<any> }>(`${restBaseUrl}/visittype`).then((response) =>
    response.data.results.map(toVisitTypeObject),
  );
}
