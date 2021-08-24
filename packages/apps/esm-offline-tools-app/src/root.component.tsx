import React, { useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { loadPersistedPatientDataSyncState } from "@openmrs/esm-framework";
import Home from "./home/home.component";
import DesktopSideNav from "./nav/desktop-side-nav.component";
import OfflinePatients from "./offline-patients/offline-patients.component";
import styles from "./root.styles.scss";
import OfflinePatientSyncDetails from "./offline-patient-sync-details/offline-patient-sync-details.component";

const Root: React.FC = () => {
  useEffect(() => {
    loadPersistedPatientDataSyncState();
  }, []);

  return (
    <BrowserRouter basename={window.spaBase}>
      <DesktopSideNav />
      <div className={"omrs-main-content " + styles.mainContentContainer}>
        <Route exact path="/offline-tools" component={Home} />
        <Route
          exact
          path="/offline-tools/patients"
          component={OfflinePatients}
        />
        <Route
          exact
          path="/offline-tools/patients/:patientUuid/offline-data"
          component={OfflinePatientSyncDetails}
        />
      </div>
    </BrowserRouter>
  );
};

export default Root;
