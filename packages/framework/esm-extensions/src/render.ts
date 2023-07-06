/** @module @category Extension */
import { LifeCycles, mountRootParcel, Parcel, ParcelConfig } from "single-spa";
import { getExtensionNameFromId, getExtensionRegistration } from "./extensions";
import { checkStatus } from "./helpers";
import { updateInternalExtensionStore } from "./store";

export interface CancelLoading {
  (): void;
}

let parcelCount = 0;

/**
 * Mounts into a DOM node (representing an extension slot)
 * a lazy-loaded component from *any* frontend module
 * that registered an extension component for this slot.
 */
export async function renderExtension(
  domElement: HTMLElement,
  extensionSlotName: string,
  extensionSlotModuleName: string,
  extensionId: string,
  renderFunction: (application: ParcelConfig) => ParcelConfig = (x) => x,
  additionalProps: Record<string, any> = {}
): Promise<Parcel | null> {
  const extensionName = getExtensionNameFromId(extensionId);
  const extensionRegistration = getExtensionRegistration(extensionId);
  let parcel: Parcel | null = null;

  if (domElement) {
    if (!extensionRegistration) {
      throw Error(
        `Couldn't find extension '${extensionName}' to attach to '${extensionSlotName}'`
      );
    }

    const { load, meta, moduleName, online, offline } = extensionRegistration;

    if (checkStatus(online, offline)) {
      updateInternalExtensionStore((state) => {
        const instance = {
          domElement,
          id: extensionId,
          slotName: extensionSlotName,
          slotModuleName: extensionSlotModuleName,
        };
        return {
          ...state,
          extensions: {
            ...state.extensions,
            [extensionName]: {
              ...state.extensions[extensionName],
              instances: [
                ...state.extensions[extensionName].instances,
                instance,
              ],
            },
          },
        };
      });

      const { default: result, ...lifecycle } = await load();
      const id = parcelCount++;
      parcel = mountRootParcel(
        renderFunction({
          ...(result ?? lifecycle),
          name: `${extensionSlotName}/${extensionName}-${id}`,
        }),
        {
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
    }
  } else {
    console.warn(
      `Tried to render ${extensionId} into ${extensionSlotName} but no DOM element was available.`
    );
  }

  return parcel;
}
