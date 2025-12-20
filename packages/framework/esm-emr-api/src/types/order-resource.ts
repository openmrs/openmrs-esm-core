import { type Concept, type OpenmrsResource } from '@openmrs/esm-api';
import { type Drug } from './drug-resource';

export type FulfillerStatus =
  | 'RECEIVED'
  | 'IN_PROGRESS'
  | 'EXCEPTION'
  | 'ON_HOLD'
  | 'DECLINED'
  | 'COMPLETED'
  | 'DISCONINTUED';

export type OrderAction = 'NEW' | 'REVISE' | 'DISCONTINUE' | 'RENEW';

export type OrderUrgency = 'ROUTINE' | 'STAT' | 'ON_SCHEDULED_DATE';

export interface Order extends OpenmrsResource {
  uuid: string;
  action: OrderAction;
  asNeeded: boolean;
  asNeededCondition?: string;
  autoExpireDate: string;
  brandName?: string;
  careSetting: OpenmrsResource;
  commentToFulfiller: string;
  concept: Concept;
  dateActivated: string;
  dateStopped?: string | null;
  dispenseAsWritten: boolean;
  dose: number;
  doseUnits: OpenmrsResource;
  dosingInstructions: string | null;
  dosingType?: 'org.openmrs.FreeTextDosingInstructions' | 'org.openmrs.SimpleDosingInstructions';
  drug: Drug;
  duration: number;
  durationUnits: OpenmrsResource;
  encounter: OpenmrsResource;
  frequency: OpenmrsResource;
  instructions?: string | null;
  numRefills: number;
  orderNumber: string;
  orderReason: string | null;
  orderReasonNonCoded: string | null;
  orderType: {
    conceptClasses: Array<any>;
    description: string;
    display: string;
    name: string;
    parent: string | null;
    retired: boolean;
    uuid: string;
  };
  orderer: {
    display: string;
    person: {
      display: string;
    };
    uuid: string;
  };
  patient: OpenmrsResource;
  previousOrder: { uuid: string; type: string; display: string } | null;
  quantity: number;
  quantityUnits: OpenmrsResource;
  route: OpenmrsResource;
  scheduleDate: null;
  urgency: OrderUrgency;

  // additional properties
  accessionNumber: string;
  scheduledDate: string;
  display: string;
  fulfillerStatus: FulfillerStatus;
  fulfillerComment: string;
  specimenSource: string;
  laterality: string;
  clinicalHistory: string;
  numberOfRepeats: string;
  type: string;
}
