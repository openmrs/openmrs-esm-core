import cloneDeep from "lodash-es/cloneDeep";
import set from "lodash-es/set";
import { mountRootParcel } from "single-spa";
import { getExtensionRegistration } from "./extensions";
import { getActualRouteProps } from "./route";
import { updateExtensionStore } from "./store";

export interface Lifecycle {
  bootstrap(): void;
  mount(): void;
  unmount(): void;
  update?(): void;
}

export interface CancelLoading {
  (): void;
}

/**
 * Mounts into a DOM node (representing an extension slot)
 * a lazy-loaded component from *any* microfrontend
 * that registered an extension component for this slot.
 */
export function renderExtension(
  domElement: HTMLElement,
  actualExtensionSlotName: string,
  attachedExtensionSlotName: string,
  extensionSlotModuleName: string,
  extensionId: string,
  renderFunction: (lifecycle: Lifecycle) => Lifecycle = (x) => x,
  additionalProps: Record<string, any> = {}
): CancelLoading {
  const extensionName = extensionId.split("#")[0];
  const extensionRegistration = getExtensionRegistration(extensionId);
  let active = true;

  if (domElement) {
    if (extensionRegistration) {
      const routeProps = getActualRouteProps(
        actualExtensionSlotName,
        attachedExtensionSlotName
      );
      const extensionContextProps = {
        _extensionContext: {
          extensionId,
          actualExtensionSlotName,
          attachedExtensionSlotName,
          extensionSlotModuleName,
          extensionModuleName: extensionRegistration.moduleName,
        },
      };

      extensionRegistration.load().then(
        ({ default: result, ...lifecycle }) =>
          active &&
          mountRootParcel(renderFunction(result ?? lifecycle) as any, {
            ...additionalProps,
            ...extensionContextProps,
            ...routeProps,
            domElement,
          })
      );

      updateExtensionStore((state) =>
        set(
          cloneDeep(state),
          [
            "extensions",
            extensionName,
            "instances",
            extensionSlotModuleName,
            actualExtensionSlotName,
          ],
          { domElement, id: extensionId }
        )
      );
    } else {
      throw Error(
        `Couldn't find extension '${extensionName}' to attach to '${actualExtensionSlotName}'`
      );
    }
  }

  return () => {
    active = false;
  };
}
