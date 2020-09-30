declare global {
  interface Window {
    getOpenmrsSpaBase(): string;
    openmrsBase: string;
    spaBase: string;
    importMapOverrides: {
      getCurrentPageMap: () => Promise<ImportMap>;
    };
  }
}

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
}

export interface Activator {
  (location: Location): boolean;
}

export type ActivatorDefinition = Activator | RegExp | string;

export interface ModuleResolver {
  (): System.Module | Promise<System.Module>;
}
