/** @module @category UI */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  userDismissible?: boolean;
  title: string;
}

export interface SnackbarMeta extends SnackbarDescriptor {
  id: number;
}

export type SnackbarType = 'error' | 'info' | 'info-square' | 'success' | 'warning' | 'warning-alt';

export const Snackbar: React.FC<SnackbarProps> = ({ snackbar, closeSnackbar }) => {
  const {
    actionButtonLabel,
    isLowContrast,
    kind,
    onActionButtonClick = () => {},
    progressActionLabel,
    subtitle,
    timeoutInMs,
    userDismissible,
    title,
    ...props
  } = snackbar;

  const [actionText, setActionText] = useState(actionButtonLabel || '');
  const [applyAnimation, setApplyAnimation] = useState(true);

  const [isClosing, setIsClosing] = useState(false);

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
    // Snackbar can auto clear after 5s if it's a success or if it's warning and not user dismissible
    const canAutoClear = kind === 'success' || (!userDismissible && (kind === 'warning' || kind === 'warning-alt'));

    if (timeoutInMs || canAutoClear) {
      const timeoutId = setTimeout(onCloseSnackbar, timeoutInMs || 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [timeoutInMs, userDismissible, kind, onCloseSnackbar]);

  useEffect(() => {
    setApplyAnimation(false);

    window.setTimeout(() => {
      setApplyAnimation(true);
    }, 0);
  }, []);

  return (
    <ActionableNotification
      actionButtonLabel={actionText}
      ariaLabel="Close snackbar"
      className={classnames(styles.slideIn, {
        [styles.animated]: applyAnimation,
        [styles.slideOut]: isClosing,
      })}
      inline
      kind={kind || 'info'}
      lowContrast={isLowContrast}
      onActionButtonClick={handleActionClick}
      onClose={closeSnackbar}
      statusIconDescription="Snackbar notification"
      subtitle={subtitle || ''}
      title={title}
      {...props}
    />
  );
};
