# openmrs

The one stop CLI for using the OpenMRS 3.0 Frontend app.

## Prerequisites

You need Node.js with NPM. We recommend using version 16.17 (LTS) or later.

## Installation

You can run the tool without installation using `npx`, which is part of NPM. Just make sure to fulfill the prerequisites.

Alternatively, install the application globally using `npm i openmrs -g`. Then you can run the tool without `npx`, e.g., instead of `npx openmrs ...` you run `openmrs ...`.

## Available Commands

The following commands are available. For an up-to-date help on your installation run `npx openmrs --help`.

The `--help` flag can also be applied to any command below, resulting in detailed information about the available options.

### `start`

> For developers.

Starts the app shell configured for the SPA reference application. Includes a default import map working against a working snapshot on the CDN.

Example:

```sh
# run the command
npx openmrs
```

### `develop`

> For developers and implementers.

Performs a debug build of the app shell and runs it against a given OpenMRS backend. Can be proxied to any network and used with any import map configuration.

Example:

```sh
# run the command
npx openmrs develop
```

### `build`

> For implementers.

Builds the app shell with a given configuration. Provides the assets necessary for the app shell in a distribution.

Example:

```sh
# run the command
npx openmrs build
```

### `assemble`

> For implementers.

Assembles an import map incl. assets to provide the frontend module assets for a distribution.

Example:

```sh
# run the command
npx openmrs assemble
```
