import React from "react";
import { useTranslation } from "react-i18next";
import HeaderedQuickInfo from "../components/headered-quick-info.component";
import OverviewCard from "../components/overview-card.component";
import { routes } from "../constants";
import useSWR from "swr";
import {
  getDynamicOfflineDataEntries,
  getSynchronizationItems,
} from "@openmrs/esm-framework";

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
  return useSWR(["offlineTools/offlinePatientsTotalCount"], async () => {
    const patientDataEntries = await getDynamicOfflineDataEntries("patient");
    const patientRegistrationSyncItems = await getSynchronizationItems(
      "patient-registration"
    );
    const registeredCount = patientRegistrationSyncItems.length;
    const downloadedCount = patientDataEntries.filter(
      (entry) => entry.syncState && entry.syncState.erroredHandlers.length === 0
    ).length;

    return {
      downloadedCount,
      registeredCount,
    };
  });
}

export default PatientsOverviewCard;
