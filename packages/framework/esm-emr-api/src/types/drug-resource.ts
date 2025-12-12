import { type Concept, type OpenmrsResource } from '@openmrs/esm-api';

export interface Drug extends OpenmrsResource {
  uuid: string;
  strength: string;
  concept: Concept;
  dosageForm: OpenmrsResource;
  display: string;
}
