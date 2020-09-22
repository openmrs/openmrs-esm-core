declare global {
  interface Window extends SpaConfig {
    getOpenmrsSpaBase(): string;
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
   * The base path for the OpenMRS API / endpoints.
   */
  openmrsBase: string;
  /**
   * The base path for the SPA root path.
   */
  spaBase: string;
}
