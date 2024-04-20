/** @module @category Workspace */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Header, InlineLoading } from '@carbon/react';
import { ArrowLeft, Close } from '@carbon/react/icons';
import { useLayoutType, isDesktop, getCoreTranslation, translateFrom } from '@openmrs/esm-framework';
import { mountRootParcel, type ParcelConfig } from 'single-spa';
import Parcel from 'single-spa-react/parcel';
import classNames from 'classnames';
import { type OpenWorkspace, useWorkspaces } from '../workspaces';
import { WorkspaceNotification } from '../notification/workspace-notification.component';
import styles from './workspace-overlay.module.scss';

export interface WorkspaceOverlayProps {
  contextKey: string;
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
 * @param props.contextKey The context key (explained above)
 */
export function WorkspaceOverlay({ contextKey }: WorkspaceOverlayProps) {
  const { workspaces } = useWorkspaces();
  return (
    <>
      {workspaces.length ? <Workspace workspaceInstance={workspaces[0]} /> : null}
      <WorkspaceNotification contextKey={contextKey} />
    </>
  );
}

interface WorkspaceProps {
  workspaceInstance: OpenWorkspace;
}

const Workspace: React.FC<WorkspaceProps> = ({ workspaceInstance }) => {
  const layout = useLayoutType();
  const ref = useRef<HTMLDivElement>(null);
  const [lifecycle, setLifecycle] = useState<ParcelConfig | undefined>();

  useEffect(() => {
    let active = true;
    workspaceInstance.load().then(({ default: result, ...lifecycle }) => {
      if (active) {
        setLifecycle(result ?? lifecycle);
      }
    });
    return () => {
      active = false;
    };
  }, [workspaceInstance.load]);

  const title = useMemo(
    () => translateFrom(workspaceInstance.moduleName, workspaceInstance.title, workspaceInstance.title),
    [workspaceInstance.moduleName, workspaceInstance.title],
  );

  const workspaceProps = {
    ...workspaceInstance.additionalProps,
    closeWorkspace: workspaceInstance.closeWorkspace,
    closeWorkspaceWithSavedChanges: workspaceInstance.closeWorkspaceWithSavedChanges,
    promptBeforeClosing: workspaceInstance.promptBeforeClosing,
  };

  return (
    <div
      className={classNames({
        [styles.desktopOverlay]: isDesktop(layout),
        [styles.tabletOverlay]: !isDesktop(layout),
      })}
    >
      {isDesktop(layout) ? (
        <div className={styles.desktopHeader}>
          <div className={styles.headerContent}>{title}</div>
          <Button
            className={styles.closeButton}
            onClick={workspaceInstance?.closeWorkspace}
            kind="ghost"
            hasIconOnly
            iconDescription={getCoreTranslation('close', 'Close')}
            tooltipPosition="bottom"
            renderIcon={(props) => <Close size={16} {...props} />}
          />
        </div>
      ) : (
        <Header
          className={styles.tabletOverlayHeader}
          aria-label={getCoreTranslation('workspaceHeader', 'Workspace header')}
        >
          <Button
            onClick={workspaceInstance.closeWorkspace}
            kind="ghost"
            hasIconOnly
            iconDescription={getCoreTranslation('close', 'Close')}
            tooltipPosition="bottom"
            renderIcon={(props) => <ArrowLeft size={16} onClick={close} {...props} />}
          />
          <div className={styles.headerContent}>{title}</div>
        </Header>
      )}
      <div className={styles.workspaceContent} ref={ref}>
        {lifecycle ? (
          <Parcel key={workspaceInstance.name} config={lifecycle} mountParcel={mountRootParcel} {...workspaceProps} />
        ) : (
          <InlineLoading
            className={styles.workspaceLoadingContent}
            description={`${getCoreTranslation('loading', 'Loading...')}`}
          />
        )}
      </div>
    </div>
  );
};
