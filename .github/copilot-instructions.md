# Copilot Cloud Agent Instructions for openmrs-esm-core

## Repository Overview

This is the **OpenMRS 3.x (O3) Frontend Core** monorepo. It contains the core framework libraries, app shell, tooling, and foundational frontend modules for the OpenMRS microfrontend ecosystem. It is a TypeScript/React project using Yarn 4 workspaces, built with Rspack (apps) and SWC (framework libraries), tested with Vitest and Playwright, and linted with ESLint and Prettier.

**Trust these instructions.** Only search the codebase if the information here is incomplete or found to be in error.

## Repository Layout

```
packages/
  apps/                  # Frontend module apps (login, devtools, primary-navigation, etc.)
  framework/             # Core framework libraries aggregated into @openmrs/esm-framework
    esm-api/             # Backend API helpers
    esm-config/          # Configuration system
    esm-react-utils/     # React hooks and utilities
    esm-styleguide/      # UI components and styling
    esm-framework/       # Aggregator package re-exporting all framework sub-packages
    tsconfig.json        # Shared base tsconfig for all framework packages
    ...16 more sub-packages
  shell/esm-app-shell/   # The app shell that bootstraps the SPA
  tooling/
    openmrs/             # CLI tooling
    rspack-config/       # Shared Rspack configuration
    webpack-config/      # Shared Webpack configuration (legacy)
    storybook/           # Storybook setup
e2e/                     # Playwright E2E tests (specs in e2e/specs/)
tools/                   # Dev utilities (i18next-parser.config.js)
turbo.json               # Turborepo task definitions
.eslintrc                # Root ESLint config
prettier.config.js       # Prettier config (120 char width, single quotes, trailing commas)
playwright.config.ts     # Playwright config (reads from .env)
example.env              # Template for E2E env vars
```

**Key configuration files:** `.eslintrc` (root), `prettier.config.js`, `turbo.json`, `packages/framework/tsconfig.json` (base tsconfig for framework packages).

Each app package has: `rspack.config.js` (one-liner importing shared config), `vitest.config.ts`, `package.json` with `build`, `test`, `lint`, `typescript` scripts.

## Build & Validation Commands

**Package manager:** Yarn 4.10.3 (Berry). The repo uses `nodeLinker: node-modules`. Always use `yarn`, never `npm`.

**Node.js:** Version 20 for CI builds, 22 for E2E. Node 20+ works locally.

### Bootstrap (required before building or testing)

```sh
yarn install
```

### Build

```sh
# Build everything (~30s with warm cache)
yarn turbo run build

# Build a single app (builds its framework dependencies first, ~28s cold)
yarn turbo run build --filter="@openmrs/esm-login-app"
```

Framework packages must be built before apps. Turborepo handles this automatically via `dependsOn: ["^build"]` in `turbo.json`.

### Test (Vitest)

```sh
# Run all unit tests
yarn turbo run test

# Run tests for one package (~4s)
yarn turbo run test --filter="@openmrs/esm-login-app"

# Bypass turbo cache
yarn turbo run test --force
```

Tests use **Vitest** (not Jest) with `happy-dom` environment. Test files are `*.test.tsx` / `*.test.ts`. Each app has a `vitest.config.ts` that aliases `@openmrs/esm-framework` to its mock: `@openmrs/esm-framework/mock`.

### Lint (~2s per package)

```sh
yarn turbo run lint
yarn turbo run lint --filter="@openmrs/esm-login-app"
```

### TypeScript type checking (~12s, checks all framework deps)

```sh
yarn turbo run typescript
yarn turbo run typescript --filter="@openmrs/esm-login-app"
```

### Full verification (lint + test + typecheck, same as CI)

```sh
yarn run verify
```

### E2E Tests (requires Docker)

```sh
cp example.env .env   # Required before first run
npx playwright install
yarn test-e2e
```

## CI Pipeline (What PRs Must Pass)

The `OpenMRS CI` workflow (`.github/workflows/ci.yml`) runs on every PR to `main`:

