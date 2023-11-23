import React, { useCallback, useEffect, useState } from "react";
import {
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  ProgressBar,
} from "@carbon/react";
import { useTranslation } from "react-i18next";
import { showToast } from "@openmrs/esm-framework";

export interface OfflineActionsProgressModalProps {
  items?: Array<any>;
  closeModal: (active: boolean) => void;
}

const OfflineReadyModal: React.FC<OfflineActionsProgressModalProps> = ({
  closeModal,
  items,
}) => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [abortController, setAbortController] = useState(
    () => new AbortController()
  );

  async function runAsyncFunctionsInParallel(asyncFunctions) {
    const totalFunctions = asyncFunctions.length;

    if (totalFunctions === 0) {
      console.warn("No tasks to run.");
      setProgress(100);
      return;
    }

    let completedFunctions = 0;

    const promises = asyncFunctions.map(async (asyncFunction) => {
      await asyncFunction(abortController);
      completedFunctions++;
      const progress = (completedFunctions / totalFunctions) * 100;
      setProgress(progress);
    });

    await Promise.all(promises);

    console.warn("All tasks completed!");
  }

  useEffect(() => {
    runAsyncFunctionsInParallel(items || []);
  }, [abortController, items]);

  const handleClose = useCallback(() => {
    if (progress < 100) {
      abortController.abort();

      showToast({
        critical: true,
        kind: "warning",
        description: t(
          "unavailableOfflineFeatures",
          "Some features may not be available offline."
        ),
        title: t("offlinePreparationCanceled", "Offline preparation canceled"),
      });
      closeModal(false);
    } else {
      showToast({
        critical: true,
        kind: "success",
        description: t("offlineModeIsReady", "Offline mode is ready"),
        title: t("offline", "Offline"),
      });
      closeModal(true);
    }
  }, [abortController, closeModal, progress, t]);

  return (
    <>
      <ModalHeader
        title={t("preparingOfflineMode", "Preparing for offline mode")}
        closeModal={handleClose}
      />
      <ModalBody>
        <ProgressBar
          id="progress-bar"
          value={progress}
          status={progress === 100 ? "finished" : "active"}
          max={100}
          label={t("progressBarLabel", "{progress}% Complete", {
            progress: Math.round(progress),
          })}
        />
      </ModalBody>
      <ModalFooter>
        <Button kind="danger" onClick={handleClose} disabled={progress === 100}>
          {t("cancel", "Cancel")}
        </Button>
        <Button
          kind="primary"
          onClick={handleClose}
          disabled={progress !== 100}
        >
          {t("confirm", "Confirm")}
        </Button>
      </ModalFooter>
    </>
  );
};

export default OfflineReadyModal;
