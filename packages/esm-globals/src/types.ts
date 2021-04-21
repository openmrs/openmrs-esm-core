declare global {
  interface Window {
    copyText(source: HTMLElement): void;
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

export interface ModernAppExtensionDefinition {
  id: string;
  slot?: string;
  slots?: Array<string>;
  load(): Promise<any>;
  meta?: Record<string, any>;
  online?: boolean | object;
  offline?: boolean | object;
}

export interface LegacyAppExtensionDefinition {
  name: string;
  load(): Promise<any>;
}

export type AppExtensionDefinition = ModernAppExtensionDefinition &
  LegacyAppExtensionDefinition;

export interface PageDefinition {
  route: string;
  load(): Promise<any>;
  online?: boolean | object;
  offline?: boolean | object;
}
