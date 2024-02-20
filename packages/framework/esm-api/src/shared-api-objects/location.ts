/** @module @category API */
import type { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { openmrsObservableFetch, restBaseUrl } from '../openmrs-fetch';
import type { Location } from '../types';

export function toLocationObject(openmrsRestForm: any): Location {
  return {
    uuid: openmrsRestForm.uuid,
    display: openmrsRestForm.display,
  };
}

export function getLocations(tagUuidOrName: string | null = null): Observable<Array<Location>> {
  const url = `${restBaseUrl}/location` + (tagUuidOrName ? '?tag=' + tagUuidOrName : '');
  return openmrsObservableFetch<any>(url)
    .pipe(
      map((results) => {
        const locations: Array<Location> = results.data.results.map(toLocationObject);
        return locations;
      }),
    )
    .pipe(take(1));
}
