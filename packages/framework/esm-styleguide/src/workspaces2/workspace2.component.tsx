import React, { useContext, useEffect, type ReactNode } from 'react';
import { Header, HeaderGlobalAction, HeaderGlobalBar, HeaderMenuButton, HeaderName } from '@carbon/react';
import { DownToBottom, Maximize, Minimize } from '@carbon/react/icons';
import { SingleSpaContext } from 'single-spa-react';
import { isDesktop, useLayoutType } from '@openmrs/esm-react-utils';
import { getOpenedWindowIndexByWorkspace } from '@openmrs/esm-extensions';
import { getCoreTranslation } from '@openmrs/esm-translations';
import classNames from 'classnames';
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from '../icons';
import styles from './workspace2.module.scss';
import { useWorkspace2Store } from './workspace2';
interface Workspace2Props {
  title: string;
  children: ReactNode;
  hasUnsavedChanges?: boolean;
}

/**
 * @experimental
 */
export interface Workspace2DefinitionProps<
  WorkspaceProps extends object = object,
  WindowProps extends object = object,
  GroupProps extends object = object,
> {
  /**
   * This function launches a child workspace. Unlike `launchWorkspace()`, this function is meant
   * to be called from the a workspace, and it does not allow passing (or changing)
   * the window props or group props
   * @param workspaceName
   * @param workspaceProps
   */
  launchChildWorkspace<Props extends object>(workspaceName: string, workspaceProps?: Props): void;

  /**
   * closes the current workspace, along with its children.
   * @param closeWindow If true, the workspace's window, along with all workspaces within it, will be closed as well
   * @param discardUnsavedChanges If true, the "unsaved changes" modal will be supressed, and the value of `hasUnsavedChanges` will be ignored. Use this when closing the workspace immediately after changes are saved.
   * @returns a Promise that resolves to true if the workspace is closed, false otherwise.
   */
  closeWorkspace(options?: { closeWindow?: boolean; discardUnsavedChanges?: boolean }): Promise<boolean>;

  workspaceProps: WorkspaceProps | null;
  windowProps: WindowProps | null;
  groupProps: GroupProps | null;
  workspaceName: string;
}

/**
 * @experimental
 */
export type Workspace2Definition<
  WorkspaceProps extends object,
  WindowProps extends object,
  GroupProps extends object,
> = React.FC<Workspace2DefinitionProps<WorkspaceProps, WindowProps, GroupProps>>;

/**
 * The Workspace2 component is used as a top-level container to render
 * its children as content within a workspace. When creating a workspace
 * component, `<Workspace2>` should be the top-level component returned,
 * wrapping all of the workspace content.
 * @experimental
 */
