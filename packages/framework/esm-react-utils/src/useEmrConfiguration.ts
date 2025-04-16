/** @module @category API */
import { useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';
import { type FetchResponse, type OpenmrsResource, openmrsFetch, restBaseUrl } from '@openmrs/esm-api';

interface LocationTag extends OpenmrsResource {
  name: string;
}

type DispositionType = 'ADMIT' | 'TRANSFER' | 'DISCHARGE';

/**
 * Add other properties as needed. Maintain alphabetical order. Keep in lockstep with the customRepresentation below.
 *
 * For all available configuration constants and global property keys, see:
 * @see https://github.com/openmrs/openmrs-module-emrapi/blob/master/api/src/main/java/org/openmrs/module/emrapi/EmrApiConstants.java
 */
export interface EmrApiConfigurationResponse {
  admissionDecisionConcept?: OpenmrsResource;
  admissionEncounterType?: OpenmrsResource;
  admissionForm?: OpenmrsResource;
  atFacilityVisitType?: OpenmrsResource;
  bedAssignmentEncounterType?: OpenmrsResource;
  cancelADTRequestEncounterType?: OpenmrsResource;
  checkInClerkEncounterRole?: OpenmrsResource;
  checkInEncounterType?: OpenmrsResource;
  clinicianEncounterRole?: OpenmrsResource;
  conceptSourcesForDiagnosisSearch?: OpenmrsResource;
  consultEncounterType?: OpenmrsResource;
  consultFreeTextCommentsConcept?: OpenmrsResource;
  denyAdmissionConcept?: OpenmrsResource;
  diagnosisMetadata?: OpenmrsResource;
  diagnosisSets?: OpenmrsResource;
  dischargeForm?: OpenmrsResource;
  dispositionDescriptor?: {
    admissionLocationConcept?: OpenmrsResource;
    dateOfDeathConcept?: OpenmrsResource;
    dispositionConcept?: OpenmrsResource;
    dispositionSetConcept?: OpenmrsResource;
    internalTransferLocationConcept?: OpenmrsResource;
  };
  dispositions?: Array<{
    actions?: [];
    additionalObs?: null;
    careSettingTypes?: ['OUTPATIENT'];
    conceptCode?: string;
    encounterTypes?: null;
    excludedEncounterTypes?: Array<string>;
    keepsVisitOpen?: null;
    name?: string;
    type?: DispositionType;
    uuid?: string;
  }>;
  emrApiConceptSource?: OpenmrsResource;
  exitFromInpatientEncounterType?: OpenmrsResource;
  extraPatientIdentifierTypes?: OpenmrsResource;
  fullPrivilegeLevel?: OpenmrsResource;
  highPrivilegeLevel?: OpenmrsResource;
  identifierTypesToSearch?: OpenmrsResource;
  inpatientNoteEncounterType?: OpenmrsResource;
  lastViewedPatientSizeLimit?: OpenmrsResource;
  metadataSourceName?: OpenmrsResource;
  motherChildRelationshipType?: OpenmrsResource;
  narrowerThanConceptMapType?: OpenmrsResource;
  nonDiagnosisConceptSets?: OpenmrsResource;
  orderingProviderEncounterRole?: OpenmrsResource;
  patientDiedConcept?: OpenmrsResource;
  personImageDirectory?: OpenmrsResource;
  primaryIdentifierType?: OpenmrsResource;
  sameAsConceptMapType?: OpenmrsResource;
  suppressedDiagnosisConcepts?: OpenmrsResource;
  supportsAdmissionLocationTag?: LocationTag;
  supportsLoginLocationTag?: LocationTag;
  supportsTransferLocationTag?: LocationTag;
  supportsVisitsLocationTag?: LocationTag;
  telephoneAttributeType?: OpenmrsResource;
  testPatientPersonAttributeType?: OpenmrsResource;
  transferForm?: OpenmrsResource;
  transferRequestEncounterType?: OpenmrsResource;
  transferWithinHospitalEncounterType?: OpenmrsResource;
  unknownCauseOfDeathConcept?: OpenmrsResource;
  unknownLocation?: OpenmrsResource;
  unknownPatientPersonAttributeType?: OpenmrsResource;
  unknownProvider?: OpenmrsResource;
  visitAssignmentHandlerAdjustEncounterTimeOfDayIfNecessary?: OpenmrsResource;
  visitExpireHours?: OpenmrsResource;
  visitNoteEncounterType?: OpenmrsResource;
}

/*
 * Add other properties as needed. Maintain alphabetical order. Keep in lockstep with the interface above.
 */
const customRepProps = [
  ['admissionDecisionConcept', 'ref'],
  ['admissionEncounterType', 'ref'],
  ['admissionForm', 'ref'],
  ['atFacilityVisitType', 'ref'],
  ['bedAssignmentEncounterType', 'ref'],
  ['cancelADTRequestEncounterType', 'ref'],
  ['checkInClerkEncounterRole', 'ref'],
  ['checkInEncounterType', 'ref'],
  ['clinicianEncounterRole', 'ref'],
  ['conceptSourcesForDiagnosisSearch', 'ref'],
  ['consultEncounterType', 'ref'],
  ['consultFreeTextCommentsConcept', 'ref'],
  ['denyAdmissionConcept', 'ref'],
  ['diagnosisMetadata', 'ref'],
  ['diagnosisSets', 'ref'],
  ['dischargeForm', 'ref'],
  ['dispositionDescriptor', 'ref'],
  ['dispositions', 'ref'],
  ['emrApiConceptSource', 'ref'],
  ['exitFromInpatientEncounterType', 'ref'],
  ['extraPatientIdentifierTypes', 'ref'],
  ['fullPrivilegeLevel', 'ref'],
  ['highPrivilegeLevel', 'ref'],
  ['identifierTypesToSearch', 'ref'],
  ['inpatientNoteEncounterType', 'ref'],
  ['lastViewedPatientSizeLimit', 'ref'],
  ['metadataSourceName', 'ref'],
  ['motherChildRelationshipType', 'ref'],
  ['narrowerThanConceptMapType', 'ref'],
  ['nonDiagnosisConceptSets', 'ref'],
  ['orderingProviderEncounterRole', 'ref'],
  ['patientDiedConcept', 'ref'],
  ['personImageDirectory', 'ref'],
  ['primaryIdentifierType', 'ref'],
  ['sameAsConceptMapType', 'ref'],
  ['suppressedDiagnosisConcepts', 'ref'],
  ['supportsAdmissionLocationTag', '(uuid,display,name,links)'],
  ['supportsLoginLocationTag', '(uuid,display,name,links)'],
  ['supportsTransferLocationTag', '(uuid,display,name,links)'],
  ['supportsVisitsLocationTag', '(uuid,display,name,links)'],
  ['telephoneAttributeType', 'ref'],
  ['testPatientPersonAttributeType', 'ref'],
  ['transferForm', 'ref'],
  ['transferRequestEncounterType', 'ref'],
  ['transferWithinHospitalEncounterType', 'ref'],
  ['unknownCauseOfDeathConcept', 'ref'],
  ['unknownLocation', 'ref'],
  ['unknownPatientPersonAttributeType', 'ref'],
  ['unknownProvider', 'ref'],
  ['visitAssignmentHandlerAdjustEncounterTimeOfDayIfNecessary', 'ref'],
  ['visitExpireHours', 'ref'],
  ['visitNoteEncounterType', 'ref'],
] as const;

const customRepresentation = `custom:${customRepProps.map(([prop, rep]) => `${prop}:${rep}`).join(',')}`;

/**
 * React hook for fetching and managing OpenMRS EMR configuration
 * @returns {Object} Object containing:
 *   - emrConfiguration: EmrApiConfigurationResponse | undefined - The EMR configuration data
 *   - isLoadingEmrConfiguration: boolean - Loading state indicator
 *   - mutateEmrConfiguration: Function - SWR's mutate function for manual revalidation
 *   - errorFetchingEmrConfiguration: Error | undefined - Error object if request fails
 */
export function useEmrConfiguration() {
  const url = `${restBaseUrl}/emrapi/configuration?v=${customRepresentation}`;
  const swrData = useSWRImmutable<FetchResponse<EmrApiConfigurationResponse>, Error>(url, openmrsFetch);

  const results = useMemo(
    () => ({
      emrConfiguration: swrData.data?.data,
      isLoadingEmrConfiguration: swrData.isLoading,
      mutateEmrConfiguration: swrData.mutate,
      errorFetchingEmrConfiguration: swrData.error,
    }),
    [swrData],
  );

  return results;
}
