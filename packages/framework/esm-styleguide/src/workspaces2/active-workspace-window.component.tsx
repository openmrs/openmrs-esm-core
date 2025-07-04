import React, { useEffect, useMemo, useState } from "react";
import { getCoreTranslation } from "@openmrs/esm-translations";
import { InlineLoading } from "@carbon/react";
import { getWorkspaceRegistration, OpenedWindow } from "@openmrs/esm-extensions";
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

  const workspace = getWorkspaceRegistration(workspaces[workspaces.length -1]);
  const {openedGroup, closeWorkspace} = useWorkspace2Store();

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

  const props : Workspace2DefinitionProps = useMemo(
    () =>
      workspace && {
        // closeWorkspace: workspace.closeWorkspace,
        // closeWorkspaceWithSavedChanges: workspace.closeWorkspaceWithSavedChanges,
        // promptBeforeClosing: workspace.promptBeforeClosing,
        // setTitle: workspace.setTitle,
        closeWorkspace: () => closeWorkspace(workspace.name),
        groupProps: openedGroup?.props ?? {},
        windowProps: windowProps,
        workspaceName: workspace.name,
      },
    [workspace, openedGroup, windowProps],
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
