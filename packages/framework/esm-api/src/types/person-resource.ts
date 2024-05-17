import { type Concept } from './concept-resource';
import { type OpenmrsResource } from './openmrs-resource';

export interface PersonAttribute {
  attributeType: OpenmrsResource;
  display: string;
  uuid: string;
  value: string | number;
}

export interface Person {
  uuid: string;
  display: string;
  gender: string;
  age: number;
  birthdate: string;
  birthdateEstimated: boolean;
  dead: boolean;
  deathDate: string;
  causeOfDeath: Concept;
  preferredName: PersonName;
  preferredAddress: PersonAddress;
  names: Array<PersonName>;
  addresses: Array<PersonAddress>;
  attributes: Array<PersonAttribute>;
  birthtime: string;
  deathdateEstimated: boolean;
  causeOfDeathNonCoded: string;
  links: Array<any>;
}

export interface PersonName {
  uuid: string;
  display: string;
  givenName: string;
  middleName: string;
  familyName: string;
  familyName2: string;
}

export interface PersonAddress {
  uuid: string;
  display: string;
  preferred: true;
  cityVillage: string;
  stateProvince: string;
  country: string;
  postalCode: string;
  countyDistrict: string;
  startDate: string;
  endDate: string;
  latitude: string;
  longitude: string;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  address5: string;
  address6: string;
  address7: string;
  address8: string;
  address9: string;
  address10: string;
  address11: string;
  address12: string;
  address13: string;
  address14: string;
  address15: string;
}
