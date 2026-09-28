/** @module @category API */
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-api';
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
): Promise<Array<Location>> {
  const params = new URLSearchParams();
  if (tagUuidOrName) {
    params.set('tag', tagUuidOrName);
  }
  if (query) {
    params.set('q', query);
  }
  const queryString = params.toString();
  const url = `${restBaseUrl}/location${queryString ? '?' + queryString : ''}`;

  return openmrsFetch<{ results: Array<Location> }>(url).then((response) =>
    response.data.results.map(toLocationObject),
  );
}
