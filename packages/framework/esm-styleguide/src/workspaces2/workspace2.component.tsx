import React, { type ReactNode } from 'react';
import { Header, HeaderGlobalAction, HeaderGlobalBar, HeaderMenuButton, HeaderName } from '@carbon/react';
import { DownToBottom, Maximize, Minimize } from '@carbon/react/icons';
import { isDesktop, useAssignedExtensions, useLayoutType } from '@openmrs/esm-react-utils';
import { getCoreTranslation } from '@openmrs/esm-translations';
import classNames from 'classnames';
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from '../icons';
import styles from './workspace2.module.scss';
import { getOpenedWindowIndexByWorkspace, getWindowByWorkspace } from '@openmrs/esm-extensions';
import { useWorkspace2Store } from './workspace2';
interface Workspace2Props {
  workspaceName: string;
  title: ReactNode;
  children: ReactNode;
}

export const Workspace2 : React.FC<Workspace2Props> = ({workspaceName, title, children}) => {
  const layout = useLayoutType();
  const {setWindowMaximized, setWindowHidden, closeWorkspace, ...state} = useWorkspace2Store();
  const {openedWindows, openedGroup} = state;
  const slotName = `action-menu-${openedGroup?.groupName}-items-slot`; // TODO: refactor into function
  const actionMenuItems = useAssignedExtensions(slotName);
  
  const window = getWindowByWorkspace(state, workspaceName)!;
  const { canHide, canMaximize } = window;
  const openedWindowIndex = getOpenedWindowIndexByWorkspace(state, workspaceName);
  const openedWindow = openedWindows[openedWindowIndex];
  const { maximized } = openedWindow;

  return (
    <div className={classNames(
      styles.workspaceFixedContainer,
      actionMenuItems.length > 0 ? styles.workspaceContainerWithActionMenu : styles.workspaceContainerWithoutActionMenu
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
                  onClick={() => setWindowMaximized(window.windowName, !maximized)}
                >
                  {maximized ? <Minimize /> : <Maximize />}
                </HeaderGlobalAction>
              )}
              {canHide ? (
                <HeaderGlobalAction
                  aria-label={getCoreTranslation('hide')}
                  onClick={() => setWindowHidden(window.windowName, true)}
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