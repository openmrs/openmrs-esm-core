import { type Concept } from './concept-resource';
import { type OpenmrsResourceStrict, type OpenmrsResource } from './openmrs-resource';

export interface PersonAttribute extends OpenmrsResourceStrict {
  attributeType?: OpenmrsResource;
  value?: string;
  voided?: boolean;
}

export interface Person extends OpenmrsResourceStrict {
  gender?: string;
  age?: number;
  birthdate?: string;
  birthdateEstimated?: boolean;
  dead?: boolean;
  deathDate?: string | null;
  causeOfDeath?: Concept | null;
  preferredName?: PersonName;
  preferredAddress?: PersonAddress;
  names?: Array<PersonName>;
  addresses?: Array<PersonAddress>;
  attributes?: Array<PersonAttribute>;
  voided?: boolean;
  birthtime?: string | null;
  deathdateEstimated?: boolean;
  causeOfDeathNonCoded?: string | null;
}

export interface PersonName extends OpenmrsResourceStrict {
  givenName?: string;
  middleName?: string;
  familyName?: string;
  familyName2?: string;
  preferred?: boolean;
  prefix?: string;
  familyNamePrefix?: string;
  familyNameSuffix?: string;
  degree?: string;
  voided?: boolean;
}

export interface PersonAddress extends OpenmrsResourceStrict {
  preferred?: boolean;
  cityVillage?: string;
  stateProvince?: string;
  country?: string;
  postalCode?: string;
  countyDistrict?: string;
  startDate?: string;
  endDate?: string;
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
  voided?: boolean;
}
