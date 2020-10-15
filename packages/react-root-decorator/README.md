# openmrs-react-root-decorator

[![Build Status](https://travis-ci.com/openmrs/openmrs-react-root-decorator.svg?branch=master)](https://travis-ci.com/openmrs/openmrs-react-root-decorator)

A decorator for root react components.

## Installation

```sh
npm install --save @openmrs/react-root-decorator
```

## Usage

```js
import openmrsRootDecorator from "@openmrs/react-root-decorator";

// Exported only for testing the component without the decorator being there.
// You should use the default export for everything but tests.
export function MyRoot(props) {
  return <div>My component</div>;
}

export default openmrsRootDecorator({
  // The featureName is shown to users! Make it human-friendly.
  featureName: "A user-facing thing",
  // moduleName is the name of your in-browser module, as it appears in the import map
  moduleName: "@openmrs/esm-login-app",
})(MyRoot);
```

## API

`@openmrs/react-root-decorator` exports a function as the default export. That function must
be called with an `opts` object with the following properties:

- `featureName` (required): A string describing the feature. Example is `patient search`. This string is shown to users.
- `moduleName` (required): The string name of your in-browser module, as it appears in the import map. Example: `"@openmrs/esm-login-app"`
- `strictMode` (optional): A boolean that turns on [React strict mode](https://reactjs.org/docs/strict-mode.html).
  Defaults to `true`.
- `throwErrorsToConsole` (optional): A boolean that indicates whether React errors should be thrown to the window via
  `setTimeout(() => {throw err})`. This is so that an automatic error logging library will be able to pick up the errors.
  Defaults to `true`.
- `disableTranslations` (optional): A boolean that indicates whether to disable translations with i18next. Defaults to `false`.

The decorator returns a function that should then be called with your root react component.
