import React, { useEffect, useState, useMemo } from 'react';
import classNames from 'classnames';
import { mountRootParcel, type ParcelConfig } from 'single-spa';
import Parcel from 'single-spa-react/parcel';
import { InlineLoading } from '@carbon/react';
import { useLayoutType } from '@openmrs/esm-react-utils';
import { getCoreTranslation } from '@openmrs/esm-translations';
import { type OpenWorkspace, useWorkspaces } from '../workspaces';
import styles from './workspace-window.module.scss';

interface WorkspaceRendererProps {
  workspace: OpenWorkspace;
  additionalPropsFromPage?: object;
}

export function WorkspaceRenderer({ workspace, additionalPropsFromPage }: WorkspaceRendererProps) {
  const layout = useLayoutType();
  const isTablet = layout === 'tablet';
  const { workspaceWindowState } = useWorkspaces();
  const maximized = workspaceWindowState === 'maximized';
  const [lifecycle, setLifecycle] = useState<ParcelConfig | undefined>();
  useEffect(() => {
    let active = true;
    workspace.load().then((lifecycle) => {
      if (active) {
        setLifecycle(lifecycle);
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
    <div className={classNames(styles.fixed, maximized && !isTablet ? styles.fullWidth : styles.dynamicWidth)}>
      {lifecycle ? (
        <Parcel key={workspace.name} config={lifecycle} mountParcel={mountRootParcel} {...props} />
      ) : (
        <InlineLoading className={styles.loading} description={`${getCoreTranslation('loading', 'Loading')} ...`} />
      )}
    </div>
  );
}
