import React, { useEffect, useState } from 'react';
import { getI18n, useTranslation } from 'react-i18next';
import type { OfflineSynchronizationStore } from '@openmrs/esm-framework/src/internal';
import { getOfflineSynchronizationStore, showNotification, useStore } from '@openmrs/esm-framework/src/internal';

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

      let activeSynchronizationIndex = currentSynchronizationIndex;
      showNotification({
        title: getI18n().t('offlineActionsSynchronizationNotificationTitle', 'Upload'),
        description: SynchronizingNotification({ mySynchronizationIndex: { activeSynchronizationIndex } }),
        action: CancelSynchronizationAction({ mySynchronizationIndex: { activeSynchronizationIndex } }),
        onAction: () => {
          const state = getOfflineSynchronizationStore().getState();
          if (activeSynchronizationIndex === currentSynchronizationIndex) {
            state.synchronization?.abortController.abort();
          }
        },
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
    return t(
      'offlineActionsSynchronizationNotificationSynchronized',
      'The offline action synchronization has finished.',
    );
  }

  return isCanceled
    ? t('offlineActionsSynchronizationNotificationCanceling', 'Canceling...')
    : t('offlineActionsSynchronizationNotificationStatus', '{{current}} / {{total}} actions', {
        current: synchronization.totalCount - synchronization.pendingCount,
        total: synchronization.totalCount,
      });
}

function CancelSynchronizationAction({ mySynchronizationIndex }) {
  const { t } = useTranslation();
  const synchronization = useMySynchronization(mySynchronizationIndex);

  if (!synchronization) {
    return null;
  }

  return t('offlineActionsSynchronizationNotificationCancelUpload', 'Cancel upload');
}

function useMySynchronization(mySynchronizationIndex: number) {
  const store = useStore(getOfflineSynchronizationStore());
  return mySynchronizationIndex === currentSynchronizationIndex ? store.synchronization : undefined;
}

function useIsSyncCanceled(synchronization?: OfflineSynchronizationStore['synchronization']) {
  const abortController = synchronization?.abortController;
  const [isCanceled, setIsCanceled] = useState(abortController?.signal.aborted ?? false);

  useEffect(() => {
    const onAborted = () => setIsCanceled(true);
    abortController?.signal.addEventListener('abort', onAborted);
    return () => abortController?.signal.removeEventListener('abort', onAborted);
  }, [abortController]);

  return isCanceled;
}
