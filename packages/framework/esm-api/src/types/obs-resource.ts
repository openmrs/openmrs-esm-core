import { type Concept } from './concept-resource';
import { type Encounter } from './encounter-resource';
import { type Location } from './location-resource';
import { type OpenmrsResource, type OpenmrsResourceStrict } from './openmrs-resource';
import { type Person } from './person-resource';

export interface Obs extends OpenmrsResourceStrict {
  concept?: Concept;
  person?: Person;
  obsDatetime?: string;
  accessionNumber?: string;
  obsGroup?: Obs;
  valueCodedName?: OpenmrsResource;
  groupMembers?: Array<Obs>;
  comment?: string;
  location?: Location;
  order?: OpenmrsResource;
  encounter?: Encounter;
  value?: number | string | boolean | OpenmrsResource;
  valueModifier?: string;
  formFilePath?: string;
  formFiledNamespace?: string;
  status?: 'PRELIMINARY' | 'FINAL' | 'AMENDED';
  interpretation?: string;
}
