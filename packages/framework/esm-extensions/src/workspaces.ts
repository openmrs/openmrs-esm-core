import { type ReactNode } from 'react';
import { type LifeCycles } from 'single-spa';
import { type WorkspaceWindowState } from '@openmrs/esm-globals';
import { type ExtensionRegistration, getExtensionRegistration } from '.';
import { createGlobalStore } from '@openmrs/esm-state';
import { translateFrom } from '@openmrs/esm-translations';

/** See [[WorkspaceDefinition]] for more information about these properties */
export interface WorkspaceRegistration {
  name: string;
  title: string;
  titleNode?: ReactNode;
  type: string;
  canHide: boolean;
  canMaximize: boolean;
  width: 'narrow' | 'wider' | 'extra-wide';
  hasOwnSidebar: boolean;
  sidebarFamily: string;
  preferredWindowSize: WorkspaceWindowState;
  load: () => Promise<{ default?: LifeCycles } & LifeCycles>;
  moduleName: string;
}

interface WorkspaceRegistrationStore {
  workspaces: Record<string, WorkspaceRegistration>;
}

const workspaceRegistrationStore = createGlobalStore<WorkspaceRegistrationStore>('workspaceRegistrations', {
  workspaces: {},
});

/** See [[WorkspaceDefinition]] for more information about these properties */
export interface RegisterWorkspaceOptions {
  name: string;
  title: string;
  type?: string;
  canHide?: boolean;
  canMaximize?: boolean;
  width?: 'narrow' | 'wider' | 'extra-wide';
  hasOwnSidebar?: boolean;
  sidebarFamily?: string;
  preferredWindowSize?: WorkspaceWindowState;
  load: () => Promise<{ default?: LifeCycles } & LifeCycles>;
  moduleName: string;
}

/**
 * Tells the workspace system about a workspace. This is used by the app shell
 * to register workspaces defined in the `routes.json` file.
 * @internal
 */
export function registerWorkspace(workspace: RegisterWorkspaceOptions) {
  workspaceRegistrationStore.setState((state) => ({
    workspaces: {
      ...state.workspaces,
      [workspace.name]: {
        ...workspace,
        preferredWindowSize: workspace.preferredWindowSize ?? 'normal',
        type: workspace.type ?? 'form',
        canHide: workspace.canHide ?? false,
        canMaximize: workspace.canMaximize ?? false,
        width: workspace.width ?? 'narrow',
        hasOwnSidebar: workspace.hasOwnSidebar ?? false,
        sidebarFamily: workspace.sidebarFamily ?? 'default',
      },
    },
  }));
}

const workspaceExtensionWarningsIssued = new Set();
/**
 * This exists for compatibility with the old way of registering
 * workspaces (as extensions).
 *
 * @param name of the workspace
 */
export function getWorkspaceRegistration(name: string): WorkspaceRegistration {
  const registeredWorkspaces = workspaceRegistrationStore.getState().workspaces;
  if (registeredWorkspaces[name]) {
    return registeredWorkspaces[name];
  } else {
    const workspaceExtension = getExtensionRegistration(name);
    if (workspaceExtension) {
      if (!workspaceExtensionWarningsIssued.has(name)) {
        console.warn(
          `The workspace '${name}' is registered as an extension. This is deprecated. Please register it in the "workspaces" section of the routes.json file.`,
        );
        workspaceExtensionWarningsIssued.add(name);
      }
      return {
        name: workspaceExtension.name,
        title: getTitleFromExtension(workspaceExtension),
        moduleName: workspaceExtension.moduleName,
        preferredWindowSize: workspaceExtension.meta?.screenSize ?? 'normal',
        load: workspaceExtension.load,
        type: workspaceExtension.meta?.type ?? 'form',
        canHide: workspaceExtension.meta?.canHide ?? false,
        canMaximize: workspaceExtension.meta?.canMaximize ?? false,
        width: workspaceExtension.meta?.width ?? 'narrow',
        sidebarFamily: 'default',
        hasOwnSidebar: false,
      };
    } else {
      throw new Error(`No workspace named '${name}' has been registered.`);
    }
  }
}

function getTitleFromExtension(ext: ExtensionRegistration) {
  const title = ext?.meta?.title;
  if (typeof title === 'string') {
    return title;
  } else if (title && typeof title === 'object') {
    return translateFrom(ext.moduleName, title.key, title.default);
  }
  return ext.name;
}
