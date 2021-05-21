import { start, unregisterApplication, getAppNames } from "single-spa";
import {
  setupApiModule,
  renderLoadingSpinner,
  createAppState,
  Config,
  provide,
  showNotification,
  showToast,
  renderInlineNotifications,
  renderToasts,
  integrateBreakpoints,
  dispatchConnectivityChanged,
  subscribeNotificationShown,
  subscribeToastShown,
  registerOmrsServiceWorker,
  messageOmrsServiceWorker,
  subscribeConnectivity,
  getSynchronizationCallbacks,
  getCurrentUser,
  KnownOmrsServiceWorkerEvents,
  dispatchNetworkRequestFailed,
} from "@openmrs/esm-framework";
import { setupI18n } from "./locale";
import { registerApp, tryRegisterExtension } from "./apps";
import { sharedDependencies } from "./dependencies";
import { loadModules, registerModules } from "./system";
import { appName, getCoreExtensions } from "./ui";
import { Workbox } from "workbox-window";

const allowedSuffixes = ["-app", "-widgets"];

/**
 * Gets the microfrontend modules (apps). These are entries
 * in the import maps that end with "-app".
 * @param maps The value of the "imports" property of the
 * import maps.
 */
function getApps(maps: Record<string, string>) {
  return Object.keys(maps).filter((m) =>
    allowedSuffixes.some((n) => m.endsWith(n))
  );
}

/**
 * Loads the microfrontends (apps and widgets). Should be done *after*
 * the import maps initialized, i.e., after modules loaded.
 *
 * By convention we call microfrontends registering activation functions
 * apps, and all others widgets. This is not enforced technically.
 */
function loadApps() {
  return window.importMapOverrides
    .getCurrentPageMap()
    .then((importMap) => loadModules(getApps(importMap.imports)));
}

/**
 * Registers the extensions already coming from the app shell itself.
 */
function registerCoreExtensions() {
  const extensions = getCoreExtensions();

  for (const extension of extensions) {
    tryRegisterExtension(appName, extension);
  }
}

/**
 * Calls the provided registration function.
 */
function callRegister(registerFn: () => void) {
  registerFn();
}

/**
 * Sets up the microfrontends (apps). Uses the defined export
 * from the root modules of the apps, which should export a
 * special function called "setupOpenMRS".
 * That function returns an object that is used to feed Single
 * SPA.
 */
async function setupApps(modules: Array<[string, System.Module]>) {
  const registerFns = modules.map(([appName, appExports]) =>
    registerApp(appName, appExports)
  );
  subscribeConnectivity(async () => {
    const appNames = getAppNames();
    await Promise.all(appNames.map(unregisterApplication));
    registerFns.forEach(callRegister);
  });
  window.installedModules = modules;
}

/**
 * Loads the provided configurations and sets them in the system.
 */
async function loadConfigs(configs: Array<{ name: string; value: Config }>) {
  for (const config of configs) {
    provide(config.value, config.name);
  }
}

/**
 * Invoked when the connectivity is changed.
 */
function connectivityChanged() {
  const online = navigator.onLine;
  dispatchConnectivityChanged(online);
  showToast({
    description: `Connection: ${online ? "online" : "offline"}`,
    title: "App",
    kind: online ? "success" : "warning",
  });
}

/**
 * Runs the shell by importing the translations and starting single SPA.
 */
function runShell() {
  window.addEventListener("offline", connectivityChanged);
  window.addEventListener("online", connectivityChanged);

  return setupI18n()
    .catch((err) => console.error(`Failed to initialize translations`, err))
    .then(() => start());
}

function handleInitFailure(e: Error) {
  console.error(e);

  if (localStorage.getItem("openmrs:devtools")) {
    clearDevOverrides();
  }

  renderApology(e.message);
}

function renderApology(message: string) {
  const template = document.querySelector<HTMLTemplateElement>("#app-error");

  if (template) {
    const fragment = template.content.cloneNode(true) as DocumentFragment;
    const messageContainer = fragment.querySelector('[data-var="message"]');

    if (messageContainer) {
      messageContainer.textContent =
        message || "No additional information available.";
    }

    document.body.appendChild(fragment);
  }
}

function clearDevOverrides() {
  for (const key of Object.keys(localStorage)) {
    if (
      key.startsWith("import-map-override:") &&
      !["import-map-override:react", "import-map-override:react-dom"].includes(
        key
      )
    ) {
      localStorage.removeItem(key);
    }
  }
  location.reload();
}

