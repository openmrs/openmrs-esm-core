# Upgrading to Framework Version 4

Version 4 of the OpenMRS 3 frontend framework includes a number of essential updates, including:

- Updating React from v16 to 18
- Updating React Router from v5 to 6
- Updating Carbon Design System from v10 to 11
- Major improvement to the system that loads frontend modules into the application.

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
packages to version `4.0.1` or later

```sh
yarn up openmrs@next @openmrs/esm-framework@next
```

In `openmrs-esm-core` run `yarn run:shell`. Then in your frontend module run `yarn serve` your frontend module and load it using the [import map overrides UI](https://o3-dev.docs.openmrs.org/#/getting_started/setup?id=import-map-overrides).

### Alternate Approach

Another way to upgrade frontend modules is [used for the core apps](https://o3-dev.docs.openmrs.org/#/under_the_hood/migration_guide?id=procedure). You can use that technique for your frontend module, but it is much more involved than the above.

## Upgrading

For a complete look at what needs to be upgraded, please read the relevant documentation for the following:

- [React 16 to 17](https://reactjs.org/blog/2020/08/10/react-v17-rc.html#other-breaking-changes)
- [React 17 to 18](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html)
- [React Router 5 to 6](https://reactrouter.com/en/main/upgrading/v5)
- [Carbon 10 to 11](https://github.com/carbon-design-system/carbon/blob/main/docs/migration/v11.md)
- [Jest 26 to 27](https://jestjs.io/blog/2021/05/25/jest-27)
- [Jest 27 to 28](https://jestjs.io/blog/2022/04/25/jest-28)
- [User Event 12 to 13](https://github.com/testing-library/user-event/releases/tag/v12.0.0)
- [User Event 13 to 14](https://github.com/testing-library/user-event/releases/tag/v14.0.0)

In practice, relatively little of that will apply to your frontend module. Here are the
most likely changes you'll need to make:

### Jest

- Add the following to your `jest.config.json`.

```json
  "testEnvironment": "jsdom",
  "testEnvironmentOptions": {
    "url": "http://localhost/"
  }
```

- Remove the following `moduleNameMapper` references in your `jest.config.json`:

```json
"moduleNameMapper": {
  "lodash-es": "lodash"
  "\\.(s?css)$": "identity-obj-proxy",
  "@openmrs/esm-framework": "@openmrs/esm-framework/mock",
  // Remove the following lines
  "^@carbon/icons-react/es/(.*)$": "@carbon/icons-react/lib/$1",
  "^@carbon/charts": "identity-obj-proxy",
  "^carbon-components-react/es/(.*)$": "carbon-components-react/lib/$1",
},
```

### User Event

- Invoke `userEvent.setup()` before your component gets rendered in your test spec. Use the methods returned from the invocation rather than calling `userEvent` directly.

```js
it('trigger some awesome feature when clicking the button', async () => {
  const user = userEvent.setup();
  
  render(<MyComponent />);

  await user.click(screen.getByRole('button', { name: /click me!/i }));

  // ...assertions...
});
```

- Make sure to `await` every `userEvent` function call.

```js
await user.click(screen.getByRole('button', { name: /click me!/i }));
```

### React Router

This is the most involved of the changes. You really just have to follow the [React Router 5 to 6 upgrade guide](https://reactrouter.com/en/main/upgrading/v5).

### Carbon
- Change `carbon-components-react` to `@carbon/react`
- Change `carbon-icons` to `@carbon/icons-react`
- Icons now get size from a prop. So change e.g. `<Close24 />` to `<Close size={24}>`.
- Replace any style rules that use the `bx--` prefix with `cds--`. Often, you can do a global find and replace to achieve this.
- Import Carbon's spacing and type token mixins using `@use '@carbon/styles/scss/spacing` and `@use '@carbon/styles/scss/type` instead of the old `@import "~carbon-components/src/globals/scss/mixins"` import. Also, the signature for referencing mixins changes as follows:

```scss
// old type mixin
.heading {
  @include carbon--type-style("productive-heading-02");
}

// new type mixin
.heading {
  @include type.type-style("productive-heading-02");
}

// old spacing mixin
.formGroup {
  margin-bottom: $spacing-02;
}

// new spacing mixin
.formGroup {
  margin-bottom: spacing.$spacing-02;
}
```

- Replace deprecated [type tokens](https://github.com/carbon-design-system/carbon/blob/main/docs/migration/v11.md#type-tokens).
- Components no longer use the `light` prop. Wrap your code in a `Layer` component instead.
- Changes to the [Grid](https://github.com/carbon-design-system/carbon/blob/main/docs/migration/v11.md#grid) component might mean your layouts no longer work as they should. Consider using the [FlexGrid](https://github.com/carbon-design-system/carbon/blob/main/docs/migration/v11.md#flexgrid) component instead as well as a [Stack](https://react.carbondesignsystem.com/?path=/story/layout-stack--default) for vertical spacing.


If errors or visual inconsistencies remain, reference the [migration docs](https://github.com/carbon-design-system/carbon/blob/main/docs/migration/v11.md).

### OpenMRS

Where:

```typescript
const layout = useLayoutType();
```

Change `layout == "desktop"` to `isDesktop(layout)`.

### ESLint

Add following rules to your `.eslintrc`:

```json
"rules": {
  "no-restricted-imports": [
    "error",
    {
      "patterns": [
        {
          "group": ["carbon-components-react"],
          "message": "Import from `@carbon/react` directly. e.g. `import { Toggle } from '@carbon/react'`"
        },
        {
          "group": ["@carbon/icons-react"],
          "message": "Import from `@carbon/react/icons`. e.g. `import { ChevronUp } from '@carbon/react/icons'`"
        }
      ]
    }
  ]
}
```

These patterns will help flag imports that use the older Carbon 10 import notation.
