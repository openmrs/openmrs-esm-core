import React, { useEffect, useState, useMemo } from 'react';
import classNames from 'classnames';
import { mountRootParcel, type ParcelConfig } from 'single-spa';
import { InlineLoading } from '@carbon/react';
import { getCoreTranslation, useLayoutType } from '@openmrs/esm-framework';
import { type OpenWorkspace, useWorkspaces } from '../workspaces';
import Parcel from 'single-spa-react/parcel';
import styles from './workspace-window.scss';

interface WorkspaceRendererProps {
  workspace: OpenWorkspace;
  active: boolean;
  additionalPropsFromPage?: object;
}

export function WorkspaceRenderer({ workspace, active, additionalPropsFromPage }: WorkspaceRendererProps) {
  const layout = useLayoutType();
  const isTablet = layout === 'tablet';
  const { workspaceWindowState } = useWorkspaces();
  const maximized = workspaceWindowState === 'maximized';
  const [lifecycle, setLifecycle] = useState<ParcelConfig | undefined>();
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
        ...additionalPropsFromPage,
        ...workspace.additionalProps,
      },
    [workspace, additionalPropsFromPage],
  );

  return (
    <div
      className={classNames(
        active ? styles.fixed : styles.hide,
        maximized && !isTablet ? styles.fullWidth : styles.dynamicWidth,
      )}
    >
      {lifecycle ? (
        <Parcel key={workspace.name} config={lifecycle} mountParcel={mountRootParcel} {...props} />
      ) : (
        <InlineLoading className={styles.loading} description={`${getCoreTranslation('loading', 'Loading')} ...`} />
      )}
    </div>
  );
}
