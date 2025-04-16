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
