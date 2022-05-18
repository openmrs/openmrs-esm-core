import React from "react";
import { useTranslation } from "react-i18next";
import { ExtensionSlot } from "@openmrs/esm-framework";
import SharedPageLayout from "../components/shared-page-layout.component";
import styles from "./offline-patients.styles.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import OfflinePatientSyncDetails from "./offline-patient-sync-details.component";

export interface OfflinePatientsProps {
  basePath: string;
}

const OfflinePatients: React.FC<OfflinePatientsProps> = ({ basePath }) => {
  const { t } = useTranslation();

  return (
    <BrowserRouter basename={basePath}>
      <Routes>
        <Route
          path="/"
          element={
            <SharedPageLayout
              header={t("offlinePatientsHeader", "Offline patients")}
            >
              <div className={styles.contentContainer}>
                <ExtensionSlot extensionSlotName="offline-tools-offline-patients-slot" />
              </div>
            </SharedPageLayout>
          }
        />
        <Route
          path="/:patientUuid/offline-data"
          element={<OfflinePatientSyncDetails />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default OfflinePatients;
