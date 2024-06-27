/** @module @category Workspace */
import React, { useCallback, useContext, useMemo } from 'react';
import classNames from 'classnames';
import { Header, HeaderGlobalAction, HeaderGlobalBar, HeaderMenuButton, HeaderName } from '@carbon/react';
import { DownToBottom, Maximize, Minimize } from '@carbon/react/icons';
import { ComponentContext, ExtensionSlot, isDesktop, useBodyScrollLock, useLayoutType } from '@openmrs/esm-react-utils';
import { getCoreTranslation, translateFrom } from '@openmrs/esm-translations';
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from '../../icons';
import { WorkspaceNotification } from '../notification/workspace-notification.component';
import { updateWorkspaceWindowState, useWorkspaces, type OpenWorkspace } from '../workspaces';
import { WorkspaceRenderer } from './workspace-renderer.component';
import styles from './workspace.module.scss';

export interface WorkspaceWindowProps {
  contextKey: string;
  additionalWorkspaceProps?: object;
}

/**
 * @deprecated Use `WorkspaceContainer` instead
 */
export function WorkspaceWindow({ contextKey, additionalWorkspaceProps }: WorkspaceWindowProps) {
  const { workspaces } = useWorkspaces();
  // If there are no open workspaces, have an empty container ready so that it can animate onto the screen
  const workspacesOrEmptyContainer: Array<OpenWorkspace | null> = workspaces.length ? workspaces : [null];
  return (
    <>
      {/* Hide all workspaces but the first one */}
      {workspacesOrEmptyContainer.map((workspace, i) => (
        <div key={`workspace-window-${i}`} className={classNames({ [styles.hiddenExtraWorkspace]: i !== 0 })}>
          <Workspace workspaceInstance={workspace} additionalWorkspaceProps={additionalWorkspaceProps} />
        </div>
      ))}
      <WorkspaceNotification contextKey={contextKey} />
    </>
  );
}

interface WorkspaceProps {
  workspaceInstance: OpenWorkspace | null;
  additionalWorkspaceProps?: object;
}

function Workspace({ workspaceInstance, additionalWorkspaceProps }: WorkspaceProps) {
  const layout = useLayoutType();
  const { workspaceWindowState } = useWorkspaces();
  const isMaximized = workspaceWindowState === 'maximized';
  const isHidden = workspaceWindowState === 'hidden' || workspaceInstance == null;

  // We use the feature name of the app containing the workspace in order to set the extension
  // slot name. We can't use contextKey for this because we don't want the slot name to be
  // different for different patients, but we do want it to be different for different apps.
  const { featureName } = useContext(ComponentContext);

  useBodyScrollLock(!isHidden && !isDesktop(layout));

  const toggleWindowState = useCallback(() => {
    isMaximized ? updateWorkspaceWindowState('normal') : updateWorkspaceWindowState('maximized');
  }, [isMaximized]);

  const workspaceTitle = useMemo(() => {
    if (workspaceInstance === null) {
      return '';
    }
    return (
      workspaceInstance.additionalProps?.['workspaceTitle'] ??
      translateFrom(workspaceInstance.moduleName, workspaceInstance.title, workspaceInstance.title)
    );
  }, [workspaceInstance]);

  const {
    canHide = false,
    canMaximize = false,
    width = 'narrow',
    closeWorkspace,
  } = useMemo(() => workspaceInstance ?? ({} as OpenWorkspace), [workspaceInstance]);

  return (
    <aside
      className={classNames(
        styles.workspaceWindowSpacer,
        width === 'narrow' ? styles.narrowWorkspace : styles.widerWorkspace,
        {
          [styles.hiddenRelative]: isHidden,
        },
      )}
    >
      <div
        className={classNames(
          { [styles.maximizedWindow]: isMaximized, [styles.hiddenFixed]: isHidden },
          styles.workspaceFixedContainer,
        )}
      >
        {workspaceInstance && (
          <>
            <Header aria-label={getCoreTranslation('workspaceHeader', 'Workspace Header')} className={styles.header}>
              {!isDesktop(layout) && !canHide && (
                <HeaderMenuButton renderMenuIcon={<ArrowLeftIcon />} onClick={closeWorkspace} />
              )}
              <HeaderName prefix="">{workspaceTitle}</HeaderName>
              <HeaderGlobalBar className={styles.headerButtons}>
                <ExtensionSlot name={`workspace-header-${featureName}-slot`} />
                {isDesktop(layout) && (
                  <>
                    {(canMaximize || isMaximized) && (
                      <HeaderGlobalAction
                        align="bottom"
                        aria-label={
                          isMaximized
                            ? getCoreTranslation('minimize', 'Minimize')
                            : getCoreTranslation('maximize', 'Maximize')
                        }
                        label={
                          isMaximized
                            ? getCoreTranslation('minimize', 'Minimize')
                            : getCoreTranslation('maximize', 'Maximize')
                        }
                        onClick={toggleWindowState}
                        size="lg"
                      >
                        {isMaximized ? <Minimize /> : <Maximize />}
                      </HeaderGlobalAction>
                    )}
                    {canHide ? (
                      <HeaderGlobalAction
                        align="bottom-right"
                        aria-label={getCoreTranslation('hide', 'Hide')}
                        label={getCoreTranslation('hide', 'Hide')}
                        onClick={() => updateWorkspaceWindowState('hidden')}
                        size="lg"
                      >
                        <ArrowRightIcon />
                      </HeaderGlobalAction>
                    ) : (
                      <HeaderGlobalAction
                        align="bottom-right"
                        aria-label={getCoreTranslation('close', 'Close')}
                        label={getCoreTranslation('close', 'Close')}
                        onClick={() => closeWorkspace?.()}
                        size="lg"
                      >
                        <CloseIcon />
                      </HeaderGlobalAction>
                    )}
                  </>
                )}
                {layout === 'tablet' && canHide && (
                  <HeaderGlobalAction
                    align="bottom-right"
                    aria-label={getCoreTranslation('close', 'Close')}
                    label={getCoreTranslation('close', 'Close')}
                    onClick={() => closeWorkspace?.()}
                  >
                    <DownToBottom />
                  </HeaderGlobalAction>
                )}
              </HeaderGlobalBar>
            </Header>
            <div className={styles.workspaceContent}>
              <WorkspaceRenderer
                key={workspaceInstance.name}
                workspace={workspaceInstance}
                additionalPropsFromPage={additionalWorkspaceProps}
              />
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
