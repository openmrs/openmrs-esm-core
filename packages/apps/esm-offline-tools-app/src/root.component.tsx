import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./home/home.component";
import DesktopSideNav from "./nav/desktop-side-nav.component";
import styles from "./root.styles.scss";
import OfflineToolsPage from "./offline-tools-page/offline-tools-page.component";

const Root: React.FC = () => {
  return (
    <BrowserRouter basename={window.spaBase}>
      <DesktopSideNav />
      <div className={`omrs-main-content ${styles.mainContentContainer}`}>
        <Routes>
          <Route path="/offline-tools" element={<Home />} />
          <Route path="/offline-tools/:page" element={<OfflineToolsPage />}>
            <Route path=":patientUuid" element={<OfflineToolsPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default Root;
