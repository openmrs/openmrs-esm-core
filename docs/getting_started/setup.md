# Setup


## Prerequisities

:bangbang:	This setup guide is for individuals who want to develop on the O3 Framework. **You will need to set up an O3 instance first.**	*If you do not already have an O3 Instance set up, please **first** follow the guidance at: https://om.rs/o3setup.*

You must have git, node, npm, and yarn installed. The versions required are
- The Node [Active LTS version](https://github.com/nodejs/release#release-schedule)
- The latest stable version of NPM
- The latest stable version of Yarn

See [prerequisites](./prerequisites.md) if any of these technologies
are unfamiliar to you.
Consider using [nvm](https://github.com/nvm-sh/nvm#node-version-manager---)
to manage your node version.

Note that as a frontend project, we use Node for compiling and bundling frontend code,
not for running the backend or server.

## Working on a frontend module

Clone the repository of interest. For this example we'll use
:sparkles:**[openmrs-esm-template-app](https://github.com/openmrs/openmrs-esm-template-app)**:sparkles:.

> Note that this repository is a good starting point for creating a new
frontend module, and also contains lots of information explaining the
different pieces of frontend modules, along with the
[Tour of a Frontend Module](./tour.md).

```bash
git clone https://github.com/openmrs/openmrs-esm-template-app.git
```

Then change to the cloned repository's directory and install its dependencies.

```bash
cd openmrs-esm-template-app
yarn
```

Then you're ready to start a dev server! The command to run will depend on
the repository you checked out. Read the README for that repository to find
out what command you should run. In the case of `openmrs-esm-template-app`,
use `yarn start` to start the server.

```bash
yarn start
```

This command will run a "script" from the `package.json`
file. Take a look at the `scripts` section of that file to find out what
the command actually does.

Once the frontend server starts up, you should be able to access the template
app at http://localhost:8080/openmrs/spa/hello. <!-- markdown-link-check-disable-line -->
You might be redirected to the log in page to log in first.

> :bulb: You run almost any command with `--help` to learn more about it.
> This includes `yarn start --help`.

### Troubleshooting

If you're running Linux, you may see the following error the first time you run
a a dev server: `Error: ENOSPC: System limit for number of file watchers reached`.
If that happens, you need to increase the system limit for the number of file
watchers. See
[this StackOverflow answer](https://stackoverflow.com/a/55763478/1464495).

## Import map overrides

If you'd like to work on multiple frontend modules that aren't in a monorepo together,
or if you'd like to run a frontend module you are developing locally on a
deployed server somewhere, you can use import map overrides,
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

In the frontend module you want to develop, run

```bash
# if the OpenMRS frontend you're looking at uses HTTP (e.g. a local server)
yarn serve
# if the OpenMRS frontend you're looking at uses HTTPS (e.g. dev3.openmrs.org)
yarn serve --https
```

> Substitute `npm run serve` if the project uses NPM, or `narn serve` if you use
  [narn](https://github.com/joeldenning/narn).

The protocol of the application must match the protocol of the locally-served frontend module.

This command will serve the frontend module and tell you the port where it is serving,
as well as showing you the filenames that are being served. You can then use
the import map overrides panel to override the existing import map
entry, or add your frontend module as a new entry.

For example, if you run `yarn serve` in
[esm-login-app](https://github.com/openmrs/openmrs-esm-core/tree/main/packages/apps/esm-login-app),
and if it says something like `Project is running at http://localhost:8080/`,
as well as something like `asset openmrs-esm-login-app.js`, then in the import
map overrides you can click on the entry for `openmrs-esm-login-app` and give it the value

```
//localhost:8081/openmrs-esm-login-app.js
```

You can also simply type `8081` and Import Map Overrides will infer the URL above.

> **Note**: The name of the entrypoint file (such as `openmrs-esm-login-app.js`) is set
  by the `browser` parameter of the `package.json`.

### Note on using HTTPS

If you're using import map overrides on a server that uses HTTPS, you must use `serve` with the
`--https` flag. Your browser will probably complain about the certificate.
You will need to convince it
that there is no security risk. In Chrome, enabling the "allow insecure localhost" flag
(chrome://flags/#allow-insecure-localhost) can help.
