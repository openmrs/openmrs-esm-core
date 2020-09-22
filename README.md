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
{
  "imports": {
        // Integrated - no need to mention
    "single-spa": "https://cdn.jsdelivr.net/npm/single-spa@4.4.1/lib/system/single-spa.min.js",
    "i18next": "https://cdn.jsdelivr.net/npm/i18next@19.0.0/dist/umd/i18next.min.js",
    "react": "https://cdn.jsdelivr.net/npm/react@16.12.0/umd/react.production.min.js",
    "react-dom": "https://cdn.jsdelivr.net/npm/react-dom@16.12.0/umd/react-dom.production.min.js",
    "react-router-dom": "https://cdn.jsdelivr.net/npm/react-router-dom@5.1.2/umd/react-router-dom.js",
    "react-i18next": "https://cdn.jsdelivr.net/npm/react-i18next@11.2.1/dist/umd/react-i18next.min.js",
    "rxjs": "https://cdn.jsdelivr.net/npm/rxjs@6.5.3/bundles/rxjs.umd.min.js",

        // Bundled - will be part of the monorepo and integrated
    "@openmrs/esm-api": "https://spa-modules.nyc3.digitaloceanspaces.com/@openmrs/esm-api/cb02685abc101550f99e18cc3be7d9ab75e09f54/openmrs-esm-api.js",
    "@openmrs/esm-styleguide": "https://spa-modules.nyc3.digitaloceanspaces.com/@openmrs/esm-styleguide/6fd1ef8837a13b24e3b223eabbbf5bd04d18b4d7/openmrs-esm-styleguide.js",
    "@openmrs/esm-extension-manager/": "https://spa-modules.nyc3.digitaloceanspaces.com/@openmrs/esm-extension-manager/2adbe6903e6f07d0ccbd2778d53fca7f348f892d/",
    "@openmrs/esm-error-handling": "https://spa-modules.nyc3.digitaloceanspaces.com/@openmrs/esm-error-handling/c8fa17c0b74ba7b5cdc5b73f93e400cb22c844de/openmrs-esm-error-handling.js",
    "@openmrs/esm-module-config": "https://spa-modules.nyc3.digitaloceanspaces.com/@openmrs/esm-module-config/2adbe6903e6f07d0ccbd2778d53fca7f348f892d/openmrs-esm-module-config.js",

        // Removed - should not be in the import map; no replacement
    "@openmrs/esm-root-config": "https://spa-modules.nyc3.digitaloceanspaces.com/@openmrs/esm-root-config/3046c8fd7c8d12b5e20be8aca8163910a797d64a/openmrs-esm-root-config.defaults.js",

        // Lazy Loaded - this is the import map
    "@openmrs/esm-patient-chart-widgets": "https://spa-modules.nyc3.digitaloceanspaces.com/@openmrs/esm-patient-chart-widgets/ed2d570673a32749321cec5cff6f7d3ae8f9ef7f/openmrs-esm-patient-chart-widgets.js",
    "@openmrs/esm-patient-chart-app": "https://spa-modules.nyc3.digitaloceanspaces.com/@openmrs/esm-patient-chart-app/b6f207ee5499e5bd4836a3a6f54d356c3d4be3e7/openmrs-esm-patient-chart.js",
    "@openmrs/esm-home-app": "https://spa-modules.nyc3.digitaloceanspaces.com/@openmrs/esm-home-app/7d596acdaa0d21ec47192e71946d8e3670ba4c83/openmrs-esm-home.js",
    "@openmrs/esm-primary-navigation-app": "https://spa-modules.nyc3.digitaloceanspaces.com/@openmrs/esm-primary-navigation-app/811ce7cdcf5548d41191bda1fd4fef1cd004bb1a/openmrs-esm-primary-navigation.js",
    "@openmrs/esm-login-app": "https://spa-modules.nyc3.digitaloceanspaces.com/@openmrs/esm-login-app/ba86336f68ddc4fa364534b605a4184fea5ac1eb/openmrs-esm-login.js",
    "@openmrs/esm-devtools-app": "https://spa-modules.nyc3.digitaloceanspaces.com/@openmrs/esm-devtools-app/75bc1045345193218fccb1058e061d24b6baa98b/openmrs-esm-devtools.js",
    "@openmrs/esm-patient-registration-app": "https://spa-modules.nyc3.digitaloceanspaces.com/@openmrs/esm-patient-registration-app/2a7219ef4dd33c0f6673b180bbefad15ff1a5219/openmrs-esm-patient-registration.js",
    "@hackathon/patient-dashboard": "https://spa-modules.nyc3.digitaloceanspaces.com/patient-dashboard/042616f867c5af104929b528b224b4bcdb741dd4/patient-dashboard.js",
    "@hackathon/navbar": "https://spa-modules.nyc3.digitaloceanspaces.com/navbar/45d7b240020a4ff041d582667e68deb0a48f4df9/navbar.js",
    "@openmrs/esm-implementer-tools-app": "https://spa-modules.nyc3.digitaloceanspaces.com/@openmrs/esm-implementer-tools-app/c3092c2d5a8661e9888213447f93e354803d6f78/openmrs-esm-implementer-tools-app.js",
    "@openmrs/esm-home-app/": "https://spa-modules.nyc3.digitaloceanspaces.com/@openmrs/esm-home-app/7d596acdaa0d21ec47192e71946d8e3670ba4c83/",
    "@openmrs/esm-login-app/": "https://spa-modules.nyc3.digitaloceanspaces.com/@openmrs/esm-login-app/ba86336f68ddc4fa364534b605a4184fea5ac1eb/",
    "@openmrs/esm-devtools-app/": "https://spa-modules.nyc3.digitaloceanspaces.com/@openmrs/esm-devtools-app/75bc1045345193218fccb1058e061d24b6baa98b/",
    "@openmrs/esm-patient-registration-app/": "https://spa-modules.nyc3.digitaloceanspaces.com/@openmrs/esm-patient-registration-app/2a7219ef4dd33c0f6673b180bbefad15ff1a5219/",
    "@openmrs/esm-patient-chart-widgets/": "https://spa-modules.nyc3.digitaloceanspaces.com/@openmrs/esm-patient-chart-widgets/ed2d570673a32749321cec5cff6f7d3ae8f9ef7f/",
    "@openmrs/esm-implementer-tools-app/": "https://spa-modules.nyc3.digitaloceanspaces.com/@openmrs/esm-implementer-tools-app/c3092c2d5a8661e9888213447f93e354803d6f78/"
  }
}
```
