import React, { useContext, type ReactNode } from 'react';
import { Header, HeaderGlobalAction, HeaderGlobalBar, HeaderMenuButton, HeaderName } from '@carbon/react';
import { DownToBottom, Maximize, Minimize } from '@carbon/react/icons';
import { isDesktop, useLayoutType } from '@openmrs/esm-react-utils';
import { getCoreTranslation } from '@openmrs/esm-translations';
import classNames from 'classnames';
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from '../icons';
import styles from './workspace2.module.scss';
import { getOpenedWindowIndexByWorkspace } from '@openmrs/esm-extensions';
import { useWorkspace2Store } from './workspace2';
import { SingleSpaContext } from "single-spa-react";
interface Workspace2Props {
  title: ReactNode;
  children: ReactNode;
}

export interface Workspace2DefinitionProps<
    WorkspaceProps extends Record<string, any> = {},
    WindowProps extends Record<string, any> = {},
    GroupProps extends Record<string, any> = {}> {
  workspaceName: string;

  /**
   * This function launches a child workspace. Unlike `launchWorkspace()`, this function is meant
   * to be called from the a workspace, and it does not allow passing it (or changing)
   * the window props or group props
   * @param workspaceName 
   * @param workspaceProps 
   */
  launchChildWorkspace<Props extends Record<string, any>>(workspaceName: string, workspaceProps: Props): void;

  /**
   * closes the current workspace, along with its children. If `closeWindow` is true, all workspaces
   * within the window (thus, including the workspace's parents) will be closed as well
   * @param closeWindow 
   */
  closeWorkspace(closeWindow?: boolean): Promise<void>;

  workspaceProps: WorkspaceProps | null;
  windowProps: WindowProps | null; 
  groupProps: GroupProps | null;
}

export type Workspace2Definition<
  WorkspaceProps extends Record<string, any>,
  WindowProps extends Record<string, any>,
  GroupProps extends Record<string, any>
> = React.FC<Workspace2DefinitionProps<WorkspaceProps, WindowProps, GroupProps>>;

export const Workspace2 : React.FC<Workspace2Props> = ({title, children}) => {
  const layout = useLayoutType();
  const {setWindowMaximized, hideWindow, closeWorkspace, ...state} = useWorkspace2Store();
  const { workspaceName } = useContext(SingleSpaContext);
  const {openedWindows, openedGroup, registeredGroupsByName, registeredWindowsByGroupName, registeredWindowsByName, registeredWorkspacesByName} = state;
  
  const openedWindowIndex = getOpenedWindowIndexByWorkspace(workspaceName);
  
  if(openedWindowIndex < 0 || openedGroup == null) {
    return null;
  }

  const group = registeredGroupsByName[openedGroup!.groupName];
  if(!group) {
    return null;
  }
  const icons = registeredWindowsByGroupName[group.name].filter(window => window.icon).map(window => window.icon);;
  const workspaceDef = registeredWorkspacesByName[workspaceName];
  const windowName = workspaceDef.window;
  const windowDef = registeredWindowsByName[windowName];
  if(!windowDef) {
    return null;
  }

  const { canHide, canMaximize } = windowDef;
  const openedWindow = openedWindows[openedWindowIndex];
  const { maximized } = openedWindow;
  const width = windowDef?.width ?? 'narrow';

  if(openedWindow.hidden) {
    return null;
  }
  return (
    <div className={classNames(
      styles.workspaceFixedContainer,
      icons.length > 0 ? styles.workspaceContainerWithActionMenu : styles.workspaceContainerWithoutActionMenu,
      {
        [styles.narrowWorkspace]: width === 'narrow',
        [styles.widerWorkspace]: width === 'wider',
        [styles.extraWideWorkspace]: width === 'extra-wide',
      }
    )}>
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
          {/* <ExtensionSlot
            name={`workspace-header-group-${openedGroup?.groupName}-slot`}
            state={workspaceProps}
          />
          <ExtensionSlot name={`workspace-header-type-${workspaceInstance.type}-slot`} state={workspaceProps} />
          <ExtensionSlot name={`workspace-header-${featureName}-slot`} state={workspaceProps} /> */}
          {isDesktop(layout) && (
            <>
              {(canMaximize || maximized) && (
                <HeaderGlobalAction
                  aria-label={
                    maximized
                      ? getCoreTranslation('minimize')
                      : getCoreTranslation('maximize')
                  }
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
                  onClick={() => closeWorkspace(workspaceName)}
                >
                  <CloseIcon />
                </HeaderGlobalAction>
              )}
            </>
          )}
          {layout === 'tablet' && canHide && (
            <HeaderGlobalAction aria-label={getCoreTranslation('close')} onClick={() => closeWorkspace(workspaceName)}>
              <DownToBottom />
            </HeaderGlobalAction>
          )}
        </HeaderGlobalBar>
      </Header>
      <div
        className={classNames(styles.workspaceContent, {
          [styles.marginWorkspaceContent]: true,
        })}
      >
        {children}
      </div>
    </div>
  );
}
