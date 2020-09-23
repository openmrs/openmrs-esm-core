/*
Originally taken from https://github.com/FHIR/fhir.js/blob/ec82ccfc125e05dbb645f47c100fe60f2c34bb73/src/fhir.d.ts
Has been adapted to be even better - if we can get fhir.js to publish a good version to npm with better typedefs,
we can remove this file in favor of the one they maintain
*/

type ClientFn = (...args: any[]) => Promise<{ data: any }>;
type ResourceName =
  | "DomainResource"
  | "Organization"
  | "Location"
  | "HealthcareService"
  | "Practitioner"
  | "Patient"
  | "RelatedPerson"
  | "Device"
  | "Account"
  | "AllergyIntolerance"
  | "Schedule"
  | "Slot"
  | "Appointment"
  | "AppointmentResponse"
  | "AuditEvent"
  | "Basic"
  | "BodySite"
  | "Substance"
  | "Medication"
  | "Group"
  | "Specimen"
  | "DeviceComponent"
  | "DeviceMetric"
  | "ValueSet"
  | "Questionnaire"
  | "QuestionnaireResponse"
  | "Observation"
  | "FamilyMemberHistory"
  | "DocumentReference"
  | "DiagnosticOrder"
  | "ProcedureRequest"
  | "ReferralRequest"
  | "Procedure"
  | "ImagingStudy"
  | "ImagingObjectSelection"
  | "Media"
  | "DiagnosticReport"
  | "CommunicationRequest"
  | "DeviceUseRequest"
  | "MedicationOrder"
  | "NutritionOrder"
  | "Order"
  | "ProcessRequest"
  | "SupplyRequest"
  | "VisionPrescription"
  | "ClinicalImpression"
  | "Condition"
  | "EpisodeOfCare"
  | "Encounter"
  | "MedicationStatement"
  | "RiskAssessment"
  | "Goal"
  | "CarePlan"
  | "Composition"
  | "Contract"
  | "Coverage"
  | "ClaimResponse"
  | "Claim"
  | "Communication"
  | "StructureDefinition"
  | "ConceptMap"
  | "OperationDefinition"
  | "Conformance"
  | "DataElement"
  | "DetectedIssue"
  | "DeviceUseStatement"
  | "DocumentManifest"
  | "EligibilityRequest"
  | "EligibilityResponse"
  | "EnrollmentRequest"
  | "EnrollmentResponse"
  | "ExplanationOfBenefit"
  | "Flag"
  | "Immunization"
  | "ImmunizationRecommendation"
  | "ImplementationGuide"
  | "List"
  | "MedicationAdministration"
  | "MedicationDispense"
  | "OperationOutcome"
  | "MessageHeader"
  | "NamingSystem"
  | "OrderResponse"
  | "PaymentNotice"
  | "PaymentReconciliation"
  | "Person"
  | "ProcessResponse"
  | "Provenance"
  | "SearchParameter"
  | "Subscription"
  | "SupplyDelivery"
  | "TestScript"
  | "Binary"
  | "Bundle"
  | "Parameters";
interface QueryOptions {
  $include?: { [key: string]: string | string[] };
  [key: string]: any;
}

declare function Create<T extends fhir.DomainResource>(content: {
  resource: T;
}): Promise<{ data: T }>;
declare function Create(content: {
  type: "Binary";
  data: Buffer;
}): Promise<{ data: fhir.Binary }>;
declare function Create<T extends fhir.DomainResource>(content: {
  type: ResourceName;
  data: T;
}): Promise<{ data: T }>;

declare function Read<T extends fhir.DomainResource>(content: {
  type: ResourceName;
  id?: string;
  patient?: string;
}): Promise<{ data: T }>;

declare function Patch(content: {
  type: ResourceName;
  id: string;
  data: Array<{
    op: "replace" | "add" | "remove";
    path: string;
    value: string | object;
  }>;
}): Promise<{ data: fhir.OperationOutcome }>;

declare function Update<T extends fhir.DomainResource>(content: {
  resource: T;
}): Promise<{ data: T }>;

declare function Search(content: {
  type: ResourceName;
  count?: number;
  query?: QueryOptions;
}): Promise<{ data: fhir.Bundle }>;

declare function NextPage(content: {
  type: ResourceName;
  bundle: fhir.Bundle;
}): Promise<{ data: fhir.Bundle }>;

export interface FhirClient {
  conformance: ClientFn;
  document: ClientFn;
  profile: ClientFn;
  transaction: ClientFn;
  history: ClientFn;
  typeHistory: ClientFn;
  resourceHistory: ClientFn;
  read: typeof Read;
  vread: ClientFn;
  delete: ClientFn;
  create: typeof Create;
  validate: ClientFn;
  search: typeof Search;
  update: typeof Update;
  nextPage: typeof NextPage;
  prevPage: ClientFn;
  resolve: ClientFn;
  patch: typeof Patch;
}

declare function makeFhir(a: any, b: any): FhirClient;

export default makeFhir;
