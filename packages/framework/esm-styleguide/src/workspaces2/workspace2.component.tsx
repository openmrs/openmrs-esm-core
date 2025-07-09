import React, { type ReactNode } from 'react';
import { Header, HeaderGlobalAction, HeaderGlobalBar, HeaderMenuButton, HeaderName } from '@carbon/react';
import { DownToBottom, Maximize, Minimize } from '@carbon/react/icons';
import { isDesktop, useLayoutType } from '@openmrs/esm-react-utils';
import { getCoreTranslation } from '@openmrs/esm-translations';
import classNames from 'classnames';
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from '../icons';
import styles from './workspace2.module.scss';
import { getOpenedWindowIndexByWorkspace } from '@openmrs/esm-extensions';
import { useWorkspace2Store } from './workspace2';
interface Workspace2Props {
  workspaceName: string;
  title: ReactNode;
  children: ReactNode;
}

export interface Workspace2DefinitionProps<GroupProps extends Record<string, any> = {}, WindowProps extends Record<string, any> = {}> {
  workspaceName: string;
  closeWorkspace(): Promise<void>;
  groupProps: GroupProps;
  windowProps: WindowProps;
}

export type Workspace2Definition<WindowProps extends Record<string, any>, GroupProps extends Record<string, any>> = 
  React.FC<Workspace2DefinitionProps<WindowProps, GroupProps>>;

export const Workspace2 : React.FC<Workspace2Props> = ({workspaceName, title, children}) => {
  const layout = useLayoutType();
  const {setWindowMaximized, hideWindow, closeWorkspace, ...state} = useWorkspace2Store();
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
  const workspace = registeredWorkspacesByName[workspaceName];
  const windowName = workspace.window;
  const window = registeredWindowsByName[windowName];
  if(!window) {
    return null;
  }

  const { canHide, canMaximize } = window;
  const openedWindow = openedWindows[openedWindowIndex];
  const { maximized } = openedWindow;

  return (
    <div className={classNames(
      styles.workspaceFixedContainer,
      icons.length > 0 ? styles.workspaceContainerWithActionMenu : styles.workspaceContainerWithoutActionMenu
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