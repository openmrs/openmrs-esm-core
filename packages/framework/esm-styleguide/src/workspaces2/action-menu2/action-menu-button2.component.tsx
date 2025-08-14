/** @module @category Workspace */
import React, { useContext } from 'react';
import classNames from 'classnames';
import { Button, IconButton } from '@carbon/react';
import { useLayoutType } from '@openmrs/esm-react-utils';
import { SingleSpaContext } from 'single-spa-react';
import { type OpenedWindow } from '@openmrs/esm-extensions';
import styles from './action-menu-button2.module.scss';
import { launchWorkspace2, useWorkspace2Store } from '../workspace2';

interface TagsProps {
  getIcon: (props: object) => JSX.Element;
  isWindowHidden: boolean;
  tagContent?: React.ReactNode;
}

function Tags({ getIcon, isWindowHidden: isWindowHidden, tagContent }: TagsProps) {
  return (
    <>
      {getIcon({ size: 16 })}

      {isWindowHidden ? (
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
  workspaceToLaunch: {
    workspaceName: string;
    workspaceProps?: Record<string, any>;
    windowProps?: Record<string, any>;
  };

  /**
   * An optional callback function to run before launching the workspace.
   * If provided, the workspace will only be launched if this function returns true.
   * This can be used to perform checks or prompt the user before launching the workspace.
   * Note that this function does not run if the action button's window is already opened;
   * it will just restore (unhide) the window.
   *
   */
  onBeforeWorkspaceLaunch?: () => Promise<boolean>;
}

/**
 * The ActionMenuButton2 component is used to render a button in the action menu of a workspace group.
 * The button is associated with a specific workspace window, defined in routes.json of the app with the button.
 * When one or more workspaces within the window are opened, the button will be highlighted.
 * If the window is hidden, either `tagContent` (if defined) or an exclamation mark will be displayed
 * on top of the icon.
 *
 * On clicked, The button either:
 * 1. restores the workspace window if it is opened and hidden; or
 * 2. launch a workspace from within that window, if the window is not opened.
 *
 */
export const ActionMenuButton2: React.FC<ActionMenuButtonProps2> = ({
  icon: getIcon,
  label,
  tagContent,
  workspaceToLaunch,
  onBeforeWorkspaceLaunch,
}) => {
  const layout = useLayoutType();
  const { openedWindows, restoreWindow } = useWorkspace2Store();

  // name of the window that the button is associated with
  const { windowName } = useContext(SingleSpaContext);

  // can be undefined if the window is not opened
  const window = openedWindows.find((w) => w.windowName === windowName);

  const isWindowOpened = window != null;
  const isWindowHidden = window?.hidden ?? false;
  const isFocused = isCurrentWindowFocused(openedWindows, window);

  const onClick = async () => {
    if (isWindowOpened) {
      if (!isFocused) {
        restoreWindow(window.windowName);
      }
    } else {
      const shouldLaunch = await (onBeforeWorkspaceLaunch?.() ?? true);
      if (shouldLaunch) {
        const { workspaceName, workspaceProps, windowProps } = workspaceToLaunch;
        launchWorkspace2(workspaceName, workspaceProps, windowProps);
      }
    }
  };

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
          <Tags isWindowHidden={isWindowHidden} getIcon={getIcon} tagContent={tagContent} />
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
        [styles.focused]: isFocused,
      })}
      enterDelayMs={300}
      kind="ghost"
      label={label}
      onClick={onClick}
      size="md"
    >
      <div className={styles.elementContainer}>
        <Tags isWindowHidden={isWindowHidden} getIcon={getIcon} tagContent={tagContent} />
      </div>
    </IconButton>
  );
};

function isCurrentWindowFocused(openedWindows: Array<OpenedWindow>, currentWindow: OpenedWindow | undefined): boolean {
  // openedWindows array is sorted with most recently opened window appearing last.
  // We check if the current window is the last one in the array that is not hidden.
  for (let i = openedWindows.length - 1; i >= 0; i--) {
    const win = openedWindows[i];
    if (!win.hidden) {
      return win.windowName === currentWindow?.windowName;
    }
  }
  return false;
}
