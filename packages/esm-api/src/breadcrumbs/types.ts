export interface BreadcrumbSettings {
  /**
   * Gets the path of breadcrumb for navigation purposes.
   */
  path: string;
  /**
   * Gets a custom matching function to know if the breadcrumb should be selected.
   *
   * In case of a missing matcher it uses the path to regexp result of the given path.
   *
   * In case of a string it uses the path to regexp result of the given matcher.
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
  title: string;
}

export interface BreadcrumbRegistration {
  matcher: RegExp;
  settings: BreadcrumbSettings;
}
