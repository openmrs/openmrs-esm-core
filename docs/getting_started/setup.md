# Setup

## Prerequisities

You must have git, node, and npm installed. See [prerequisites](getting_started/prerequisites.md).
Consider using [nvm](https://github.com/nvm-sh/nvm#node-version-manager---)
to ensure you're using the latest node.

Note that as a frontend project, we use node for compiling and bundling frontend code,
not for running the backend or server.

## Working on a microfrontend

Clone the repository of interest. For this example we'll use
[openmrs-esm-template-app](https://github.com/openmrs/openmrs-esm-template-app).

```bash
git clone https://github.com/openmrs/openmrs-esm-template-app.git
```

Then change to the cloned repository's directory and install its dependencies.

```bash
cd openmrs-esm-template-app
npm install
```

Then you're ready to start a dev server! Simply run

```bash
npm run start
```

If you look at the `start` script in `package.json`, you'll see that this executes

```bash
npx openmrs develop  # the 'npx' is 'npm exec', which is implicit within `scripts`
```

> **For the curious**: This command runs two dev servers. One serves the
*app shell*, which
is installed as a dependency of the `openmrs` package.
The other serves the microfrontend.
They come together via the import map.

You can usually run commands with `--help` to learn more about them.
Try `npm run start -- --help` (or `npx openmrs develop --help`), for example.

## Developing microfrontends in a Lerna monorepo

In a [Lerna monorepo](https://github.com/lerna/lerna#readme), the commands are
a bit different. As an example monorepo you can use
[openmrs-esm-patient chart](https://github.com/openmrs/openmrs-esm-patient-chart).

```bash
git clone https://github.com/openmrs/openmrs-esm-patient-chart.git
```

To install dependencies, use the `lerna` executable.

```bash
cd openmrs-esm-patient-chart
npx lerna bootstrap
```

And to start a dev server, use the `openmrs` executable directly.
To work on the package `@openmrs/esm-patient-vitals-app`, run

```bash
npx openmrs develop --sources packages/esm-patient-vitals-app/
```

To work on multiple packages at the same time, you can use a  wildcard / glob
pattern for the `--sources` parameter. For example,

```bash
npx openmrs develop --sources packages/esm-*-app/
```

will run a local server with all the microfrontends matching the pattern.

## Import Map Overrides

If you'd like to work on multiple microfrontends that aren't in a monorepo together,
or if you'd like to run a microfrontend you are developing locally on a
deployed server somewhere, you can use Import Map Overrides,
which is made available through the OpenMRS DevTools.

> If you'd like to understand how Import Map Overrides works, check out
  the [documentation](https://github.com/joeldenning/import-map-overrides).
  If you'd just like to use it, continue reading here.

To enable the OpenMRS DevTools, open your browser's JavaScript console and execute

```javascript
localStorage.setItem('openmrs:devtools', true)
```

After refreshing the page, a little box should appear in the lower-right hand corner of the page.
Clicking this box opens the OpenMRS DevTools.

In the microfrontend you want to develop, run

```bash
# if the OpenMRS frontend you're looking at uses HTTP (e.g. a local server)
npm run serve
# if the OpenMRS frontend you're looking at uses HTTPS (e.g. openmrs-spa.org)
npm run serve --https
```

> Substitute `yarn serve` if the project uses Yarn, or `narn serve` if you use
  [narn](https://github.com/joeldenning/narn).

The protocol of the application must match the protocol of the locally-served microfrontend.

This command will serve the microfrontend and tell you the port where it is serving,
as well as showing you the filenames that are being served. You can then use
the import map overrides panel to override the existing import map
entry, or add your microfrontend as a new entry.

For example, if you run `yarn serve` in
[esm-login-app](https://github.com/openmrs/openmrs-esm-core/tree/master/packages/apps/esm-login-app),
and if it says something like `Project is running at http://localhost:8080/`,
as well as something like `asset openmrs-esm-login-app.js`, then in the import
map overrides you can click on the entry for `openmrs-esm-login-app` and give it the value

```
//localhost:8080/openmrs-esm-login-app.js
```

You can also simply type `8080` and Import Map Overrides will infer the URL above.

> **Note**: The name of the entrypoint file (such as `openmrs-esm-login-app.js`) is set
  by the `browser` parameter of the `package.json`.

### Note on using HTTPS

If you're using import map overrides on a server that uses HTTPS, you must use `serve` with the
`--https` flag. Your browser will probably complain about the certificate.
You will need to convince it
that there is no security risk. In Chrome, enabling the "allow insecure localhost" flag
(chrome://flags/#allow-insecure-localhost) can help.
