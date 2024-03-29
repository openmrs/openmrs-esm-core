import React from 'react';
import { cancelPrompt, useWorkspaces } from '../workspaces';
import { Button, ComposedModal, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import styles from './workspace-notification.scss';

const WorkspaceNotification: React.FC = () => {
  const { t } = useTranslation();
  const { prompt } = useWorkspaces();

  return prompt != null ? (
    <ComposedModal open={true} onClose={cancelPrompt}>
      <ModalHeader title={prompt.title}></ModalHeader>
      <ModalBody>
        <p className={styles.messageBody}>{prompt.body}</p>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={cancelPrompt}>
          {prompt.cancelText ?? t('cancel', 'Cancel')}
        </Button>
        <Button kind="danger" onClick={prompt.onConfirm}>
          {prompt.confirmText ?? t('confirm', 'Confirm')}
        </Button>
      </ModalFooter>
    </ComposedModal>
  ) : null;
};

export default WorkspaceNotification;
