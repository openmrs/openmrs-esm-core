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

/**
 * Use this component to render the [workspace window](https://zeroheight.com/23a080e38/p/483a22-workspace)
 * in an app such as the patient chart.
 * When a workspace is opened, the other content on the screen will be pushed to the left.
 *
 * The context key is a string that appears in the URL, which defines the pages on which workspaces
 * are valid. If the URL changes in a way such that it no longer contains the context key, then
 * all workspaces will be closed. This ensures that, for example, workspaces on the home page do
 * not stay open when the user transitions to the patient dashboard; and also that workspaces do
 * not stay open when the user navigates to a different patient. The context key must be a valid
 * sub-path of the URL, with no initial or trailing slash. So if the URL is
 * `https://example.com/patient/123/foo`, then `patient` and `patient/123` and `123/foo` are valid
 * context keys, but `patient/12` and `pati` are not.
 *
 * Workspaces may be opened with the [[launchWorkspace]] function from `@openmrs/esm-framework`
 * (among other options).
 *
 * This component also provides everything needed for workspace notifications to be rendered.
 *
 * This component does not include the action menu (the right siderail). The [[ActionMenu]] component
 * is provided separately.
 *
 * An extension slot is provided in the workspace header. Its name is derived from the `featureName` of
 * the top-level component in which it is defined (feature names are generally provided in the lifecycle
 * functions in an app's `index.ts` file). The slot is named `workspace-header-${featureName}-slot`.
 * For the patient chart, this is `workspace-header-patient-chart-slot`.
 *
 * @param props.contextKey The context key (explained above)
 */
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
