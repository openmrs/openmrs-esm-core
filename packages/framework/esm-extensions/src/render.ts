/** @module @category Extension */
import { mountRootParcel, type AppProps, type Parcel, type ParcelConfig } from 'single-spa';
import { getExtensionNameFromId, getExtensionRegistration } from './extensions';
import { checkStatus } from './helpers';
import { updateInternalExtensionStore } from './store';

export interface CancelLoading {
  (): void;
}

type MountParcel = AppProps['mountParcel'];

let parcelCount = 0;
let parcelMounter: Promise<MountParcel> | null = null;

/**
 * Resolves the function used to mount extensions, which is the `mountParcel()` of a long-lived
 * parcel of our own rather than single-spa's `mountRootParcel()`.
 *
 * single-spa only removes a parcel from its owner's registry when it unmounts if that owner has a
 * name, and the internal object backing `mountRootParcel()` has none (fixed in single-spa 7).
 * Anything mounted with it is therefore retained for the lifetime of the page, along with the
 * `domElement` it was given and the whole subtree rendered into it. Extensions mounted through a
 * named owner are pruned as they should be.
 *
 * The host parcel is mounted at most once, lazily, and never unmounted; if mounting it fails we
 * fall back to `mountRootParcel()`, since leaking is better than not rendering.
 */
function getParcelMounter(): Promise<MountParcel> {
  parcelMounter ??= new Promise<MountParcel>((resolve, reject) => {
    const host = mountRootParcel(
      {
        name: 'openmrs-extension-host',
        bootstrap: () => Promise.resolve(),
        mount: (props) => {
          // single-spa types a parcel's lifecycle props as only the custom props it was mounted
          // with, but they also carry the props single-spa itself injects, `mountParcel` included.
          resolve((props as unknown as AppProps).mountParcel);
          return Promise.resolve();
        },
        unmount: () => Promise.resolve(),
      },
      { domElement: document.createElement('div') },
    );

    host.mountPromise.catch(reject);
  }).catch((err) => {
    console.error(
      'The host parcel used to mount extensions could not be mounted. Falling back to mounting ' +
        'extensions as root parcels, which leaks their DOM elements.',
      err,
    );
    return mountRootParcel;
  });

  return parcelMounter;
}

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
              instances: [...state.extensions[extensionName].instances, instance],
            },
          },
        };
      });

      const lifecycle = await load();
      const id = parcelCount++;
      const mountParcel = await getParcelMounter();
      parcel = mountParcel(
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
    }
  } else {
    console.warn(`Tried to render ${extensionId} into ${extensionSlotName} but no DOM element was available.`);
  }

  return parcel;
}
