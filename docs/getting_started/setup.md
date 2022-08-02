# Setup

## Prerequisities

You must have git, node, npm, and yarn installed. The versions required are
- The Node [Active LTS version](https://nodejs.org/en/about/releases/)
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
[esm-login-app](https://github.com/openmrs/openmrs-esm-core/tree/master/packages/apps/esm-login-app),
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

## Staying Up To Date, Troubleshooting

Staying current with the code base is important to make sure we the latest fixes, latest features, and the correct API to develop against. When developing a microfrontend your code will depend on app-shell and core libraries and sometimes other microfrontends. For the OpenMRS project there are several places we should look to make sure our application is kept up to date. If you are having trouble running code locally when it appears to be working on the server ([dev3](https://dev3.openmrs.org/openmrs/spa)), consider taking any or all of these upgrade steps.
### Updating core libraries

If you notice your app suddenly stop working there is a chance that some core library has changed. The main dependencies shared by all OpenMRS microfrontends are  `openmrs` and `@openmrs/esm-framework`.

```sh
yarn upgrade openmrs @openmrs/esm-framework
git restore package.json # resets version numbers to "next" 
```

After updating these core libraries be sure to restart your development server

### Updating current branch

It's good practice to merge the main branch into your working branch often, at least once a week. This way, if anyone else has made changes to the app dependencies or fixed any bugs you will be able to get these benefits. Also, this prevents merge conflicts when trying to make a PR if your files are behind the main branch.

```sh
git checkout main
git pull
git checkout [my-branch-name]
git merge main
```

### Refreshing importmap

Sometimes the modules being pointed to by the importmap have been updated. If your local development setup is using an old importmap consider replacing the static versions with more recent versions. Another alternative here is to use a dynamic importmap when starting your local server 

```sh
# an example of pointing a local development server to a dynamic importmap
yarn start --importmap "https://spa-modules.nyc3.digitaloceanspaces.com/import-map.json"
```

### Clearing out the browser cache

By default the module javascript files are cached by your browser for 30 days. This is thanks to a [configuration setting](https://github.com/openmrs/openmrs-contrib-ansible-docker-compose/blob/c36115ca22b8fb842f8cf0ff745d1d35a4567912/files/emr-3-dev/proxy.conf#L97) on the server. This is a fine setting for end users, and caching is useful to make sure we don't need to download the entire app again with each reload, but as developers we often need the latest version of a core module or microfrontend as soon as it comes out. The easiest way to trigger a re-download of the app javascript files is to open your browser's implementer tools, going to the "Network" tab and checking "Disable Cache". Then, force reload the page. You should get brand new javascript files from the server. After you have refreshed the page to replace your cached script files, you can uncheck the "Disable Cache" option to improve the application behavior and not re-download script files on every reload. 

How to open browser developer tools (chrome)
<img width="933" alt="open-devtools-chrome" src="https://user-images.githubusercontent.com/5445264/182458545-ba701bb0-1cfe-4083-98bb-5e7338d97065.png">

How to disable asset (javascript, css) cache (chrome)
<img width="936" alt="disable-cache-chrome" src="https://user-images.githubusercontent.com/5445264/182458626-bab053e1-0d4c-4d71-a69a-1357fc1dd13e.png">

### Restarting your computer

Its possible for browser caches to not get cleared properly, or else for applications to be left in an inconsistent state which causes them to run poorly, slowly, or not at all. Sometimes these issues are only recoverable with restarting your computer

 > *Did you turn it off and then on again?
