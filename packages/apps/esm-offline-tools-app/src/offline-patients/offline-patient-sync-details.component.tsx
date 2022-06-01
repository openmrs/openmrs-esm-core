import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router-dom";
import { Tile } from "carbon-components-react";
import CheckmarkFilled16 from "@carbon/icons-react/es/checkmark--filled/16";
import WarningFilled16 from "@carbon/icons-react/es/warning--filled/16";
import styles from "./offline-patient-sync-details.styles.scss";
import SharedPageLayout from "../components/shared-page-layout.component";
import { useLastSyncStateOfPatient } from "../hooks/offline-patient-data-hooks";
import { getDynamicOfflineDataHandlers } from "@openmrs/esm-framework";

interface OfflinePatientSyncDetailsParams {
  patientUuid: string;
}

const OfflinePatientSyncDetails: React.FC<
  RouteComponentProps<OfflinePatientSyncDetailsParams>
> = ({ match }) => {
  const { t } = useTranslation();
  const patientUuid: string = match.params.patientUuid;
  const { data: lastSyncState } = useLastSyncStateOfPatient(patientUuid);
  const handlers = useMemo(() => getDynamicOfflineDataHandlers(), []);
  const succeededHandlers = filterOutNonDisplayableHandlerIds(
    lastSyncState?.succeededHandlers ?? []
  );
  const erroredHandlers = filterOutNonDisplayableHandlerIds(
    lastSyncState?.erroredHandlers ?? []
  );

  return (
    <SharedPageLayout
      header={t("offlinePatientSyncDetailsHeader", "Offline patient details")}
    >
      <div className={styles.contentContainer}>
        {succeededHandlers.length > 0 && (
          <section className={styles.headeredTileSection}>
            <h2 className={styles.productiveHeading02}>
              {t(
                "offlinePatientSyncDetailsDownloadedHeader",
                "Downloaded to this device"
              )}
            </h2>
            {succeededHandlers.map((id) => (
              <Tile className={styles.syncedTile} light>
                <span className={styles.bodyShort01}>
                  {handlers.find((handler) => handler.id === id)?.displayName}
                </span>
                <CheckmarkFilled16 className={styles.syncedTileIcon} />
              </Tile>
            ))}
          </section>
        )}
        {erroredHandlers.length > 0 && (
          <section className={styles.headeredTileSection}>
            <h2 className={styles.productiveHeading02}>
              {t(
                "offlinePatientSyncDetailsFailedHeader",
                "There was an error downloading the following items"
              )}
            </h2>
            {erroredHandlers.map((id) => (
              <Tile className={styles.failedTile} light>
                <span className={styles.bodyShort01}>
                  {handlers.find((handler) => handler.id === id)?.displayName}
                </span>
                <WarningFilled16 className={styles.failedTileIcon} />
                <span
                  className={`${styles.failedTileErrorMessage} ${styles.label01}`}
                >
                  {lastSyncState.errors.find((error) => error.handlerId === id)
                    ?.message ??
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

function filterOutNonDisplayableHandlerIds(handlerIds: Array<string>) {
  const handlers = getDynamicOfflineDataHandlers();
  return handlerIds.filter((id) =>
    handlers.some((handler) => handler.id === id && !!handler.displayName)
  );
}

export default OfflinePatientSyncDetails;
