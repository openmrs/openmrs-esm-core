import { type User } from './user-resource';

export interface OpenmrsResource extends OpenmrsResourceStrict {
  [anythingElse: string]: any;
}

/**
 * Superclass for all Openmrs Resources, with strict typings.
 * If the subclass does not have all attributes (including optional ones)
 * accounted for, use OpenmrsResource instead.
 */
export interface OpenmrsResourceStrict {
  uuid: string;
  display?: string;
  links?: Array<Link>;
  auditInfo?: AuditInfo;
  resourceVersion?: string;
}

export interface Link {
  rel: string;
  uri: string;
  resourceAlias?: string;
}

export interface AuditInfo {
  dateCreated?: string;
  creator?: User;
  dateChanged?: string;
  changedBy?: User;
  voided?: boolean;
  dateVoided?: string;
  voidedBy?: User;
  voidReason?: string;
  retired?: boolean;
  datedRetired?: string;
  retiredBy?: User;
  retireReason?: string;
}
