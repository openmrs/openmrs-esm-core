export interface Activator {
  (location: Location): boolean;
}

export type ActivatorDefinition = RegExp | string | boolean;

export type OpenmrsRoutes = Record<string, OpenmrsAppRoutes>;

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
   * Determines the order in which this component renders in its default extension slot. Note that this can be overridden by configuration.
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
   * The name of the component exported by this frontend module.
   */
  component: string;
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
   * Meta describes any properties that are passed down to the extension when it is loaded
   */
  meta?: {
    [k: string]: unknown;
  };
};

/**
 * This interface is for the entries in the overall routes.json for an instance of the O3 frontend
 */
export interface OpenmrsAppRoutes {
  /**
   * The version of this frontend module.
   */
  version: string;
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