1. `yarn install --immutable`
2. `yarn turbo run build --color --concurrency=5`
3. `yarn run verify --concurrency=5` (runs `lint`, `test`, `typescript` in parallel via turbo)

Additional PR checks:
- **PR title check** (`.github/workflows/pr-title-check.yml`): Title must match `(type) Summary` where type is `feat`, `fix`, `chore`, `docs`, or `test`. Use `(BREAKING)` for breaking changes. Never use `(refactor)`.
- **PR description check**: Body must fill out the PR template.
- **Bundle size report**: Reports compressed size changes on PRs.
- **E2E tests** (`.github/workflows/e2e.yml`): Run against Docker containers when source files change.

## Pre-commit Hooks (Husky + lint-staged)

On commit, Husky runs:
1. `yarn lint-staged --no-stash` - ESLint fix + Prettier on staged `*.ts`, `*.tsx`, `*.css`, `*.scss` files
2. `yarn turbo run extract-translations` - Updates `en.json` translation files
3. `yarn turbo run document -- --since main` - Updates API docs

On push: `yarn verify` (full lint + test + typecheck).

## Coding Conventions

Follow the conventions at https://o3-docs.openmrs.org/docs/coding-conventions/introduction. Key rules:

**File naming:** Components use `*.component.tsx`, tests use `*.test.tsx`, styles use `*.module.scss`, data fetching uses `*.resource.ts`. Colocate related files in the same directory.

**Imports:** Use `import { type Foo }` (inline type imports) - enforced by ESLint rule `@typescript-eslint/consistent-type-imports`. Import Carbon components from `@carbon/react` (not `carbon-components-react`). Import Carbon icons from `@carbon/react/icons` (not `@carbon/icons-react`). Import lodash-es methods individually: `import { map } from 'lodash-es'`.

**Styling:** Use CSS Modules (`.module.scss`). Use Carbon design tokens for colors, spacing, typography. Use the `classnames` library for conditional classes.

**Data fetching:** Place in `*.resource.ts` files. Use SWR hooks (`useSWR`, `useSWRImmutable`, `useOpenmrsSWR`). Name hooks `use<Resource>`. Always memoize return values and return `{ data, error, isLoading }`.

**i18n:** Use `useTranslation()` hook. Call `t("key", "Default value")`. Run `extract-translations` to sync `en.json`. Never edit locale files directly (managed by Transifex).

**Testing:** Use React Testing Library. Query via `screen` object. Test behavior, not implementation. Use `@testing-library/jest-dom` matchers. Use `query*` only to assert absence. The framework mock at `@openmrs/esm-framework/mock` is auto-aliased in `vitest.config.ts`.

**Important:** If you change framework API surface (add/remove/modify exports from any `packages/framework/*` package), you must also update the mock files: `packages/framework/esm-framework/mock.tsx` and `packages/framework/esm-framework/mock-jest.tsx`.

**No `console.log`:** The ESLint rule `no-console` is set to error. Use `console.warn` or `console.error` instead.

## Agent Behavior Guidelines

**React quality:** Ensure data flows are sensible. Use `useMemo` and `useCallback` judiciously and correctly to avoid unnecessary re-renders -- but do not add them speculatively. Components should be well-scoped and minimal to meet their needs.

**Test coverage:** Suggest any obvious missing tests. This includes both unit tests (Vitest + React Testing Library) for new components or logic, and E2E tests (Playwright in `e2e/specs/`) for new user-facing workflows.

**Comments:** Focus comments on *how* and *why* the code works, not on describing the current change. Every comment should have long-term value for future developers.

**Communication style:** Keep all remarks brief but polite. Provide additional context only when explicitly asked.

**PR scope:** Each PR must be scoped to a single feature or fix. Do not include extraneous changes (unrelated refactors, style cleanups, import reordering) that do not directly support the PR's main goal.

## PR Title and Description Format

Title format: `(type) Short description` - e.g., `(feat) Add patient search to login page`

Allowed types: `feat`, `fix`, `chore`, `docs`, `test`, `BREAKING`. Do **not** use `refactor`.

The PR body must include a Summary section and, if applicable, screenshots for UI changes.
