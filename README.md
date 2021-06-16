![Node.js CI](https://github.com/openmrs/openmrs-esm-core/workflows/Node.js%20CI/badge.svg)

Information for developers about the OpenMRS Frontend system can be found at the following link:

**[OpenMRS Frontend Developer Documentation](https://openmrs.github.io/openmrs-esm-core/#/)**

Below is the documentation for this repository.

# OpenMRS Frontend Core

This is a [Lerna](https://lerna.js.org/) project containing the core packages for the OpenMRS Frontend. These packages handle the "cross-cutting concerns" described in the [Domain Decomposition](https://wiki.openmrs.org/display/projects/MFE+Domain+Decomposition) document.

## Available Packages

You can find more documentation on these in the [docs](./docs) folder.

### Application

This contains tooling and the app shell.

- [openmrs](packages/tooling/openmrs)
- [@openmrs/esm-app-shell](packages/shell/esm-app-shell)

### Framework

The following common libraries have been developed. They may also be used independently of the app shell.

- [@openmrs/esm-api](packages/framework/esm-api)
- [@openmrs/esm-breadcrumbs](packages/framework/esm-breadcrumbs)
- [@openmrs/esm-config](packages/framework/esm-config)
- [@openmrs/esm-error-handling](packages/framework/esm-error-handling)
- [@openmrs/esm-extensions](packages/framework/esm-extensions)
- [@openmrs/esm-globals](packages/framework/esm-globals)
- [@openmrs/esm-offline](packages/framework/esm-offline)
- [@openmrs/esm-react-utils](packages/framework/esm-react-utils)
- [@openmrs/esm-state](packages/framework/esm-state)
- [@openmrs/esm-styleguide](packages/framework/esm-styleguide)
- [@openmrs/esm-utils](packages/framework/esm-utils)

All libraries are aggregated in the `@openmrs/esm-framework` package:

- [@openmrs/esm-framework](packages/framework/esm-framework)

### Microfrontends

A set of microfrontends provide the core technical functionality of the application.

- [@openmrs/esm-devtools-app](packages/apps/esm-devtools-app)
- [@openmrs/esm-implementer-tools-app](packages/apps/esm-implementer-tools-app)
- [@openmrs/esm-login-app](packages/apps/esm-login-app)
- [@openmrs/esm-primary-navigation-app](packages/apps/esm-primary-navigation-app)

## Development

### Getting Started

To set up the repository for development, run the following commands:

```sh
yarn install
yarn setup
```

### Building

To build all packages in the repository, run the following command:

```sh
lerna run build
```

Verification of the existing packages can also be done in one step using `yarn`:

```sh
yarn verify
```

### Running

#### The app shell and the framework

```sh
yarn run:shell
```

#### The microfrontends in `apps`

```sh
cd packages/apps/esm-[xyz]-app
yarn start
```

<!-- The tooling? -->

### Version and release

If there are any new packages in the monorepo, first verify that their `package.json`
contains a `publishConfig` section with `"access": "public"`. Or, if the package should
not be published, the `package.json` should contain the entry `"private": true`.

To increment the version, run the following command:

```sh
yarn ci:release
```

You will need to pick the next version number. We use minor changes (e.g. `3.2.0` → `3.3.0`)
to indicate big new features and breaking changes, and patch changes (e.g. `3.2.0` → `3.2.1`)
otherwise.

Note that this command will not create a new tag, nor publish the packages.
After running it, make a PR or merge to `master` with the resulting changeset.

Once the version bump is merged, go to GitHub and
[draft a new release](https://github.com/openmrs/openmrs-esm-core/releases/new). 
The tag should be prefixed with `v` (e.g., `v3.2.1`), while the release title
should just be the version number (e.g., `3.2.1`). The creation of the GitHub release
will cause GitHub Actions to publish the packages, completing the release process.

> Don't run `npm publish`, `yarn publish`, or `lerna publish`. Use the above process.

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
