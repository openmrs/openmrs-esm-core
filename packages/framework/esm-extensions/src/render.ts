import { update } from "@openmrs/esm-state";
import { LifeCycles, mountRootParcel, Parcel } from "single-spa";
import { getExtensionNameFromId, getExtensionRegistration } from "./extensions";
import { checkStatus, getCustomProps } from "./helpers";
import { updateExtensionStore } from "./store";

export interface CancelLoading {
  (): void;
}

/**
 * Mounts into a DOM node (representing an extension slot)
 * a lazy-loaded component from *any* frontend module
 * that registered an extension component for this slot.
 */
export function renderExtension(
  domElement: HTMLElement,
  extensionSlotName: string,
  extensionSlotModuleName: string,
  extensionId: string,
  renderFunction: (lifecycle: LifeCycles) => LifeCycles = (x) => x,
  additionalProps: Record<string, any> = {}
): CancelLoading {
  const extensionName = getExtensionNameFromId(extensionId);
  const extensionRegistration = getExtensionRegistration(extensionId);
  let active: boolean = true;
  let parcel: Parcel | null = null;

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
          parcel = mountRootParcel(renderFunction(result ?? lifecycle) as any, {
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
          });
        }
      });

      markExtensionRendered(
        extensionId,
        extensionSlotModuleName,
        extensionSlotName,
        domElement
      );
    }
  }

  return () => {
    active = false;
    if (parcel) {
      if (parcel.getStatus() !== "MOUNTED") {
        parcel.mountPromise.then(() => {
          if (parcel) {
            parcel.unmount();
          }
        });
      } else {
        parcel.unmount();
      }
    }
  };
}

export function markExtensionRendered(
  extensionId,
  extensionSlotModuleName,
  extensionSlotName,
  domElement
) {
  const extensionName = getExtensionNameFromId(extensionId);
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
