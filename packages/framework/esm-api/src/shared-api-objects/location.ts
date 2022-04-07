/** @module @category API */
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { openmrsObservableFetch } from "../openmrs-fetch";
import { Location } from "../types";

export function toLocationObject(openmrsRestForm: any): Location {
  return {
    uuid: openmrsRestForm.uuid,
    display: openmrsRestForm.display,
  };
}

export function getLocations(): Observable<Array<Location>> {
  return openmrsObservableFetch<any>(`/ws/rest/v1/location`)
    .pipe(
      map((results) => {
        const locations: Array<Location> =
          results.data.results.map(toLocationObject);
        return locations;
      })
    )
    .pipe(take(1));
}
