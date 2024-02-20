import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';

export function fetchPersonAttributeTypeByUuid(personAttributeTypeUuid: string) {
  return openmrsFetch(`${restBaseUrl}/personattributetype/${personAttributeTypeUuid}`, {
    method: 'GET',
  });
}

export function performPersonAttributeTypeSearch(query: string) {
  return openmrsFetch(`${restBaseUrl}/personattributetype/?q=${query}`, {
    method: 'GET',
  });
}
