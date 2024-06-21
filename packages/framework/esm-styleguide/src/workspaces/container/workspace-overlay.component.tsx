/** @module @category Workspace */
import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { Header, HeaderGlobalAction, HeaderName } from '@carbon/react';
import { ComponentContext, ExtensionSlot, isDesktop, useBodyScrollLock, useLayoutType } from '@openmrs/esm-react-utils';
import { getCoreTranslation, translateFrom } from '@openmrs/esm-translations';
import { ArrowLeftIcon, CloseIcon } from '../../icons';
import { WorkspaceNotification } from '../notification/workspace-notification.component';
import { useWorkspaces, type OpenWorkspace } from '../workspaces';
import { WorkspaceRenderer } from './workspace-renderer.component';
import styles from './workspace.module.scss';

export interface WorkspaceOverlayProps {
  contextKey: string;
  additionalWorkspaceProps?: object;
}

/**
 * @deprecated Use `WorkspaceContainer` instead
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
