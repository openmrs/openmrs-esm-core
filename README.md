# OpenMRS Frontend Core

This is a [Lerna](https://lerna.js.org/) project containing the core packages for the OpenMRS Frontend. These packages handle the "cross-cutting concerns" described in the [Domain Decomposition](https://wiki.openmrs.org/display/projects/MFE+Domain+Decomposition) document.

- [@openmrs/esm-api](packages/esm-api)
- [@openmrs/esm-app-shell](packages/esm-app-shell)
- [@openmrs/esm-config](packages/esm-config)
- [@openmrs/esm-error-handling](packages/esm-error-handling)
- [@openmrs/esm-extension-manager](packages/esm-extension-manager)
- [@openmrs/esm-styleguide](packages/esm-styleguide)

## Getting Started

To install and setup the repository just use the following command:

```sh
npx lerna bootstrap
```
