import React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import OfflinePatientSyncDetails from './offline-patient-sync-details.component';
import OfflinePatientTable from './offline-patient-table.component';
import SharedPageLayout from '../components/shared-page-layout.component';
import styles from './offline-patients.styles.scss';

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
            <SharedPageLayout header={t('offlinePatientsHeader', 'Offline patients')}>
              <div className={styles.contentContainer}>
                <OfflinePatientTable isInteractive showHeader={false} />
              </div>
            </SharedPageLayout>
          }
        />
        <Route path="/:patientUuid/offline-data" element={<OfflinePatientSyncDetails />} />
      </Routes>
    </BrowserRouter>
  );
};

export default OfflinePatients;
