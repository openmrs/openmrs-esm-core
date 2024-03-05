import React from 'react';
import { createRoot } from 'react-dom/client';
import Workspace from './workspaces.component';
import {
  type WorkspaceRegistration,
  closeInstance,
  openInstance,
  workspaceStore,
  workspaceRegistrations,
  getWorkspaceRegistration,
  workspaceStoreName,
} from './workspaces.resource';

/**
 * Registers a new workspace to display.
 * @param workspaceDefinition
 */
export function registerWorkspace(workspaceDefinition: WorkspaceRegistration) {
  workspaceRegistrations[workspaceDefinition.name] = workspaceDefinition;
}

export function renderWorkspaces(workspaceContainer: HTMLElement | null) {
  if (workspaceContainer) {
    const root = createRoot(workspaceContainer);
    root.render(<Workspace />);
  }
}

/**
 * Shows the provided component in an workspace window.
 * @param name name of the workspace registered with
 * @param props props that will be passed into the workspace content component
 */
export function showWorkspace(
  name: string,
  props: {
    workspaceTitle?: string;
    [x: string]: any;
  } = {},
) {
  const store = workspaceStore;
  const existingWorkspace = store.getState().workspaceStack.find((x) => x.name === name);
  if (existingWorkspace) {
    store.setState((prev) => ({
      ...prev,
      workspaceStack: [existingWorkspace, ...prev.workspaceStack.filter((x) => x.name !== name)],
    }));
    return;
  }

  const workspaceRegistration = getWorkspaceRegistration(name);
  if (workspaceRegistration) {
    openInstance({
      ...workspaceRegistration,
      workspaceTitle: props?.workspaceTitle ?? workspaceRegistration.title,
      props: {
        ...props,
        closeWorkspace: (onClose: () => void = () => {}) => closeInstance(name, onClose),
      },
    });
  }
}