function createConfigLoader(configUrls: Array<string>) {
  const loadingConfigs = Promise.all(
    configUrls.map((configUrl) =>
      fetch(configUrl)
        .then((res) => res.json())
        .then((config) => ({
          name: configUrl,
          value: config,
        }))
        .catch((err) => {
          console.error(`Loading the config from "${configUrl}" failed.`, err);
          return {
            name: configUrl,
            value: {},
          };
        })
    )
  );
  return () => loadingConfigs.then(loadConfigs);
}

function showNotifications() {
  renderInlineNotifications(
    document.querySelector(".omrs-inline-notifications-container")
  );
  return;
}

function showToasts() {
  renderToasts(document.querySelector(".omrs-toasts-container"));
  return;
}

function showLoadingSpinner() {
  return renderLoadingSpinner(document.body);
}

async function setupServiceWorker() {
  const sw = await registerOmrsServiceWorker(
    `${window.getOpenmrsSpaBase()}service-worker.js`
  );
  registerSwEvents(sw);

  if (navigator.onLine) {
    try {
      await Promise.all([precacheImportMap(), precacheSharedApiEndpoints()]);

      showNotification({
        title: "You can now go offline",
        description:
          "The application is done preparing the offline mode. You can now use the website without an internet connection.",
        kind: "info",
      });
    } catch (e) {
      showNotification({
        title: "Offline Setup Error",
        description: `There was an error while preparing the website's offline mode. You can try reloading the page to potentially fix the error. Details: ${e}.`,
      });
    }
  }
}

function registerSwEvents(sw: Workbox) {
  sw.addEventListener("message", (e) => {
    const event = e.data as KnownOmrsServiceWorkerEvents;

    if (event.type === "networkRequestFailed") {
      dispatchNetworkRequestFailed(event);
    } else {
      console.warn(
        `Received an unknown service worker event of type ${event.type}.`,
        event
      );
    }
  });
}

async function precacheImportMap() {
  const importMap = await window.importMapOverrides.getCurrentPageMap();
  await messageOmrsServiceWorker({
    type: "onImportMapChanged",
    importMap,
  });
}

async function precacheSharedApiEndpoints() {
  await messageOmrsServiceWorker({ type: "clearDynamicRoutes" });

  // By default, cache the session endpoint.
  // This ensures that a lot of user/session related functions also work offline.
  const sessionPathUrl = new URL(
    `${window.openmrsBase}/ws/rest/v1/session`,
    window.location.origin
  ).href;

  await messageOmrsServiceWorker({
    type: "registerDynamicRoute",
    url: sessionPathUrl,
  });
}

function setupOfflineDataSynchronization() {
  // Synchronizing data requires a logged in user.
  let hasLoggedInUser = false;
  let isOnline = false;

  getCurrentUser({ includeAuthStatus: false }).subscribe((user) => {
    hasLoggedInUser = !!user;
    trySynchronize();
  });

  subscribeConnectivity(async ({ online }) => {
    isOnline = online;
    trySynchronize();
  });

  async function trySynchronize() {
    const syncCallbacks = getSynchronizationCallbacks();
    if (!isOnline || !hasLoggedInUser || syncCallbacks.length === 0) {
      return;
    }

    showNotification({
      title: "Synchronizing Offline Changes",
      description:
        "Synchronizing the changes you have made offline. This may take a while...",
      kind: "info",
    });

    await Promise.allSettled(syncCallbacks.map((cb) => cb()));

    showNotification({
      title: "Offline Synchronization Finished",
      description:
        "Finished synchronizing the changes you have made while offline.",
      kind: "success",
    });
  }
}

export function run(configUrls: Array<string>) {
  const closeLoading = showLoadingSpinner();
  const provideConfigs = createConfigLoader(configUrls);

  integrateBreakpoints();
  showToasts();
  showNotifications();
  createAppState({});
  subscribeNotificationShown(showNotification);
  subscribeToastShown(showToast);
  registerModules(sharedDependencies);
  setupApiModule();
  registerCoreExtensions();
  setupServiceWorker();

  return loadApps()
    .then(setupApps)
    .then(provideConfigs)
    .then(runShell)
    .catch(handleInitFailure)
    .then(closeLoading)
    .then(setupOfflineDataSynchronization);
}
