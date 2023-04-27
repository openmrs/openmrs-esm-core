import React, { useEffect, useState } from "react";
import {
  getOfflineSynchronizationStore,
  OfflineSynchronizationStore,
  showNotification,
  useStore,
} from "@openmrs/esm-framework/src/internal";
import { getI18n, useTranslation } from "react-i18next";
import { Loading, NotificationActionButton } from "@carbon/react";
import styles from "./synchronizing-notification.styles.scss";

let showNewModalOnNextSynchronization = true;
let currentSynchronizationIndex = 0;

export function setupSynchronizingOfflineActionsNotifications() {
  const store = getOfflineSynchronizationStore();
  const onChange = (state: OfflineSynchronizationStore) => {
    if (!state.synchronization) {
      showNewModalOnNextSynchronization = true;
    }

    if (showNewModalOnNextSynchronization && state.synchronization) {
      showNewModalOnNextSynchronization = false;
      currentSynchronizationIndex++;

      showNotification({
        title: getI18n().t(
          "offlineActionsSynchronizationNotificationTitle",
          "Upload"
        ),
        description: (
          <SynchronizingNotification
            mySynchronizationIndex={currentSynchronizationIndex}
          />
        ),
        action: (
          <CancelSynchronizationAction
            mySynchronizationIndex={currentSynchronizationIndex}
          />
        ),
      });
    }
  };

  return store.subscribe(onChange);
}

function SynchronizingNotification({ mySynchronizationIndex }) {
  const { t } = useTranslation();
  const synchronization = useMySynchronization(mySynchronizationIndex);
  const isCanceled = useIsSyncCanceled(synchronization);

  if (!synchronization) {
    return (
      <>
        {t(
          "offlineActionsSynchronizationNotificationSynchronized",
          "The offline action synchronization has finished."
        )}
      </>
    );
  }

  return (
    <div className={styles.notificationLoadingContainer}>
      {isCanceled
        ? t(
            "offlineActionsSynchronizationNotificationCanceling",
            "Canceling..."
          )
        : t(
            "offlineActionsSynchronizationNotificationStatus",
            "{current} / {total} actions",
            {
              current:
                synchronization.totalCount - synchronization.pendingCount,
              total: synchronization.totalCount,
            }
          )}
      <Loading small withOverlay={false} />
    </div>
  );
}

function CancelSynchronizationAction({ mySynchronizationIndex }) {
  const { t } = useTranslation();
  const synchronization = useMySynchronization(mySynchronizationIndex);
  const isCanceled = useIsSyncCanceled(synchronization);

  if (!synchronization) {
    return null;
  }

  return (
    <NotificationActionButton
      onClick={() => synchronization?.abortController.abort()}
      disabled={isCanceled}
    >
      {t(
        "offlineActionsSynchronizationNotificationCancelUpload",
        "Cancel upload"
      )}
    </NotificationActionButton>
  );
}

function useMySynchronization(mySynchronizationIndex: number) {
  const store = useStore(getOfflineSynchronizationStore());
  return mySynchronizationIndex === currentSynchronizationIndex
    ? store.synchronization
    : undefined;
}

function useIsSyncCanceled(
  synchronization?: OfflineSynchronizationStore["synchronization"]
) {
  const abortController = synchronization?.abortController;
  const [isCanceled, setIsCanceled] = useState(
    abortController?.signal.aborted ?? false
  );

  useEffect(() => {
    const onAborted = () => setIsCanceled(true);
    abortController?.signal.addEventListener("abort", onAborted);
    return () =>
      abortController?.signal.removeEventListener("abort", onAborted);
  }, [abortController]);

  return isCanceled;
}
