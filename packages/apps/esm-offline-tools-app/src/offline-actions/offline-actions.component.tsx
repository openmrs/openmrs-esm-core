import {
  deleteSynchronizationItem,
  getOfflineSynchronizationStore,
  runSynchronization,
  showModal,
  SyncItem,
  useLayoutType,
  useStore,
} from "@openmrs/esm-framework";
import React from "react";
import { useTranslation } from "react-i18next";
import SharedPageLayout from "../components/shared-page-layout.component";
import OfflineActionsTable from "./offline-actions-table.component";
import styles from "./offline-actions.styles.scss";
import Renew16 from "@carbon/icons-react/es/renew/16";
import { Button, Tabs, Tab } from "carbon-components-react";
import {
  usePendingSyncItems,
  useSyncItemPatients,
} from "../hooks/offline-actions";
import NoActionsEmptyState from "./no-actions-empty-state.component";

export interface OfflineActionsProps {
  canSynchronizeOfflineActions: boolean;
}

const OfflineActions: React.FC<OfflineActionsProps> = ({
  canSynchronizeOfflineActions,
}) => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const syncStore = useStore(getOfflineSynchronizationStore());
  const { data: syncItems, mutate } = usePendingSyncItems();
  const { data: syncItemPatients } = useSyncItemPatients(syncItems);
  const isLoading = !syncItems || !syncItemPatients;
  const isSynchronizing = !!syncStore.synchronization;

  const synchronize = () => runSynchronization().finally(() => mutate());
  const deleteSynchronizationItems = async (ids: Array<number>) => {
    const closeModal = showModal("offline-tools-confirmation-modal", {
      title: t(
        "offlineActionsDeleteConfirmationModalTitle",
        "Delete offline actions"
      ),
      children: t(
        "offlineActionsDeleteConfirmationModalContent",
        "Are you sure that you want to delete all selected offline actions? This cannot be undone!"
      ),
      confirmText: t(
        "offlineActionsDeleteConfirmationModalConfirm",
        "Delete forever"
      ),
      cancelText: t("offlineActionsDeleteConfirmationModalCancel", "Cancel"),
      closeModal: () => closeModal(),
      onConfirm: async () => {
        await Promise.allSettled(
          ids.map((id) => deleteSynchronizationItem(id))
        );
        mutate();
      },
    });
  };

  const primaryActions = (
    <Button
      className={styles.primaryActionButton}
      size={layout === "desktop" ? "sm" : undefined}
      renderIcon={layout === "desktop" ? Renew16 : undefined}
      disabled={isSynchronizing}
      onClick={synchronize}
    >
      {layout !== "desktop" && <Renew16 className={styles.buttonInlineIcon} />}
      {t("offlineActionsUpdateOfflinePatients", "Update offline patients")}
    </Button>
  );

  return (
    <SharedPageLayout
      header={t("offlineActionsHeader", "Offline actions")}
      primaryActions={canSynchronizeOfflineActions ? primaryActions : undefined}
    >
      <div className={styles.contentContainer}>
        {isLoading || syncItems?.length > 0 ? (
          <OfflineActionsTable
            isLoading={isLoading}
            data={getSyncItemsWithPatient(syncItems, syncItemPatients)}
            disableEditing={isSynchronizing}
            disableDelete={false}
            onDelete={deleteSynchronizationItems}
          />
        ) : (
          <NoActionsEmptyState />
        )}
      </div>
    </SharedPageLayout>
  );
};

function getSyncItemsWithPatient(
  syncItems: Array<SyncItem> = [],
  patients: Array<fhir.Patient> = []
) {
  return syncItems.map((item) => ({
    item,
    patient: patients.find(
      (patient) => patient.id === item.descriptor?.patientUuid
    ),
  }));
}

export default OfflineActions;
