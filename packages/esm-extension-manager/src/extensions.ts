/**
 * Creates the extension component <-> extension slot management engine.
 *
 * The critical piece of information is the "name" parameter, which
 * creates the connection "component" <-> "slot".
 */

const extensions: Record<string, Array<ExtensionDefinition>> = {};

const importSingleSpaPromise = System.import("single-spa");

export interface ExtensionDefinition {
  appName: string;
  name: string;
  load(): Promise<any>;
}

export interface CancelLoading {
  (): void;
}

export function registerExtension({
  name,
  load,
  appName,
}: ExtensionDefinition) {
  const components = extensions[name] || (extensions[name] = []);
  components.push({
    name,
    load,
    appName,
  });
}

/**
 * Updates a DOM node (representing a so-called "extension slot")
 * dynamically with a lazy loaded component from *any* microfrontend
 * that registered an extension component for this slot.
 */
export function renderExtension(
  domElement: HTMLElement,
  name: string,
  params: any
): CancelLoading {
  const components = extensions[name] ?? [];
  const parcels: Array<any> = [];
  let active = true;

  importSingleSpaPromise.then(({ mountRootParcel }) => {
    if (domElement) {
      components.map(({ load }) =>
        load().then(
          ({ default: result }) =>
            active &&
            parcels.push(
              mountRootParcel(result, {
                domElement,
                ...params,
              })
            )
        )
      );
    }
  });
  return () => {
    active = false;
  };
}
