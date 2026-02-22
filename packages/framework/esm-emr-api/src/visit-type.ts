/** @module @category API */
import { openmrsObservableFetch, restBaseUrl } from '@openmrs/esm-api';
import type { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators/index.js';
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
 * @returns An Observable that emits an array of VisitType objects and then completes.
 *   The Observable will emit exactly one value containing all visit types.
 *
 * @example
 * ```ts
 * import { getVisitTypes } from '@openmrs/esm-framework';
 * getVisitTypes().subscribe((visitTypes) => {
 *   console.log('Available visit types:', visitTypes);
 * });
 * ```
 */
export function getVisitTypes(): Observable<Array<VisitType>> {
  return openmrsObservableFetch<any>(`${restBaseUrl}/visittype`)
    .pipe(
      map((results) => {
        const visitTypes: Array<VisitType> = results.data.results.map(toVisitTypeObject);
        return visitTypes;
      }),
    )
    .pipe(take(1));
}
