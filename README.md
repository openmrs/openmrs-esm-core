:wave:	New to our project? Be sure to review the [OpenMRS 3 Frontend Developer Documentation](https://openmrs.github.io/openmrs-esm-core/#/). You may find the [Map of the Project](https://openmrs.github.io/openmrs-esm-core/#/main/map) especially helpful.


Also see the [API documentation](./packages/framework/esm-framework/docs/API.md)
for `@openmrs/esm-framework`, which is contained in this repository.


![OpenMRS CI](https://github.com/openmrs/openmrs-esm-core/workflows/OpenMRS%20CI/badge.svg)
![Check documentation](https://github.com/openmrs/openmrs-esm-core/actions/workflows/docs.yml/badge.svg)


Below is the documentation for this repository.

# OpenMRS Frontend Core

This is a [monorepo](https://classic.yarnpkg.com/lang/en/docs/workspaces/) containing the core packages for the OpenMRS Frontend. These packages handle the "cross-cutting concerns" described in the [Domain Decomposition](https://wiki.openmrs.org/display/projects/MFE+Domain+Decomposition) document.

## Available Packages

### Application

This contains tooling and the app shell.

- [openmrs](packages/tooling/openmrs)
- [@openmrs/esm-app-shell](packages/shell/esm-app-shell)

### Framework

The following common libraries have been developed. They may also be used independently of the app shell.

- [@openmrs/esm-api](packages/framework/esm-api): helps make calls to the backend
- [@openmrs/esm-breadcrumbs](packages/framework/esm-breadcrumbs): management of UI breadcrumbs
- [@openmrs/esm-config](packages/framework/esm-config): validation and storage of frontend configuration
- [@openmrs/esm-error-handling](packages/framework/esm-error-handling): handling of errors
- [@openmrs/esm-extensions](packages/framework/esm-extensions): implementation of a frontend component extension system
- [@openmrs/esm-globals](packages/framework/esm-globals): useful global variables and types
- [@openmrs/esm-offline](packages/framework/esm-offline): provides offline functionality
- [@openmrs/esm-react-utils](packages/framework/esm-react-utils): utilities for React components
- [@openmrs/esm-state](packages/framework/esm-state): brings in state management
- [@openmrs/esm-styleguide](packages/framework/esm-styleguide): styling and UI capabilities
- [@openmrs/esm-utils](packages/framework/esm-utils): general utility and helper functions

All libraries are aggregated in the `@openmrs/esm-framework` package:

- [@openmrs/esm-framework](packages/framework/esm-framework)

### Frontend modules

A set of frontend modules provide the core technical functionality of the application.

- [@openmrs/esm-devtools-app](packages/apps/esm-devtools-app)
- [@openmrs/esm-implementer-tools-app](packages/apps/esm-implementer-tools-app)
- [@openmrs/esm-login-app](packages/apps/esm-login-app)
- [@openmrs/esm-primary-navigation-app](packages/apps/esm-primary-navigation-app)
- [@openmrs/esm-offline-tools-app](packages/apps/esm-offline-tools-app)

## Development

### Getting Started

To set up the repository for development, run the following commands:

```sh
yarn
yarn setup
```

### Building

To build all packages in the repository, run the following command:

```sh
yarn build
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

`run:shell` will run the latest version of the shell and the framework only.

#### The frontend modules in `apps`

```sh
yarn run:omrs develop --sources packages/apps/<app folder>
```

This will allow you to develop the app similar to the experience of developing other apps.

#### The tooling

```sh
cd packages/tooling/openmrs
yarn build
./dist/cli.js
```

#### The tests

Run `yarn test` in the directory containing the package you want to test.

Run `yarn lerna run test` to run all the tests in this repository.

#### Linking the framework

If you want to try out changes to a framework library, you will
probably want to `yarn link` or `npm link` it into a frontend module.
Note that even though frontend modules import from `@openmrs/esm-framework`,
the package you need to link is the sub-library; e.g., if you are trying
to test changes in `packages/framework/esm-api`, you will need to link
`@openmrs/esm-api`.

In order to get your local version of that package to be served in your local
dev server, you will need to link the app shell as well, and to build it.

##### Example
To set up to develop `@openmrs/esm-api` in a dev server for
the patient chart:

1. In this repository, run
`yarn link` in each of `packages/framework/esm-api` and
`packages/shell/esm-app-shell`.
2. In `packages/shell/esm-app-shell`, run
`yarn build:development --watch` to ensure that the built app shell is
updated with your changes and available to the patient chart.
3. In another terminal, navigate to the patient chart repository. Execute
`yarn link @openmrs/esm-api @openmrs/esm-app-shell`.
Then run your patient chart dev server as usual.

Check your work by adding a `console.log` at the top level of a file you're
working on in `esm-api`.

### Version and release

To increment the version, run the following command:

```sh
yarn release
```

You will need to pick the next version number. We use minor changes (e.g. `3.2.0` → `3.3.0`)
to indicate big new features and breaking changes, and patch changes (e.g. `3.2.0` → `3.2.1`)
otherwise.

Note that this command will not create a new tag, nor publish the packages.
After running it, make a PR or merge to `main` with the resulting changeset.

Once the version bump is merged, go to GitHub and
[draft a new release](https://github.com/openmrs/openmrs-esm-core/releases/new). 
The tag should be prefixed with `v` (e.g., `v3.2.1`), while the release title
should just be the version number (e.g., `3.2.1`). The creation of the GitHub release
will cause GitHub Actions to publish the packages, completing the release process.

> Don't run `npm publish`, `yarn publish`, or `lerna publish`. Use the above process.

