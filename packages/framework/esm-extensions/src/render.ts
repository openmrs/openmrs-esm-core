/** @module @category Extension */
import {
  mountRootParcel,
  type AppProps,
  type CustomProps,
  type LifeCycles,
  type Parcel,
  type ParcelConfig,
  type ParcelProps,
} from 'single-spa';
import { getExtensionNameFromId, getExtensionRegistration } from './extensions';
import { checkStatus } from './helpers';
import { registerExtensionRendering, unregisterExtensionRendering } from './store';

export interface CancelLoading {
  (): void;
}

type MountParcel = AppProps['mountParcel'];

let parcelCount = 0;
let parcelMounter: Promise<MountParcel> | null = null;

/**
 * Mark parcels as dead if they do not succeed within 15s. Note that loading and unloading is
 * skipped as that has an unpredictable timing. Failing here allows us to clean-up correctly
 * if the parcel doesn't fully mount.
 */
const lifecycleTimeouts = {
  bootstrap: { millis: 15_000, dieOnTimeout: true },
  mount: { millis: 15_000, dieOnTimeout: true },
  unmount: { millis: 15_000, dieOnTimeout: true },
};

/**
 * Applies {@link lifecycleTimeouts} to a parcel config, resolving the function form first so that a
 * lazily loaded config gets them too.
 *
 * The cast is needed because single-spa reads `timeouts` off a parcel config but doesn't declare it
 * on `ParcelConfigObject`.
 */
function withLifecycleTimeouts(parcelConfig: ParcelConfig): ParcelConfig {
  // Spread after ours, so a parcel that declares its own timeouts keeps them.
  if (typeof parcelConfig === 'function') {
    return (() => parcelConfig().then((resolved) => ({ timeouts: lifecycleTimeouts, ...resolved }))) as ParcelConfig;
  }

  return { timeouts: lifecycleTimeouts, ...parcelConfig } as ParcelConfig;
}

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
 * Mounts a parcel through the framework's host parcel, which lets single-spa release the parcel,
 * its `domElement` and everything rendered into it once it unmounts. Prefer this to single-spa's
 * `mountRootParcel()`, which retains all three for the lifetime of the page.
 *
 * @param parcelConfig The parcel config, or a function that loads one
 * @param customProps The props to mount the parcel with, including the `domElement` to render into
 * @returns The parcel handle; mounting completes with its `mountPromise`
 */
export async function renderParcel<T = CustomProps>(
  parcelConfig: ParcelConfig,
  customProps: ParcelProps & T,
): Promise<ReturnType<MountParcel>> {
  const mountParcel = await getParcelMounter();
  return mountParcel(withLifecycleTimeouts(parcelConfig), customProps);
}

/**
 * Provides the equivalent of {@link renderParcel} for callers that need a `mountParcel()` they can
 * call synchronously, single-spa-react's `<Parcel mountParcel={...} />` being the usual case.
 *
 * The parcel it returns is a stand-in until the real one exists, so its `getStatus()` reports
 * `LOADING_SOURCE_CODE` rather than the real status for a short while after mounting. Prefer
 * {@link renderParcel} wherever the caller can await it.
 *
 * @returns A `mountParcel()` that mounts through the host parcel
 */
export function createParcelMounter(): MountParcel {
  return mountParcel;
}

/**
 * Adapts the asynchronous `renderParcel()` to single-spa's synchronous `mountParcel()` signature,
 * by returning an object that stands in for the parcel and forwards each call to the real one once
 * it resolves. A caller that serialises its calls on `mountPromise`, as single-spa-react's
 * `<Parcel>` does, never observes the stand-in; one that doesn't sees `getStatus()` report
 * `LOADING_SOURCE_CODE` until the parcel is mounted, and an unmounted parcel's `update()` and
 * `unmount()` deferred rather than rejected.
 */
function mountParcel(config: ParcelConfig, props: ParcelProps & CustomProps): Parcel {
  let mounted: Parcel | undefined;
  const pending = renderParcel(config, props).then((parcel) => (mounted = parcel));

  return {
    mount: () => pending.then((parcel) => parcel.mount()),
    unmount: () => pending.then((parcel) => parcel.unmount()),
    update: (customProps) => pending.then((parcel) => parcel.update?.(customProps)),
    getStatus: () => mounted?.getStatus() ?? 'LOADING_SOURCE_CODE',
    // Derived lazily so a mount failure surfaces only on the promise the caller actually reads,
    // instead of becoming an unhandled rejection on the ones it ignores.
    get loadPromise() {
      return pending.then((parcel) => parcel.loadPromise);
    },
    get bootstrapPromise() {
      return pending.then((parcel) => parcel.bootstrapPromise);
    },
    get mountPromise() {
      return pending.then((parcel) => parcel.mountPromise);
    },
    get unmountPromise() {
      return pending.then((parcel) => parcel.unmountPromise);
    },
  };
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
      const id = parcelCount++;
      const renderingId = `${extensionSlotName}/${extensionId}-${id}`;

      // Marks the node for the UI editor, which needs to pair a rendering with the element it went
      // into and cannot tell two renderings of one extension apart by any other attribute.
      domElement.dataset.extensionRenderingId = renderingId;

      const forget = () => unregisterExtensionRendering(renderingId);
      const forgetSafely = (cleanupErrorMessage: string) => {
        try {
          forget();
        } catch (cleanupError) {
          console.error(cleanupErrorMessage, cleanupError);
        }
      };

      // Registered before loading so that the config system can start resolving this extension's
      // config while its bundle is still in flight. Registering drives the config derivation
      // synchronously, so a failure there has to release the record before it propagates — nothing
      // else has a handle on it yet.
      try {
        registerExtensionRendering({
          renderingId,
          extensionName,
          extensionModuleName: moduleName,
          extensionId,
          slotName: extensionSlotName,
          slotModuleName: extensionSlotModuleName,
        });
      } catch (e) {
        forgetSafely(`Recomputing configuration after registering '${extensionId}' failed also failed`);

        throw e;
      }

      let lifecycle: LifeCycles;

      try {
        lifecycle = await load();
      } catch (e) {
        forgetSafely(`Recomputing configuration after '${extensionId}' failed to load also failed`);

        throw e;
      }

      try {
        parcel = await renderParcel(
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
        forgetSafely(`Recomputing configuration after '${extensionId}' failed to mount also failed`);

        throw e;
      }

      // A parcel that fails to bootstrap or mount never settles `unmountPromise`, so the mount
      // rejection has to release the record too. single-spa hard-fails parcels, so its own error
      // handlers never see either failure and the rejected promise is the only channel left.
      parcel.mountPromise.then(undefined, (err) => {
        console.error(`Extension '${extensionId}' in slot '${extensionSlotName}' failed to mount`, err);
        forgetSafely(`Recomputing configuration after '${extensionId}' failed to mount also failed`);
      });
      parcel.unmountPromise.then(
        () => forgetSafely(`Recomputing configuration after unmounting '${extensionId}' failed`),
        (err) => {
          console.error(`Extension '${extensionId}' in slot '${extensionSlotName}' failed to unmount`, err);
          forgetSafely(`Recomputing configuration after '${extensionId}' failed to unmount also failed`);
        },
      );
    }
  } else {
    console.warn(`Tried to render ${extensionId} into ${extensionSlotName} but no DOM element was available.`);
  }

  return parcel;
}
