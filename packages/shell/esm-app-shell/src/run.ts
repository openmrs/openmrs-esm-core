import "import-map-overrides";
import "systemjs/dist/system";
import "systemjs/dist/extras/amd";
import "systemjs/dist/extras/named-exports";
import "systemjs/dist/extras/named-register";
import "systemjs/dist/extras/use-default";
import { start, unregisterApplication, getAppNames } from "single-spa";
import {
  setupApiModule,
  renderLoadingSpinner,
  createAppState,
  Config,
  provide,
  showNotification,
  showActionableNotification,
  showToast,
  renderInlineNotifications,
  renderActionableNotifications,
  renderToasts,
  integrateBreakpoints,
  dispatchConnectivityChanged,
  subscribeNotificationShown,
  subscribeActionableNotificationShown,
  subscribeToastShown,
  registerOmrsServiceWorker,
  messageOmrsServiceWorker,
  subscribeConnectivity,
  getCurrentUser,
  renderModals,
  dispatchPrecacheStaticDependencies,
  activateOfflineCapability,
  subscribePrecacheStaticDependencies,
  openmrsFetch,
} from "@openmrs/esm-framework/src/internal";
import {
  finishRegisteringAllApps,
  registerApp,
  tryRegisterExtension,
} from "./apps";
import { setupI18n } from "./locale";
import { loadModules } from "./load-modules";
import { appName, getCoreExtensions } from "./ui";
import { registerModules, sharedDependencies } from "./dependencies";

/**
 * Loads the frontend modules (apps and widgets). Should be done *after*
 * the import maps initialized, i.e., after modules loaded.
 *
 * By convention we call frontend modules registering activation functions
 * apps, and all others widgets. This is not enforced technically.
 */
function loadApps() {
  return window.importMapOverrides
    .getCurrentPageMap()
    .then((importMap) => loadModules(importMap.imports));
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
 * Sets up the frontend modules (apps). Uses the defined export
 * from the root modules of the apps, which should export a
 * special function called "setupOpenMRS".
 * That function returns an object that is used to feed Single
 * SPA.
 */
async function setupApps(modules: Array<[string, System.Module]>) {
  modules.forEach(([appName, appExports]) => registerApp(appName, appExports));
  subscribeConnectivity(async () => {
    const appNames = getAppNames();
    await Promise.all(appNames.map(unregisterApplication));
    finishRegisteringAllApps();
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
    critical: true,
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
  renderFatalErrorPage(e);
}

function renderFatalErrorPage(e?: Error) {
  const template = document.querySelector<HTMLTemplateElement>("#app-error");

  if (template) {
    const fragment = template.content.cloneNode(true) as DocumentFragment;
    const messageContainer = fragment.querySelector('[data-var="message"]');

    if (messageContainer) {
      messageContainer.textContent =
        e?.message || "No additional information available.";
    }

    if (
      localStorage.getItem("openmrs:devtools") &&
      Object.keys(localStorage).some((k) =>
        k.startsWith("import-map-override:")
      )
    ) {
      const appErrorActionButtons = fragment?.querySelector("#buttons");
      if (appErrorActionButtons) {
        const clearDevOverridesButton = document.createElement("button");
        clearDevOverridesButton.className = "cds--btn";
        clearDevOverridesButton.innerHTML = "Clear dev overrides";
        clearDevOverridesButton.onclick = clearDevOverrides;
        appErrorActionButtons.appendChild(clearDevOverridesButton);
      }
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

function showActionableNotifications() {
  renderActionableNotifications(
    document.querySelector(".omrs-actionable-notifications-container")
  );
  return;
}

function showToasts() {
  renderToasts(document.querySelector(".omrs-toasts-container"));
  return;
}

function showModals() {
  renderModals(document.querySelector(".omrs-modals-container"));
  return;
}

function showLoadingSpinner() {
  return renderLoadingSpinner(document.body);
}

async function setupOffline() {
  try {
    await registerOmrsServiceWorker(
      `${window.getOpenmrsSpaBase()}service-worker.js`
    );
    await activateOfflineCapability();
    setupOfflineStaticDependencyPrecaching();
  } catch (error) {
    console.error("Error while setting up offline mode.", error);
    showNotification({
      kind: "error",
      title: "Offline Setup Error",
      description: error.message,
    });
  }
}

function setupOfflineStaticDependencyPrecaching() {
  const precacheDelay = 1000 * 60 * 5;
  let lastPrecache: Date | null = null;

  subscribeOnlineAndLoginChange((online, hasLoggedInUser) => {
    const hasExceededPrecacheDelay =
      !lastPrecache ||
      new Date().getTime() - lastPrecache.getTime() > precacheDelay;

    if (hasLoggedInUser && online && hasExceededPrecacheDelay) {
      lastPrecache = new Date();
      dispatchPrecacheStaticDependencies();
    }
  });
}

function subscribeOnlineAndLoginChange(
  cb: (online: boolean, hasLoggedInUser: boolean) => void
) {
  let isOnline = false;
  let hasLoggedInUser = false;

  getCurrentUser({ includeAuthStatus: false }).subscribe((user) => {
    hasLoggedInUser = !!user;
    cb(isOnline, hasLoggedInUser);
  });

  subscribeConnectivity(({ online }) => {
    isOnline = online;
    cb(online, hasLoggedInUser);
  });
}

async function precacheGlobalStaticDependencies() {
  await precacheImportMap();

  // By default, cache the session endpoint.
  // This ensures that a lot of user/session related functions also work offline.
  const sessionPathUrl = new URL(
    `${window.openmrsBase}/ws/rest/v1/session`,
    window.location.origin
  ).href;

  await messageOmrsServiceWorker({
    type: "registerDynamicRoute",
    url: sessionPathUrl,
    strategy: "network-first",
  });

  await openmrsFetch("/ws/rest/v1/session").catch((e) =>
    console.warn(
      "Failed to precache the user session data from the app shell. MFs depending on this data may run into problems while offline.",
      e
    )
  );
}

async function precacheImportMap() {
  const importMap = await window.importMapOverrides.getCurrentPageMap();
  await messageOmrsServiceWorker({
    type: "onImportMapChanged",
    importMap,
  });
}

function setupOfflineCssClasses() {
  subscribeConnectivity(({ online }) => {
    const body = document.querySelector("body")!;
    if (online) {
      body.classList.remove("omrs-offline");
    } else {
      body.classList.add("omrs-offline");
    }
  });
}

export function run(configUrls: Array<string>, offline: boolean) {
  const closeLoading = showLoadingSpinner();
  const provideConfigs = createConfigLoader(configUrls);

  integrateBreakpoints();
  showToasts();
  showModals();
  showNotifications();
  showActionableNotifications();
  createAppState({});
  subscribeNotificationShown(showNotification);
  subscribeActionableNotificationShown(showActionableNotification);
  subscribeToastShown(showToast);
  subscribePrecacheStaticDependencies(precacheGlobalStaticDependencies);
  // FIXME this is part of a hack to load esm-form-app which depends on the legacy loading for now
  // Once esm-form-app can be upgraded to Angular 12 and Module Federation, we should be able to ditch this
  registerModules(sharedDependencies);
  setupApiModule();
  registerCoreExtensions();

  return loadApps()
    .then(setupApps)
    .then(setupOfflineCssClasses)
    .then(provideConfigs)
    .then(runShell)
    .catch(handleInitFailure)
    .then(closeLoading)
    .then(() => (offline ? setupOffline() : undefined));
}
