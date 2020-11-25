# OpenMRS Frontend Core

This is a [Lerna](https://lerna.js.org/) project containing the core packages for the OpenMRS Frontend. These packages handle the "cross-cutting concerns" described in the [Domain Decomposition](https://wiki.openmrs.org/display/projects/MFE+Domain+Decomposition) document.

## Available Packages

You can find more documentation on these in the [docs](./docs) folder.

### Application

This contains tooling and the app shell.

- [openmrs](packages/openmrs)
- [@openmrs/esm-app-shell](packages/esm-app-shell)

### Libraries

The following common libraries have been developed. They may also be used independently of the app shell.

- [@openmrs/esm-api](packages/esm-api)
- [@openmrs/esm-config](packages/esm-config)
- [@openmrs/esm-error-handling](packages/esm-error-handling)
- [@openmrs/esm-extensions](packages/esm-extensions)
- [@openmrs/esm-styleguide](packages/esm-styleguide)

### Microfrontends

A set of microfrontends to provide core technical functionality for working with the application.

- [@openmrs/esm-devtools-app](packages/esm-devtools-app)
- [@openmrs/esm-implementer-tools-app](packages/esm-implementer-tools-app)

## Repository Development

### Getting Started

To install and setup the repository just use the following command:

```sh
npx lerna bootstrap
```

For working with the app shell you don't need to have the repository cloned. You can also just use the `openmrs` directly.

```sh
npx openmrs
```

This is a command line utility for running (or building) the app shell in isolation. In particular, it deals with everything that touches the development, distribution, and deployment of an app shell.

### Building

For building the code just run

```sh
lerna run build
```

Verification of the existing packages can also be done in one step using `yarn`:

```sh
yarn verify
```

To run only the shell locally use `yarn`, too:

```sh
yarn run:shell
```

### Incrementing Version

Run `yarn` to trigger Lerna's version mode. This will not create a new tag. Tags should be created on GitHub exclusively.

```sh
yarn ci:release
```

**Important**: Creating a tag on GitHub will trigger a new release.

### Creating a Release

First of all: **Not** every merge into `master` has to result in release. We should only release when we have gathered enough interesting changes in `master` to benefit from it.

Now, let's say we have enough interesting changes accumulated in `master`.

Please check:

1. Do we have a unique version number that reflects the changes in `master` (changes as compared to the previous release)? We use minor changes to indicate big new features (requiring attention) and patch levels to indicate rather small fixes and improvements.
2. If we have new packages in the monorepo - did we set `"private": true` if we don't want them to be published?
3. Did we add a `publishConfig` section to the *package.json* of all new packages that should be published (i.e., `"private": false`)? This section should have a `"access": "public"` field.

If we still need to have a version update run `yarn ci:release` (see section beforehand) and make a new PR / merge into `master` with the resulting changeset.

**Don't** run `lerna publish` or any related command locally. Once merged into `master` go to GitHub and [draft a new release](https://github.com/openmrs/openmrs-esm-core/releases/new). The tag should be prefixed with `v` (e.g., `v3.2.1`), while the release title should just be the version number (e.g., `3.2.1`).

## Possibilities

The new architecture offers a couple of interesting possibilities. We go into them one by one.

### Proxying OpenMRS Backends

We can now proxy *any* backend. For instance, using the backend of the demo instance we just run:

```sh
npx openmrs debug --backend https://demo.openmrs.org/
```

There are a couple of interesting public instances:

```sh
https://qa-refapp.openmrs.org/
https://demo.openmrs.org/
https://openmrs-spa.org/
```
