import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { CloseIcon } from '@openmrs/esm-framework/src/internal';
import { implementerToolsStore } from '../store';
import styles from './exit-ui-editor-button.scss';

interface ExitUiEditorButtonProps {
  /** Sits on the top edge of the implementer tools' panel rather than in the viewport's corner. */
  isDocked?: boolean;
}

/** Turns the UI editor off. */
export function ExitUiEditorButton({ isDocked }: ExitUiEditorButtonProps) {
  const { t } = useTranslation();

  return (
    <Button
      className={classNames(styles.exitButton, isDocked ? styles.docked : styles.floating)}
      data-openmrs-ui-editor-exit={isDocked ? 'docked' : 'floating'}
      kind="danger"
      onClick={() => implementerToolsStore.setState({ isUIEditorEnabled: false })}
      renderIcon={(props) => <CloseIcon {...props} size={16} />}
      size="sm"
    >
      {t('exitUIEditor', 'Exit UI Editor')}
    </Button>
  );
}
