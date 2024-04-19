import React, { useEffect } from 'react';
import {
  canCloseWorkspaceWithoutPrompting,
  cancelPrompt,
  changeWorkspaceContext,
  closeAllWorkspaces,
  getWorkspaceStore,
  resetWorkspaceStore,
  useWorkspaces,
} from '../workspaces';
import { Button, ComposedModal, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import styles from './workspace-notification.module.scss';
import { navigate } from '@openmrs/esm-framework';

export interface WorkspaceNotificationProps {
  contextKey: string;
}

export function WorkspaceNotification({ contextKey }: WorkspaceNotificationProps) {
  const { t } = useTranslation();
  const { prompt } = useWorkspaces();

  useEffect(() => {
    changeWorkspaceContext(contextKey);
    return () => {
      changeWorkspaceContext(null);
    };
  }, [contextKey]);

  // If we navigate away from the current context, we need to prompt if there are
  // unsaved changes.
  useEffect(() => {
    const handleRouting = (event) => {
      const {
        detail: { cancelNavigation, newUrl },
      } = event as { detail: { cancelNavigation: () => void; newUrl: string } };

      // Check if the new URL matches the current context.
      const regex = new RegExp(`\/${contextKey}(?:\/\w+)?$`);
      const isSameContextUrl = regex.test(newUrl);
      const canCloseAllWorkspaces = getWorkspaceStore()
        .getState()
        .openWorkspaces.every(({ name }) => {
          const canCloseWorkspace = canCloseWorkspaceWithoutPrompting(name);
          return canCloseWorkspace;
        });

      if (!isSameContextUrl) {
        if (!canCloseAllWorkspaces) {
          cancelNavigation();
          const navigateToNewUrl = () => {
            function getUrlWithoutPrefix(url: string) {
              return url.split(window['getOpenmrsSpaBase']())?.[1];
            }
            navigate({ to: `\${openmrsSpaBase}/${getUrlWithoutPrefix(newUrl)}` });
          };

          closeAllWorkspaces(navigateToNewUrl);
        } else {
          resetWorkspaceStore();
        }
      }
    };
    window.addEventListener('single-spa:before-routing-event', handleRouting);

    return () => {
      window.removeEventListener('single-spa:before-routing-event', handleRouting);
    };
  }, []);

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
}
