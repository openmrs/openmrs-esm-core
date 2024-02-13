/** @module @category UI */
import React, { useState, useEffect, useCallback } from 'react';
import { ActionableNotification } from '@carbon/react';
import classnames from 'classnames';
import styles from './snackbar.module.scss';

// Design documentation for Snackbars https://zeroheight.com/23a080e38/p/683580-notifications/t/468baf
export interface SnackbarProps {
  snackbar: SnackbarMeta;
  closeSnackbar(): void;
}

export interface SnackbarDescriptor {
  actionButtonLabel?: string;
  isLowContrast?: boolean;
  kind?: SnackbarType | string;
  onActionButtonClick?: () => void;
  progressActionLabel?: string;
  subtitle?: string;
  timeoutInMs?: number;
  autoClose?: boolean;
  title: string;
}

export interface SnackbarMeta extends SnackbarDescriptor {
  id: number;
}

export type SnackbarType = 'error' | 'info' | 'info-square' | 'success' | 'warning' | 'warning-alt';

export const Snackbar: React.FC<SnackbarProps> = ({ snackbar, closeSnackbar: removeSnackBarFromDom }) => {
  const {
    actionButtonLabel = '',
    kind = 'success',
    onActionButtonClick = () => {},
    isLowContrast = kind !== 'error',
    progressActionLabel,
    subtitle = '',
    timeoutInMs = 5000,
    autoClose = kind !== 'error',
    title,
    ...props
  } = snackbar;

  const [actionText, setActionText] = useState(actionButtonLabel);
  const [applyAnimation, setApplyAnimation] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const closeSnackbar = useCallback(() => {
    // This is to add a slide out animation before closing the snackbar
    // The animation lasts for 250ms, thus the timeout
    setTimeout(removeSnackBarFromDom, 250);
  }, [removeSnackBarFromDom]);

  const onCloseSnackbar = useCallback(() => {
    setIsClosing(true);
    closeSnackbar();
  }, [closeSnackbar]);

  const handleActionClick = () => {
    onActionButtonClick();
    onCloseSnackbar();
    progressActionLabel && setActionText(progressActionLabel);
  };

  useEffect(() => {
    if (autoClose) {
      const timeoutId = setTimeout(onCloseSnackbar, timeoutInMs);
      return () => clearTimeout(timeoutId);
    }
  }, [timeoutInMs, autoClose, onCloseSnackbar]);

  useEffect(() => {
    setApplyAnimation(false);

    window.setTimeout(() => {
      setApplyAnimation(true);
    }, 0);
  }, []);

  return (
    <ActionableNotification
      actionButtonLabel={actionText}
      aria-label="Close snackbar"
      className={classnames(styles.slideIn, {
        [styles.animated]: applyAnimation,
        [styles.slideOut]: isClosing,
      })}
      inline
      kind={kind}
      lowContrast={isLowContrast}
      onActionButtonClick={handleActionClick}
      onClose={closeSnackbar}
      statusIconDescription="Snackbar notification"
      subtitle={subtitle}
      title={title}
      {...props}
    />
  );
};
