import { useMemo } from 'react';
import { type FetchResponse, openmrsFetch } from '@openmrs/esm-framework';
import useSWR from 'swr';

export interface PatientPreferredName {
  display: string;
  uuid: string;
  givenName: string;
  middleName: string;
  familyName: string;
  familyName2: string;
  voided: boolean;
}

export type NameToken = 'givenName' | 'middleName' | 'familyName' | 'familyName2' | string;

export interface NameTemplate {
  displayName: string;
  codeName: string;
  country: null;
  lines: Array<{
    isToken: 'IS_NOT_NAME_TOKEN' | 'IS_NAME_TOKEN';
    displayText: string;
    codeName?: NameToken;
    displaySize?: '30';
  }>;
  lineByLineFormat: Array<NameToken>;
  nameMappings: {
    [x in NameToken]: string;
  };
  sizeMappings: {
    [x in NameToken]: string;
  };
}

function useRestPatient(patientUuid: string) {
  const { isLoading: isLoadingPersonName, data } = useSWR<FetchResponse<{ preferredName: PatientPreferredName }>>(
    `/ws/rest/v1/person/${patientUuid}?v=custom:(preferredName)`,
    openmrsFetch,
  );
  return {
    isLoadingPersonName,
    preferredName: data?.data?.preferredName,
  };
}

function useNameTemplate() {
  const { isLoading: isLoadingNameTemplate, data } = useSWR<FetchResponse<NameTemplate>>(
    '/ws/rest/v1/nametemplate',
    openmrsFetch,
  );
  return {
    isLoadingNameTemplate,
    nameTemplate: data?.data,
  };
}

export default function usePatientName(patientUuid: string) {
  const { isLoadingPersonName, preferredName } = useRestPatient(patientUuid);
  const { isLoadingNameTemplate, nameTemplate } = useNameTemplate();

  const patientName = useMemo(() => {
    if (isLoadingNameTemplate || isLoadingPersonName) {
      return '';
    }
    const lineByLineFormat = nameTemplate?.lineByLineFormat ?? [];
    return lineByLineFormat
      ?.reduce((acc: Array<string>, nameToken) => {
        if (preferredName?.[nameToken]) {
          acc.push(preferredName?.[nameToken]);
        }
        return acc;
      }, [])
      ?.join(' ');
  }, [isLoadingNameTemplate, isLoadingPersonName, nameTemplate, preferredName]);

  return {
    patientName,
    nameTemplate,
    isLoadingName: isLoadingNameTemplate || isLoadingPersonName,
  };
}
