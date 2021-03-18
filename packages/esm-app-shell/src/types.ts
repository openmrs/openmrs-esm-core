import type { SpaEnvironment } from "@openmrs/esm-framework";

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
  (): System.Module;
}
