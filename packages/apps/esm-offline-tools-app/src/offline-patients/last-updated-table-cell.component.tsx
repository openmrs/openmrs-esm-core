import React from "react";
import {
  DynamicOfflineDataSyncState,
  getDynamicOfflineDataHandlers,
  navigate,
} from "@openmrs/esm-framework";
import { useTranslation } from "react-i18next";
import PendingFilled16 from "@carbon/icons-react/es/pending--filled/16";
import WarningAltFilled16 from "@carbon/icons-react/es/warning--alt--filled/16";
import CheckmarkOutline16 from "@carbon/icons-react/es/checkmark--outline/16";
import styles from "./last-updated-table-cell.scss";
import { Link } from "carbon-components-react";

export interface LastUpdatedTableCellProps {
  patientUuid: string;
  isSyncing: boolean;
  lastSyncState?: DynamicOfflineDataSyncState;
}

const LastUpdatedTableCell: React.FC<LastUpdatedTableCellProps> = ({
  patientUuid,
  isSyncing,
  lastSyncState,
}) => {
  const { t } = useTranslation();

  const InnerContent = () => {
    if (isSyncing) {
      return (
        <>
          <PendingFilled16 className={styles.pendingIcon} />
          {t("offlinePatientsTableLastUpdatedDownloading", "Downloading...")}
        </>
      );
    }

    if (!lastSyncState) {
      return (
        <>
          <WarningAltFilled16 className={styles.errorIcon} />
          {t(
            "offlinePatientsTableLastUpdatedNotYetSynchronized",
            "Not synchronized"
          )}
        </>
      );
    }

    if (hasNewUnknownHandlers(lastSyncState)) {
      return (
        <>
          <WarningAltFilled16 className={styles.errorIcon} />
          {t("offlinePatientsTableLastUpdatedOutdatedData", "Outdated data")}
        </>
      );
    }

    if (lastSyncState.erroredHandlers.length > 0) {
      return (
        <>
          <WarningAltFilled16 className={styles.errorIcon} />
          <Link
            onClick={() =>
              navigate({
                to: `${window.getOpenmrsSpaBase()}offline-tools/patients/${patientUuid}/offline-data`,
              })
            }
          >
            {lastSyncState.erroredHandlers.length}{" "}
            {lastSyncState.erroredHandlers.length === 1
              ? t("offlinePatientsTableLastUpdatedError", "error")
              : t("offlinePatientsTableLastUpdatedErrors", "errors")}
          </Link>
        </>
      );
    }

    return (
      <>
        <CheckmarkOutline16 />
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
    .filter((handler) => handler.type === "patient")
    .map((handler) => handler.id);
  const lastSyncHandlers = [
    ...lastSyncState.succeededHandlers,
    ...lastSyncState.erroredHandlers,
  ];

  return currentHandlers.some((id) => !lastSyncHandlers.includes(id));
}

export default LastUpdatedTableCell;
