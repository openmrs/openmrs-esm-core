import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@carbon/react';
import { PendingFilled, WarningAltFilled, CheckmarkOutline } from '@carbon/react/icons';
import type { DynamicOfflineDataSyncState } from '@openmrs/esm-framework';
import { getDynamicOfflineDataHandlers, navigate } from '@openmrs/esm-framework';
import styles from './last-updated-table-cell.scss';

export interface LastUpdatedTableCellProps {
  patientUuid: string;
  isSyncing: boolean;
  lastSyncState?: DynamicOfflineDataSyncState;
}

const LastUpdatedTableCell: React.FC<LastUpdatedTableCellProps> = ({ patientUuid, isSyncing, lastSyncState }) => {
  const { t } = useTranslation();

  const InnerContent = () => {
    if (isSyncing) {
      return (
        <>
          <PendingFilled className={styles.pendingIcon} />
          {t('offlinePatientsTableLastUpdatedDownloading', 'Downloading...')}
        </>
      );
    }

    if (!lastSyncState) {
      return (
        <>
          <WarningAltFilled className={styles.errorIcon} />
          {t('offlinePatientsTableLastUpdatedNotYetSynchronized', 'Not synchronized')}
        </>
      );
    }

    if (hasNewUnknownHandlers(lastSyncState)) {
      return (
        <>
          <WarningAltFilled className={styles.errorIcon} />
          {t('offlinePatientsTableLastUpdatedOutdatedData', 'Outdated data')}
        </>
      );
    }

    if (lastSyncState.erroredHandlers.length > 0) {
      return (
        <>
          <WarningAltFilled className={styles.errorIcon} />
          <Link
            onClick={() =>
              navigate({
                to: `${window.getOpenmrsSpaBase()}offline-tools/patients/${patientUuid}/offline-data`,
              })
            }
          >
            {lastSyncState.erroredHandlers.length}{' '}
            {lastSyncState.erroredHandlers.length === 1
              ? t('offlinePatientsTableLastUpdatedError', 'error')
              : t('offlinePatientsTableLastUpdatedErrors', 'errors')}
          </Link>
        </>
      );
    }

    return (
      <>
        <CheckmarkOutline />
        {lastSyncState.syncedOn.toLocaleDateString()}
      </>
    );
  };

  return (
    <div className={styles.cellContainer}>
      <InnerContent />
    </div>
  );
};

function hasNewUnknownHandlers(lastSyncState: DynamicOfflineDataSyncState) {
  const currentHandlers = getDynamicOfflineDataHandlers()
    .filter((handler) => handler.type === 'patient')
    .map((handler) => handler.id);
  const lastSyncHandlers = [...lastSyncState.succeededHandlers, ...lastSyncState.erroredHandlers];

  return currentHandlers.some((id) => !lastSyncHandlers.includes(id));
}

export default LastUpdatedTableCell;
