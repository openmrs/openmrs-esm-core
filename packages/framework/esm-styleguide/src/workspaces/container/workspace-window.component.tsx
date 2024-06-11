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
 * @param props.additionalWorkspaceProps Additional props to pass to the workspace. Using this is
 *          unusual; you will generally want to pass props to the workspace when you open it, using
 *          `launchWorkspace`. Use this only for props that will apply to every workspace launched
 *          on the page where this component is mounted.
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
        styles.workspaceWindow,
        width === 'narrow' ? styles.narrowWorkspace : styles.widerWorkspace,
        {
          [styles.maximized]: maximized,
          [styles.hidden]: hidden,
        },
      )}
    >
      <Header
        aria-label={getCoreTranslation('workspaceHeader', 'Workspace Header')}
        className={classNames(styles.header, maximized ? styles.fullWidth : styles.dynamicWidth)}
      >
        {!isDesktop(layout) && !canHide && (
          <HeaderMenuButton renderMenuIcon={<ArrowLeftIcon />} onClick={closeWorkspace} />
        )}
        <HeaderName prefix="">{workspaceTitle}</HeaderName>
        <HeaderGlobalBar className={styles.headerGlobalBar}>
          <ExtensionSlot name={`workspace-header-${featureName}-slot`} />
          {isDesktop(layout) && (
            <>
              {(canMaximize || maximized) && (
                <HeaderGlobalAction
                  align="bottom"
                  aria-label={
                    maximized ? getCoreTranslation('minimize', 'Minimize') : getCoreTranslation('maximize', 'Maximize')
                  }
                  label={
                    maximized ? getCoreTranslation('minimize', 'Minimize') : getCoreTranslation('maximize', 'Maximize')
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
      <div
        className={classNames(
          styles.workspaceContent,
          maximized && isDesktop(layout) ? styles.fullWidth : styles.dynamicWidth,
        )}
      >
        <WorkspaceRenderer
          key={workspaceInstance.name}
          workspace={workspaceInstance}
          additionalPropsFromPage={additionalWorkspaceProps}
        />
      </div>
    </aside>
  );
}
