export interface FHIRResource {
  resource: {
    code: { coding: Array<FHIRCode> };
    effectiveDateTime: Date;
    encounter: {
      reference: string;
      type: string;
    };
    id: string;
    issued: Date;
    referenceRange: any;
    resourceType: string;
    status: string;
    subject: {
      display: string;
      identifier: { id: string; system: string; use: string; value: string };
      reference: string;
      type: string;
    };
    valueQuantity: {
      value: number;
    };
    valueString: string;
    valueCodeableConcept: { coding: Array<FHIRCode> };
  };
}

export interface FHIRCode {
  code: string;
  system: string;
  display?: string;
}
