import React from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router-dom";
import { OfflinePatientDataSyncStore } from "@openmrs/esm-framework";
import { Tile } from "@carbon/react";
import { CheckmarkFilled, WarningFilled } from "@carbon/react/icons";
import SharedPageLayout from "../components/shared-page-layout.component";
import { useOfflinePatientDataStore } from "../hooks/offline-patient-data-hooks";
import styles from "./offline-patient-sync-details.styles.scss";

interface OfflinePatientSyncDetailsParams {
  patientUuid: string;
}

const OfflinePatientSyncDetails: React.FC<
  RouteComponentProps<OfflinePatientSyncDetailsParams>
> = ({ match }) => {
  const { t } = useTranslation();
  const store = useOfflinePatientDataStore();
  const patientUuid: string = match.params.patientUuid;
  const syncedHandlers = getHandlersForDisplay(
    store.offlinePatientDataSyncState[patientUuid]?.syncedHandlers ?? [],
    store
  );
  const failedHandlers = getHandlersForDisplay(
    store.offlinePatientDataSyncState[patientUuid]?.failedHandlers ?? [],
    store
  );

  return (
    <SharedPageLayout
      header={t("offlinePatientSyncDetailsHeader", "Offline patient details")}
    >
      <div className={styles.contentContainer}>
        {syncedHandlers.length > 0 && (
          <section className={styles.headeredTileSection}>
            <h2 className={styles.productiveHeading02}>
              {t(
                "offlinePatientSyncDetailsDownloadedHeader",
                "Downloaded to this device"
              )}
            </h2>
            {syncedHandlers.map(({ handler }) => (
              <Tile className={styles.syncedTile} light>
                <span className={styles.bodyShort01}>
                  {handler.displayName}
                </span>
                <CheckmarkFilled size={16} className={styles.syncedTileIcon} />
              </Tile>
            ))}
          </section>
        )}
        {failedHandlers.length > 0 && (
          <section className={styles.headeredTileSection}>
            <h2 className={styles.productiveHeading02}>
              {t(
                "offlinePatientSyncDetailsFailedHeader",
                "There was an error downloading the following items"
              )}
            </h2>
            {failedHandlers.map(({ identifier, handler }) => (
              <Tile className={styles.failedTile} light>
                <span className={styles.bodyShort01}>
                  {handler.displayName}
                </span>
                <WarningFilled size={16} className={styles.failedTileIcon} />
                <span
                  className={`${styles.failedTileErrorMessage} ${styles.label01}`}
                >
                  {store.offlinePatientDataSyncState[patientUuid]?.errors[
                    identifier
                  ] ??
                    t(
                      "offlinePatientSyncDetailsFallbackErrorMessage",
                      "Unknown error."
                    )}
                </span>
              </Tile>
            ))}
          </section>
        )}
      </div>
    </SharedPageLayout>
  );
};

function getHandlersForDisplay(
  identifiers: Array<string>,
  store: OfflinePatientDataSyncStore
) {
  const displayableHandlers = getHandlerIdentifiersForDisplay(store);
  return identifiers
    .filter((identifier) => displayableHandlers.includes(identifier))
    .map((identifier) => ({ identifier, handler: store.handlers[identifier] }));
}

function getHandlerIdentifiersForDisplay(store: OfflinePatientDataSyncStore) {
  return Object.entries(store.handlers)
    .filter(([_, handler]) => !!handler.displayName?.trim())
    .map(([identifier]) => identifier);
}

export default OfflinePatientSyncDetails;
