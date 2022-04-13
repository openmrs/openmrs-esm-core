/** @module @category Breadcrumb */
import { pathToRegexp } from "path-to-regexp";
import { createGlobalStore } from "@openmrs/esm-state";
import { BreadcrumbSettings, BreadcrumbRegistration } from "./types";

const store = createGlobalStore<Array<BreadcrumbRegistration>>(
  "breadcrumbs",
  []
);

function getMatcher(settings: BreadcrumbSettings) {
  if (settings.matcher instanceof RegExp) {
    return settings.matcher;
  } else if (typeof settings.matcher === "string") {
    return pathToRegexp(settings.matcher);
  } else {
    return pathToRegexp(settings.path);
  }
}

export function registerBreadcrumb(breadcrumb: BreadcrumbSettings) {
  return registerBreadcrumbs([breadcrumb]);
}

export function registerBreadcrumbs(breadcrumbs: Array<BreadcrumbSettings>) {
  const prevBreadcrumbs = getBreadcrumbs();
  const newBreadcrumbs = breadcrumbs.map((settings) => ({
    matcher: getMatcher(settings),
    settings,
  }));
  const nextBreadcrumbs = [...prevBreadcrumbs, ...newBreadcrumbs];
  store.setState(nextBreadcrumbs, true);
}

export function getBreadcrumbs() {
  return store.getState();
}
