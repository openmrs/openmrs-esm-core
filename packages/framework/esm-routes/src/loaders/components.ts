import {
  attach,
  registerExtension,
  registerModal,
  registerWorkspaceGroups2,
  registerWorkspaces2,
  registerWorkspaceWindows2,
} from '@openmrs/esm-extensions';
import {
  type ExtensionDefinition,
  type FeatureFlagDefinition,
  type ModalDefinition,
  type WorkspaceDefinition2,
  type WorkspaceGroupDefinition2,
  type WorkspaceWindowDefinition2,
} from '@openmrs/esm-globals';
import { registerFeatureFlag } from '@openmrs/esm-feature-flags';
import { loadLifeCycles } from './load-lifecycles';

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

  if (!extension.component) {
    console.error(
      `The extension ${name} from ${appName} is missing a 'component' entry and thus cannot be registered.
To fix this, ensure that you define a 'component' field inside the extension definition.`,
      extension,
    );
    return;
  }

  registerExtension({
    name,
    load: () => loadLifeCycles(appName, extension.component),
    meta: extension.meta || {},
    order: extension.order,
    moduleName: appName,
    privileges: extension.privileges,
    online: extension.online ?? true,
    offline: extension.offline ?? false,
    featureFlag: extension.featureFlag,
    displayExpression: extension.displayExpression,
  });

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

  if (!modal.component) {
    console.error(
      `The modal ${name} from ${appName} is missing a 'component' entry and thus cannot be registered.
To fix this, ensure that you define a 'component' field inside the modal definition.`,
      modal,
    );
    return;
  }

  registerModal({
    name,
    moduleName: appName,
    load: () => loadLifeCycles(appName, modal.component),
  });
}

export function tryRegisterWorkspaceGroups2(appName: string, workspaceGroupDefs: Array<WorkspaceGroupDefinition2>) {
  registerWorkspaceGroups2(appName, workspaceGroupDefs);
}

export function tryRegisterWorkspace2(appName: string, workspaceDefs: Array<WorkspaceDefinition2>) {
  registerWorkspaces2(appName, workspaceDefs);
}

export function tryRegisterWorkspaceWindows2(appName: string, workspaceWindowDefs: Array<WorkspaceWindowDefinition2>) {
  registerWorkspaceWindows2(appName, workspaceWindowDefs);

  // register each window with icon as an extension to the slot with
  // its workspace group name as slotName. This allows for configuration
  // of the icons in the group, similar to extensions in extension slots
  for (const windowDef of workspaceWindowDefs) {
    if (windowDef.icon) {
      const extension: ExtensionDefinition = {
        name: windowDef.name,
        component: windowDef.icon,
        slot: windowDef.group,
        order: windowDef.order,
      };
      tryRegisterExtension(appName, extension);
    }
  }
}

/**
 * This function registers a feature flag definition with the framework.
 *
 * @param appName The name of the app defining this feature flag
 * @param featureFlag An object that describes the feature flag, derived from `routes.json`
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
