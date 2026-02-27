// Storybook-compatible mock for @openmrs/esm-framework.
// Re-exports from individual package mocks so that components importing
// from the barrel (e.g., `import { X } from '@openmrs/esm-framework'`)
// resolve correctly.
export * from './esm-react-utils';
export * from './esm-config';
export * from './esm-api';
export * from './esm-state';
export * from './esm-extensions';
export * from './esm-emr-api';
export * from './esm-globals';
export * from './esm-navigation';
export * from './esm-error-handling';
export * from './esm-translations';
