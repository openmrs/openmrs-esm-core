import {
  attach,
  type ExtensionRegistration,
  registerExtension,
  registerModal,
  registerWorkspace,
} from '@openmrs/esm-extensions';
import {
  type FeatureFlagDefinition,
  type ExtensionDefinition,
  type ModalDefinition,
  type WorkspaceDefinition,
} from '@openmrs/esm-globals';
import { getLoader } from './app';
import { FeatureFlag, registerFeatureFlag } from '@openmrs/esm-feature-flags';

/**
 * This function registers an extension definition with the framework and will
 * attach the extension to any configured slots.
 *
 * @param appName The name of the app containing this extension
 * @param extension An object that describes the extension, derived from `routes.json`
 */
export function tryRegisterExtension(appName: string, extension: ExtensionDefinition) {
  const name = extension.name;
  if (!name) {
    console.error(
      `An extension definition in ${appName} is missing an name and thus cannot be
registered. To fix this, ensure that you define the "name" field inside the
extension definition.`,
      extension,
    );
    return;
  }

  if (extension.slots && extension.slot) {
    console.warn(
      `The extension ${name} from ${appName} declares both a 'slots' property and
a 'slot' property. Only the 'slots' property will be honored.`,
    );
  }
  const slots = extension.slots ? extension.slots : extension.slot ? [extension.slot] : [];

  if (!extension.component && !extension.load) {
    console.error(
      `The extension ${name} from ${appName} is missing a 'component' entry and thus cannot be registered.
To fix this, ensure that you define a 'component' field inside the extension definition.`,
      extension,
    );
    return;
  }

  let loader: ExtensionRegistration['load'] | undefined = undefined;
  if (extension.component) {
    loader = getLoader(appName, extension.component);
  } else if (extension.load) {
    if (typeof extension.load !== 'function') {
      console.error(
        `The extension ${name} from ${appName} declares a 'load' property that is not a function. This is not
supported, so the extension will not be loaded.`,
      );
      return;
    }
    loader = extension.load;
  }

  if (loader) {
    registerExtension({
      name,
      load: loader,
      meta: extension.meta || {},
      order: extension.order,
      moduleName: appName,
      privileges: extension.privileges,
      online: extension.online ?? true,
      offline: extension.offline ?? false,
      featureFlag: extension.featureFlag,
    });
  }

  for (const slot of slots) {
    attach(slot, name);
  }
}

/**
 * This function registers a modal definition with the framework so that it can be launched.
 *
 * @param appName The name of the app defining this modal
 * @param modal An object that describes the modal, derived from `routes.json`
 */
export function tryRegisterModal(appName: string, modal: ModalDefinition) {
  const name = modal.name;
  if (!name) {
    console.error(
      `A modal definition in ${appName} is missing an name and thus cannot be
registered. To fix this, ensure that you define the "name" field inside the
modal definition.`,
      modal,
    );
    return;
  }

  if (!modal.component && !modal.load) {
    console.error(
      `The modal ${name} from ${appName} is missing a 'component' entry and thus cannot be registered.
To fix this, ensure that you define a 'component' field inside the modal definition.`,
      modal,
    );
    return;
  }

  let loader: ExtensionRegistration['load'] | undefined = undefined;
  if (modal.component) {
    loader = getLoader(appName, modal.component);
  } else if (modal.load) {
    if (typeof modal.load !== 'function') {
      console.error(
        `The modal ${name} from ${appName} declares a 'load' property that is not a function. This is not
supported, so the modal will not be loaded.`,
      );
      return;
    }
    loader = modal.load;
  }

  if (loader) {
    registerModal({
      name,
      load: loader,
      moduleName: appName,
    });
  }
}

/**
 * This function registers a workspace definition with the framework so that it can be launched.
 *
 * @param appName The name of the app defining this workspace
 * @param workspace An object that describes the workspace, derived from `routes.json`
 */
export function tryRegisterWorkspace(appName: string, workspace: WorkspaceDefinition) {
  const name = workspace.name;
  if (!name) {
    console.error(
      `A workspace definition in ${appName} is missing a name and thus cannot be registered.
To fix this, ensure that you define the "name" field inside the workspace definition.`,
      workspace,
    );
    return;
  }

  const title = workspace.title;
  if (!title) {
    console.error(
      `A workspace definition in ${appName} is missing a title and thus cannot be registered.
To fix this, ensure that you define the "title" field inside the workspace definition.`,
      workspace,
    );
    return;
  }

  if (!workspace.component && !workspace.load) {
    console.error(
      `The workspace ${name} from ${appName} is missing a 'component' entry and thus cannot be registered.
To fix this, ensure that you define a 'component' field inside the workspace definition.`,
      workspace,
    );
    return;
  }

  let loader: ExtensionRegistration['load'] | undefined = undefined;
  if (workspace.component) {
    loader = getLoader(appName, workspace.component);
  } else if (workspace.load) {
    if (typeof workspace.load !== 'function') {
      console.error(
        `The workspace ${name} from ${appName} declares a 'load' property that is not a function. This is not
supported, so the workspace will not be loaded.`,
      );
      return;
    }
    loader = workspace.load;
  }

  if (loader) {
    registerWorkspace({
      name,
      title,
      load: loader,
      moduleName: appName,
      type: workspace.type,
      canHide: workspace.canHide,
      canMaximize: workspace.canMaximize,
      width: workspace.width,
      hasOwnSidebar: workspace.hasOwnSidebar,
      sidebarFamily: workspace.sidebarFamily,
      preferredWindowSize: workspace.preferredWindowSize,
    });
  }
}

/**
 * This function registers a workspace definition with the framework so that it can be launched.
 *
 * @param appName The name of the app defining this workspace
 * @param workspace An object that describes the workspace, derived from `routes.json`
 */
export function tryRegisterFeatureFlag(appName: string, featureFlag: FeatureFlagDefinition) {
  const name = featureFlag.flagName;
  if (!name) {
    console.error(
      `A feature flag definition in ${appName} is missing a name and thus cannot be registered.
To fix this, ensure that you define the "name" field inside the feature flag definition.`,
      featureFlag,
    );
    return;
  }

  const label = featureFlag.label;
  if (!label) {
    console.error(
      `A feature flag definition in ${appName} is missing a description and thus cannot be registered.
To fix this, ensure that you define the "label" field inside the feature flag definition.`,
      featureFlag,
    );
    return;
  }

  const description = featureFlag.description;
  if (!description) {
    console.error(
      `A feature flag definition in ${appName} is missing a description and thus cannot be registered.
To fix this, ensure that you define the "description" field inside the feature flag definition.`,
      featureFlag,
    );
    return;
  }

  registerFeatureFlag(featureFlag.flagName, featureFlag.label, featureFlag.description);
}
