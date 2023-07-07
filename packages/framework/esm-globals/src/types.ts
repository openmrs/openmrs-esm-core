import type { Application } from "single-spa";
import type { i18n } from "i18next";

declare global {
  const __webpack_share_scopes__: Record<
    string,
    Record<
      string,
      { loaded?: 1; get: () => Promise<unknown>; from: string; eager: boolean }
    >
  >;

  var __webpack_init_sharing__: (scope: string) => Promise<void>;

  interface Window {
    /**
     * Easily copies a text from an element.
     * @param source The source element carrying the text.
     */
    copyText(source: HTMLElement): void;
    /**
     * Gets the OpenMRS SPA base path with a trailing slash.
     */
    getOpenmrsSpaBase(): string;
    /**
     * Starts the OpenMRS SPA application.
     * @param config The configuration to use for running.
     */
    initializeSpa(config: SpaConfig): void;
    /**
     * Gets the API base path.
     */
    openmrsBase: string;
    /**
     * Gets the SPA base path.
     */
    spaBase: string;
    /**
     * Gets the determined SPA environment.
     */
    spaEnv: SpaEnvironment;
    /**
     * Gets the published SPA version.
     */
    spaVersion?: string;
    /**
     * Gets a set of options from the import-map-overrides package.
     */
    importMapOverrides: {
      getCurrentPageMap: () => Promise<ImportMap>;
      addOverride(moduleName: string, url: string): void;
      getOverrideMap(includeDisabled?: boolean): ImportMap;
    };
    /**
     * Gets the installed modules, which are tuples consisting of the module's name and exports.
     */
    installedModules: Array<[string, OpenmrsAppRoutes]>;
    /**
     * The i18next instance for the app.
     */
    i18next: i18n;
  }
}

export type SpaEnvironment = "production" | "development" | "test";

export interface ImportMap {
  imports: Record<string, string>;
}

/**
 * The configuration passed to the app shell initialization function
 */
export interface SpaConfig {
  /**
   * The base path or URL for the OpenMRS API / endpoints.
   */
  apiUrl: string;
  /**
   * The base path for the SPA root path.
   */
  spaPath: string;
  /**
   * The environment to use.
   * @default production
   */
  env?: SpaEnvironment;
  /**
   * URLs of configurations to load in the system.
   */
  configUrls?: Array<string>;
  /**
   * Defines if offline should be supported by installing a service worker.
   * @default true
   */
  offline?: boolean;
}

/** @internal */
export type RouteDefinition = RegExp | string | boolean;

/** @internal */
type AppComponent = {
  appName: string;
};

/**
 * A definition of a page extracted from an app's routes.json
 */
export type PageDefinition = {
  /**
   * The name of the component exported by this frontend module.
   */
  component: string;
  /**
   * Determines whether the component renders while the browser is connected to the internet. If false, this page will never render while online.
   */
  online?: boolean;
  /**
   * Determines whether the component renders while the browser is not connected to the internet. If false, this page will never render while offline.
   */
  offline?: boolean;
  /**
   * Determines the order in which this page is rendered in the app-shell, which is useful for situations where DOM ordering matters.
   */
  order?: number;
} & (
  | {
      /**
       * Either a string or a boolean.
       *
       * If a string value, this is used to indicate that this page should be rendered. For example, \"name\" will match when the current page is ${window.spaBase}/name.
       *
       * If a boolean, this either indicates that the component should always be rendered or should never be rendered.
       */
      route: string | boolean;
      /**
       * A regular expression used to match against the current route to determine whether this page should be rendered. Note that ${window.spaBase} will be removed before attempting to match, so setting this to \"^name.+\" will match any route that starts with ${window.spaBase}/name.
       */
      routeRegex?: never;
    }
  | {
      /**
       * Either a string or a boolean.
       *
       * If a string value, this is used to indicate that this page should be rendered. For example, \"name\" will match when the current page is ${window.spaBase}/name.
       *
       * If a boolean, this either indicates that the component should always be rendered or should never be rendered.
       */
      route?: never;
      /**
       * A regular expression used to match against the current route to determine whether this page should be rendered. Note that ${window.spaBase} will be removed before attempting to match, so setting this to \"^name.+\" will match any route that starts with ${window.spaBase}/name.
       */
      routeRegex: string;
    }
);

/**
 * A definition of a page after the app has been registered.
 */
export type RegisteredPageDefinition = Omit<PageDefinition, "order"> &
  AppComponent & { order: number };

/**
 * A definition of an extension as extracted from an app's routes.json
 */
export type ExtensionDefinition = {
  /**
   * The name of this extension. This is used to refer to the extension in configuration.
   */
  name: string;
  /**
   * If supplied, the slot that this extension is rendered into by default.
   */
  slot?: string;
  /**
   * If supplied, the slots that this extension is rendered into by default.
   */
  slots?: Array<string>;
  /**
   * Determines whether the component renders while the browser is connected to the internet. If false, this page will never render while online.
   */
  online?: boolean;
  /**
   * Determines whether the component renders while the browser is not connected to the internet. If false, this page will never render while offline.
   */
  offline?: boolean;
  /**
   * Determines the order in which this component renders in its default extension slot. Note that this can be overridden by configuration.
   */
  order?: number;
  /**
  
   */
  privileges?: string | Array<string>;
  /**
   * Meta describes any properties that are passed down to the extension when it is loaded
   */
  meta?: {
    [k: string]: unknown;
  };
} & (
  | {
      /**
       * The name of the component exported by this frontend module.
       */
      component: string;
      /**
       * @internal
       */
      load?: never;
    }
  | {
      /**
       * The name of the component exported by this frontend module.
       */
      component?: never;
      /**
       * @internal
       */
      load: Application;
    }
);

/**
 * This interface describes the format of the routes provided by an app
 */
export interface OpenmrsAppRoutes {
  /**
   * The version of this frontend module.
   */
  version?: string;
  /**
   * A list of backend modules necessary for this frontend module and the corresponding required versions.
   */
  backendDependencies?: Record<string, string>;
  /**
   * An array of all pages supported by this frontend module. Pages are automatically mounted based on a route.
   */
  pages?: Array<PageDefinition>;
  /**
   * An array of all extensions supported by this frontend module. Extensions can be mounted in extension slots, either via declarations in this file or configuration.
   */
  extensions?: Array<ExtensionDefinition>;
}

/**
 * This interfaces describes the format of the overall rotues.json loaded by the app shell.
 * Basically, this is the same as the app routes, with each routes definition keyed by the app's name
 */
export type OpenmrsRoutes = Record<string, OpenmrsAppRoutes>;

export interface ResourceLoader<T = any> {
  (): Promise<T>;
}
