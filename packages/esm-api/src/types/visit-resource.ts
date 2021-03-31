import { OpenmrsResource } from "./openmrs-resource";

export interface NewVisitPayload {
  location: string;
  patient?: string;
  startDatetime: Date;
  visitType: string;
  stopDatetime?: Date;
}

export type UpdateVisitPayload = NewVisitPayload & {};

export interface Visit {
  uuid: string;
  display?: string;
  encounters: Array<OpenmrsResource>;
  patient?: OpenmrsResource;
  visitType: VisitType;
  location?: Location;
  startDatetime: Date;
  stopDatetime?: Date;
  attributes?: Array<OpenmrsResource>;
  [anythingElse: string]: any;
}

export interface Location {
  uuid: string;
  display?: string;
  name?: string;
}

export interface VisitType {
  uuid: string;
  display: string;
  name?: string;
}
