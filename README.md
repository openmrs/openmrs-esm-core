:wave:	New to our project? Be sure to review the [OpenMRS 3 Frontend Developer Documentation](https://o3-docs.openmrs.org/). You may find the [Introduction](https://o3-docs.openmrs.org/docs/introduction) especially helpful.

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
- [@openmrs/esm-config](packages/framework/esm-config): validation and storage of frontend configuration
- [@openmrs/esm-error-handling](packages/framework/esm-error-handling): handling of errors
- [@openmrs/esm-extensions](packages/framework/esm-extensions): implementation of a frontend component extension system
- [@openmrs/esm-feature-flags](packages/framework/esm-feature-flags): hide features that are in progress
- [@openmrs/esm-globals](packages/framework/esm-globals): useful global variables and types
- [@openmrs/esm-navigation](packages/framework/esm-navigation): navigation utilities, breadcrumbs, and history
- [@openmrs/esm-offline](packages/framework/esm-offline): provides offline functionality
- [@openmrs/esm-react-utils](packages/framework/esm-react-utils): utilities for React components
- [@openmrs/esm-state](packages/framework/esm-state): brings in state management
- [@openmrs/esm-styleguide](packages/framework/esm-styleguide): styling and UI capabilities
- [@openmrs/esm-translations](packages/framework/esm-translations): common translations and utilities
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

### Running the app shell and the framework

```sh
yarn run:shell
```

`run:shell` will run the latest version of the shell and the framework only.

### Running the frontend modules in `apps`

```sh
yarn run:omrs develop --sources packages/apps/<app folder>
```

This will allow you to develop the app similar to the experience of developing other apps.

### Running the tooling

```sh
cd packages/tooling/openmrs
yarn build
./dist/cli.js
```

### Running tests

To run tests for all packages, run:

```bash
yarn turbo run test
```

To run tests in `watch` mode, run:

```bash
yarn turbo run test:watch
```

To run tests for a specific package, pass the package name to the `--filter` flag. For example, to run tests for `esm-patient-conditions-app`, run:

```bash
yarn turbo run test --filter="esm-patient-conditions-app"
```

To run a specific test file, run:

```bash
yarn turbo run test -- login
```

The above command will only run tests in the file or files that match the provided string.

You can also run the matching tests from above in watch mode by running:

```bash
yarn turbo run test:watch -- login.test
```

To generate a `coverage` report, run:

```bash
yarn turbo run coverage
```

By default, `turbo` will cache test runs. This means that re-running tests wihout changing any of the related files will return the cached logs from the last run. To bypass the cache, run tests with the `force` flag, as follows:

```bash
yarn turbo run test --force
```

### Linking the framework

You probably want to try out your changes to a framework library in a frontend module. Unfortunately, getting
a working development environment for this is very finicky. No one technique works for all frontend modules
all the time.

Note that even though frontend modules import from `@openmrs/esm-framework`, the package you need to link is the sub-library; for example, if you are trying to test changes in `packages/framework/esm-api`, you will need to link that sub-library.

If you're unsure whether your version of a core package is running, add a `console.log` at the top level of a file you're working on.

Here are the tools at your disposal for trying to get this to work:

#### Yarn Link

This should be the first thing you try. To link the styleguide, for example, you would use

```
yarn link ../path/to/openmrs-esm-core/packages/framework/esm-styleguide
```

This will add a line to the "resolutions" section of the `package.json` file which uses the `portal:` protocol.
The other protocol is `link:`. If you need to make changes to the `esm-framework` package, you will need to link
it in as well. However, this does not work as a portal created with the `yarn link` command. Rather you will
want to manually add the line to the `resolutions` field in the `package.json` file:

```json
"resolutions": {
  "@openmrs/esm-framework": "link:../path/to/openmrs-esm-core/packages/framework/esm-framework"
}
```

#### Yalc

Sometimes, the build tooling will simply not work with `yarn link`. In this case, you will need to use `yalc`.
Install `yalc` on your computer with

```
npm install -g yalc
```

Then, link the repository you are working on. For `esm-api`, for example, run

```sh
# In this repository
cd packages/framework/esm-api
yalc publish
cd ../../../openmrs-esm-patient-chart  # for example
yalc link @openmrs/esm-api
```

In order for patient-chart to receive further updates you make to esm-api, you will need to run `yalc push` in the esm-api directory and `yalc update` in the patient-chart directory.

### Running with a local version of the core packages

This satisfies the build tooling, but we must do one more step to get the frontend to load these dependencies at runtime.

Here, there are two options:

#### Method 1: Using the frontend dev server

In order to get your local version of the core packages to be served in your local
dev server, you will need to link the tooling as well.

`yarn link /path/to/esm-core/packages/tooling/openmrs`.

You can try using `yalc` for this as well, if `yarn link` doesn't work. Or manually creating a `link:` resolution in `package.json`.
In packages/shell/esm-app-shell, run `yarn build:development --watch` to ensure that the built app shell is updated with your changes and available to the patient chart.
Then run your patient chart dev server as usual, with `yarn start`.

#### Method 2: Using import map overrides

In `esm-core`, start the app shell with `yarn run:shell`. Then, in the patient chart repository, `cd` into whatever packages you are working on and run `yarn serve` from there. Then use the import map override tool in the browser to tell the frontend to load your local patient chart packages.

#### Once it's working

Please note that any of these techniques will modify the `package.json` file. These changes must be undone before creating 
your PR. If you used `yarn link`, you can undo these changes by running `yarn unlink --all` in the patient chart repo.


### Version and release

We use Yarn [workspaces](https://yarnpkg.com/features/workspaces) to handle versioning in this monorepo.

To increment the version, run the following command:

```sh
yarn release [version]
```

Where version corresponds to:

- `patch` for bug fixes e.g. `3.2.0` → `3.2.1`
- `minor` for new features that are backwards-compatible e.g `3.2.0` → `3.3.0`
- `major` for breaking changes e.g. `3.2.0` → `4.0.0`

Note that this command will not create a new tag, nor publish the packages. After running it, make a PR or merge to `main` with the resulting changeset. Note that the release commit message must resemble `(chore) Release vx.x.x` where `x.x.x` is the new version number prefixed with `v`.

This is because we don't want to trigger a pre-release build when effecting a version bump.

Once the version bump commit is merged, go to GitHub and [draft a new release](https://github.com/openmrs/openmrs-esm-core/releases/new).

The tag should be prefixed with `v` (e.g., `v3.2.1`), while the release title should just be the version number (e.g., `3.2.1`). The creation of the GitHub release will cause GitHub Actions to publish the packages, completing the release process.

> Don't run `npm publish`, `yarn publish`, or `lerna publish`. Use the above process.

## Design Patterns

For documentation about our design patterns, please visit our design system documentation website.

## Bumping Playwright Version

Be sure to update the Playwright version in the [Bamboo Playwright Docker image](e2e/support/bamboo/playwright.Dockerfile) whenever making version changes. 
Also, ensure you specify fixed (pinned) versions of Playwright in the package.json file to maintain consistency between the Playwright version used in the Docker image for Bamboo test execution and the version used in the codebase.
