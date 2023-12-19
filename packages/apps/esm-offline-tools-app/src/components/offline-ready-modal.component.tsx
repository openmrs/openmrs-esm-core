import React, { useCallback, useEffect, useState } from 'react';
import { ModalBody, ModalFooter, ModalHeader, Button, InlineLoading } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { getCurrentOfflineMode, showToast } from '@openmrs/esm-framework';

export interface OfflineActionsProgressModalProps {
  items?: Array<any>;
  closeModal: (active: boolean) => void;
}

const OfflineReadyModal: React.FC<OfflineActionsProgressModalProps> = ({ closeModal, items }) => {
  const { t } = useTranslation();
  const [isRunning, setIsRunning] = useState(true);
  const [abortController, setAbortController] = useState(() => new AbortController());

  async function dispatchOfflineEvent() {
    window.dispatchEvent(
      new CustomEvent(`openmrs:offline-enabled`, {
        detail: getCurrentOfflineMode(),
      }),
    );

    setIsRunning(false);
  }

  useEffect(() => {
    dispatchOfflineEvent();
  }, [abortController, items]);

  const handleClose = useCallback(() => {
    if (isRunning) {
      abortController.abort();

      showToast({
        critical: true,
        kind: 'warning',
        description: t('unavailableOfflineFeatures', 'Some features may not be available offline.'),
        title: t('offlinePreparationCanceled', 'Offline preparation canceled'),
      });
      closeModal(false);
    } else {
      showToast({
        critical: true,
        kind: 'success',
        description: t('offlineModeIsReady', 'Offline mode is ready'),
        title: t('offline', 'Offline'),
      });
      closeModal(true);
    }
  }, [abortController, closeModal, isRunning, t]);

  return (
    <>
      <ModalHeader title={t('preparingOfflineMode', 'Preparing for offline mode')} closeModal={handleClose} />
      <ModalBody>
        {isRunning && (
          <InlineLoading
            // className={styles.loader}
            description={t('loading', 'Loading') + '...'}
          />
        )}
      </ModalBody>
      <ModalFooter>
        <Button kind="danger" onClick={handleClose} disabled={!isRunning}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button kind="primary" onClick={handleClose} disabled={isRunning}>
          {t('confirm', 'Confirm')}
        </Button>
      </ModalFooter>
    </>
  );
};

export default OfflineReadyModal;
