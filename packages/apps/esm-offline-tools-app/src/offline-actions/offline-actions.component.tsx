import {
  getOfflineSynchronizationStore,
  queueSynchronizationItem,
  runSynchronization,
  SyncItem,
  useLayoutType,
  useStore,
} from "@openmrs/esm-framework";
import React from "react";
import { useTranslation } from "react-i18next";
import SharedPageLayout from "../components/shared-page-layout.component";
import OfflineActionsTable from "./offline-actions-table.component";
import styles from "./offline-actions.styles.scss";
import Renew16 from "@carbon/icons-react/lib/renew/16";
import { Button, Tabs, Tab } from "carbon-components-react";
import {
  usePendingSyncItems,
  useSyncItemPatients,
} from "../hooks/offline-actions";

const OfflineActions: React.FC = () => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const syncStore = useStore(getOfflineSynchronizationStore());
  const {
    data: syncItems,
    isValidating: isValidatingSyncItems,
    mutate,
  } = usePendingSyncItems();
  const { data: syncItemPatients, isValidating: isValidatingSyncItemPatients } =
    useSyncItemPatients(syncItems);
  const isSynchronizing = !!syncStore.synchronization;

  const synchronize = () => runSynchronization().finally(() => mutate());

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
      primaryActions={primaryActions}
    >
      <button
        onClick={() => {
          queueSynchronizationItem("test", "test-content", {
            displayName: "Test Display Name",
            patientUuid: "87d02366-ef24-4bf0-a8a9-23e55d87f703",
          });
        }}
      >
        Queue
      </button>
      <div className={styles.contentContainer}>
        <Tabs type="container">
          <Tab label={t("offineActionsPendingTab", "Pending")}>
            <OfflineActionsTable
              isLoading={isValidatingSyncItems || isValidatingSyncItemPatients}
              isEditable={!isSynchronizing}
              data={getSyncItemsWithPatient(syncItems, syncItemPatients)}
            />
          </Tab>
          <Tab label={t("offlineActionsUploadedTab", "Uploaded")}></Tab>
        </Tabs>
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
