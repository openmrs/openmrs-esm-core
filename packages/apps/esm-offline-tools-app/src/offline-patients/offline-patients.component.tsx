import React from "react";
import { useTranslation } from "react-i18next";
import SharedPageLayout from "../components/shared-page-layout.component";
import styles from "./offline-patients.styles.scss";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import OfflinePatientSyncDetails from "./offline-patient-sync-details.component";
import OfflinePatientTable from "./offline-patient-table.component";

export interface OfflinePatientsProps {
  basePath: string;
}

const OfflinePatients: React.FC<OfflinePatientsProps> = ({ basePath }) => {
  const { t } = useTranslation();

  return (
    <BrowserRouter basename={basePath}>
      <Switch>
        <Route
          exact
          path="/:patientUuid/offline-data"
          component={OfflinePatientSyncDetails}
        />
        <Route exact>
          <SharedPageLayout
            header={t("offlinePatientsHeader", "Offline patients")}
          >
            <div className={styles.contentContainer}>
              <OfflinePatientTable isInteractive showHeader={false} />
            </div>
          </SharedPageLayout>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default OfflinePatients;
