import { importDynamic } from '@openmrs/esm-dynamic-loading';
import { type LifeCycles } from 'single-spa';
import { emptyLifecycle } from './helpers';

// Couldn't figure out how to express this as an interface
type Module = Omit<Record<string, () => LifeCycles | Promise<LifeCycles>>, 'startupApp'> & {
  startupApp?: () => unknown;
};

/**
 * @internal
 *
 * Used internally to track which apps have had their `startupApp()` initializer called
 *
 * Values are promises to support asynchronous loading of the same app multiple times
 */
const initializedApps = new Map<string, Promise<unknown>>();

/**
 * This function creates a loader function suitable for use in either a single-spa
 * application or parcel.
 *
 * The returned function is lazy and ensures that the appropriate module is loaded,
 * that the module's `startupApp()` is called before the component is loaded. It
 * then calls the component function, which should return either a single-spa
 * {@link LifeCycles} object or a {@link Promise} that will resolve to such an object.
 *
 * React-based pages or extensions should generally use the framework's
 * `getAsyncLifecycle()` or `getSyncLifecycle()` functions.
 */
export function getLoader(appName: string, component: string): () => Promise<LifeCycles> {
  return async () => {
    const module = await importDynamic<Module>(appName);

    if (module && Object.hasOwn(module, component) && typeof module[component] === 'function') {
      return initializeApp(appName, module).then(() => module[component]());
    } else {
      if (module && Object.hasOwn(module, component)) {
        console.warn(`The export ${component} of the app ${appName} is not a function`);
      } else {
        console.warn(`The app ${appName} does not define a component called ${component}, this cannot be loaded`);
      }
    }

    return emptyLifecycle;
  };
}

/**
 * This function can be used to manually initialize an application without waiting for the
 * framework to load it. This can sometimes be helpful if the framework doesn't load code
 * at the point you think is appropriate.
 *
 * This will ensure that the module is available and that it's `startupApp()` function (if
 * any) will be called. Note that these are only guaranteed to be complete once the Promise
 * returned from the function completes.
 *
 * @param appName The name of the app to initialize
 * @param module The loaded code module, if available; if this parameter is omitted, this
 *   function will load it.
 * @returns a Promise which completes once the app has been loaded and initialized
 */
export async function initializeApp(appName: string, module?: Module) {
  if (!(appName in initializedApps)) {
    let _module: Module = module ?? (await importDynamic<Module>(appName));

    await (initializedApps[appName] = new Promise((resolve, reject) => {
      if (Object.hasOwn(_module, 'startupApp')) {
        const startup = _module['startupApp'];
        if (typeof startup === 'function') {
          return Promise.resolve(startup()).then(resolve).catch(reject);
        }
      }

      resolve(null);
    }));
  } else {
    await initializedApps[appName];
  }
}
