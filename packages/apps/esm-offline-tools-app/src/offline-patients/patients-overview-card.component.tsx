import React from 'react';
import { useTranslation } from 'react-i18next';
import HeaderedQuickInfo from '../components/headered-quick-info.component';
import OverviewCard from '../components/overview-card.component';
import { routes } from '../constants';
import { useOfflinePatientStats } from '../hooks/offline-patient-data-hooks';

const PatientsOverviewCard: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useOfflinePatientStats();

  return (
    <OverviewCard header={t('homeOverviewCardPatientsHeader', 'Patients')} viewLink={routes.offlineToolsPatients}>
      <HeaderedQuickInfo
        header={t('homeOverviewCardPatientsDownloaded', 'Downloaded')}
        content={data?.downloadedCount}
        isLoading={!data}
      />
      <HeaderedQuickInfo
        header={t('homeOverviewCardPatientsNewlyRegistered', 'Newly registered')}
        content={data?.registeredCount}
        isLoading={!data}
      />
    </OverviewCard>
  );
};

export default PatientsOverviewCard;
