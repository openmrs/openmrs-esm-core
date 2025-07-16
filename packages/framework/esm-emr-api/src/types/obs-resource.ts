import { type Concept, type OpenmrsResource, type Person } from '@openmrs/esm-api';
import { type Encounter } from './encounter-resource';
import { type Location } from './location-resource';

export interface Obs extends OpenmrsResource {
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
