# OpenMRS Frontend Core

This is a [Lerna](https://lerna.js.org/) project containing the core packages for the OpenMRS Frontend. These packages handle the "cross-cutting concerns" described in the [Domain Decomposition](https://wiki.openmrs.org/display/projects/MFE+Domain+Decomposition) document.

- [@openmrs/esm-app-shell](packages/esm-app-shell)
- [@openmrs/esm-config](packages/esm-config)
- [@openmrs/esm-extension-manager](packages/esm-extension-manager)

## Getting Started

To install and setup the repository just use the following command:

```sh
npx lerna bootstrap
```

## TODO

The import map needs to be addressed / improved as follows:

```plain
// Integrated - no need to mention
"single-spa"
"i18next"
"react"
"react-dom"
"react-router-dom"
"react-i18next"
"rxjs"

// Bundled - will be part of the monorepo and integrated
"@openmrs/esm-api"
"@openmrs/esm-styleguide"
"@openmrs/esm-extension-manager"
"@openmrs/esm-error-handling"
"@openmrs/esm-module-config"

// Removed - should not be in the import map; no replacement
"@openmrs/esm-root-config"

// Lazy Loaded - this is the import map
"@openmrs/esm-patient-chart-widgets"
"@openmrs/esm-patient-chart-app"
"@openmrs/esm-home-app"
"@openmrs/esm-primary-navigation-app"
"@openmrs/esm-login-app"
"@openmrs/esm-devtools-app"
"@openmrs/esm-patient-registration-app"
"@hackathon/patient-dashboard"
"@hackathon/navbar"
"@openmrs/esm-implementer-tools-app"
"@openmrs/esm-home-app/"
"@openmrs/esm-login-app/"
"@openmrs/esm-devtools-app/"
"@openmrs/esm-patient-registration-app/"
"@openmrs/esm-patient-chart-widgets/"
"@openmrs/esm-implementer-tools-app/"
...
```
