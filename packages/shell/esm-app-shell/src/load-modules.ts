/**
 * Loads all provided modules into the webpack runtime so that they
 * may be used.
 *
 * Our module loading system is based on Webpack Module Federation.
 * We have a "dynamic remote containers" system. The "entry point" of
 * the application is `@openmrs-esm-app-shell`. The list of remotes
 * to be loaded is supplied in import maps, which are loaded by
 * SystemJS. We are not using the SystemJS registry at all, only WMF.
 *
 * Each module ("remote") is provided as a name and URL. For each URL,
 * a `<script>` element is appended to the DOM. Because those scripts have webpack
 * library type == 'var', when they are loaded, they create a new
 * global variable which has the Webpack Container Interface for that
 * module: the `init` and `get` methods. We use those to obtain the
 * actual module exports.
 *
 * @param modules A mapping from module names to URLs.
 * @returns The interfaces of those modules.
 */
export async function loadModules(modules: Record<string, string>) {
  return Promise.all(
    Object.entries(modules).map(async ([name, url]) => {
      await new Promise((resolve, reject) => {
        loadScript(name, url, resolve, reject);
      });
      const app: any = window[slugify(name)];
      if (!app) {
        console.error(
          `${name} failed to be loaded into the webpack container. It might have been built using a version of the 'openmrs' library < 4.0.`
        );
        return [name, {}];
      }
      app.init(__webpack_share_scopes__.default);
      const start = await app.get("./start");
      const moduleExports = start();
      return [name, moduleExports];
    })
  );
}

/**
 * Appends a `<script>` to the DOM with the given URL.
 */
function loadScript(
  name: string,
  url: string,
  resolve: (value: unknown) => void,
  reject: () => void
) {
  if (!document.head.querySelector(`script[src="${url}"]`)) {
    const element = document.createElement("script");
    // Webpack uses this attribute to check whether a module has already
    // been loaded into the application.
    element.setAttribute("data-webpack", slugify[name]);
    element.src = url;
    element.type = "text/javascript";
    element.async = true;
    element.onload = () => {
      resolve(null);
    };

    element.onerror = (ev: ErrorEvent) => {
      console.error(`Failed to load script from ${url}`);
      console.error(ev);
      reject();
    };

    document.head.appendChild(element);
  } else {
    console.warn("Script already loaded. Not loading it again.", url);
    resolve(null);
  }
}

function slugify(name) {
  return name.replace(/[\/\-@]/g, "_");
}
