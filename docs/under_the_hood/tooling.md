# How the Developer Tooling Works

## `openmrs develop` vs `openmrs debug`

Generally, `openmrs develop` is the one you will want to use. It uses
build artifacts from the
version of `@openmrs/esm-framework` installed in the `openmrs` package
itself. It uses [webpack-dev-server](https://webpack.js.org/configuration/dev-server/)
to serve the application in the directory where it is run. It uses an
Express server to serve a custom import map and index file, and to
proxy the backend.

`openmrs debug` uses the `@openmrs/esm-app-shell` webpack config. Therefore
it does approximately the same thing as doing `yarn run:shell` from
`openmrs-esm-core`, but that it also works to run the frontend module
in the directory where it is run. It will generally be slower than
`openmrs develop`, but may have some advantages related to debugging.

## Avoiding Webpack

If you want to use another bundler or build tool, you can still use the
`openmrs` tooling. You just have to add a special section in the `package.json`.

Consider the following example from the `@openmrs/esm-form-entry-app` package contained in
the `openmrs-esm-patient-chart` monorepo:

```json
{
  "scripts": {
    "start": "openmrs develop",
    "serve": "ng serve --port 4200 --live-reload true"
  },
  "openmrs:develop": {
    "command": "npm run serve",
    "url": "http://localhost:4200/openmrs-esm-form-entry-app.js"
  },
  // ...
}
```

This one will use `ng serve --port 4200 --live-reload true` when `openmrs develop` is used.
The URL `http://localhost:4200/openmrs-esm-form-entry-app.js` will be added to the import map
used for debugging.
