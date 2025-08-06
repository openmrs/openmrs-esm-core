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

export interface Workspace2DefinitionProps<
  WorkspaceProps extends Record<string, any> = object,
  WindowProps extends Record<string, any> = object,
  GroupProps extends Record<string, any> = object,
> {
  workspaceName: string;

  /**
   * This function launches a child workspace. Unlike `launchWorkspace()`, this function is meant
   * to be called from the a workspace, and it does not allow passing it (or changing)
   * the window props or group props
   * @param workspaceName
   * @param workspaceProps
   */
  launchChildWorkspace<Props extends Record<string, any>>(workspaceName: string, workspaceProps?: Props): void;

  /**
   * closes the current workspace, along with its children.
   * @param closeWindow If true, the workspace's window, along with all workspaces within it, will be closed as well
   * @returns a Promise that resolves to true if the workspace is closed, false otherwise.
   */
  closeWorkspace(options?: { closeWindow?: boolean; discardUnsavedChanges?: boolean }): Promise<boolean>;

  workspaceProps: WorkspaceProps | null;
  windowProps: WindowProps | null;
  groupProps: GroupProps | null;
}

export type Workspace2Definition<
  WorkspaceProps extends Record<string, any>,
  WindowProps extends Record<string, any>,
  GroupProps extends Record<string, any>,
> = React.FC<Workspace2DefinitionProps<WorkspaceProps, WindowProps, GroupProps>>;

/**
 * The Workspace2 component is used as a top-level container to render
 * its children as content within a workspace.
 */
export const Workspace2: React.FC<Workspace2Props> = ({ title, children, hasUnsavedChanges }) => {
  const layout = useLayoutType();
  const {
    setWindowMaximized,
    hideWindow,
    closeWorkspace,
    setHasUnsavedChanges,
    openedWindows,
    openedGroup,
    registeredGroupsByName,
    registeredWindowsByGroupName,
    registeredWindowsByName,
    registeredWorkspacesByName,
    workspaceTitleByWorkspaceName,
    setWorkspaceTitle,
  } = useWorkspace2Store();
  const { workspaceName } = useContext(SingleSpaContext);

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
    return null;
  }

  const group = registeredGroupsByName[openedGroup!.groupName];
  if (!group) {
    return null;
  }
  const workspaceDef = registeredWorkspacesByName[workspaceName];
  const windowName = workspaceDef.window;
  const windowDef = registeredWindowsByName[windowName];
  if (!windowDef) {
    return null;
  }

  const { canHide, canMaximize } = windowDef;
  const { maximized } = openedWindow;
  const width = windowDef?.width ?? 'narrow';

  return (
    <div
      className={classNames(styles.workspaceOuterContainer, {
        [styles.narrowWorkspace]: width === 'narrow',
        [styles.widerWorkspace]: width === 'wider',
        [styles.extraWideWorkspace]: width === 'extra-wide',
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
          })}
        >
          <Header aria-label={getCoreTranslation('workspaceHeader')} className={styles.header}>
            {!isDesktop(layout) && !canHide && (
              <HeaderMenuButton
                aria-label={getCoreTranslation('close')}
                renderMenuIcon={<ArrowLeftIcon />}
                onClick={() => closeWorkspace(workspaceName)}
              />
            )}
            <HeaderName prefix="">{title}</HeaderName>
            <div className={styles.overlayHeaderSpacer} />
            <HeaderGlobalBar className={styles.headerButtons}>
              {isDesktop(layout) && (
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
                    <HeaderGlobalAction aria-label={getCoreTranslation('hide')} onClick={() => hideWindow(windowName)}>
                      <ArrowRightIcon />
                    </HeaderGlobalAction>
                  ) : (
                    <HeaderGlobalAction
                      aria-label={getCoreTranslation('close')}
                      onClick={() => closeWorkspace(workspaceName)}
                    >
                      <CloseIcon />
                    </HeaderGlobalAction>
                  )}
                </>
              )}
              {layout === 'tablet' && canHide && (
                <HeaderGlobalAction
                  aria-label={getCoreTranslation('close')}
                  onClick={() => closeWorkspace(workspaceName)}
                >
                  <DownToBottom />
                </HeaderGlobalAction>
              )}
            </HeaderGlobalBar>
          </Header>
          <div className={classNames(styles.workspaceContent)}>{children}</div>
        </div>
      </div>
    </div>
  );
};
