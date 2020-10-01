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

For working with the app shell you don't need to have the repository cloned. You can also just use the `run-openmrs` directly.

```sh
npx run-openmrs
```

This is a command line utility for running (or building) the app shell in isolation. In particular, it deals with everything that touches the development, distribution, and deployment of an app shell.

## Possibilities

The new architecture offers a couple of interesting possibilities. We go into them one by one.

### Proxying OpenMRS Backends

We can now proxy *any* backend. For instance, using the backend of the demo instance we just run:

```sh
npx run-openmrs debug --backend https://demo.openmrs.org/
```

There are a couple of interesting public instances:

```sh
https://qa-refapp.openmrs.org/
https://demo.openmrs.org/
https://openmrs-spa.org/
```
