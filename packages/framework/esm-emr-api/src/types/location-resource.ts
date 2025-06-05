import { type OpenmrsResource } from '@openmrs/esm-api';

export interface Location extends OpenmrsResource {
  name?: string;
  description?: string;
  cityVillage?: string;
  stateProvince?: string;
  country?: string;
  postalCode?: string;
  countyDistrict?: string;
  latitude?: string;
  longitude?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  address4?: string;
  address5?: string;
  address6?: string;
  address7?: string;
  address8?: string;
  address9?: string;
  address10?: string;
  address11?: string;
  address12?: string;
  address13?: string;
  address14?: string;
  address15?: string;
  tags?: Array<OpenmrsResource>;
  attributes?: Array<OpenmrsResource>;
  parentLocation?: Location;
  childLocation?: Location;
  retired?: boolean;
}

export interface FHIRLocationResource {
  resource: {
    id: string;
    name: string;
    resourceType: string;
    status: 'active' | 'inactive';
    meta?: {
      tag?: Array<{
        code: string;
        display: string;
        system: string;
      }>;
    };
  };
}
