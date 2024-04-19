import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { ExtensionSlot, useBodyScrollLock, useLayoutType, isDesktop, translateFrom } from '@openmrs/esm-framework';
import { type OpenWorkspace, useWorkspaces, updateWorkspaceWindowState } from '../workspaces';
import { Header, HeaderGlobalBar, HeaderName, HeaderMenuButton, HeaderGlobalAction } from '@carbon/react';
import { ArrowLeft, ArrowRight, Close, DownToBottom, Maximize, Minimize } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { WorkspaceRenderer } from './workspace-renderer.component';
import styles from './workspace-window.module.scss';
import { WorkspaceNotification } from '../notification/workspace-notification.component';
import { ComponentContext } from '@openmrs/esm-react-utils';

export interface WorkspaceWindowProps {
  contextKey: string;
  additionalWorkspaceProps?: object;
}

export function WorkspaceWindow({ contextKey, additionalWorkspaceProps }: WorkspaceWindowProps) {
  const { active, workspaces, workspaceWindowState } = useWorkspaces();
  const hidden = workspaceWindowState === 'hidden';
  return (
    <>
      {workspaces.length && active && !hidden ? (
        <Workspace workspaceInstance={workspaces[0]} additionalWorkspaceProps={additionalWorkspaceProps} />
      ) : null}
      <WorkspaceNotification contextKey={contextKey} />
    </>
  );
}

interface WorkspaceProps {
  workspaceInstance: OpenWorkspace;
  additionalWorkspaceProps?: object;
}

function Workspace({ workspaceInstance, additionalWorkspaceProps }: WorkspaceProps) {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const { workspaceWindowState } = useWorkspaces();
  const maximized = workspaceWindowState === 'maximized';

  // We use the feature name of the app containing the workspace in order to set the extension
  // slot name. We can't use contextKey for this because we don't want the slot name to be
  // different for different patients, but we do want it to be different for different apps.
  const { featureName } = useContext(ComponentContext);

  useBodyScrollLock(!isDesktop(layout));

  const toggleWindowState = () => {
    maximized ? updateWorkspaceWindowState('normal') : updateWorkspaceWindowState('maximized');
  };

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
      className={classNames(styles.container, width === 'narrow' ? styles.narrowWorkspace : styles.widerWorkspace, {
        [styles.maximized]: maximized,
      })}
    >
      <Header
        aria-label="Workspace Title"
        className={classNames(styles.header, maximized ? styles.fullWidth : styles.dynamicWidth)}
      >
        {layout === 'tablet' && !canHide && (
          <HeaderMenuButton renderMenuIcon={<ArrowLeft />} onClick={closeWorkspace} />
        )}
        <HeaderName prefix="">{workspaceTitle}</HeaderName>
        <HeaderGlobalBar className={styles.headerGlobalBar}>
          <ExtensionSlot name={`workspace-header-${featureName}-slot`} />
          {isDesktop(layout) && (
            <>
              {(canMaximize || maximized) && (
                <HeaderGlobalAction
                  align="bottom"
                  label={maximized ? t('minimize', 'Minimize') : t('maximize', 'Maximize')}
                  onClick={toggleWindowState}
                  size="lg"
                >
                  {maximized ? <Minimize /> : <Maximize />}
                </HeaderGlobalAction>
              )}
              {canHide ? (
                <HeaderGlobalAction
                  align="bottom-right"
                  label={t('hide', 'Hide')}
                  onClick={() => updateWorkspaceWindowState('hidden')}
                  size="lg"
                >
                  <ArrowRight />
                </HeaderGlobalAction>
              ) : (
                <HeaderGlobalAction
                  align="bottom-right"
                  label={t('close', 'Close')}
                  onClick={() => closeWorkspace?.()}
                  size="lg"
                >
                  <Close />
                </HeaderGlobalAction>
              )}
            </>
          )}
          {layout === 'tablet' && canHide && (
            <HeaderGlobalAction align="bottom-right" label={t('close', 'Close')} onClick={() => closeWorkspace?.()}>
              <DownToBottom />
            </HeaderGlobalAction>
          )}
        </HeaderGlobalBar>
      </Header>
      <WorkspaceRenderer
        key={workspaceInstance.name}
        workspace={workspaceInstance}
        additionalPropsFromPage={additionalWorkspaceProps}
      />
    </aside>
  );
}
