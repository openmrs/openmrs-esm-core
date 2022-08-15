# Upgrading to Framework Version 4

Version 4 of the OpenMRS 3 frontend framework includes a number of essential updates, including
- Updating React from 16 to 18
- Updating React Router from 5 to 6
- Updating Carbon Design System from 10 to 11
- Major improvement to the system that loads frontend modules into the application

> Note: This has nothing to do with any OpenMRS 4, which does not exist yet (in 2022). This is about upgrading some libraries within OpenMRS 3. The packages `openmrs` and `@openmrs/esm-framework` are being upgraded from version 3 to version 4.

A consequence of this last change is that frontend modules built with the `openmrs`
library at version 3.x will not work in an application running the app shell at
version 4.x.

There are some breaking changes that require changes to frontend module code.
You will also need to upgrade testing libraries to support the new version of React, which
involve some additional changes:
- Jest from 26 to 28
- React Testing Library from 10 to 13
- User Event from 12 to 14

## Setting Up to Upgrade

<!-- TODO: Update this when 4.0.0 is released! -->

In brief, you're going to run the app shell, upgrade the libraries in your frontend module, and load your frontend module into the app shell using [import map overrides](https://o3-dev.docs.openmrs.org/#/getting_started/setup?id=import-map-overrides).

### Getting Frontend Framework 4.0

Check out the `main` branch of [openmrs-esm-core](https://github.com/openmrs/openmrs-esm-core/tree/main).
Set it up by running

```sh
yarn
yarn build:apps
```

and then run the app shell using `yarn run:shell`.

### Running your Frontend Module

In your checked-out frontend module, upgrade the `openmrs` and `@openmrs/esm-framework`
packages to version `4.0.0-pre` (use `4.x` once `4.0.0` is released).

```sh
yarn upgrade openmrs@4.0.0-pre @openmrs-esm-framework@4.0.0-pre
```

In `openmrs-esm-core` run `yarn run:shell`. Then in your frontend module run `yarn serve` your frontend module and load it using the [import map overrides UI](https://o3-dev.docs.openmrs.org/#/getting_started/setup?id=import-map-overrides).

### Alternate Approach

Another way to upgrade frontend modules is [used for the core apps](https://o3-dev.docs.openmrs.org/#/under_the_hood/migration_guide?id=procedure). You can use that technique for your frontend module, buit it is much more involved than the above.

## Upgrading

For a complete look at what needs to be upgraded, please read the relevant documentation for
[React 16 to 17](https://reactjs.org/blog/2020/08/10/react-v17-rc.html#other-breaking-changes),
[React 17 to 18](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html),
[React Router 5 to 6](https://reactrouter.com/docs/en/v6/upgrading/v5),
[Carbon 10 to 11](https://github.com/carbon-design-system/carbon/blob/main/docs/migration/v11.md),
[Jest 26 to 27](https://jestjs.io/blog/2021/05/25/jest-27),
[Jest 27 to 28](https://jestjs.io/docs/upgrading-to-jest28),
[User Event 12 to 13](https://github.com/testing-library/user-event/releases/tag/v12.0.0),
[User Event 13 to 14](https://github.com/testing-library/user-event/releases/tag/v14.0.0)

In practice, relatively little of that will apply to your frontend module. Here are the
most likely changes you'll need to make.

### Jest

Add the following to your `jest.config.json`.

```json
  "testEnvironment": "jsdom",
  "testEnvironmentOptions": {
    "url": "http://localhost/"
  }
```

### User Event

`await` every `userEvent` function call.

### React Router

This is the most involved of the changes. You really just have to follow the [React Router 5 to 6 upgrade guide](https://reactrouter.com/docs/en/v6/upgrading/v5#introduction).

### Carbon

- Change `carbon-components-react` to `@carbon/react`
- Change `carbon-icons` to `@carbon/icons-react`
- Icons now get size from a prop. So change e.g. `<Close24 />` to `<Close size={24}>`.

If errors remain, reference the [migration docs](https://github.com/carbon-design-system/carbon/blob/main/docs/migration/v11.md).

### OpenMRS

Where

```typescript
const layout = useLayoutType();
```

Change `layout == "desktop"` to `isDesktop(layout)`.