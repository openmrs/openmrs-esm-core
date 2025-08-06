import { type ReactNode } from 'react';
import { type LifeCycles } from 'single-spa';
import { type WorkspaceGroupDefinition, type WorkspaceWindowState } from '@openmrs/esm-globals';
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
  preferredWindowSize: WorkspaceWindowState;
  load(): Promise<LifeCycles>;
  moduleName: string;
  groups: Array<string>;
}

export type WorkspaceGroupRegistration = WorkspaceGroupDefinition & {
  members: Array<string>;
};

interface WorkspaceRegistrationStore {
  workspaces: Record<string, WorkspaceRegistration>;
}

const workspaceRegistrationStore = createGlobalStore<WorkspaceRegistrationStore>('workspaceRegistrations', {
  workspaces: {},
});

interface WorkspaceGroupRegistrationStore {
  workspaceGroups: Record<string, { name: string; members: Array<string> }>;
}

const workspaceGroupStore = createGlobalStore<WorkspaceGroupRegistrationStore>('workspaceGroups', {
  workspaceGroups: {},
});

/** See [[WorkspaceDefinition]] for more information about these properties */
export interface RegisterWorkspaceOptions {
  name: string;
  title: string;
  type?: string;
  canHide?: boolean;
  canMaximize?: boolean;
  width?: 'narrow' | 'wider' | 'extra-wide';
  preferredWindowSize?: WorkspaceWindowState;
  component: string;
  moduleName: string;
  groups?: Array<string>;
  load(): Promise<LifeCycles>;
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
        load: workspace.load,
        preferredWindowSize: workspace.preferredWindowSize ?? 'normal',
        type: workspace.type ?? 'form',
        canHide: workspace.canHide ?? false,
        canMaximize: workspace.canMaximize ?? false,
        width: workspace.width ?? 'narrow',
        groups: workspace.groups ?? [],
      },
    },
  }));
}

/**
 * Tells the workspace system about a workspace group. This is used by the app shell
 * to register workspace groups defined in the `routes.json` file.
 * @internal
 */
export function registerWorkspaceGroup(workspaceGroup: WorkspaceGroupRegistration) {
  workspaceGroupStore.setState((state) => {
    const group = state.workspaceGroups[workspaceGroup.name];
    if (group) {
      // This condition occurs when a workspace with a `groups` property is registered before
      // the corresponding workspace group. In such cases, the workspace group is registered
      // by the `attachWorkspaceToGroup` function.
      return {
        workspaceGroups: {
          ...state.workspaceGroups,
          [workspaceGroup.name]: {
            ...group,
            members: Array.from(new Set([...group.members, ...workspaceGroup.members])),
          },
        },
      };
    } else {
      return {
        workspaceGroups: {
          ...state.workspaceGroups,
          [workspaceGroup.name]: {
            name: workspaceGroup.name,
            members: workspaceGroup.members,
          },
        },
      };
    }
  });
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
        groups: workspaceExtension.meta?.groups ?? [],
      };
    } else {
      throw new Error(`No workspace named '${name}' has been registered.`);
    }
  }
}

/**
 * This provides the workspace group registration and is also compatible with the
 * old way of registering workspace groups (as extensions), but isn't recommended.
 *
 * @param name of the workspace
 */
export function getWorkspaceGroupRegistration(name: string): WorkspaceGroupRegistration {
  const registeredWorkspaces = workspaceGroupStore.getState().workspaceGroups;
  if (registeredWorkspaces[name]) {
    return registeredWorkspaces[name];
  } else {
    throw new Error(`No workspace group named '${name}' has been registered.`);
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
