import React, { useCallback, useContext, useMemo } from 'react';
import classNames from 'classnames';
import { Header, HeaderGlobalAction, HeaderGlobalBar, HeaderMenuButton, HeaderName } from '@carbon/react';
import { DownToBottom, Maximize, Minimize } from '@carbon/react/icons';
import { ComponentContext, ExtensionSlot, isDesktop, useBodyScrollLock, useLayoutType } from '@openmrs/esm-react-utils';
import { getCoreTranslation, translateFrom } from '@openmrs/esm-translations';

import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from '../../icons';
import { WorkspaceNotification } from '../notification/workspace-notification.component';
import ActionMenu from './action-menu.component';
import { type OpenWorkspace, updateWorkspaceWindowState, useWorkspaces } from '../workspaces';
import { WorkspaceRenderer } from './workspace-renderer.component';
import styles from './workspace.module.scss';

export interface WorkspaceContainerProps {
  contextKey: string;
  overlay?: boolean;
  showSiderailAndBottomNav?: boolean;
  additionalWorkspaceProps?: object;
}

/**
 * Use this component to render the [workspace window](https://zeroheight.com/23a080e38/p/483a22-workspace)
 * in an app such as the patient chart, or a workspace overlay in an app such as the clinic dashboard.
 * This allows workspaces to be opened on the page where this component is mounted. This component
 * must not be mounted multiple times on the same page. If there are multiple apps on a page, only
 * one of those apps should use this component—it "hosts" the workspaces.
 *
 * Workspaces may be opened with the [[launchWorkspace]] function from `@openmrs/esm-framework`
 * (among other options).
 *
 * The `overlay` prop determines whether the workspace is rendered as an overlay or a window.
 * When a workspace window is opened, the other content on the screen will be pushed to the left.
 * When an overlay is opened, it will cover other content on the screen.
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
 * An extension slot is provided in the workspace header. Its name is derived from the `featureName` of
 * the top-level component in which it is defined (feature names are generally provided in the lifecycle
 * functions in an app's `index.ts` file). The slot is named `workspace-header-${featureName}-slot`.
 * For the patient chart, this is `workspace-header-patient-chart-slot`.
 *
 * This component also provides the [Siderail and Bottom Nav](https://zeroheight.com/23a080e38/p/948cf1-siderail-and-bottom-nav/b/86907e).
 * To use this, pass the `showSiderailAndBottomNav` prop. The Siderail is rendered on the right side of the screen
 * on desktop, and the Bottom Nav is rendered at the bottom of the screen on tablet or mobile. The sidebar/bottom-nav
 * menu provides an extension slot, to which buttons are attached as extensions. The slot
 * derives its name from the `featureName` of the top-level component in which this `WorkspaceContainer`
 * appears (feature names are generally provided in the lifecycle functions in an app's `index.ts` file).
 * The slot is named `action-menu-${featureName}-items-slot`. For the patient chart, this is
 * `action-menu-patient-chart-items-slot`.
 *
 * This component also provides everything needed for workspace notifications to be rendered.
 *
 * @param props.contextKey The context key (explained above)
 * @param props.additionalWorkspaceProps Additional props to pass to the workspace. Using this is
 *          unusual; you will generally want to pass props to the workspace when you open it, using
 *          `launchWorkspace`. Use this only for props that will apply to every workspace launched
 *          on the page where this component is mounted.
 */
export function WorkspaceContainer({
  contextKey,
  overlay,
  showSiderailAndBottomNav,
  additionalWorkspaceProps,
}: WorkspaceContainerProps) {
  const layout = useLayoutType();
  const { workspaces, workspaceWindowState } = useWorkspaces();
  const activeWorkspace = workspaces[0];
  const isHidden = workspaceWindowState === 'hidden' || activeWorkspace == null;
  const isMaximized = workspaceWindowState === 'maximized';
  const width = activeWorkspace?.width ?? (overlay ? 'wider' : 'narrow');

  useBodyScrollLock(!isHidden && !isDesktop(layout));

  return (
    <>
      <div
        className={
          showSiderailAndBottomNav
            ? styles.workspaceContainerWithActionMenu
            : styles.workspaceContainerWithoutActionMenu
        }
      >
        <aside
          className={classNames(overlay ? styles.workspaceOverlayOuterContainer : styles.workspaceWindowSpacer, {
            [styles.hiddenRelative]: isHidden,
            [styles.narrowWorkspace]: width === 'narrow',
            [styles.widerWorkspace]: width === 'wider',
            [styles.extraWideWorkspace]: width === 'extra-wide',
          })}
        >
          <div
            className={classNames(styles.workspaceFixedContainer, {
              [styles.maximizedWindow]: isMaximized,
              [styles.hiddenFixed]: isHidden,
            })}
          >
            {workspaces.map((workspace, i) => (
              <div
                key={`workspace-container-${workspace ? workspace.name : 'empty'}`}
                className={classNames({ [styles.hiddenExtraWorkspace]: i !== 0 }, styles.workspaceInnerContainer)}
              >
                <Workspace workspaceInstance={workspace} additionalWorkspaceProps={additionalWorkspaceProps} />
              </div>
            ))}
          </div>
        </aside>
        <WorkspaceNotification contextKey={contextKey} />
      </div>
      {showSiderailAndBottomNav && <ActionMenu />}
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
  const isMaximized = workspaceWindowState === 'maximized';

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
    hasOwnSidebar = false,
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
            <HeaderMenuButton renderMenuIcon={<ArrowLeftIcon />} onClick={closeWorkspace} />
          )}
          <HeaderName prefix="">{workspaceInstance.titleNode ?? workspaceInstance.title}</HeaderName>
          <div className={styles.overlayHeaderSpacer} />
          <HeaderGlobalBar className={styles.headerButtons}>
            <ExtensionSlot
              name={`workspace-header-family-${workspaceInstance.sidebarFamily}-slot`}
              state={workspaceProps}
            />
            <ExtensionSlot name={`workspace-header-type-${workspaceInstance.type}-slot`} state={workspaceProps} />
            <ExtensionSlot name={`workspace-header-${featureName}-slot`} state={workspaceProps} />
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
        <div
          className={classNames(styles.workspaceContent, {
            [styles.marginWorkspaceContent]: hasOwnSidebar,
          })}
        >
          <WorkspaceRenderer
            key={workspaceInstance.name}
            workspace={workspaceInstance}
            additionalPropsFromPage={additionalWorkspaceProps}
          />
        </div>
        {hasOwnSidebar && <ActionMenu isWithinWorkspace name={workspaceInstance.sidebarFamily} />}
      </>
    )
  );
}
