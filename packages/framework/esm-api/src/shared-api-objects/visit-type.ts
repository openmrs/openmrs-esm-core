/** @module @category API */
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { openmrsObservableFetch } from "../openmrs-fetch";
import { VisitType } from "../types";

export function toVisitTypeObject(openmrsRestForm: any): VisitType {
  return {
    uuid: openmrsRestForm.uuid,
    display: openmrsRestForm.display,
    name: openmrsRestForm.name,
  };
}

export function getVisitTypes(): Observable<Array<VisitType>> {
  return openmrsObservableFetch<any>(`/ws/rest/v1/visittype`)
    .pipe(
      map((results) => {
        const visitTypes: Array<VisitType> =
          results.data.results.map(toVisitTypeObject);
        return visitTypes;
      })
    )
    .pipe(take(1));
}
