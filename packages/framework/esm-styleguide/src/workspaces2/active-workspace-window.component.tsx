import React, { useEffect, useMemo, useState } from 'react';
import { InlineLoading } from '@carbon/react';
import { type OpenedWindow, type OpenedWorkspace, workspace2Store } from '@openmrs/esm-extensions';
import { loadLifeCycles } from '@openmrs/esm-routes';
import { getCoreTranslation } from '@openmrs/esm-translations';
import { mountRootParcel, type ParcelConfig } from 'single-spa';
import Parcel from 'single-spa-react/parcel';
import { promptForClosingWorkspaces, useWorkspace2Store } from './workspace2';
import { type Workspace2DefinitionProps } from './workspace2.component';

interface WorkspaceWindowProps {
  openedWindow: OpenedWindow;
}
/**
 * Renders an opened workspace window.
 */
const ActiveWorkspaceWindow: React.FC<WorkspaceWindowProps> = ({ openedWindow }) => {
  const { openedWorkspaces } = openedWindow;
  const [lifeCycles, setLifeCycles] = useState<ParcelConfig[]>();
  const { registeredWorkspacesByName } = workspace2Store.getState();

  useEffect(() => {
    Promise.all(
      openedWorkspaces.map((openedWorkspace) => {
        const { moduleName, component } = registeredWorkspacesByName[openedWorkspace.workspaceName];
        return loadLifeCycles(moduleName, component);
      }),
    ).then(setLifeCycles);
  }, [openedWorkspaces]);

  return (
    <>
      {openedWorkspaces.map((openedWorkspace, i) => (
        <ActiveWorkspace
          key={openedWorkspace.uuid}
          openedWorkspace={openedWorkspace}
          openedWindow={openedWindow}
          lifeCycle={lifeCycles?.[i]}
          isRootWorkspace={i === 0}
          isLeafWorkspace={i === openedWorkspaces.length - 1}
        />
      ))}
    </>
  );
};

interface ActiveWorkspaceProps {
  lifeCycle: ParcelConfig | undefined;
  openedWorkspace: OpenedWorkspace;
  openedWindow: OpenedWindow;
  isRootWorkspace: boolean;
  isLeafWorkspace: boolean;
}

const ActiveWorkspace: React.FC<ActiveWorkspaceProps> = ({
  lifeCycle,
  openedWorkspace,
  openedWindow,
  isRootWorkspace,
  isLeafWorkspace,
}) => {
  const { openedGroup, closeWorkspace, openChildWorkspace } = useWorkspace2Store();

  const props: Workspace2DefinitionProps = useMemo(
    () =>
      openedWorkspace && {
        closeWorkspace: async (options = {}) => {
          const { closeWindow = false, discardUnsavedChanges = false } = options;
          if (closeWindow) {
            const okToCloseWorkspaces =
              discardUnsavedChanges ||
              (await promptForClosingWorkspaces({
                reason: 'CLOSE_WINDOW',
                explicit: true,
                windowName: openedWindow.windowName,
              }));
            if (okToCloseWorkspaces) {
              closeWorkspace(openedWindow.openedWorkspaces[0].workspaceName);
              return true;
            }
            return false;
          } else {
            const okToCloseWorkspaces =
              discardUnsavedChanges ||
              (await promptForClosingWorkspaces({
                reason: 'CLOSE_WORKSPACE',
                explicit: true,
                windowName: openedWindow.windowName,
                workspaceName: openedWorkspace.workspaceName,
              }));
            if (okToCloseWorkspaces) {
              closeWorkspace(openedWorkspace.workspaceName);
              return true;
            }
            return false;
          }
        },
        launchChildWorkspace: (childWorkspaceName, childWorkspaceProps) => {
          const parentWorkspaceName = openedWorkspace.workspaceName;
          openChildWorkspace(parentWorkspaceName, childWorkspaceName, childWorkspaceProps ?? {});
        },
        workspaceName: openedWorkspace.workspaceName,
        workspaceProps: openedWorkspace.props,
        windowProps: openedWindow.props,
        groupProps: openedGroup?.props ?? null,
        isRootWorkspace,
        isLeafWorkspace,
        windowName: openedWindow.windowName,
      },
    [openedWorkspace, closeWorkspace, openedGroup, openedWindow],
  );

  return lifeCycle ? (
    <Parcel key={openedWorkspace.workspaceName} config={lifeCycle} mountParcel={mountRootParcel} {...props} />
  ) : (
    <InlineLoading description={`${getCoreTranslation('loading')} ...`} />
  );
};

export default ActiveWorkspaceWindow;
