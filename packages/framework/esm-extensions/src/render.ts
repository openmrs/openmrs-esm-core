/** @module @category Extension */
import { type LifeCycles, mountRootParcel, type Parcel, type ParcelConfig } from 'single-spa';
import { getExtensionNameFromId, getExtensionRegistration } from './extensions';
import { checkStatus } from './helpers';
import { registerExtensionRendering, unregisterExtensionRendering } from './store';

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
  additionalProps: Record<string, any> = {},
): Promise<Parcel | null> {
  const extensionName = getExtensionNameFromId(extensionId);
  const extensionRegistration = getExtensionRegistration(extensionId);
  let parcel: Parcel | null = null;

  if (domElement) {
    if (!extensionRegistration) {
      throw Error(`Couldn't find extension '${extensionName}' to attach to '${extensionSlotName}'`);
    }

    const { meta, moduleName, online, offline, load } = extensionRegistration;

    if (checkStatus(online, offline)) {
      const id = parcelCount++;
      const renderingId = `${extensionSlotName}/${extensionId}-${id}`;

      // Registered before loading so that the config system can start resolving this extension's
      // config while its bundle is still in flight.
      registerExtensionRendering({
        renderingId,
        extensionName,
        extensionModuleName: moduleName,
        id: extensionId,
        slotName: extensionSlotName,
        slotModuleName: extensionSlotModuleName,
      });

      let lifecycle: LifeCycles;

      try {
        lifecycle = await load();
      } catch (e) {
        // Releasing the record runs the config recomputation cascade, which can itself throw;
        // letting that escape would replace the load failure that actually matters.
        try {
          unregisterExtensionRendering(renderingId);
        } catch (cleanupError) {
          console.error(`Recomputing configuration after '${extensionId}' failed to load also failed`, cleanupError);
        }

        throw e;
      }

      const forget = () => unregisterExtensionRendering(renderingId);

      try {
        parcel = mountRootParcel(
          renderFunction({
            ...lifecycle,
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
          },
        );
      } catch (e) {
        try {
          forget();
        } catch (cleanupError) {
          console.error(`Recomputing configuration after '${extensionId}' failed to mount also failed`, cleanupError);
        }

        throw e;
      }

      // A parcel that fails to bootstrap or mount never settles `unmountPromise`, so the mount
      // rejection has to release the record too. single-spa hard-fails parcels, so its own error
      // handlers never see either failure and the rejected promise is the only channel left.
      parcel.mountPromise.then(undefined, (err) => {
        console.error(`Extension '${extensionId}' in slot '${extensionSlotName}' failed to mount`, err);
        forget();
      });
      parcel.unmountPromise.then(forget, (err) => {
        console.error(`Extension '${extensionId}' in slot '${extensionSlotName}' failed to unmount`, err);
        forget();
      });
    }
  } else {
    console.warn(`Tried to render ${extensionId} into ${extensionSlotName} but no DOM element was available.`);
  }

  return parcel;
}
