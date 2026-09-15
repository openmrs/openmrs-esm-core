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

type ParcelConfigObject = Extract<ParcelConfig, LifeCycles>;
type LifecycleFn = Exclude<LifeCycles['mount'], readonly unknown[]>;
type LifecycleName = keyof typeof lifecycleDeadlines;

/** Reports how one of a parcel's lifecycles settled. */
type LifecycleSettled = (which: LifecycleName, failed: boolean) => void;

/** Follows the props object single-spa holds for a parcel, so it can be emptied on failure. */
interface PropsTracker {
  /** Reports how one of the parcel's lifecycles settled. */
  onSettled: LifecycleSettled;
  /** Tracks a copy of `next` in place of the props tracked so far, and returns it to pass on. */
  retarget(next: Record<string, unknown>): Record<string, unknown>;
  /** Empties the tracked props. */
  release(): void;
}

/**
 * How long each lifecycle gets before the parcel is marked dead. Loading and unloading are left
 * out, as their timing is unpredictable. These are meant to be generous.
 *
 * These are enforced by {@link withDeadline} rather than through single-spa's `timeouts`, because
 * `reasonableTime()` never clears the timers it schedules from that config: until one fires its
 * closure retains the parcel, the `domElement` it was given and the whole subtree rendered into it.
 */
const lifecycleDeadlines = {
  bootstrap: 15_000,
  mount: 15_000,
  unmount: 15_000,
};

/** single-spa's own test for a thenable, which is all it requires a lifecycle to return. */
function isPromiseLike(value: unknown): value is Promise<unknown> {
  const thenable = value as Promise<unknown> | undefined;
  return typeof thenable?.then === 'function' && typeof thenable?.catch === 'function';
}

/**
 * Collapses single-spa's "function or array of functions" lifecycle shape into one function that
 * runs each in turn, rejecting if any of them returns something that is not a promise.
 */
function toSingleFn(lifecycle: LifecycleFn | Array<LifecycleFn>, name: string, which: LifecycleName): LifecycleFn {
  const fns = Array.isArray(lifecycle) ? lifecycle : [lifecycle];

  return (props) =>
    fns.reduce<Promise<unknown>>(
      (chain, fn, index) =>
        chain.then(() => {
          const result = fn(props);

          return isPromiseLike(result)
            ? result
            : Promise.reject(
                new Error(
                  `Lifecycle function ${which} at array index ${index} for parcel ${name} did not return a promise`,
                ),
              );
        }),
      Promise.resolve<unknown>(undefined),
    );
}

/**
 * Empties the props object single-spa is holding for a parcel.
 *
 * If a parcel's `unmount()` rejects, single-spa retains it in the `SKIP_BECAUSE_BROKEN` state,
 * including holding on to the props, which can include the DOM node if it was successfully
 * mounted. Since we hand single-spa the props, we can clear that object here which helps reduce
 * the memory pressure of the retained parcels
 */
function releaseProps(props: Record<string, unknown>) {
  for (const key of Object.keys(props)) {
    delete props[key];
  }
}

/**
 * Watches a parcel's lifecycles and releases its props once single-spa has no further use for them,
 * which is only ever after a failure: a parcel that unmounts cleanly is dropped by single-spa
 * itself, taking its props with it.
 *
 * The timing matters, because single-spa keeps calling lifecycles past the failure that broke the
 * parcel and they are handed these same props.
 *
 * Which object gets released moves over the parcel's life, since `update()` replaces the props
 * single-spa holds rather than merging into them. See {@link trackUpdates}.
 *
 * @param props The object single-spa was mounted with, which must not be the caller's own
 */
function trackProps(props: Record<string, unknown>): PropsTracker {
  let tracked = props;
  let mountFailed = false;
  const release = () => releaseProps(tracked);

  return {
    retarget(next) {
      tracked = { ...next };

      return tracked;
    },
    release,
    onSettled(which, failed) {
      switch (which) {
        case 'bootstrap':
          // single-spa breaks the parcel there and then, without calling anything else.
          if (failed) {
            release();
          }

          return;
        case 'mount':
          // A parcel whose mount fails is unmounted before it is broken, so that the extension gets
          // to tear down whatever it managed to render. The release waits for that unmount.
          mountFailed ||= failed;

          return;
        case 'unmount':
          if (failed || mountFailed) {
            release();
          }

          return;
      }
    },
  };
}

