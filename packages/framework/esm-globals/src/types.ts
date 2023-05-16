import type { LifeCycleFn } from "single-spa";

declare global {
  const __webpack_share_scopes__: Record<
    string,
    Record<
      string,
      { loaded?: 1; get: () => Promise<unknown>; from: string; eager: boolean }
    >
  >;
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
    };
    /**
     * Gets the installed modules, which are tuples consisting of the module's name and exports.
     */
    installedModules: Array<
      [
        string,
        { version?: string; backendDependencies?: Record<string, string> }
      ]
    >;
    /**
     * The remotes from Webpack Module Federation.
     */
    __remotes__: Record<string, string>;
  }
}

export type SpaEnvironment = "production" | "development" | "test";

export interface ImportMap {
  imports: Record<string, string>;
}

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

export interface ResourceLoader<T = any> {
  (): Promise<T>;
}
