import { type OpenmrsResource } from './openmrs-resource';

// TODO: make this extends OpenmrsResourceStrict
export interface Concept extends OpenmrsResource {
  name?: ConceptName;
  datatype?: ConceptDatatype;
  conceptClass?: ConceptClass;
  set?: boolean;
  version?: string;
  retired?: boolean;
  names?: Array<ConceptName>;
  descriptions?: Array<OpenmrsResource>;
  // TODO: add better typings
  mappings?: any;
  answers?: any;
  setMembers?: any;
  attributes?: any;
}

export interface ConceptDatatype extends OpenmrsResource {
  name?: string;
  description?: string;
  hl7Abbreviation?: string;
  retired?: boolean;
}

export interface ConceptName extends OpenmrsResource {
  name?: string;
  locale?: string;
  localPreferred?: boolean;
  conceptNameType?: 'FULLY_SPECIFIED' | 'SHORT' | 'INDEX_TERM';
}

export interface ConceptClass extends OpenmrsResource {
  name?: string;
  description?: string;
  retired?: boolean;
}
