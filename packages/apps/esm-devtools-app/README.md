# openmrs-esm-devtools

openmrs-esm-devtools is an in-browser JavaScript module that provides a UI for developers writing frontend code for OpenMRS 3.x.

![esm-devtools](https://user-images.githubusercontent.com/1031876/81030238-f5b9d500-8e3c-11ea-81b8-6c2a4938faf2.gif)

## Purpose

The devtools allow you to override any JavaScript module to point to any URL.
This is useful for developing features and for debugging problems, because you
can tell the browser to load one module from your localhost while keeping all
other modules using the default version in the import map.

## Tech Stack

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Carbon Design System](https://carbondesignsystem.com/)
- [single-spa](https://single-spa.js.org/)
- [import-map-overrides](https://github.com/single-spa/import-map-overrides)

## Prerequisites

- [Node.js](https://nodejs.org) (v18 or higher)
- [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

## Installation & Local Development

1. Clone the repository:
```bash
git clone https://github.com/openmrs/openmrs-esm-core.git
cd openmrs-esm-core
```

2. Install dependencies:
```bash
yarn install
```

3. Start the devtools app:
```bash
cd packages/apps/esm-devtools-app
yarn start --port 8081
```

4. Enable devtools in your browser console:
```js
localStorage.setItem('openmrs:devtools', true)
```

5. Refresh the page — you'll see a rectangular button in the bottom right corner of the screen.

> **Note:** When the rectangle is red, it means you have an active module override.

## Usage

The devtools are registered as a [single-spa application](https://single-spa.js.org/docs/building-applications/) that creates a gray or red rectangular button near the bottom right of the screen.

If you prefer using the browser console instead of a UI to manage module overrides, check out the [import-map-overrides documentation](https://github.com/single-spa/import-map-overrides).

## Contributing

Contributions are welcome! Here's how to get started:

1. Fork this repository
2. Create a new branch:
```bash
git checkout -b feat/your-feature-name
```
3. Make your changes
4. Commit your changes:
```bash
git commit -m "feat: description of your change"
```
5. Push to your fork:
```bash
git push origin feat/your-feature-name
```
6. Open a Pull Request on GitHub

Please make sure to follow the [OpenMRS Frontend Developer Documentation](https://o3-docs.openmrs.org) and the [contributing guidelines](https://github.com/openmrs/openmrs-esm-core/blob/main/CONTRIBUTING.md).

## Related Links

- [OpenMRS Frontend Developer Documentation](https://o3-docs.openmrs.org)
- [OpenMRS Talk](https://talk.openmrs.org)
- [OpenMRS Slack](https://slack.openmrs.org)
- [Report an Issue](https://issues.openmrs.org)