import React from 'react';
import { createRoot } from 'react-dom/client';
import Workspace from './workspaces.component';
import {
  workspaceStore,
  getWorkspaceRegistration,
  type CloseWorkspaceOptions,
  closeWorkspace,
  promptBeforeClosing,
  type WorkspaceInstance,
  getPromptBeforeClosingFcn,
  type Prompt,
} from './workspaces.resource';
import { translateFrom } from '@openmrs/esm-framework';

export function renderWorkspaces(workspaceContainer: HTMLElement | null) {
  if (workspaceContainer) {
    const root = createRoot(workspaceContainer);
    root.render(<Workspace />);
  }
}

function promptBeforeLaunchingWorkspace(
  workspace: WorkspaceInstance,
  newWorkspaceDetails: { name: string; additionalProps?: object },
) {
  const { name, additionalProps } = newWorkspaceDetails;
  const store = workspaceStore;

  const proceed = () => {
    workspace.closeWorkspace({
      ignoreChanges: true,
      // Calling the launchPatientWorkspace again, since one of the `if` case
      // might resolve, but we need to check all the cases before launching the form.
      onWorkspaceClose: () => launchWorkspace(name, additionalProps),
    });
  };

  if (!canCloseWorkspaceWithoutPrompting(workspace.name)) {
    const prompt: Prompt = {
      title: translateFrom('@openmrs/esm-patient-chart-app', 'unsavedChangesTitleText', 'Unsaved Changes'),
      body: translateFrom(
        '@openmrs/esm-patient-chart-app',
        'unsavedChangesInWorkspace',
        'There are unsaved changes in {{workspaceName}}. Please save them before opening another workspace.',
        { workspaceName: workspace.workspaceTitle },
      ),
      onConfirm: proceed,
      confirmText: translateFrom('@openmrs/esm-patient-chart-app', 'openAnyway', 'Open anyway'),
    };
    store.setState((prevState) => ({
      ...prevState,
      prompt,
    }));
  } else {
    proceed();
  }
}

/**
 * Shows the provided component in an workspace window.
 * @param name name of the workspace registered with
 * @param props props that will be passed into the workspace content component
 */
export function launchWorkspace(name: string, additionalProps: Record<string, any> = {}) {
  const store = workspaceStore;
  const workspaceRegistration = getWorkspaceRegistration(name);
  const newWorkspace: WorkspaceInstance = {
    ...workspaceRegistration,
    workspaceTitle: additionalProps?.workspaceTitle ?? workspaceRegistration.title,
    closeWorkspace: (options: CloseWorkspaceOptions = {}) => closeWorkspace(name, options),
    closeWorkspaceWithSavedChanges: (options: CloseWorkspaceOptions) =>
      closeWorkspace(name, { ignoreChanges: true, ...options }),
    promptBeforeClosing: (testFcn) => promptBeforeClosing(name, testFcn),
    additionalProps,
  };

  const updateStoreWithNewWorkspace = (
    workspaceToBeAdded: WorkspaceInstance,
    restWorkspaces: WorkspaceInstance[] = [],
  ) => {
    store.setState((state) => {
      const openWorkspaces = [workspaceToBeAdded, ...(restWorkspaces ?? state.openWorkspaces)];

      return {
        ...state,
        openWorkspaces,
      };
    });
  };

  const openWorkspaces = store.getState().openWorkspaces;
  const workspaceIndexInOpenWorkspaces = openWorkspaces.findIndex((w) => w.name === name);
  const isWorkspaceAlreadyOpen = workspaceIndexInOpenWorkspaces >= 0;

  if (openWorkspaces.length === 0) {
    updateStoreWithNewWorkspace(newWorkspace);
  } else if (workspaceIndexInOpenWorkspaces !== 0) {
    promptBeforeLaunchingWorkspace(openWorkspaces[0], {
      name,
      additionalProps,
    });
  } else if (isWorkspaceAlreadyOpen) {
    openWorkspaces[workspaceIndexInOpenWorkspaces].additionalProps = newWorkspace.additionalProps;
    const restOfWorkspaces = openWorkspaces.filter((w) => w.name != name);
    updateStoreWithNewWorkspace(openWorkspaces[workspaceIndexInOpenWorkspaces], restOfWorkspaces);
  } else {
    updateStoreWithNewWorkspace(newWorkspace);
  }
}

/**
 *
 * @param name Name of the workspace
 * @param ignoreChanges If set to true, the "unsaved changes" modal will never be shown, even if the `promptBeforeClosing` function returns true. The user will not be prompted before closing.
 * @returns true if the workspace can be closed.
 */
export function canCloseWorkspaceWithoutPrompting(name: string, ignoreChanges: boolean = false) {
  if (ignoreChanges) {
    return true;
  }
  const promptBeforeFn = getPromptBeforeClosingFcn(name);
  return !promptBeforeFn || !promptBeforeFn();
}