export const Workspace2: React.FC<Workspace2Props> = ({ title, children, hasUnsavedChanges = false }) => {
  const layout = useLayoutType();
  const {
    setWindowMaximized,
    hideWindow,
    setHasUnsavedChanges,
    openedWindows,
    openedGroup,
    registeredGroupsByName,
    registeredWindowsByName,
    registeredWorkspacesByName,
    workspaceTitleByWorkspaceName,
    setWorkspaceTitle,
  } = useWorkspace2Store();
  const { workspaceName, isRootWorkspace, isLeafWorkspace, closeWorkspace } = useContext(SingleSpaContext);

  const openedWindowIndex = getOpenedWindowIndexByWorkspace(workspaceName);

  const openedWindow = openedWindows[openedWindowIndex];
  const openedWorkspace = openedWindow?.openedWorkspaces.find((workspace) => workspace.workspaceName === workspaceName);

  useEffect(() => {
    if (openedWorkspace?.hasUnsavedChanges != hasUnsavedChanges) {
      setHasUnsavedChanges(workspaceName, hasUnsavedChanges ?? false);
    }
  }, [openedWorkspace, hasUnsavedChanges]);

  useEffect(() => {
    if (workspaceTitleByWorkspaceName[workspaceName] !== title) {
      setWorkspaceTitle(workspaceName, title);
    }
  }, [openedWorkspace, title]);

  if (openedWindowIndex < 0 || openedGroup == null || openedWorkspace == null) {
    // workspace window / group has likely just closed
    return null;
  }

  const group = registeredGroupsByName[openedGroup.groupName];
  if (!group) {
    throw new Error(`Cannot find registered workspace group ${openedGroup.groupName}`);
  }
  const workspaceDef = registeredWorkspacesByName[workspaceName];
  const windowName = workspaceDef.window;
  const windowDef = registeredWindowsByName[windowName];
  if (!windowDef) {
    throw new Error(`Cannot find registered workspace window ${windowName}`);
  }

  const { icon, canMaximize } = windowDef;
  const canHide = !!icon;
  const { maximized } = openedWindow;
  const width = windowDef?.width ?? 'narrow';

  const isActionMenuOpened = Object.values(registeredWindowsByName).some(
    (window) => window.group === openedGroup.groupName && window.icon !== undefined,
  );

  return (
    <div
      className={classNames(styles.workspaceOuterContainer, {
        [styles.narrowWorkspace]: width === 'narrow',
        [styles.widerWorkspace]: width === 'wider',
        [styles.extraWideWorkspace]: width === 'extra-wide',
        [styles.isActionMenuOpened]: isActionMenuOpened,
      })}
    >
      <div
        className={classNames(styles.workspaceSpacer, {
          [styles.hidden]: openedWindow.hidden,
        })}
      />
      <div
        className={classNames(styles.workspaceMiddleContainer, {
          [styles.maximized]: maximized,
          [styles.hidden]: openedWindow.hidden,
        })}
      >
        <div
          className={classNames(styles.workspaceInnerContainer, {
            [styles.maximized]: maximized,
            [styles.hidden]: openedWindow.hidden,
            [styles.isRootWorkspace]: isRootWorkspace,
          })}
        >
          {isLeafWorkspace && (
            <>
              <Header aria-label={getCoreTranslation('workspaceHeader')} className={styles.header}>
                <HeaderName prefix="">{title}</HeaderName>
                <div className={styles.overlayHeaderSpacer} />
                <HeaderGlobalBar className={styles.headerButtons}>
                  {isDesktop(layout) ? (
                    <>
                      {(canMaximize || maximized) && (
                        <HeaderGlobalAction
                          aria-label={maximized ? getCoreTranslation('minimize') : getCoreTranslation('maximize')}
                          onClick={() => setWindowMaximized(windowName, !maximized)}
                        >
                          {maximized ? <Minimize /> : <Maximize />}
                        </HeaderGlobalAction>
                      )}
                      {canHide ? (
                        <HeaderGlobalAction
                          aria-label={getCoreTranslation('hide')}
                          onClick={() => hideWindow(windowName)}
                        >
                          <ArrowRightIcon />
                        </HeaderGlobalAction>
                      ) : (
                        <HeaderGlobalAction
                          aria-label={getCoreTranslation('close')}
                          onClick={() => closeWorkspace({ closeWindow: true })}
                        >
                          <CloseIcon />
                        </HeaderGlobalAction>
                      )}
                    </>
                  ) : (
                    <>
                      {canHide && (
                        <HeaderGlobalAction
                          aria-label={getCoreTranslation('hide')}
                          onClick={() => hideWindow(windowName)}
                        >
                          <DownToBottom />
                        </HeaderGlobalAction>
                      )}

                      <HeaderGlobalAction
                        aria-label={getCoreTranslation('close')}
                        onClick={() => closeWorkspace({ closeWindow: true })}
                      >
                        <CloseIcon />
                      </HeaderGlobalAction>
                    </>
                  )}
                </HeaderGlobalBar>
              </Header>
              <div className={classNames(styles.workspaceContent)}>{children}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
