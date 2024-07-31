import React, { useEffect, useState, useMemo } from 'react';
import { mountRootParcel, type ParcelConfig } from 'single-spa';
import Parcel from 'single-spa-react/parcel';
import { InlineLoading } from '@carbon/react';
import { getCoreTranslation } from '@openmrs/esm-translations';
import styles from './workspace.module.scss';
import { type OpenWorkspace } from '../workspaces';
import { useWorkspaceFamilyStore } from '../workspace-sidebar-store/useWorkspaceFamilyStore';

interface WorkspaceRendererProps {
  workspace: OpenWorkspace;
  additionalPropsFromPage?: object;
}

export function WorkspaceRenderer({ workspace, additionalPropsFromPage }: WorkspaceRendererProps) {
  const [lifecycle, setLifecycle] = useState<ParcelConfig | undefined>();
  const workspaceFamilyState = useWorkspaceFamilyStore(workspace.sidebarFamily);

  useEffect(() => {
    let active = true;
    workspace.load().then(({ default: result, ...lifecycle }) => {
      if (active) {
        setLifecycle(result ?? lifecycle);
      }
    });
    return () => {
      active = false;
    };
  }, [workspace]);

  const props = useMemo(
    () =>
      workspace && {
        closeWorkspace: workspace.closeWorkspace,
        closeWorkspaceWithSavedChanges: workspace.closeWorkspaceWithSavedChanges,
        promptBeforeClosing: workspace.promptBeforeClosing,
        setTitle: workspace.setTitle,
        ...additionalPropsFromPage,
        ...workspaceFamilyState,
        ...workspace.additionalProps,
      },
    [workspace, additionalPropsFromPage, workspaceFamilyState],
  );

  return lifecycle ? (
    <Parcel key={workspace.name} config={lifecycle} mountParcel={mountRootParcel} {...props} />
  ) : (
    <InlineLoading className={styles.loader} description={`${getCoreTranslation('loading', 'Loading')} ...`} />
  );
}
