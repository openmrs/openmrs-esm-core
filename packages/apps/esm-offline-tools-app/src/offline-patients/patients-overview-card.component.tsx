import React from "react";
import { useTranslation } from "react-i18next";
import { useOfflinePatientDataStore } from "../hooks/offline-patient-data-hooks";
import HeaderedQuickInfo from "../components/headered-quick-info.component";
import OverviewCard from "../components/overview-card.component";
import { routes } from "../constants";
import useSWR from "swr";
import { getSynchronizationItems } from "@openmrs/esm-framework";

const PatientsOverviewCard: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useDownloadedOfflinePatients();

  return (
    <OverviewCard
      header={t("homeOverviewCardPatientsHeader", "Patients")}
      viewLink={routes.offlineToolsPatients}
    >
      <HeaderedQuickInfo
        header={t("homeOverviewCardPatientsDownloaded", "Downloaded")}
        content={data?.downloadedCount}
        isLoading={!data}
      />
      <HeaderedQuickInfo
        header={t(
          "homeOverviewCardPatientsNewlyRegistered",
          "Newly registered"
        )}
        content={data?.registeredCount}
        isLoading={!data}
      />
    </OverviewCard>
  );
};

function useDownloadedOfflinePatients() {
  const store = useOfflinePatientDataStore();
  return useSWR(["offlinePatientsTotalCount", store], async () => {
    const downloadedCount = Object.values(
      store.offlinePatientDataSyncState
    ).filter(
      (patientSyncState) =>
        patientSyncState.failedHandlers.length === 0 &&
        patientSyncState.syncingHandlers.length === 0
    ).length;

    const patientRegistrationSyncItems = await getSynchronizationItems(
      "patient-registration"
    );
    const registeredCount = patientRegistrationSyncItems.length;

    return {
      downloadedCount,
      registeredCount,
    };
  });
}

export default PatientsOverviewCard;
