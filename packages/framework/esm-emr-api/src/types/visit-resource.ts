import { type OpenmrsResource } from '@openmrs/esm-api';
import { type Encounter } from './encounter-resource';
import { type Patient } from './patient-resource';

export interface NewVisitPayload {
  uuid?: string;
  location: string;
  patient?: string;
  startDatetime: Date;
  visitType: string;
  stopDatetime?: Date;
  attributes?: Array<{
    attributeType: string;
    value: string;
  }>;
}

export type UpdateVisitPayload = Partial<NewVisitPayload> & {};

export interface Visit {
  uuid: string;
  display?: string;
  encounters?: Array<Encounter>;
  patient?: Patient;
  visitType: VisitType;
  location?: Location;
  startDatetime: string;
  stopDatetime: string | null;
  attributes?: Array<OpenmrsResource>;
  [anythingElse: string]: any;
}

interface Location {
  uuid: string;
  display?: string;
  name?: string;
}

export interface VisitType {
  uuid: string;
  display: string;
  name?: string;
}
