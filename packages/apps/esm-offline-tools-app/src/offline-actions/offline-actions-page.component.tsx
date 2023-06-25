import React from "react";
import {
  getOfflineSynchronizationStore,
  isDesktop,
  runSynchronization,
  useConnectivity,
  useLayoutType,
  useStore,
} from "@openmrs/esm-framework/src/internal";
import { Button } from "@carbon/react";
import { Renew } from "@carbon/react/icons";
import { useTranslation } from "react-i18next";
import { usePendingSyncItems } from "../hooks/offline-actions";
import SharedPageLayout from "../components/shared-page-layout.component";
import OfflineActions from "./offline-actions.component";
import styles from "./offline-actions-page.styles.scss";

const OfflineActionsPage: React.FC = () => {
  const { t } = useTranslation();
  const canSynchronizeOfflineActions = useConnectivity();
  const layout = useLayoutType();
  const syncStore = useStore(getOfflineSynchronizationStore());
  const { mutate: mutatePendingSyncItems } = usePendingSyncItems();
  const isSynchronizing = !!syncStore.synchronization;

  const synchronize = () =>
    runSynchronization().finally(() => mutatePendingSyncItems());

  const primaryActions = (
    <Button
      className={styles.primaryActionButton}
      size={isDesktop(layout) ? "sm" : undefined}
      renderIcon={(props) =>
        isDesktop(layout) && <Renew size={16} {...props} />
      }
      disabled={isSynchronizing}
      onClick={synchronize}
    >
      {!isDesktop(layout) && (
        <Renew size={16} className={styles.buttonInlineIcon} />
      )}
      {t("offlineActionsUpdateOfflinePatients", "Update offline patients")}
    </Button>
  );

  return (
    <SharedPageLayout
      header={t("offlineActionsHeader", "Offline actions")}
      primaryActions={canSynchronizeOfflineActions ? primaryActions : undefined}
    >
      <div className={styles.contentContainer}>
        <OfflineActions />
      </div>
    </SharedPageLayout>
  );
};

export default OfflineActionsPage;
