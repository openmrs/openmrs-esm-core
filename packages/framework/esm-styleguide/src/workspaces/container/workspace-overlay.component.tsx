/** @module @category Workspace */
import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { Header } from '@carbon/react';
import { useLayoutType, isDesktop, ComponentContext, ExtensionSlot, useBodyScrollLock } from '@openmrs/esm-react-utils';
import { getCoreTranslation, translateFrom } from '@openmrs/esm-translations';
import { ArrowLeftIcon, CloseIcon } from '../../icons';
import { type OpenWorkspace, useWorkspaces } from '../workspaces';
import { WorkspaceNotification } from '../notification/workspace-notification.component';
import { WorkspaceRenderer } from './workspace-renderer.component';
import { HeaderName } from '@carbon/react';
import { HeaderGlobalAction } from '@carbon/react';
import styles from './workspace.module.scss';

export interface WorkspaceOverlayProps {
  contextKey: string;
  additionalWorkspaceProps?: object;
}

/**
 * Use this component to render the workspace window as an overlay in an app. An overlay is
 * a way of rendering workspaces that will cover other content on the screen, rather than
 * pushing it to the left (as with [[WorkspaceWindow]]). As described in the
 * [ZeroHeight](https://zeroheight.com/23a080e38/p/483a22-workspace/t/34e1a1) documentation,
 * this should be used on "app pages" such as the Clinic Dashboard.
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
export function WorkspaceOverlay({ contextKey, additionalWorkspaceProps }: WorkspaceOverlayProps) {
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

const Workspace: React.FC<WorkspaceProps> = ({ workspaceInstance, additionalWorkspaceProps }) => {
  const layout = useLayoutType();

  // We use the feature name of the app containing the workspace in order to set the extension
  // slot name. We can't use contextKey for this because we don't want the slot name to be
  // different for different patients, but we do want it to be different for different apps.
  const { featureName } = useContext(ComponentContext);

  const workspaceTitle = useMemo(
    () =>
      workspaceInstance.additionalProps?.['workspaceTitle'] ??
      translateFrom(workspaceInstance.moduleName, workspaceInstance.title, workspaceInstance.title),
    [workspaceInstance],
  );

  useBodyScrollLock(!isDesktop(layout));

  return (
    <aside className={classNames(styles.workspaceFixedContainer, styles.widerWorkspace, styles.overlay)}>
      <Header className={styles.header} aria-label={getCoreTranslation('workspaceHeader', 'Workspace header')}>
        <HeaderName className={styles.overlayTitle} prefix="">
          {workspaceTitle}
        </HeaderName>
        <div className={styles.overlayHeaderSpacer} />
        <ExtensionSlot className={styles.headerButtons} name={`workspace-header-${featureName}-slot`} />
        <div className={classNames(styles.overlayCloseButton, styles.headerButtons)}>
          <HeaderGlobalAction
            align="bottom-right"
            aria-label={getCoreTranslation('close', 'Close')}
            label={getCoreTranslation('close', 'Close')}
            onClick={() => workspaceInstance?.closeWorkspace()}
            size="lg"
          >
            {isDesktop(layout) ? <CloseIcon /> : <ArrowLeftIcon />}
          </HeaderGlobalAction>
        </div>
      </Header>
      <div className={styles.workspaceContent}>
        <WorkspaceRenderer
          key={workspaceInstance.name}
          workspace={workspaceInstance}
          additionalPropsFromPage={additionalWorkspaceProps}
        />
      </div>
    </aside>
  );
};
