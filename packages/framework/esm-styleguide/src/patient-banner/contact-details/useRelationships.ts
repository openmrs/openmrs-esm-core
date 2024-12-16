import { openmrsFetch, restBaseUrl } from '@openmrs/esm-api';
import useSWR from 'swr';

const customRepresentation =
  'custom:(display,uuid,personA:(age,display,birthdate,uuid),personB:(age,display,birthdate,uuid),relationshipType:(uuid,display,description,aIsToB,bIsToA))';

export function useRelationships(patientUuid: string) {
  const apiUrl = `${restBaseUrl}/relationship?v=${customRepresentation}&person=${patientUuid}`;

  const { data, error, isLoading, isValidating } = useSWR<{ data: RelationshipsResponse }, Error>(
    patientUuid ? apiUrl : null,
    openmrsFetch,
  );

  const formattedRelationships = data?.data?.results?.length
    ? extractRelationshipData(patientUuid, data.data.results)
    : null;

  return {
    data: data ? formattedRelationships : null,
    error,
    isLoading,
    isValidating,
  };
}

function extractRelationshipData(
  patientIdentifier: string,
  relationships: Array<Relationship>,
): Array<ExtractedRelationship> {
  const relationshipsData: Array<ExtractedRelationship> = [];
  for (const r of relationships) {
    if (patientIdentifier === r.personA.uuid) {
      relationshipsData.push({
        uuid: `${r.uuid}`,
        display: r.personB.display,
        relativeAge: r.personB.age,
        relativeUuid: r.personB.uuid,
        relationshipType: r.relationshipType.bIsToA,
      });
    } else {
      relationshipsData.push({
        uuid: `${r.uuid}`,
        display: r.personA.display,
        relativeAge: r.personA.age,
        relativeUuid: r.personA.uuid,
        relationshipType: r.relationshipType.aIsToB,
      });
    }
  }
  return relationshipsData;
}

interface RelationshipsResponse {
  results: Array<Relationship>;
}

interface ExtractedRelationship {
  uuid: string;
  display: string;
  relativeAge: number;
  relativeUuid: string;
  relationshipType: string;
}

export interface Relationship {
  display: string;
  uuid: number;
  personA: {
    uuid: string;
    age: number;
    display: string;
  };
  personB: {
    uuid: string;
    age: number;
    display: string;
  };
  relationshipType: {
    uuid: string;
    display: string;
    aIsToB: string;
    bIsToA: string;
  };
}
