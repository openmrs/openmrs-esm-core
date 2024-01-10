import React from 'react';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layer, Tile } from '@carbon/react';
import { CheckmarkFilled, WarningFilled } from '@carbon/react/icons';
import { getDynamicOfflineDataHandlers } from '@openmrs/esm-framework';
import { useLastSyncStateOfPatient } from '../hooks/offline-patient-data-hooks';
import SharedPageLayout from '../components/shared-page-layout.component';
import styles from './offline-patient-sync-details.styles.scss';

const OfflinePatientSyncDetails: React.FC = () => {
  const { t } = useTranslation();
  const { patientUuid } = useParams();
  const { data: lastSyncState } = useLastSyncStateOfPatient(patientUuid);
  const handlers = getDynamicOfflineDataHandlers();
  const succeededHandlers = filterOutNonDisplayableHandlerIds(lastSyncState?.succeededHandlers ?? []);
  const erroredHandlers = filterOutNonDisplayableHandlerIds(lastSyncState?.erroredHandlers ?? []);

  return (
    <SharedPageLayout header={t('offlinePatientSyncDetailsHeader', 'Offline patient details')}>
      <div className={styles.contentContainer}>
        {succeededHandlers.length > 0 && (
          <section className={styles.headeredTileSection}>
            <h2 className={styles.productiveHeading02}>
              {t('offlinePatientSyncDetailsDownloadedHeader', 'Downloaded to this device')}
            </h2>
            {succeededHandlers.map((id) => (
              <Layer>
                <Tile className={styles.syncedTile}>
                  <span className={styles.bodyShort01}>
                    {handlers.find((handler) => handler.id === id)?.displayName}
                  </span>
                  <CheckmarkFilled size={16} className={styles.syncedTileIcon} />
                </Tile>
              </Layer>
            ))}
          </section>
        )}
        {erroredHandlers.length > 0 && (
          <section className={styles.headeredTileSection}>
            <h2 className={styles.productiveHeading02}>
              {t('offlinePatientSyncDetailsFailedHeader', 'There was an error downloading the following items')}
            </h2>
            {erroredHandlers.map((id) => (
              <Layer>
                <Tile className={styles.failedTile}>
                  <span className={styles.bodyShort01}>
                    {handlers.find((handler) => handler.id === id)?.displayName}
                  </span>
                  <WarningFilled size={16} className={styles.failedTileIcon} />
                  <span className={classNames(styles.failedTileErrorMessage, styles.label01)}>
                    {lastSyncState.errors.find((error) => error.handlerId === id)?.message ??
                      t('offlinePatientSyncDetailsFallbackErrorMessage', 'Unknown error.')}
                  </span>
                </Tile>
              </Layer>
            ))}
          </section>
        )}
      </div>
    </SharedPageLayout>
  );
};

function filterOutNonDisplayableHandlerIds(handlerIds: Array<string>) {
  const handlers = getDynamicOfflineDataHandlers();
  return handlerIds.filter((id) => handlers.some((handler) => handler.id === id && !!handler.displayName));
}

export default OfflinePatientSyncDetails;
