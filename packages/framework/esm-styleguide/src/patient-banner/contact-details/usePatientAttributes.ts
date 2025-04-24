import { useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-api';
import { useConfig } from '@openmrs/esm-react-utils';
import { type Patient } from './types';

const customRepresentation =
  'custom:(uuid,display,identifiers:(identifier,uuid,preferred,location:(uuid,name),identifierType:(uuid,name,format,formatDescription,validator)),person:(uuid,display,gender,birthdate,dead,age,deathDate,birthdateEstimated,causeOfDeath,preferredName:(uuid,preferred,givenName,middleName,familyName),attributes,preferredAddress:(uuid,preferred,address1,address2,cityVillage,longitude,stateProvince,latitude,country,postalCode,countyDistrict,address3,address4,address5,address6,address7)))';

/**
 *  React hook that takes patientUuid and return Patient Attributes {@link Attribute}
 * @param patientUuid Unique Patient identifier
 * @returns Object containing `patient-attributes`, `isLoading` loading status, `error`
 */
export const usePatientAttributes = (patientUuid: string) => {
  const { data, error, isLoading } = useSWRImmutable<{ data: Patient }>(
    `${restBaseUrl}/patient/${patientUuid}?v=${customRepresentation}`,
    openmrsFetch,
  );

  return {
    isLoading,
    attributes: data?.data.person.attributes ?? [],
    error: error,
  };
};

/**
 * React hook that takes patientUuid and returns contact details
 * derived from patient attributes using configured attributeTypes.
 *
 * Note: This hook loads configuration from '@openmrs/esm-patient-banner-app'
 * because the contact attribute types are defined in the patient banner's
 * configuration schema. While this hook lives in esm-styleguide, it serves
 * the patient banner's contact details display.
 *
 * @param patientUuid - Unique patient identifier
 * @returns {Object} Object containing filtered contact attributes, loading status, and error
 * @property {Array} contactAttributes - List of contact-related attributes
 * @property {boolean} isLoading - Loading status
 * @property {Error|null} error - Error object if request fails
 */
export const usePatientContactAttributes = (patientUuid: string) => {
  const { contactAttributeTypes = [] } = useConfig({
    externalModuleName: '@openmrs/esm-patient-banner-app',
  });

  const { attributes, error, isLoading } = usePatientAttributes(patientUuid);
  const contactAttributes = useMemo(
    () => attributes.filter(({ attributeType }) => contactAttributeTypes?.some((uuid) => attributeType.uuid === uuid)),
    [attributes, contactAttributeTypes],
  );

  return {
    contactAttributes,
    isLoading,
    error,
  };
};
