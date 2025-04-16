import { type OpenmrsResource } from '@openmrs/esm-api';
import { type Diagnosis } from './diagnosis-resource';
import { type Location } from './location-resource';
import { type Obs } from './obs-resource';
import { type Patient } from './patient-resource';
import { type Visit } from './visit-resource';

// TODO: make this extends OpenmrsResourceStrict
export interface Encounter extends OpenmrsResource {
  encounterDatetime?: string;
  patient?: Patient;
  location?: Location;
  encounterType?: EncounterType;
  obs?: Array<Obs>;
  visit?: Visit;
  encounterProviders?: Array<EncounterProvider>;
  diagnoses?: Array<Diagnosis>;
  form?: OpenmrsResource;
}

export interface EncounterType extends OpenmrsResource {
  name?: string;
  description?: string;
  retired?: boolean;
}

export interface EncounterProvider extends OpenmrsResource {
  provider?: OpenmrsResource;
  encounterRole?: EncounterRole;
}

export interface EncounterRole extends OpenmrsResource {
  name?: string;
  description?: string;
  retired?: boolean;
}
