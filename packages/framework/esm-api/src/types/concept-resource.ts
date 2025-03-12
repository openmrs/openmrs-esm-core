import { type OpenmrsResourceStrict, type OpenmrsResource } from './openmrs-resource';

export interface Concept extends OpenmrsResourceStrict {
  name?: string;
  locale?: string;
  localPreferred?: boolean;
  conceptNameType?: 'FULLY_SPECIFIED' | 'SHORT' | 'INDEX_TERM';
}

export interface ConceptClass extends OpenmrsResourceStrict {
  name?: string;
  description?: string;
  retired?: boolean;
}
