# openmrs

The command-line tool for developing and distributing the OpenMRS 3 (O3) frontend.

O3's frontend is made up of an app shell (`@openmrs/esm-app-shell`) and many frontend modules, each published independently. At runtime, the app shell loads the modules using two files:

- an import map (`importmap.json`), which says where each module's JavaScript lives
- a routes registry (`routes.registry.json`), which says which pages and extensions each module provides

This CLI produces those files and hosts the app shell, both while you're working on a module and when you're building a distribution. It's used in three places:

- Frontend module development. `openmrs develop` runs your module inside a full O3 against a real backend. It's what `yarn start` runs in frontend modules.
- Building a distribution. `openmrs assemble` gathers the frontend modules a distribution uses, and `openmrs build` builds the app shell for it. The reference application's frontend image and the OpenMRS SDK both run these two commands.
- The module build toolchain. The package ships the `rspack` and `webpack` commands and the shared bundler configuration that modules build with.

On this page:

- [Requirements](#requirements)
- [Running the CLI](#running-the-cli)
- [Developing a frontend module](#developing-a-frontend-module-openmrs-develop)
- [Building a distribution](#building-a-distribution)
- [The module toolchain](#the-module-toolchain)
- [`openmrs start`](#openmrs-start)

## Requirements

Node.js 20.11 or later. We recommend the current LTS release.

## Running the CLI

In a frontend module, `openmrs` is a dev dependency and you run it through the module's package scripts.

Everywhere else, run it with `npx`, pinning the version you want:

```sh
npx openmrs@<version> <command>
```

The CLI's version and the app shell's version go together: `openmrs build` compiles the `@openmrs/esm-app-shell` release that matches its own version. So the CLI version a distribution builds with is the app shell version it ships.

Run `openmrs --help` or `openmrs <command> --help` for the full list of options.

## Developing a frontend module: `openmrs develop`

A module's `package.json` usually has these scripts:

```json
"scripts": {
  "start": "openmrs develop",
  "build": "rspack --mode=production"
}
```

and a one-line `rspack.config.js` (see [The module toolchain](#the-module-toolchain)):

```js
module.exports = require('openmrs/default-rspack-config');
```

When you run `openmrs develop`, it:

1. Starts a dev server for your module, using its `rspack.config.js` or `webpack.config.js`. The module rebuilds whenever you change its source.
2. Serves a prebuilt app shell on port 8080, or the next free port.
3. Fetches the backend's import map and routes registry and swaps your local module into them.
4. Proxies API requests to the backend.
5. Opens the app in your browser.

Changes to the module's `src/routes.json` are picked up without a restart. Reload the page to see them.

```sh
# Run the module in the current directory against a local backend
openmrs develop --backend http://localhost:8080

# Run two modules from a monorepo, by package name
openmrs develop --packages @openmrs/esm-patient-chart-app --packages @openmrs/esm-patient-vitals-app

# Run every module matching a pattern
openmrs develop --sources 'packages/esm-*-app'
```

| Option | Default | What it does |
| --- | --- | --- |
| `--backend` | `https://dev3.openmrs.org` | The OpenMRS server to proxy API requests to. The base import map and routes registry come from here too, or from dev3 if the backend doesn't serve them. |
| `--host` | `localhost` | The host name or IP address to serve the app on. |
| `--port` | 8080, or the next free port | The port the app is served on. Each module's dev server uses the next free port after it. |
| `--sources` | `.`, unless `--packages` is given | Directories of modules to run, as paths or glob patterns. Can be repeated. |
| `--packages` | | Modules to run by package name, looked up in the current monorepo's workspaces. Can be repeated. |
| `--importmap` | `importmap.json` | The base import map, as a local file, a URL or inline JSON. By default it's the backend's own, unless there's an `importmap.json` file in the current directory. |
| `--routes` | `routes.registry.json` | The base routes registry, in the same forms as `--importmap`. |
| `--config-file` | | A local frontend configuration file to load. Can be repeated. |
| `--config-url` | | The URL of a frontend configuration file to load. Can be repeated. |
| `--spa-path` | `/openmrs/spa/` | The path the app is served under. Keep the trailing slash, since it's also used to find the backend's import map. |
| `--api-url` | `/openmrs/` | The path API requests go to. Requests under it are proxied to the backend. |
| `--add-cookie` | | Extra cookies to send with proxied requests. |
| `--no-open` | | Don't open the app in the browser. |
| `--use-rspack` | | Always use the rspack dev server. The module then needs an `rspack.config.js`. |

### Custom start commands

If a module needs to be served some other way, give it an `openmrs:develop` entry in its `package.json`:

```json
"openmrs:develop": {
  "command": "npm run serve",
  "url": "http://localhost:4200/openmrs-esm-my-app.js"
}
```

`develop` runs `command` in the module's directory and puts `url` in the import map. You can give `host` (like `http://localhost:4200`) instead of `url`, and `develop` adds the file name of the module's bundle, taken from `browser`, `module` or `main` in its `package.json`.

## Building a distribution

A distribution's frontend is built in two steps, usually from two JSON files:

```sh
npx openmrs@<version> assemble --mode config --config spa-assemble-config.json --target ./spa
npx openmrs@<version> build --build-config spa-build-config.json --target ./spa
```

The result in `./spa` is a static site. The web server hosting it needs to return `index.html` for any path under the SPA path that isn't a file, since those are the app's own pages. For a complete working setup, see the reference application's [frontend directory](https://github.com/openmrs/openmrs-distro-referenceapplication/tree/main/frontend), including its Dockerfile and nginx configuration.

### `openmrs assemble`

`assemble` downloads the frontend modules you list, extracts each one into the target directory, and writes the import map and routes registry that point at them.

```json
{
  "frontendModules": {
    "@openmrs/esm-login-app": "latest",
    "@openmrs/esm-patient-chart-app": "next",
    "@my-org/esm-custom-app": "file:../esm-custom-app/my-org-esm-custom-app-1.0.0.tgz"
  }
}
```

A module's version can be:

- anything npm accepts, like `5.2.0`, `5.x` or a dist-tag like `next`
- a `file:` path to a tarball, relative to the current directory
- an `http(s)` URL to a tarball

Modules are fetched from the npm registry set in your `.npmrc`, so private registries and authentication work the usual way. `--registry` overrides the registry.

The config file can also have:

- `frontendModuleExcludes`: package names to leave out. With several `--config` files, they're read in order. A later file can add or replace modules, and its excludes remove modules added by earlier files.
- `publicUrl`: where the modules are served from. `assemble` puts it at the start of each import map entry. It can be a full URL, like a CDN. It defaults to `.`, and the app shell loads entries that start with `./` from under the SPA path. Other relative values are resolved against the current page's URL.

`assemble` writes these to the target directory:

| Output | What it is |
| --- | --- |
| `<module>-<version>/` | Each module's files, like `openmrs-esm-login-app-10.0.0/`. |
| `importmap.json` | Where each module's entry file lives. |
| `routes.registry.json` | Every module's `routes.json`, combined. |
| `openmrs-config.json` | With `--config-file`, the given frontend configuration files merged in order. |
| `spa-assemble-config.json` | With `--manifest`, the exact version of each module that was assembled. You can pass this file back as `--config` to assemble the same versions again. |

| Option | Default | What it does |
| --- | --- | --- |
| `--mode` | `survey` | `config` reads the `--config` files. `survey` asks you to pick modules interactively, so use `config` in scripts and CI. |
| `--config` | `spa-build-config.json` | The config files to read in `config` mode. Can be repeated. |
| `--target` | `dist` | The output directory. |
| `--fresh` | | Empty the target directory first. |
| `--hash-files` | | Add a content hash to the names of the JSON files, so they can be cached. `build` finds the hashed import map and routes registry in the same target directory by itself. |
| `--application-version` | | A version for the whole distribution. It's stored in the routes registry, and the app exposes it as `window.applicationVersion`. |
| `--no-ensure-entrypoints` | | Warn instead of failing when a module is missing its `routes.json` or its entry file. |
| `--no-build-routes` | | Don't write `routes.registry.json`. |
| `--config-file` | | Frontend configuration files to merge into `openmrs-config.json`. Can be repeated. |
| `--manifest` | | Write the version manifest described above. |
| `--registry` | from `.npmrc` | The npm registry to fetch modules from. |

### `openmrs build`

`build` compiles the app shell (its `index.html`, the framework bundle and the styles) into the target directory, next to what `assemble` wrote. Then it writes gzip and brotli copies of the text files in that directory, including the modules from `assemble`.

Its settings can come from flags or from a build config file:

```json
{
  "spaPath": "/openmrs/spa",
  "apiUrl": "/openmrs",
  "importmap": "/openmrs/spa/importmap.json",
  "routes": "/openmrs/spa/routes.registry.json",
  "configUrls": ["/openmrs/spa/config.json"],
  "pageTitle": "My Clinic",
  "defaultLocale": "en"
}
```

| Option | Build config key | Default | What it does |
| --- | --- | --- | --- |
| `--target` | | `dist` | The output directory. |
| `--build-config` | | | A JSON file with any of the keys in this table. |
| `--spa-path` | `spaPath` | `/openmrs/spa/` | The path the app is served under. |
| `--api-url` | `apiUrl` | `/openmrs/` | Where the OpenMRS API is, as a path on the same server or a full URL. |
| `--importmap` | `importmap` | `importmap.json` | Where the app loads the import map from, as a URL. A local file or inline JSON is embedded in `index.html` instead. |
| `--routes` | `routes` | `routes.registry.json` | The same, for the routes registry. |
| `--config-url` | `configUrls` | | URLs of frontend configuration files the app loads when it starts. Can be repeated. |
| `--config-path` | `configPaths` | | Local frontend configuration files to copy into the target and load when the app starts. Can be repeated. |
| `--page-title` | `pageTitle` | `OpenMRS` | The title shown in the browser tab. |
| `--default-locale` | `defaultLocale` | `en` | The default locale, like `en` or `en_GB`. |
| `--env` | `env` | `production` | The environment to build for. |
| `--asset` | | | CSS or JS files to copy into `assets/` and include in `index.html`. Can be repeated. |
| `--fresh` | | | Empty the target directory before building. This also removes everything `assemble` put there. |
| `--no-compress` | `compress` | | Don't write compressed copies. |
| `--no-compress-gzip` | `compressGzip` | | Don't write `.gz` copies. |
| `--no-compress-brotli` | `compressBrotli` | | Don't write `.br` copies. |

A few things to know:

- When a setting is in both the build config and a flag, the build config wins. That's because most flags have a default, and the CLI can't tell a default apart from a value you passed. `importmap`, `routes` and `defaultLocale` are only set when you pass the flag, so for those the flag wins.
- Set `importmap` and `routes` to absolute paths under `spaPath`, like the example above. The defaults are relative, so the browser resolves them against the current page's URL rather than the SPA path. Files from `--config-path` are loaded by their file name alone, so they're relative in the same way. `configUrls` can use `${openmrsSpaBase}` (for example `${openmrsSpaBase}/config.json`), which the app fills in with the SPA path.
- `--asset` only works as a flag for now. `assets` in the build config is ignored.
- Use absolute paths for local files in `configPaths` in the build config, and in `--importmap` or `--routes`. Relative paths there aren't resolved against your current directory yet. Relative paths passed with `--config-path` work.

#### Compressed copies

`build` writes a `.gz` and a `.br` copy next to each text file of at least 1 KiB that gets smaller when compressed, using the maximum compression level. Source maps are skipped, since browsers only fetch them when developer tools are open. A web server can serve these directly instead of compressing each response. The reference application's [nginx.conf](https://github.com/openmrs/openmrs-distro-referenceapplication/blob/main/frontend/nginx.conf) shows one way to do that.

Copies that no longer match their file, or whose file is gone, are removed on the next build. `--no-compress` skips that cleanup along with the compression.

#### Settings that change per deployment

`build` writes its settings into `index.html`. If one build has to run with different settings in different places, you can build with placeholders and fill them in when the server starts. The reference application does this: its [spa-build-config.json](https://github.com/openmrs/openmrs-distro-referenceapplication/blob/main/frontend/spa-build-config.json) uses values like `$SPA_PATH` and `$API_URL`, and its [startup.sh](https://github.com/openmrs/openmrs-distro-referenceapplication/blob/main/frontend/startup.sh) fills them in with `envsubst` when the container starts.

## The module toolchain

The package includes the `rspack` and `webpack` commands, so a module doesn't need its own dependency on either. It also exports the shared bundler configs that modules build with:

- `openmrs/default-rspack-config`, from [`@openmrs/rspack-config`](https://github.com/openmrs/openmrs-esm-core/tree/main/packages/tooling/rspack-config)
- `openmrs/default-webpack-config`, from [`@openmrs/webpack-config`](https://github.com/openmrs/openmrs-esm-core/tree/main/packages/tooling/webpack-config)

To customize the config for a module, see the comments at the top of [`@openmrs/rspack-config`'s source](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/tooling/rspack-config/src/index.ts).

## `openmrs start`

`start` serves the prebuilt app shell against a backend (dev3 by default), without any local modules. It's also what runs if you don't give a command. For working on a module, use `openmrs develop`.
