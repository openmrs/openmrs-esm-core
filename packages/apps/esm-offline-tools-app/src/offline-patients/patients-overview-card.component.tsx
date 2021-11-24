import React from "react";
import { useTranslation } from "react-i18next";
import { useOfflinePatientDataStore } from "../hooks/offline-patient-data-hooks";
import HeaderedQuickInfo from "../components/headered-quick-info.component";
import OverviewCard from "../components/overview-card.component";
import { routes } from "../constants";

const PatientsOverviewCard: React.FC = () => {
  const { t } = useTranslation();
  const downloaded = useDownloadedOfflinePatients();

  return (
    <OverviewCard
      header={t("homeOverviewCardPatientsHeader", "Patients")}
      viewLink={routes.offlineToolsPatients}
    >
      <HeaderedQuickInfo
        header={t("homeOverviewCardPatientsDownloaded", "Downloaded")}
        content={downloaded}
      />
    </OverviewCard>
  );
};

function useDownloadedOfflinePatients() {
  const store = useOfflinePatientDataStore();
  return Object.values(store.offlinePatientDataSyncState).filter(
    (patientSyncState) =>
      patientSyncState.failedHandlers.length === 0 &&
      patientSyncState.syncingHandlers.length === 0
  ).length;
}

export default PatientsOverviewCard;
