# openmrs-esm-context

## What is this?

openmrs-esm-context is an
[in-browser javascript module](https://github.com/openmrs/openmrs-rfc-frontend/blob/master/text/0002-modules.md)
that provides React [Context](https://reactjs.org/docs/context.html)
that can be shared between modules, as well as the OpenMRS React Root Decorator.

## Usage

```js
import openmrsRootDecorator from "@openmrs/esm-context";

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

The decorator returns a function that should then be called with your root react component.
