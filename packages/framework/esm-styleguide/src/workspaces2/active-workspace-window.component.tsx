import React, { useEffect, useMemo, useState } from "react";
import { getCoreTranslation } from "@openmrs/esm-translations";
import { InlineLoading } from "@carbon/react";
import { getWorkspaceRegistration, OpenedWindow, workspace2Store } from "@openmrs/esm-extensions";
import { mountRootParcel, type ParcelConfig } from 'single-spa';
import Parcel from 'single-spa-react/parcel';
import { useWorkspace2Store } from "./workspace2";
import { Workspace2DefinitionProps } from "./workspace2.component";

interface WorkspaceWindowProps {
  window: OpenedWindow;
}
/**
 * Renders an opened workspace window. 
 */
const ActiveWorkspaceWindow : React.FC<WorkspaceWindowProps> = ({window}) => {
  const {hidden, workspaces, props: windowProps} = window;
  const [lifecycle, setLifecycle] = useState<ParcelConfig | undefined>();
  const {registeredWorkspacesByName} = workspace2Store.getState();
  
  // only the leaf workspace should be shown; parent workspaces are "covered" 
  // TODO: I think we still need to render each workspace, even if they are not shown,
  //      if we want to preserve the react states within each workspace component 
  const leafWorkspaceName = workspaces[workspaces.length -1];

  const workspace = registeredWorkspacesByName[leafWorkspaceName];
  const {openedGroup, closeWorkspace} = useWorkspace2Store();

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

  const props : Workspace2DefinitionProps = useMemo(
    () =>
      workspace && {
        // closeWorkspace: workspace.closeWorkspace,
        // closeWorkspaceWithSavedChanges: workspace.closeWorkspaceWithSavedChanges,
        // promptBeforeClosing: workspace.promptBeforeClosing,
        // setTitle: workspace.setTitle,
        closeWorkspace: async () => {
          // TOOD: prompt for unsaved changes with better UI
          const discardUnsavedChanges = await confirm("Yo, close workspace?");
          if(discardUnsavedChanges) {
            closeWorkspace(workspace.name)
          }
        },
        groupProps: openedGroup?.props ?? {},
        windowProps: windowProps,
        workspaceName: workspace.name,
      },
    [workspace, closeWorkspace, openedGroup, windowProps],
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
