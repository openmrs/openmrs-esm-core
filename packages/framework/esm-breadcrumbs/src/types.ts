/** @module @category Breadcrumb */

export interface BreadcrumbSettings {
  /**
   * Gets the path of breadcrumb for navigation purposes.
   */
  path: string;
  /**
   * A string or RegEx that determines whether the breadcrumb should be displayed.
   * It is tested against the current location's path.
   *
   * If `matcher` is a string, it can contain route parameters. e.g. `/foo/:bar`.
   *
   * Can be omitted; the value of `path` is used as the default value.
   */
  matcher?: string | RegExp;
  /**
   * The breadcrumb's parent breadcrumb. Supply the path of the breadcrumb here, e.g.,
   * if we are currently in "/foo/bar", you could provide "/foo" to get the breadcrumb
   * associated with the path "/foo".
   *
   * If a path is missing for some reason, the closest matching one will be taken as
   * parent.
   */
  parent?: string;
  /**
   * The title of the breadcrumb.
   */
  title:
    | string
    | ((params: any) => string)
    | ((params: any) => Promise<string>);
}

export interface BreadcrumbRegistration {
  matcher: RegExp;
  settings: BreadcrumbSettings;
}
