import React, { useEffect, useMemo, useState } from "react";
import { getCoreTranslation } from "@openmrs/esm-translations";
import { InlineLoading } from "@carbon/react";
import { getWorkspaceRegistration } from "@openmrs/esm-extensions";
import { mountRootParcel, type ParcelConfig } from 'single-spa';
import Parcel from 'single-spa-react/parcel';
import { OpenedWindow, useWorkspace2Store } from "./store";

interface WorkspaceWindowProps {
  window: OpenedWindow;
}
/**
 * Renders an opened workspace window. 
 */
const ActiveWorkspaceWindow : React.FC<WorkspaceWindowProps> = ({window}) => {
  const {hidden, workspaces, props: workspaceWindowProps} = window;
  const [lifecycle, setLifecycle] = useState<ParcelConfig | undefined>();

  const workspace = getWorkspaceRegistration(workspaces[workspaces.length -1]);
  const {openedGroup} = useWorkspace2Store();

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
        // closeWorkspace: workspace.closeWorkspace,
        // closeWorkspaceWithSavedChanges: workspace.closeWorkspaceWithSavedChanges,
        // promptBeforeClosing: workspace.promptBeforeClosing,
        // setTitle: workspace.setTitle,
        workspaceGroupProps: openedGroup?.props,
        workspaceWindowProps,
        workspaceName: workspace.name,
      },
    [workspace, openedGroup, workspaceWindowProps],
  );

  if(hidden) {
    return null;
  }

  return lifecycle ? (
    <Parcel key={workspace.name} config={lifecycle} mountParcel={mountRootParcel} {...props} />
  ) : (
    <InlineLoading /*className={styles.loader}*/ description={`${getCoreTranslation('loading')} ...`} />
  );
}

export default ActiveWorkspaceWindow;