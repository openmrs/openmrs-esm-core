# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

`@openmrs/esm-core` is the **core monorepo for the OpenMRS 3.x (O3) frontend**: the cross-cutting framework libraries, the configuration system, the extension system, global state, the styleguide, the app shell, and developer tooling. Every frontend module (including the clinical modules that live outside this repo) depends on what is built here.

## Build system & environment

- **Yarn 4** (`packageManager: yarn@4.10.3`, Plug'n'Play workspaces), **Turborepo** for cross-package orchestration and caching, **Node >= 20.11**.
- Four workspace groups: `packages/framework/*`, `packages/shell/*`, `packages/apps/*`, `packages/tooling/*`.
- React 18 + TypeScript + **single-spa** (micro-frontends). Dynamic loading goes through Webpack/rspack **Module Federation** (see `esm-dynamic-loading`).

## Common commands

```sh
yarn && yarn setup        # install + turbo build everything (if it runs out of resources: yarn build --concurrency 1)
yarn build                # turbo run build (build:apps builds only the apps)
yarn verify               # turbo run lint test typescript (the pre-submit gate)
yarn run:shell            # run only the app shell + framework (no frontend modules)
yarn start --sources packages/apps/esm-login-app   # run a single app with HMR dev server

# Tests (Turborepo)
yarn turbo run test                                # all packages
yarn turbo run test --filter="@openmrs/esm-styleguide"  # a single package
yarn turbo run test -- login                       # tests whose filename matches "login"
yarn turbo run test:watch -- login.test            # watch mode
yarn turbo run test --force                        # bypass the turbo cache

# E2E (Playwright, runs against a full OpenMRS backend in Docker)
npx playwright install    # first time only
yarn test-e2e             # build frontend -> start containers -> run -> clean up
yarn test-e2e -- --headed         # show the browser
yarn test-e2e -- --ui             # Playwright interactive UI mode
yarn test-e2e -- login.spec.ts    # a single spec file
yarn test-e2e --keep-on-failure   # leave containers running on failure (for debugging)
yarn test-e2e --list              # CLI-friendly output, no browser popup (useful for LLM tools)
E2E_BASE_URL=https://dev3.openmrs.org/openmrs yarn playwright test   # against a remote instance (no Docker)
```

Tests use **Vitest** (each package has a `vitest.config.ts` and `setup-tests.ts`).

## Anatomy of a frontend module (the most important mental model)

Each app (under `packages/apps/*`, and clinical modules outside this repo) declares its capabilities through two files. The app shell reads them at runtime to assemble the UI:

**1. `src/routes.json`** — declares what the module contributes (`$schema: routes.schema.json`):
- `backendDependencies`: required backend modules and versions (e.g. `webservices.rest`).
- `pages`: full-page components mounted at a `route` (`component` maps to a named export in `index.ts`).
- `extensions`: components that plug into **slots** opened by other modules (`name` + `slot` + `component`, optional `order`).
- `modals`: named modals, invoked via `showModal()`.
- Each entry may set `online` / `offline` to control offline availability.

**2. `src/index.ts`** — maps the `component` names from `routes.json` to actual components via single-spa lifecycles:
```ts
const options = { featureName: 'login', moduleName: '@openmrs/esm-login-app' };
export const root = getSyncLifecycle(rootComponent, options);        // synchronous component
export const changePasswordModal = getAsyncLifecycle(() => import('...'), options);  // lazy-loaded
export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');
export function startupApp() { defineConfigSchema(moduleName, configSchema); }  // register config schema
```

The **extension/slot system** (`esm-extensions`) is the heart of O3 composition: module A opens a slot in its UI, and module B injects an extension into it via its `routes.json` — without either module importing the other.

## Configuration system (`esm-config`)

- Each module defines a schema in `config-schema.ts` (`Type.String/Boolean/...`, `_default`, `_description`, `_validators`) and registers it inside `startupApp()` with `defineConfigSchema(moduleName, schema)`.
- Cross-field constraints use `validator(fn, msgFn)`; common validators live in `validators` (`oneOf`, `isUrl`, etc.).
- String defaults may interpolate variables such as `${openmrsSpaBase}`. Implementers override defaults with a config file at runtime.

## Package layout

- **`packages/framework/*`**: independently usable libraries — `esm-api` (backend calls), `esm-config`, `esm-context` (the `AppContext` for sharing state across apps), `esm-extensions`, `esm-state`, `esm-offline`, `esm-styleguide`, `esm-react-utils`, `esm-routes`, `esm-navigation`, `esm-translations`, `esm-dynamic-loading`, `esm-feature-flags`, and more.
- **`packages/framework/esm-framework`**: **aggregates** all of the above into a single public entry point (frontend modules always `import { ... } from '@openmrs/esm-framework'`). The API docs live in `packages/framework/esm-framework/docs/API.md` and are generated from source with `yarn turbo run document`.
- **`packages/shell/esm-app-shell`**: the app shell that loads and orchestrates all micro-frontends.
- **`packages/apps/*`**: core apps (login, primary-navigation, implementer-tools, devtools, offline-tools, help-menu).
- **`packages/tooling/*`**: the `openmrs` CLI, `webpack-config`/`rspack-config`, `storybook`, and the typedoc plugin.

## The `openmrs` CLI (`packages/tooling/openmrs`)

The command-line tool used by frontend-module developers. Main subcommands: `develop` (dev server that loads an import map plus local sources), `build`, `assemble` (collect each module's import-map artifacts according to a config), `start`, `debug`. This repo's `yarn start` is `openmrs develop`.

## Linking local framework changes into a frontend module (a known pain point)

Frontend modules import from `@openmrs/esm-framework`, but the package you actually link is the **sub-library** (e.g. to test a change in `esm-api`, link `esm-api`). Try these in order:

1. `yarn link ../path/to/openmrs-esm-core/packages/framework/esm-styleguide` (adds a `portal:` line to `resolutions` in `package.json`).
2. If you need to change `esm-framework` itself, `yarn link` will **not** work — manually add `"@openmrs/esm-framework": "link:../path/.../esm-framework"` to `resolutions`.
3. If both fail, use **yalc**.

If you are unsure whether your local version is in effect, add a `console.log` at the top level of a file you are editing.

## Conventions

- Frontend-module component files use semantic suffixes: `*.component.tsx`, `*.extension.tsx`, `*.modal.tsx`, `*.resource.ts` (both `extract-translations` and the turbo inputs key off these).
- On commit, lint-staged runs `eslint --fix --max-warnings 0` on `*.{ts,tsx}` and prettier on style files.
- After adding translatable strings, translations are loaded from `translations/` via the `require.context` in `importTranslation`.
