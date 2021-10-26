import React, { useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { loadPersistedPatientDataSyncState } from "@openmrs/esm-framework";
import Home from "./home/home.component";
import DesktopSideNav from "./nav/desktop-side-nav.component";
import styles from "./root.styles.scss";
import OfflineToolsPage from "./offline-tools-page/offline-tools-page.component";

const Root: React.FC = () => {
  useEffect(() => {
    loadPersistedPatientDataSyncState();
  }, []);

  return (
    <BrowserRouter basename={window.spaBase}>
      <DesktopSideNav />
      <div className={`omrs-main-content ${styles.mainContentContainer}`}>
        <Route path="/offline-tools" exact component={Home} />
        <Route path="/offline-tools/:page" component={OfflineToolsPage} />
      </div>
    </BrowserRouter>
  );
};

export default Root;
