/** @module @category Workspace */
import React, { useEffect } from 'react';
import { Button, ComposedModal, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import { escapeRegExp } from 'lodash-es';
import { navigate } from '@openmrs/esm-navigation';
import { reportError } from '@openmrs/esm-error-handling';
import { getCoreTranslation } from '@openmrs/esm-translations';
import { type SingleSpaCustomEventDetail } from 'single-spa';
import {
  cancelPrompt,
  canCloseWorkspaceWithoutPrompting,
  changeWorkspaceContext,
  closeAllWorkspaces,
  getWorkspaceStore,
  resetWorkspaceStore,
  useWorkspaces,
} from '../workspaces';
import styles from './workspace-notification.module.scss';

export interface WorkspaceNotificationProps {
  contextKey: string;
}

export function WorkspaceNotification({ contextKey }: WorkspaceNotificationProps) {
  const { prompt } = useWorkspaces();

  useEffect(() => {
    // When the component initially mounts, check that it has been provided a valid context key.
    // I can't think of a reason the component would mount with a valid context key but not matching the URL.
    const regex = new RegExp(`\/${escapeRegExp(contextKey)}(\/|$)`);
    const isValidContextKey = regex.test(window.location.pathname);
    if (!isValidContextKey) {
      reportError(
        `WorkspaceContainer has provided an invalid context key: "${contextKey}". The context key must be part of the URL path, with no initial or trailing slash.`,
      );
    }
  }, []);

  useEffect(() => {
    changeWorkspaceContext(contextKey);
    return () => {
      changeWorkspaceContext(null);
    };
  }, [contextKey]);

  // If we navigate away from the current context, we need to prompt if there are
  // unsaved changes.
  useEffect(() => {
    const handleRouting = (event: Event & { detail: SingleSpaCustomEventDetail }) => {
      const {
        detail: { cancelNavigation, newUrl },
      } = event;

      // Check if the new URL matches the current context.
      const regex = new RegExp(`\/${escapeRegExp(contextKey)}(\/|$)`);
      const url = new URL(newUrl);
      const isSameContextUrl = regex.test(url.pathname);
      const canCloseAllWorkspaces = getWorkspaceStore()
        .getState()
        .openWorkspaces.every(({ name }) => {
          const canCloseWorkspace = canCloseWorkspaceWithoutPrompting(name);
          return canCloseWorkspace;
        });

      if (!isSameContextUrl) {
        if (!canCloseAllWorkspaces) {
          cancelNavigation?.();
          const navigateToNewUrl = () => {
            navigate({ to: newUrl });
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
          {prompt.cancelText ?? getCoreTranslation('cancel')}
        </Button>
        <Button kind="danger" onClick={prompt.onConfirm}>
          {prompt.confirmText ?? getCoreTranslation('confirm')}
        </Button>
      </ModalFooter>
    </ComposedModal>
  ) : null;
}
