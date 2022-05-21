import React from "react";
import {
  getOfflineSynchronizationStore,
  runSynchronization,
  useLayoutType,
  useStore,
} from "@openmrs/esm-framework/src/internal";
import { Button } from "@carbon/react";
import { useTranslation } from "react-i18next";
import SharedPageLayout from "../components/shared-page-layout.component";
import styles from "./offline-actions-page.styles.scss";
import { Renew } from "@carbon/icons-react";
import OfflineActions from "./offline-actions.component";
import { usePendingSyncItems } from "../hooks/offline-actions";

export interface OfflineActionsPageProps {
  canSynchronizeOfflineActions: boolean;
}

const OfflineActionsPage: React.FC<OfflineActionsPageProps> = ({
  canSynchronizeOfflineActions,
}) => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const syncStore = useStore(getOfflineSynchronizationStore());
  const { mutate: mutatePendingSyncItems } = usePendingSyncItems();
  const isSynchronizing = !!syncStore.synchronization;

  const synchronize = () =>
    runSynchronization().finally(() => mutatePendingSyncItems());

  const primaryActions = (
    <Button
      className={styles.primaryActionButton}
      size={layout === "desktop" ? "sm" : undefined}
      renderIcon={(props) =>
        layout === "desktop" && <Renew size={16} {...props} />
      }
      disabled={isSynchronizing}
      onClick={synchronize}
    >
      {layout !== "desktop" && (
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
