import React, { type ReactNode, Suspense, useCallback, useContext, useEffect, useMemo } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Header, HeaderGlobalAction, HeaderGlobalBar, HeaderMenuButton, HeaderName } from '@carbon/react';
import { DownToBottom, Maximize, Minimize } from '@carbon/react/icons';
import { ComponentContext, ExtensionSlot, isDesktop, useBodyScrollLock, useLayoutType } from '@openmrs/esm-react-utils';
import { getCoreTranslation } from '@openmrs/esm-translations';
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from '../icons';
import { type OpenWorkspace, updateWorkspaceWindowState, useWorkspaces } from '../workspaces';
import { WorkspaceRenderer } from './workspace-renderer.component';
import styles from './workspace.module.scss';
/**
 * Renders a workspace that is opened
 */
function ActiveWorkspace2({ workspaceInstance, additionalWorkspaceProps }: WorkspaceProps) {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const { workspaceWindowState, workspaceGroup } = useWorkspaces();
  const currentGroupName = workspaceGroup?.name;
  const isMaximized = workspaceWindowState === 'maximized';

  // Translate the workspace title
  // The workspace title is a translation key whose translation resides in the workspace module.
  // Since the workspace module is not loaded at the time of workspace registration, we need to translate it here
  // when the workspace is actually rendered and the workspace module along with its translations are loaded.
  useEffect(() => {
    const translatedTitle = t(workspaceInstance.title);
    if (translatedTitle !== workspaceInstance.title) {
      workspaceInstance.setTitle(translatedTitle);
    }
  }, [workspaceInstance.title, t, workspaceInstance.setTitle]);

  // We use the feature name of the app containing the workspace in order to set the extension
  // slot name. We can't use contextKey for this because we don't want the slot name to be
  // different for different patients, but we do want it to be different for different apps.
  const { featureName } = useContext(ComponentContext);

  const toggleWindowState = useCallback(() => {
    isMaximized ? updateWorkspaceWindowState('normal') : updateWorkspaceWindowState('maximized');
  }, [isMaximized]);

  const {
    canHide = false,
    canMaximize = false,
    currentWorkspaceGroup = '',
    closeWorkspace,
  } = useMemo(() => workspaceInstance ?? ({} as OpenWorkspace), [workspaceInstance]);

  const workspaceProps = useMemo(
    () => ({
      ...additionalWorkspaceProps,
      ...workspaceInstance?.additionalProps,
    }),
    [additionalWorkspaceProps, workspaceInstance],
  );

  return (
    workspaceInstance && (
      <>
        <Header aria-label={getCoreTranslation('workspaceHeader', 'Workspace Header')} className={styles.header}>
          {!isDesktop(layout) && !canHide && (
            <HeaderMenuButton
              aria-label={getCoreTranslation('close', 'Close')}
              renderMenuIcon={<ArrowLeftIcon />}
              onClick={() => closeWorkspace()}
            />
          )}
          <HeaderName prefix="">{workspaceInstance.titleNode ?? (t(workspaceInstance.title) as ReactNode)}</HeaderName>
          <div className={styles.overlayHeaderSpacer} />
          <HeaderGlobalBar className={styles.headerButtons}>
            <ExtensionSlot
              name={`workspace-header-group-${workspaceInstance.currentWorkspaceGroup}-slot`}
              state={workspaceProps}
            />
            <ExtensionSlot name={`workspace-header-type-${workspaceInstance.type}-slot`} state={workspaceProps} />
            <ExtensionSlot name={`workspace-header-${featureName}-slot`} state={workspaceProps} />
            {isDesktop(layout) && (
              <>
                {(canMaximize || isMaximized) && (
                  <HeaderGlobalAction
                    aria-label={
                      isMaximized
                        ? getCoreTranslation('minimize', 'Minimize')
                        : getCoreTranslation('maximize', 'Maximize')
                    }
                    onClick={toggleWindowState}
                  >
                    {isMaximized ? <Minimize /> : <Maximize />}
                  </HeaderGlobalAction>
                )}
                {canHide && !currentGroupName ? (
                  <HeaderGlobalAction
                    aria-label={getCoreTranslation('hide', 'Hide')}
                    onClick={() => updateWorkspaceWindowState('hidden')}
                  >
                    <ArrowRightIcon />
                  </HeaderGlobalAction>
                ) : (
                  <HeaderGlobalAction
                    aria-label={getCoreTranslation('close', 'Close')}
                    onClick={() => closeWorkspace?.()}
                  >
                    <CloseIcon />
                  </HeaderGlobalAction>
                )}
              </>
            )}
            {layout === 'tablet' && canHide && (
              <HeaderGlobalAction aria-label={getCoreTranslation('close', 'Close')} onClick={() => closeWorkspace?.()}>
                <DownToBottom />
              </HeaderGlobalAction>
            )}
          </HeaderGlobalBar>
        </Header>
        <div
          className={classNames(styles.workspaceContent, {
            [styles.marginWorkspaceContent]: Boolean(currentWorkspaceGroup),
          })}
        >
          <WorkspaceRenderer
            key={workspaceInstance.name}
            workspace={workspaceInstance}
            additionalPropsFromPage={additionalWorkspaceProps}
          />
        </div>
      </>
    )
  );
}

export default ActiveWorkspace2;