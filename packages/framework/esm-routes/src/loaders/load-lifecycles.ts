import { importDynamic } from '@openmrs/esm-dynamic-loading';
import { type LifeCycles } from 'single-spa';
import { registerModuleLoad } from '@openmrs/esm-config';

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
 * This function loads a single-spa Lifecycles from the given app. The Lifecycles should be
 * created using `getAsyncLifecycle()` or `getSyncLifecycle()` and exported in the app's
 * index.ts file.
 * The function is lazy and ensures that the appropriate module is loaded,
 * that the module's `startupApp()` is called before the component is loaded. It
 * then calls the component function, which should return either a single-spa
 * {@link LifeCycles} object or a {@link Promise} that will resolve to such an object.
 *
 * @param routesAppName The app name of the routes.json file defining the component to load
 *
 * @param fullComponentName The name of the component to load. Note that this can optionally
 * include the appName to load the component from (in the format `${appName}#${componentName}`),
 * or omitted to implicitly use routesAppName
 *
 */
export async function loadLifeCycles(routesAppName: string, fullComponentName: string): Promise<LifeCycles> {
  const poundIndex = fullComponentName.indexOf('#');
  const isNamespaced = poundIndex >= 0;
  const appName = isNamespaced ? fullComponentName.substring(0, poundIndex) : routesAppName;
  const componentName = isNamespaced ? fullComponentName.substring(poundIndex + 1) : fullComponentName;

  const module = await importDynamic<Module>(appName);

  if (module && Object.hasOwn(module, componentName) && typeof module[componentName] === 'function') {
    return initializeApp(appName, module).then(() => module[componentName]());
  } else {
    if (!module) {
      console.warn(`Unknown app ${appName} for ${fullComponentName} defined in ${routesAppName}'s routes.json`);
    } else if (module && Object.hasOwn(module, componentName)) {
      console.warn(`The export ${fullComponentName}, defined in ${routesAppName}'s routes.json, is not a function`);
    } else {
      console.warn(
        `${appName} does not define a component called "${componentName}", referenced in ${routesAppName}'s routes.json. This cannot be loaded.`,
      );
    }
  }

  return emptyLifecycle;
}

const emptyLifecycle: LifeCycles<never> = {
  bootstrap() {
    return Promise.resolve();
  },
  mount() {
    return Promise.resolve();
  },
  unmount() {
    return Promise.resolve();
  },
};

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
async function initializeApp(appName: string, module?: Module) {
  if (!(appName in initializedApps)) {
    let _module: Module = module ?? (await importDynamic<Module>(appName));

    await (initializedApps[appName] = new Promise((resolve, reject) => {
      if (Object.hasOwn(_module, 'startupApp')) {
        const startup = _module['startupApp'];
        if (typeof startup === 'function') {
          return Promise.resolve(startup())
            .then(() => {
              registerModuleLoad(appName);
              resolve(null);
            })
            .catch(reject);
        }
      }

      registerModuleLoad(appName);
      resolve(null);
    }));
  } else {
    await initializedApps[appName];
  }
}
