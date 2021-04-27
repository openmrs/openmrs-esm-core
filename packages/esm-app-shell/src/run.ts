import { start } from "single-spa";
import {
  setupApiModule,
  renderLoadingSpinner,
  createAppState,
  Config,
  provide,
  showToast,
  renderToasts,
  integrateBreakpoints,
  dispatchConnectivityChanged,
  subscribeToastShown,
} from "@openmrs/esm-framework";
import { setupI18n } from "./locale";
import { registerApp, tryRegisterExtension } from "./apps";
import { sharedDependencies } from "./dependencies";
import { loadModules, registerModules } from "./system";
import { appName, getCoreExtensions } from "./ui";

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
 * Sets up the microfrontends (apps). Uses the defined export
 * from the root modules of the apps, which should export a
 * special function called "setupOpenMRS".
 * That function returns an object that is used to feed Single
 * SPA.
 */
async function setupApps(modules: Array<[string, System.Module]>) {
  for (const [appName, appExports] of modules) {
    registerApp(appName, appExports);
  }

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
  // trigger single SPA re-evaluation
  window.history.replaceState(undefined, document.title, undefined);
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

function showToasts() {
  return renderToasts(document.querySelector(".omrs-toasts-container"));
}

function showLoadingSpinner() {
  return renderLoadingSpinner(document.body);
}

export function run(configUrls: Array<string>) {
  const closeLoading = showLoadingSpinner();
  const provideConfigs = createConfigLoader(configUrls);

  integrateBreakpoints();
  showToasts();
  createAppState({});
  subscribeToastShown(showToast);
  registerModules(sharedDependencies);
  setupApiModule();
  registerCoreExtensions();

  return loadApps()
    .then(setupApps)
    .then(provideConfigs)
    .then(runShell)
    .catch(handleInitFailure)
    .then(closeLoading);
}
