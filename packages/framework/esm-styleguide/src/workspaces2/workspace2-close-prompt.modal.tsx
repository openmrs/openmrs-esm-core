import React from 'react';
import { Trans } from 'react-i18next';
import { ModalHeader, ModalBody, ModalFooter, Button } from '@carbon/react';
import { getCoreTranslation } from '@openmrs/esm-translations';
import styles from './workspace2-close-prompt.module.scss';

interface WorkspaceUnsavedChangesModal {
  onConfirm: () => void;
  onCancel: () => void;
  affectedWorkspaceTitles: string[];
}

/**
 * This modal is used for prompting user to confirm closing currently opened workspace.
 */
const Workspace2ClosePromptModal: React.FC<WorkspaceUnsavedChangesModal> = ({
  onConfirm,
  onCancel,
  affectedWorkspaceTitles,
}) => {
  return (
    <>
      <ModalHeader closeModal={onCancel} title={getCoreTranslation('discardUnsavedChangesPromptTitle')} />
      <ModalBody>
        {affectedWorkspaceTitles.length === 1 ? (
          <p>
            <Trans
              ns="core"
              i18nKey="discardUnsavedChangesPromptBodySingle"
              defaults="<strong>{{workspaceTitle}}</strong> has unsaved changes. Closing it will discard them."
              values={{ workspaceTitle: affectedWorkspaceTitles[0] }}
              components={{ strong: <strong /> }}
            />
          </p>
        ) : (
          <>
            <p>
              {getCoreTranslation('discardUnsavedChangesPromptBodyMultiple', undefined, {
                count: affectedWorkspaceTitles.length,
              })}
            </p>
            <ul className={styles.workspaceList}>
              {affectedWorkspaceTitles.map((title, i) => (
                <li key={i}>
                  <strong>{title}</strong>
                </li>
              ))}
            </ul>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={onCancel}>
          {getCoreTranslation('keepEditing')}
        </Button>
        <Button kind="danger" onClick={onConfirm}>
          {getCoreTranslation('discardChanges', 'Discard changes')}
        </Button>
      </ModalFooter>
    </>
  );
};

export default Workspace2ClosePromptModal;
