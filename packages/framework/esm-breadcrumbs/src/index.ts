export * from './types';

import { registerBreadcrumb as rb, registerBreadcrumbs as rbs, getBreadcrumbs as gb } from './db';
/** @deprecated Please import from esm-navigation (or esm-framework) instead of esm-breadcrumbs */
const registerBreadcrumb = rb;
/** @deprecated Please import from esm-navigation (or esm-framework) instead of esm-breadcrumbs */
const registerBreadcrumbs = rbs;
/** @deprecated Please import from esm-navigation (or esm-framework) instead of esm-breadcrumbs */
const getBreadcrumbs = gb;
export { registerBreadcrumb, registerBreadcrumbs, getBreadcrumbs };

import { filterBreadcrumbs as fb, getBreadcrumbsFor as gbf } from './filter';
/** @deprecated Please import from esm-navigation (or esm-framework) instead of esm-breadcrumbs */
const filterBreadcrumbs = fb;
/** @deprecated Please import from esm-navigation (or esm-framework) instead of esm-breadcrumbs */
const getBreadcrumbsFor = gbf;
export { filterBreadcrumbs, getBreadcrumbsFor };
