export * from './module-config/module-config';
export * from './module-config/state';
export * from './validators/validator';
export * from './validators/validators';
export * from './types';
import {
  navigate as na,
  interpolateString as is,
  interpolateUrl as iu,
  TemplateParams,
  NavigateOptions,
} from '@openmrs/esm-navigation';
/** @deprecated Please import from esm-navigation (or esm-framework) instead of esm-config */
const navigate = na;
/** @deprecated Please import from esm-navigation (or esm-framework) instead of esm-config */
const interpolateString = is;
/** @deprecated Please import from esm-navigation (or esm-framework) instead of esm-config */
const interpolateUrl = iu;
export { navigate, interpolateString, interpolateUrl, TemplateParams, NavigateOptions };
