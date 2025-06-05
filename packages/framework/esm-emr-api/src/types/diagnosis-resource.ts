import { type Concept, type ConceptClass, type OpenmrsResource } from '@openmrs/esm-api';
import { type Encounter } from './encounter-resource';
import { type Patient } from './patient-resource';

// TODO: make this extends OpenmrsResourceStrict
export interface Diagnosis extends OpenmrsResource {
  diagnosis?: {
    coded?: {
      uuid: string;
      display?: string;
      name?: Concept;
      datatype?: OpenmrsResource;
      conceptClass?: ConceptClass;
    };
    nonCoded?: string;
  };
  patient?: Patient;
  encounter?: Encounter;
  certainty?: string;
  rank?: number;
  formFieldNamespace?: string;
  formFieldPath?: string;
  voided?: boolean;
}
