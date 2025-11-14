import { useOpenmrsSWR, useSession, restBaseUrl, useConfig } from '@openmrs/esm-framework';
import type { ConfigSchema } from '../config-schema';
import { useMemo } from 'react';

type Attribute = {
  uuid: string;
  display: string;
  attributeType: {
    uuid: string;
    display: string;
  };
  value: string;
};

type Provider = {
  uuid: string;
  display: string;
  person: {
    uuid: string;
    display: string;
    attributes: Array<Attribute>;
  };
  attributes: Array<Attribute>;
};
export const useProviderDetails = () => {
  const rep = `custom:(uuid,display,person:(uuid,display,attributes),attributes)`;
  const session = useSession();
  const { attributeTypes } = useConfig<ConfigSchema>();
  const {
    currentProvider: { uuid },
  } = session;
  const { data, error, isLoading, mutate } = useOpenmrsSWR<Provider>(`${restBaseUrl}/provider/${uuid}?v=${rep}`);
  const providerDetails = data?.data;
  const phoneNumberFromPersonAttributes = useMemo(() => {
    return providerDetails?.person?.attributes?.find(
      (attribute) => attribute.attributeType.uuid === attributeTypes.personPhoneNumber,
    )?.value;
  }, [providerDetails, attributeTypes.personPhoneNumber]);
  const phoneNumberFromProviderAttributes = useMemo(() => {
    return providerDetails?.attributes?.find(
      (attribute) => attribute.attributeType.uuid === attributeTypes.providerPhoneNumber,
    )?.value;
  }, [providerDetails, attributeTypes.providerPhoneNumber]);
  const nationalIdFromProviderAttributes = useMemo(() => {
    return providerDetails?.attributes?.find(
      (attribute) => attribute.attributeType.uuid === attributeTypes.providerNationalId,
    )?.value;
  }, [providerDetails, attributeTypes.providerNationalId]);

  return {
    nationalId: nationalIdFromProviderAttributes,
    telephone: phoneNumberFromPersonAttributes || phoneNumberFromProviderAttributes,
    isLoading,
    error,
    mutate,
  };
};
