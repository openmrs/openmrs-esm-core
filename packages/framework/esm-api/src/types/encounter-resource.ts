import { type OpenmrsResource, type OpenmrsResourceStrict } from './openmrs-resource';
import { type Patient } from './patient-resource';
import { type Location } from './location-resource';
import { type Visit } from './visit-resource';
import { type Diagnosis } from './diagnosis-resource';
import { type Obs } from './obs-resource';

export interface Encounter extends OpenmrsResourceStrict {
  encounterDateTime?: string;
  patient?: Patient;
  location?: Location;
  encounterType?: EncounterType;
  obs?: Array<Obs>;
  visit?: Visit;
  encounterProviders?: Array<OpenmrsResource>;
  diagnoses?: Array<Diagnosis>;
}

export interface EncounterType extends OpenmrsResourceStrict {
  name: string;
  description: string;
  retired: boolean;
}

export interface EncounterProvider extends OpenmrsResourceStrict {
  provider: OpenmrsResource;
  encounterRole: EncounterRole;
}

export interface EncounterRole extends OpenmrsResourceStrict {
  name: string;
  description: string;
  retired: boolean;
}
