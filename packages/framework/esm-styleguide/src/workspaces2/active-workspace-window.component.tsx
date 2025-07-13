import React, { useEffect, useMemo, useState } from "react";
import { getCoreTranslation } from "@openmrs/esm-translations";
import { InlineLoading } from "@carbon/react";
import { OpenedWindow, OpenedWorkspace, workspace2Store } from "@openmrs/esm-extensions";
import { mountRootParcel, type ParcelConfig } from 'single-spa';
import Parcel from 'single-spa-react/parcel';
import { useWorkspace2Store } from "./workspace2";
import { Workspace2DefinitionProps } from "./workspace2.component";

interface WorkspaceWindowProps {
  openedWindow: OpenedWindow;
}
/**
 * Renders an opened workspace window. 
 */
const ActiveWorkspaceWindow : React.FC<WorkspaceWindowProps> = ({openedWindow}) => {
  const {openedWorkspaces} = openedWindow;
  const [lifeCycles, setLifeCycles] = useState<ParcelConfig[]>();
  const {registeredWorkspacesByName} = workspace2Store.getState();
  
  useEffect(() => {
    Promise.all(openedWorkspaces.map(openedWorkspace => {
      const workspaceRegistration = registeredWorkspacesByName[openedWorkspace.workspaceName];
      return workspaceRegistration.load();
    })).then(setLifeCycles)
  }, [openedWorkspaces]);

  return openedWorkspaces.map((openedWorkspace, i) => (
    <ActiveWorkspace 
      key={openedWorkspace.workspaceName}
      openedWorkspace={openedWorkspace}
      openedWindow={openedWindow}
      lifeCycle={lifeCycles?.[i]}
    />
  ));
}

interface ActiveWorkspaceProps {
  lifeCycle: ParcelConfig | undefined;
  openedWorkspace: OpenedWorkspace;
  openedWindow: OpenedWindow
}

const ActiveWorkspace : React.FC<ActiveWorkspaceProps> = ({lifeCycle, openedWorkspace, openedWindow}) => {
  
  const {openedGroup, closeWorkspace, openChildWorkspace} = useWorkspace2Store();

  const props : Workspace2DefinitionProps = useMemo(
    () =>
      openedWorkspace && {
        closeWorkspace: async (closeWindow?: boolean) => {
          if(closeWindow) {
            // TOOD: prompt for unsaved changes with better UI
            const discardUnsavedChanges = await confirm("Yo, close all workspaces in window?");
            if(discardUnsavedChanges) {
              closeWorkspace(openedWindow.openedWorkspaces[0].workspaceName);
            }

          } else {
            // TOOD: prompt for unsaved changes with better UI
            const discardUnsavedChanges = await confirm("Yo, close workspace?");
            if(discardUnsavedChanges) {
              closeWorkspace(openedWorkspace.workspaceName)
            }
          }
        },
        launchChildWorkspace: openChildWorkspace,
        workspaceName: openedWorkspace.workspaceName,
        workspaceProps: openedWorkspace.props,
        windowProps: openedWindow.props,
        groupProps: openedGroup?.props ?? null,
      },
    [openedWorkspace, closeWorkspace, openedGroup, openedWindow],
  );

  return lifeCycle ? (
    <Parcel key={openedWorkspace.workspaceName} config={lifeCycle} mountParcel={mountRootParcel} {...props} />
  ) : (
    <InlineLoading /*className={styles.loader}*/ description={`${getCoreTranslation('loading')} ...`} />
  );
}

export default ActiveWorkspaceWindow;
