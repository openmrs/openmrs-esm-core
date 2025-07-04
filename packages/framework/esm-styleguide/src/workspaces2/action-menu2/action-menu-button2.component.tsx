/** @module @category Workspace */
import React from 'react';
import classNames from 'classnames';
import { Button, IconButton } from '@carbon/react';
import { useLayoutType } from '@openmrs/esm-react-utils';
import styles from './action-menu-button2.module.scss';
import { launchWorkspace2, useWorkspace2Store } from '../workspace2';

interface TagsProps {
  getIcon: (props: object) => JSX.Element;
  formOpenInTheBackground: boolean;
  tagContent?: string | React.ReactNode;
}

function Tags({ getIcon, formOpenInTheBackground, tagContent }: TagsProps) {
  return (
    <>
      {getIcon({ size: 16 })}

      {formOpenInTheBackground ? (
        <span className={styles.interruptedTag}>!</span>
      ) : (
        <span className={styles.countTag}>{tagContent}</span>
      )}
    </>
  );
}

export interface ActionMenuButtonProps2 {
  icon: (props: object) => JSX.Element;
  label: string;
  tagContent?: string | React.ReactNode;
  windowName: string;
  workspaceToLaunch: {
    workspaceName: string;
    groupProps: Record<string, any>;
    windowProps: Record<string, any>;
  }
}

export const ActionMenuButton2: React.FC<ActionMenuButtonProps2> = ({
  icon: getIcon,
  label,
  tagContent,
  windowName,
  workspaceToLaunch
}) => {
  const layout = useLayoutType();
  const { openedWindows, restoreWindow } = useWorkspace2Store();
  const window = openedWindows.find((w) => w.windowName === windowName);
  const isWindowOpened = window != null;
  const isWindowHidden = window?.hidden ?? false;
  const isMostRecentlyOpened = openedWindows[openedWindows.length - 1]?.windowName === windowName;

  const onClick = () => {
    if(isWindowOpened) {
      if(isWindowHidden || !isMostRecentlyOpened) {
        restoreWindow(window.windowName)
      }
    } else {
      const {workspaceName, groupProps, windowProps} = workspaceToLaunch;
      launchWorkspace2(workspaceName, groupProps, windowProps);
    }
  }

  if (layout === 'tablet' || layout === 'phone') {
    return (
      <Button
        className={classNames(styles.container, { [styles.active]: isWindowOpened })}
        iconDescription={label}
        kind="ghost"
        onClick={onClick}
        role="button"
        tabIndex={0}
        size="md"
      >
        <span className={styles.elementContainer}>
          <Tags formOpenInTheBackground={isWindowHidden} getIcon={getIcon} tagContent={tagContent} />
        </span>
        <span>{label}</span>
      </Button>
    );
  }

  return (
    <IconButton
      align="left"
      aria-label={label}
      className={classNames(styles.container, {
        [styles.active]: isWindowOpened,
      })}
      enterDelayMs={300}
      kind="ghost"
      label={label}
      onClick={onClick}
      size="md"
    >
      <div className={styles.elementContainer}>
        <Tags formOpenInTheBackground={isWindowHidden} getIcon={getIcon} tagContent={tagContent} />
      </div>
    </IconButton>
  );
};
