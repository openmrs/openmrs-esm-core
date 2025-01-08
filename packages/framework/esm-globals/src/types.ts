import type { LifeCycles } from 'single-spa';
import type { i18n } from 'i18next';

declare global {
  const __webpack_share_scopes__: Record<
    string,
    Record<string, { loaded?: 1; get: () => Promise<unknown>; from: string; eager: boolean }>
  >;

  // eslint-disable-next-line no-var
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
     * Indicates whether offline mode is enabled in this install or not.
     * This is used to determine whether offline functionality is present or not.
     */
    offlineEnabled: boolean;
    /**
     * Gets the API base path, e.g. /openmrs
     */
    openmrsBase: string;
    /**
     * Gets the SPA base path, e.g. /openmrs/spa
     */
    spaBase: string;
    /**
     * Set by the app shell. Indicates whether the app shell is running in production, development, or test mode.
     */
    spaEnv: SpaEnvironment;
    /**
     * The build number of the app shell. Set when the app shell is built by webpack.
     */
    spaVersion: string;
    /**
     * Gets a set of options from the import-map-overrides package.
     */
    importMapOverrides: {
      addOverride(moduleName: string, url: string): void;
      enableOverride(moduleName: string): void;
      getCurrentPageMap(): Promise<ImportMap>;
      getDefaultMap(): Promise<ImportMap>;
      getNextPageMap(): Promise<ImportMap>;
      addOverride(moduleName: string, url: string): void;
      getOverrideMap(includeDisabled?: boolean): ImportMap;
      getDisabledOverrides(): Array<string>;
      isDisabled(moduleName: string): boolean;
      removeOverride(moduleName: string): void;
      resetOverrides(): void;
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

export type SpaEnvironment = 'production' | 'development' | 'test';

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
   * If supplied, the page will only be rendered when this feature flag is enabled.
   */
  featureFlag?: string;
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
 * @internal
 * A definition of a page after the app has been registered.
 */
export type RegisteredPageDefinition = Omit<PageDefinition, 'order'> & AppComponent & { order: number };

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
   * The user must have ANY of these privileges to see this extension.
   */
  privileges?: string | Array<string>;
  /**
   * If supplied, the extension will only be rendered when this feature flag is enabled.
   */
  featureFlag?: string;
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
      load: () => Promise<{ default?: LifeCycles } & LifeCycles>;
    }
);

/**
 * A definition of a modal as extracted from an app's routes.json
 */
export type ModalDefinition = {
  /**
   * The name of this modal. This is used to launch the modal.
   */
  name: string;
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
      load: () => Promise<{ default?: LifeCycles } & LifeCycles>;
    }
);

/* The possible states a workspace window can be opened in. */
export type WorkspaceWindowState = 'maximized' | 'hidden' | 'normal';

/**
 * A definition of a workspace as extracted from an app's routes.json
 */
export type WorkspaceDefinition = {
  /**
   * The name of this workspace. This is used to launch the workspace.
   */
  name: string;
  /**
   * The title of the workspace. This will be looked up as a key in the translations of the module
   * defining the workspace.
   */
  title: string;
  /**
   * The type of the workspace. Only one of each "type" of workspace is allowed to be open at a
   * time. The default is "form". If the right sidebar is in use, then the type determines which
   * right sidebar icon corresponds to the workspace.
   */
  type: string;
  canHide?: boolean;
  canMaximize?: boolean;
  /**
   * Controls the width of the workspace. The default is "narrow" and this should only be
   * changed to "wider" if the workspace itself has internal navigation, like the form editor.
   * The width "extra-wide" is for workspaces that contain their own sidebar.
   */
  width?: 'narrow' | 'wider' | 'extra-wide';
  /**
   * Launches the workspace in the preferred size, it defaults to the 'narrow' width
   */
  preferredWindowSize?: WorkspaceWindowState;

  /**
   * Workspaces can open either independently or as part of a "workspace group". A
   * "workspace group" groups related workspaces together, so that only one is visible
   * at a time. For example,
   *
   * @example
   *
   * {
   *  name: 'order-basket',
   *  type: 'order',
   *  groups: ['ward-patient']
   * }
   *
   * This means that the 'order-basket' workspace can be opened independently, or only
   * in the 'ward-patient'.
   * If a workspace group is already open and a new workspace is launched, and the
   * groups in the newly launched workspace do not include the currently open group’s
   * name, the entire workspace group will close, and the new workspace will launch independently.
   *
   */
  groups: Array<string>;
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
      load: () => Promise<{ default?: LifeCycles } & LifeCycles>;
    }
);

export interface WorkspaceGroupDefinition {
  /**
   * Name of the workspace group. This is used to launch the workspace group
   */
  name: string;
  /**
   * List of workspace names which are part of the workspace group.
   */
  members?: Array<string>;
}

/**
 * A definition of a feature flag extracted from the routes.json
 */
export interface FeatureFlagDefinition {
  /** A code-friendly name for the flag, which will be used to reference it in code */
  flagName: string;
  /** A human-friendly name which will be displayed in the Implementer Tools */
  label: string;
  /** An explanation of what the flag does, which will be displayed in the Implementer Tools */
  description: string;
}

/** This interface describes the format of the routes provided by an app */
export interface OpenmrsAppRoutes {
  /** The version of this frontend module. */
  version?: string;
  /** A list of backend modules necessary for this frontend module and the corresponding required versions. */
  backendDependencies?: Record<string, string>;
  /** A list of backend modules that may enable optional functionality in this frontend module if available and the corresponding required versions. */
  optionalBackendDependencies?: {
    /** The name of the backend dependency and either the required version or an object describing the required version */
    [key: string]:
      | string
      | {
          /** The minimum version of this optional dependency that must be present. */
          version: string;
          /** The feature flag to enable if this backend dependency is present */
          feature?: FeatureFlagDefinition;
        };
  };
  /** An array of all pages supported by this frontend module. Pages are automatically mounted based on a route. */
  pages?: Array<PageDefinition>;
  /**  An array of all extensions supported by this frontend module. Extensions can be mounted in extension slots, either via declarations in this file or configuration. */
  extensions?: Array<ExtensionDefinition>;
  /** An array of all feature flags for any beta-stage features this module provides. */
  featureFlags?: Array<FeatureFlagDefinition>;
  /** An array of all modals supported by this frontend module. Modals can be launched by name. */
  modals?: Array<ModalDefinition>;
  /** An array of all workspaces supported by this frontend module. Workspaces can be launched by name. */
  workspaces?: Array<WorkspaceDefinition>;
  /** An array of all workspace groups supported by this frontend module. */
  workspaceGroups?: Array<WorkspaceGroupDefinition>;
}

/**
 * This interfaces describes the format of the overall rotues.json loaded by the app shell.
 * Basically, this is the same as the app routes, with each routes definition keyed by the app's name
 */
export type OpenmrsRoutes = Record<string, OpenmrsAppRoutes>;

export interface ResourceLoader<T = any> {
  (): Promise<T>;
}

/*
 * Supported values for FHIR HumanName.use as defined by https://hl7.org/fhir/R4/valueset-name-use.html
 */
export type NameUse = 'usual' | 'official' | 'temp' | 'nickname' | 'anonymous' | 'old' | 'maiden';
