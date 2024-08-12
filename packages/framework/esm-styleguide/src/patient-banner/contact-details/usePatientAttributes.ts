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
 *  React hook that takes patientUuid {@link string} and return contact details
 *  derived from patient-attributes using configured attributeTypes
 * @param patientUuid Unique patient identifier {@type string}
 * @returns Object containing `contactAttribute` {@link Attribute} loading status
 */
export const usePatientContactAttributes = (patientUuid: string) => {
  const { contactAttributeTypes } = useConfig();
  const { attributes, isLoading } = usePatientAttributes(patientUuid);
  const contactAttributes = attributes.filter(
    ({ attributeType }) => contactAttributeTypes?.some((uuid) => attributeType.uuid === uuid),
  );
  return {
    contactAttributes: contactAttributes ?? [],
    isLoading,
  };
};
