import { type OpenmrsResource } from './openmrs-resource';
import { type Person } from './person-resource';

export interface PatientIdentifierType extends OpenmrsResource {}

export interface Patient {
  uuid: string;
  display: string;
  identifiers: PatientIdentifier[];
  person: Person;
}

export interface PatientIdentifier {
  uuid: string;
  display: string;
  identifier: string;
  identifierType: PatientIdentifierType;
  location: Location;
  preferred: boolean;
}
