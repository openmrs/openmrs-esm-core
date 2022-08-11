# Architecture Overview

Below you'll find an architecture diagram connecting the parts from the core application with the (frontend) ecosystem.

![Architecture Diagram](./architecture.png)

## Startup

When the application loads it goes through the following steps.

1. Preloads the importmap and related files
2. Evaluates the stylesheets and scripts
3. Configures the SPA application
4. Installs the service worker for offline capabilities
5. Loads and evaluates the different frontend modules from the importmap
6. Loads and validates the provided configurations
7. Sets up the offline capabilities and synchronization features
8. Renders the UI

Once the UI is rendered the content is exclusively coming from the different frontend modules. The app shell is solely an orchestration layer.

## Frontend module anatomy

Frontend modules use [dynamic imports](https://webpack.js.org/guides/code-splitting/)
to split into a "front bundle" and content bundles.
The front bundle begins at the entry point, which the
[webpack config](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/tooling/openmrs/default-webpack-config.js)
takes from the
[main entry of package.json](https://github.com/openmrs/openmrs-esm-template-app/blob/69b0f7a3ef3e79e9851fc0621e8b6c8311e7e6d7/package.json#L7)
and which is usually `src/index.ts`. This bundle should be small and not contain much
code. The functions `getAsyncLifecycle` and `getLifecycle` use dynamic imports
to import the frontend module content only when it is needed.
