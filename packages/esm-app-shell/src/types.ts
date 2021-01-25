declare global {
  interface Window {
    getOpenmrsSpaBase(): string;
    openmrsBase: string;
    spaBase: string;
    spaEnv: SpaEnvironment;
    spaVersion?: string;
    importMapOverrides: {
      getCurrentPageMap: () => Promise<ImportMap>;
    };
    installedModules: Array<any>;
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

export interface Activator {
  (location: Location): boolean;
}

export type ActivatorDefinition = Activator | RegExp | string;

export interface ModuleResolver {
  (): System.Module | Promise<System.Module>;
}
