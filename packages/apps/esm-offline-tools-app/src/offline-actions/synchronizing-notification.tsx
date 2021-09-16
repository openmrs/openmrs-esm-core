import React from "react";
import {
  getOfflineSynchronizationStore,
  OfflineSynchronizationStore,
  showNotification,
  useStore,
} from "@openmrs/esm-framework";
import { useTranslation } from "react-i18next";
import { NotificationActionButton } from "carbon-components-react";

export function setupSynchronizingOfflineActionsNotifications() {
  let isNew = true;
  const store = getOfflineSynchronizationStore();
  const onChange = (state: OfflineSynchronizationStore) => {
    if (!state.synchronization) {
      isNew = true;
    }

    if (isNew && state.synchronization) {
      isNew = false;
      showNotification({
        description: <SynchronizingNotification />,
        // action: (
        //   <NotificationActionButton>Cancel upload</NotificationActionButton>
        // ),
      });
    }
  };

  store.subscribe(onChange);
  return () => store.unsubscribe(onChange);
}

function SynchronizingNotification() {
  const { t } = useTranslation();
  const store = useStore(getOfflineSynchronizationStore());

  if (!store.synchronization) {
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
    <>{t("offlineActionsSynchronizationNotificationUploading", "Uploading")}</>
  );
}
