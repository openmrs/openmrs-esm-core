import { update } from "@openmrs/esm-state";
import { mountRootParcel, Parcel } from "single-spa";
import { getExtensionNameFromId, getExtensionRegistration } from "./extensions";
import { checkStatus, getCustomProps } from "./helpers";
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
  extensionSlotName: string,
  extensionSlotModuleName: string,
  extensionId: string,
  renderFunction: (lifecycle: Lifecycle) => Lifecycle = (x) => x,
  additionalProps: Record<string, any> = {}
): CancelLoading {
  const extensionName = getExtensionNameFromId(extensionId);
  const extensionRegistration = getExtensionRegistration(extensionId);
  let active: boolean | Parcel = true;

  if (domElement) {
    if (!extensionRegistration) {
      throw Error(
        `Couldn't find extension '${extensionName}' to attach to '${extensionSlotName}'`
      );
    }

    const { load, online, offline, meta, moduleName } = extensionRegistration;

    if (checkStatus(online, offline)) {
      load().then(({ default: result, ...lifecycle }) => {
        if (active) {
          const parcel = mountRootParcel(
            renderFunction(result ?? lifecycle) as any,
            {
              ...getCustomProps(online, offline),
              ...additionalProps,
              _meta: meta,
              _extensionContext: {
                extensionId,
                extensionSlotName,
                extensionSlotModuleName,
                extensionModuleName: moduleName,
              },
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
            extensionSlotName,
          ],
          { domElement, id: extensionId }
        )
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
