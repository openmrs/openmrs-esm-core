import { update } from "@openmrs/esm-state";
import { mountRootParcel, Parcel } from "single-spa";
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
  let active: boolean | Parcel = true;

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

      extensionRegistration.load().then(({ default: result, ...lifecycle }) => {
        if (active) {
          const parcel = mountRootParcel(
            renderFunction(result ?? lifecycle) as any,
            {
              ...additionalProps,
              ...extensionContextProps,
              ...routeProps,
              domElement,
            }
          );
          active = parcel;
        }
      });

      updateExtensionStore((state) =>
        update(
          state,
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
    if (typeof active === "boolean") {
      active = false;
    } else {
      const p = active;

      if (p.getStatus() !== "MOUNTED") {
        p.mountPromise.then(() => p.unmount());
      } else {
        p.unmount();
      }
    }
  };
}
