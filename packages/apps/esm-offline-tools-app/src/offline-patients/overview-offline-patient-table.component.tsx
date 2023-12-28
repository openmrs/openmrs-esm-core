import React from 'react';
import OfflinePatientTable from './offline-patient-table.component';

const OverviewOfflinePatientTable: React.FC = () => {
  return <OfflinePatientTable isInteractive={false} showHeader />;
};

export default OverviewOfflinePatientTable;
