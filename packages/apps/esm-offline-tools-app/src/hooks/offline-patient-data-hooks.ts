import {
  fetchCurrentPatient,
  getSynchronizationItems,
  getDynamicOfflineDataEntries,
} from "@openmrs/esm-framework";
import merge from "lodash-es/merge";
import { useMemo } from "react";
import useSWR, { SWRResponse } from "swr";

function useDynamicOfflineDataEntries(type: string) {
  return useSWR(`dynamicOfflineData/entries/${type}`, () =>
    getDynamicOfflineDataEntries(type)
  );
}

function useSynchronizationItems<T>(type: string) {
  return useSWR(`syncQueue/items/${type}`, () =>
    getSynchronizationItems<T>(type)
  );
}

function useFhirPatients(ids: Array<string>) {
  const stableIds = useMemo(() => [...ids].sort(), [ids]);
  return useSWR(["fhirPatients", stableIds], () =>
    Promise.all(
      stableIds.map((patientId) =>
        fetchCurrentPatient(patientId, undefined, false)
      )
    )
  );
}

export function useOfflineRegisteredPatients() {
  const offlinePatientsSwr = useDynamicOfflineDataEntries("patient");
  const patientSyncItemsSwr = useSynchronizationItems<{
    fhirPatient?: fhir.Patient;
  }>("patient-registration");

  return useMergedSwr(() => {
    return patientSyncItemsSwr.data
      .filter((patientRegistrationItem) => {
        const isNewlyRegistered =
          patientRegistrationItem.fhirPatient &&
          !offlinePatientsSwr.data.find(
            (offlinePatientEntry) =>
              offlinePatientEntry.identifier ===
              patientRegistrationItem.fhirPatient.id
          );
        return isNewlyRegistered;
      })
      .map((item) => item.fhirPatient);
  }, [offlinePatientsSwr, patientSyncItemsSwr]);
}

export function useOfflinePatientsWithEntries() {
  const offlinePatientsSwr = useDynamicOfflineDataEntries("patient");
  const patientSyncItemsSwr = useSynchronizationItems<{
    fhirPatient?: fhir.Patient;
  }>("patient-registration");
  const fhirPatientsSwr = useFhirPatients(
    offlinePatientsSwr.data?.map((entry) => entry.identifier) ?? []
  );

  return useMergedSwr(() => {
    return offlinePatientsSwr.data.map((offlinePatientEntry) => {
      const matchingFhirPatient = fhirPatientsSwr.data.find(
        (patient) => patient.id === offlinePatientEntry.identifier
      );
      const offlineUpdates = patientSyncItemsSwr.data
        .filter(
          (syncItem) =>
            syncItem.fhirPatient.id === offlinePatientEntry.identifier
        )
        .map((item) => item.fhirPatient);
      const finalPatient = merge(
        matchingFhirPatient,
        ...offlineUpdates
      ) as fhir.Patient;

      return {
        patient: finalPatient,
        entry: offlinePatientEntry,
      };
    });
  }, [offlinePatientsSwr, patientSyncItemsSwr, fhirPatientsSwr]);
}

export function useOfflinePatientStats() {
  const offlinePatientsSwr = useDynamicOfflineDataEntries("patient");
  const offlineRegisteredPatientsSwr = useOfflineRegisteredPatients();

  return useMergedSwr(
    () => ({
      downloadedCount: offlinePatientsSwr.data.length,
      registeredCount: offlineRegisteredPatientsSwr.data.length,
    }),
    [offlinePatientsSwr, offlineRegisteredPatientsSwr]
  );
}

export function useLastSyncStateOfPatient(patientUuid: string) {
  return useSWR(
    `offlineTools/offlinePatient/${patientUuid}/lastSyncState`,
    async () => {
      const offlinePatientEntries = await getDynamicOfflineDataEntries(
        "patient"
      );
      const patientEntry = offlinePatientEntries.find(
        (entry) => entry.identifier === patientUuid
      );
      return patientEntry?.syncState;
    }
  );
}

function useMergedSwr<T>(
  merge: () => T,
  swrResponses: Array<SWRResponse>
): SWRResponse<T> {
  return useMemo(() => {
    const areAllLoaded = swrResponses.every((res) => !!res.data);
    const data = areAllLoaded ? merge() : null;
    const error = swrResponses.find((res) => res.error);
    const mutate = () =>
      Promise.all(swrResponses.map((res) => res.mutate())).then(merge);
    const isValidating = swrResponses.some((res) => res.isValidating);
    const isLoading = swrResponses.some((res) => res.isLoading);

    return {
      data,
      error,
      mutate,
      isValidating,
      isLoading,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    merge,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...swrResponses.flatMap((res) => [res.data, res.error, res.isValidating]),
  ]);
}
