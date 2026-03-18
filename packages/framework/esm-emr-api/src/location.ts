/** @module @category API */
import { openmrsObservableFetch, restBaseUrl } from '@openmrs/esm-api';
import type { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators/index.js';
import type { Location } from './types';

export function toLocationObject(openmrsRestForm: any): Location {
  return {
    uuid: openmrsRestForm.uuid,
    display: openmrsRestForm.display,
  };
}

export function getLocations(
  tagUuidOrName: string | null = null,
  query: string | null = null,
): Observable<Array<Location>> {
  const params = new URLSearchParams();
  if (tagUuidOrName) {
    params.set('tag', tagUuidOrName);
  }
  if (query) {
    params.set('q', query);
  }
  const queryString = params.toString();
  const url = `${restBaseUrl}/location${queryString ? '?' + queryString : ''}`;

  return openmrsObservableFetch<{ results: Array<Location> }>(url)
    .pipe(
      map((results) => {
        const locations: Array<Location> = results.data.results.map(toLocationObject);
        return locations;
      }),
    )
    .pipe(take(1));
}
