import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import classNames from 'classnames';
import DesktopSideNav from './nav/desktop-side-nav.component';
import Home from './home/home.component';
import OfflineToolsPage from './offline-tools-page/offline-tools-page.component';
import styles from './root.styles.scss';

const Root: React.FC = () => {
  return (
    <BrowserRouter basename={window.getOpenmrsSpaBase()}>
      <DesktopSideNav />
      <div className={classNames('omrs-main-content', styles.mainContentContainer)}>
        <Routes>
          <Route path="offline-tools" element={<Home />} />
          <Route path="offline-tools/:page" element={<OfflineToolsPage />}>
            <Route path=":patientUuid" element={<OfflineToolsPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default Root;
