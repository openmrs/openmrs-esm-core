/** @module @category Workspace */
import React, { useCallback, useContext, useMemo } from 'react';
import classNames from 'classnames';
import { Header, HeaderGlobalBar, HeaderName, HeaderMenuButton, HeaderGlobalAction } from '@carbon/react';
import { DownToBottom, Maximize, Minimize } from '@carbon/react/icons';
import { ComponentContext, ExtensionSlot, useBodyScrollLock, useLayoutType, isDesktop } from '@openmrs/esm-react-utils';
import { translateFrom, getCoreTranslation } from '@openmrs/esm-translations';
import { type OpenWorkspace, useWorkspaces, updateWorkspaceWindowState } from '../workspaces';
import { WorkspaceRenderer } from './workspace-renderer.component';
import { WorkspaceNotification } from '../notification/workspace-notification.component';
import styles from './workspace.module.scss';
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from '../../icons';

export interface WorkspaceWindowProps {
  contextKey: string;
  additionalWorkspaceProps?: object;
}

/**
 * @deprecated Use `WorkspaceContainer` instead
 */
export function WorkspaceWindow({ contextKey, additionalWorkspaceProps }: WorkspaceWindowProps) {
  const { workspaces } = useWorkspaces();
  return (
    <>
      {/* Hide all workspaces but the first one */}
      {workspaces.map((workspace, i) => (
        <div key={workspace.name} className={classNames({ [styles.hidden]: i !== 0 })}>
          <Workspace workspaceInstance={workspace} additionalWorkspaceProps={additionalWorkspaceProps} />
        </div>
      ))}
      <WorkspaceNotification contextKey={contextKey} />
    </>
  );
}

interface WorkspaceProps {
  workspaceInstance: OpenWorkspace;
  additionalWorkspaceProps?: object;
}

function Workspace({ workspaceInstance, additionalWorkspaceProps }: WorkspaceProps) {
  const layout = useLayoutType();
  const { workspaceWindowState } = useWorkspaces();
  const maximized = workspaceWindowState === 'maximized';
  const hidden = workspaceWindowState === 'hidden';

  // We use the feature name of the app containing the workspace in order to set the extension
  // slot name. We can't use contextKey for this because we don't want the slot name to be
  // different for different patients, but we do want it to be different for different apps.
  const { featureName } = useContext(ComponentContext);

  useBodyScrollLock(!hidden && !isDesktop(layout));

  const toggleWindowState = useCallback(() => {
    maximized ? updateWorkspaceWindowState('normal') : updateWorkspaceWindowState('maximized');
  }, [maximized]);

  const workspaceTitle = useMemo(
    () =>
      workspaceInstance.additionalProps?.['workspaceTitle'] ??
      translateFrom(workspaceInstance.moduleName, workspaceInstance.title, workspaceInstance.title),
    [workspaceInstance],
  );

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
          [styles.maximizedWindow]: maximized,
          [styles.hidden]: hidden,
        },
      )}
    >
      <div className={styles.workspaceFixedContainer}>
        <Header aria-label={getCoreTranslation('workspaceHeader', 'Workspace Header')} className={styles.header}>
          {!isDesktop(layout) && !canHide && (
            <HeaderMenuButton renderMenuIcon={<ArrowLeftIcon />} onClick={closeWorkspace} />
          )}
          <HeaderName prefix="">{workspaceTitle}</HeaderName>
          <HeaderGlobalBar className={styles.headerButtons}>
            <ExtensionSlot name={`workspace-header-${featureName}-slot`} />
            {isDesktop(layout) && (
              <>
                {(canMaximize || maximized) && (
                  <HeaderGlobalAction
                    align="bottom"
                    aria-label={
                      maximized
                        ? getCoreTranslation('minimize', 'Minimize')
                        : getCoreTranslation('maximize', 'Maximize')
                    }
                    label={
                      maximized
                        ? getCoreTranslation('minimize', 'Minimize')
                        : getCoreTranslation('maximize', 'Maximize')
                    }
                    onClick={toggleWindowState}
                    size="lg"
                  >
                    {maximized ? <Minimize /> : <Maximize />}
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
      </div>
    </aside>
  );
}
