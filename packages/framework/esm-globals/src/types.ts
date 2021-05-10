declare global {
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
    installedModules: Array<[string, any]>;
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
}

export interface ResourceLoader<T = any> {
  (): Promise<T>;
}

export interface ComponentDefinition {
  /**
   * Defines a function to use for actually loading the component's lifecycle.
   */
  load(): Promise<any>;
  /**
   * Defines the online support / properties of the component.
   */
  online?: boolean | object;
  /**
   * Defines the offline support / properties of the component.
   */
  offline?: boolean | object;
  /**
   * Defines resources that are loaded when the component should mount.
   */
  resources?: Record<string, ResourceLoader>;
}

export interface ModernAppExtensionDefinition extends ComponentDefinition {
  /**
   * The ID of the extension to register.
   */
  id: string;
  /**
   * The slot of the extension to optionally attach to.
   */
  slot?: string;
  /**
   * The slots of the extension to optionally attach to.
   */
  slots?: Array<string>;
  /**
   * The meta data used for reflection by other components.
   */
  meta?: Record<string, any>;
}

export interface LegacyAppExtensionDefinition extends ComponentDefinition {
  /**
   * The ID of the extension to register.
   */
  name: string;
  /**
   * The meta data used for reflection by other components.
   */
  meta?: Record<string, any>;
}

export type AppExtensionDefinition = ModernAppExtensionDefinition &
  LegacyAppExtensionDefinition;

export interface PageDefinition extends ComponentDefinition {
  /**
   * The route of the page.
   */
  route: string;
}