/**
 * Points a parcel's `update()` at a copy of the props it is given, which {@link trackProps} then
 * follows in place of the ones the parcel was mounted with.
 *
 * single-spa's `update()` assigns the props it is given over the ones it holds, so without this a
 * later failure would empty the mount-time copy while single-spa kept the updated one — which, for
 * the workspaces' `<Parcel>`, carries the `domElement` and everything rendered into it.
 *
 * single-spa attaches `update()` to the parcel only once its config has loaded, and only for a
 * config that has an update lifecycle, so this intercepts the assignment rather than the method:
 * callers such as `<Extension>` read `update` to decide whether the parcel can be updated at all.
 */
function trackUpdates(parcel: Parcel, tracker: PropsTracker): Parcel {
  const wrap =
    (update: NonNullable<Parcel['update']>): Parcel['update'] =>
    (customProps) =>
      update.call(parcel, tracker.retarget(customProps)).catch((err: unknown) => {
        if (parcel.getStatus() === 'SKIP_BECAUSE_BROKEN') {
          tracker.release();
        }

        throw err;
      });

  let tracked = parcel.update && wrap(parcel.update);

  return Object.defineProperty(parcel, 'update', {
    configurable: true,
    enumerable: true,
    get: () => tracked,
    set: (update: Parcel['update']) => {
      tracked = update && wrap(update);
    },
  });
}

/**
 * Wraps a lifecycle so that it rejects once `millis` have elapsed, clearing the timer as soon as it
 * settles either way. Rejecting puts the parcel into the same broken state single-spa's own
 * `dieOnTimeout` would, but without leaving a timer holding the parcel for the full deadline.
 *
 * Reporting each outcome to `onSettled` from here rather than from the parcel's own promises leaves
 * a rejection no caller handles free to reach the global unhandled rejection handler.
 */
function withDeadline(
  lifecycle: LifecycleFn | Array<LifecycleFn>,
  millis: number,
  name: string,
  which: LifecycleName,
  onSettled: LifecycleSettled,
): LifecycleFn {
  const run = toSingleFn(lifecycle, name, which);

  return (props) => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const deadline = new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(new Error(`Lifecycle function ${which} for parcel ${name} did not settle within ${millis}ms`)),
        millis,
      );
    });

    return Promise.race([run(props), deadline])
      .finally(() => clearTimeout(timer))
      .then(
        (value) => {
          onSettled(which, false);
          return value;
        },
        (err) => {
          onSettled(which, true);
          throw err;
        },
      );
  };
}

/** Applies {@link lifecycleDeadlines} to a resolved parcel config. */
function boundLifecycles(parcelConfig: ParcelConfigObject, onSettled: LifecycleSettled): ParcelConfigObject {
  // A parcel that declares its own timeouts is bounding itself, so it is left to single-spa.
  if ((parcelConfig as { timeouts?: unknown }).timeouts) {
    return parcelConfig;
  }

  const name = (parcelConfig as { name?: string }).name ?? 'parcel';
  const bounded = Object.fromEntries(
    (Object.keys(lifecycleDeadlines) as Array<LifecycleName>)
      .filter((which) => parcelConfig[which])
      .map((which) => [which, withDeadline(parcelConfig[which], lifecycleDeadlines[which], name, which, onSettled)]),
  );

  return { ...parcelConfig, ...bounded };
}

/**
 * Applies {@link boundLifecycles} to a parcel config, resolving the function form first so that a
 * lazily loaded config gets the deadlines too.
 */
function withLifecycleDeadlines(parcelConfig: ParcelConfig, onSettled: LifecycleSettled): ParcelConfig {
  if (typeof parcelConfig === 'function') {
    return (() => parcelConfig().then((resolved) => boundLifecycles(resolved, onSettled))) as ParcelConfig;
  }

  return boundLifecycles(parcelConfig, onSettled);
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
  // Copied because single-spa holds onto this object for as long as it holds the parcel, and
  // {@link releaseProps} empties it; the caller's own object is unchanged.
  const props = { ...customProps };
  const tracker = trackProps(props);

  return trackUpdates(mountParcel(withLifecycleDeadlines(parcelConfig, tracker.onSettled), props), tracker);
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
