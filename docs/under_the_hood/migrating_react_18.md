# Migration Guide for React 18, Carbon v11, and React Router Dom 6

## Motivation

As of this writing the OpenMRS 3.x frontend is using versions of its core libraries which are 1-2 years out of date. Below is a list of the packages we're upgrading from -> to with some explanation of the specifics.
### Summary
* React 18 adds in concurrency, automatic render batching, and makes `<Suspense>` a first class citizen leading to **faster loading** of elements due to the decoupling of UI rendering and API fetching.
* This compounds with React Router 6 which can enable a **several times speedup** of widget load times when implemented correctly.
* Updates to Carbon v11 keep the UI modern for designers, the package and API cleanup makes it faster to use for developers, and smaller bundle sizes mean a faster UI for customers.
### Specifics

* Currently on React 16.14, upgrading to React 18.1. Detailed notes can be found in the [How To Upgrade to React 18](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html) guide and also the [React v18.0](https://reactjs.org/blog/2022/03/29/react-v18.html) release post.
    * Suspense is now a first class citizen. This will allow us to unblock component rendering while api calls decide to load.
    * Children are now not assumed prop of type `React.ReactNode`, now need to be explicitly declared.
    * Automatic batching is on by default which helps reduce the number of renders.
    * New concurrent render means that the UI can immediately respond to user input even if it's in the middle of a large render task. => A more fluid UX
    * Concurrent render also adds support for reusable state so that previously rendered sections of the UI can be added back in.
* Currently on carbon-components-react v7.31 (Carbon v10), upgrading to @carbon/react v1.4 (Carbon v11). See the [Carbon V11 FAQ](https://carbondesignsystem.com/migrating/faq/) for a full list of benefits.
    * The [Design Kit](https://carbondesignsystem.com/migrating/guide/design) has:
        * Updated concepts for Notifications, Tooltip, Tabs, Sizing, Type tokens, and Color tokens
        * New Popover and Toggletip features
        * The UI shell is now theme-able to support light and dark mode.
    * The [React packages](https://carbondesignsystem.com/migrating/guide/develop) have been simplified from 4 packages down to one: `@carbon/react`.
    * Sass styles are now accessible directly from `@carbon/react/scss` 
    * 90% decrease in compilation time of Styles from Carbon.
    * `size` is now consistent across all components.
    * Uses CSS Grid (2 dimensional) by default instead of flexbox grid (1 dimension). (See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Relationship_of_Grid_Layout) for more info.)
    * Same IBM Design Language. Does not require any brand-driven product redesigns.
* Currently on react-router-dom v5.3, upgrading to react-router-dom v6.3. Read the [v6 upgrade guide](https://reactrouter.com/docs/en/v6/upgrading/v5) for more information.
    * All `<Route>`s and `<Link>`s inside a `<Routes>` are relative. This leads to leaner and more predictable code in `<Route path>` and `<Link to>`
    * Routes are chosen based on the best match instead of being traversed in order. This avoids bugs due to unreachable routes because they were defined later in the `<Switch>`
    * Routes are allowed to be nested instead of spread out. This allows all routes to be easily seen at once. Meanwhile nested routes can still be loaded dynamically via `React.lazy`.
    * Route children can only be nested routes; rendered elements need to go in `element`. This simplifies reading the routing structure leading to fewer bugs.
    * Switches to using React Elements instead of Components. This combined with React 18's native Suspense makes for very quick rendering.
    * Discontinued use of regex routes leads to cleaner route syntax, and drops `path-to-regexp` dependency reducing bundle size.
    * `useNavigate` is more suspense friendly than the old `useHistory`. This provides a smoother experience when a user interaction needs to interrupt a pending route transition.


## Strategy

Because all versions are pointing to `next` version of `esm-framework`, `openmrs`, and `webpack-config` 
we will need to manually point to a 4.0 shell. Because this is not addressable using tag syntax and the 4.0 
branch is not found on the package manager npmjs.com we need to pull the branch locally, build it into
consumable .js files and serve the .js files from the app shell. Once the shell is ready to serve the 
backbone of the app we can start to add microfrontends to it one at a time through serving those microfrontends
locally and pointing to the local server via import map. With the core and apps running on the same local
browser, we can start to integrate the modules together using the new libraries.

## Procedure

1. Get latest openmrs-esm-core branch ([4.0](https://github.com/openmrs/openmrs-esm-core/tree/4.0)) - This is the branch where new versions of the core libraries are specified (thanks to a prior effort by Brandon) 

2. Build the App Shell – This compiles the core source files into static webpack JS files which can be served. This will automatically bundle all of the openmrs-esm-core/packages/apps/ into a dist folder. The yarn run:shell at the end serves this app shell on 8080 and will be our main entry into the app.

    * In openmrs-esm-core: `cd packages/tooling/webpack-config` then `yarn build`

    * In openmrs-esm-core: `cd packages/tooling/openmrs` then `yarn build`

    * In openmrs-esm-core: `cd packages/shell/esm-app-shell` then `yarn build`

    * In openmrs-esm-core: `yarn run:shell`

    * At this point there should be no errors in the terminal. The web server should start in your terminal and the app shell should load in your browser, although most of the microfrontends will be missing and should tell you this in the browser console. 

3. Create links to all core packages (if you haven't already). This will make them available in the yarn system to do a symlink shorthand inside of node_modules 

    * In each openmrs-esm-core/packages/[apps, framework, shell/esm-app-shell/, tooling] repo create a yarn link like: `yarn link`

<!-- markdown-link-check-disable-next-line -->
4. Link child package to the up-to-date openmrs-esm-core. This will tell them to use the local version rather than downloading "next" from [npmjs.com](npmjs.com).

    * In openmrs-esm-patient-management `yarn link @openmrs/esm-app-shell` (example of doing one at a time)

    * In openmrs-esm-patient-management `yarn link @openmrs/esm-api          @openmrs/esm-config          @openmrs/esm-extensions  @openmrs/esm-globals  @openmrs/esm-react-utils  @openmrs/esm-styleguide @openmrs/esm-breadcrumbs  @openmrs/esm-error-handling  @openmrs/esm-framework   @openmrs/esm-offline  @openmrs/esm-state        @openmrs/esm-utils` (do everything at once to save time)

    * You can check that this is working by using patient-management% `ls –l node_modules@openmrs`. This should show symlinks instead of the usual directories containing the source code.

5. Copy the contents of openmrs-esm-core webpack-config build files ( in `webpack-config/dist/`) to the the target repo. We need to do it this way because symlinks will not work with webpack config

    * Copy the files over: In esm-patient management `cp -r /path/to/esm-core/packages/tooling/webpack-config/dist/* node_modules/@openmrs/webpack-config/dist/ `

    * Point the individual mocrofrontend up to the repo's version of webpack config: Change the contents of `openmrs-esm-patient-management/packages/esm-patient-search-app/webpack.config.js`  to be:
    >`module.exports = require('../../node_modules/@openmrs/webpack-config'); `

    * Using `ls -l node_modules/@openmrs` in patient-management again we should see all the previous symlinks and now `webpack-config` which is a directory instead

6. Upgrade React within a repo. We do this now so that the types can resolve properly.

    * [Add React](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html). In openmrs-esm-patient-management: `yarn add -D -W react react-dom`
    
    * Add types. In openmrs-esm-patient-management: `yarn add -D -W @types/react@latest @types/react-dom@latest @types/react-router-dom@latest`

    * Update microfrontend reference. In patient-search: `yarn add --peer react`

7. Serve the specific app you want the app shell to find. This will start another local server where this module will be active, referencing by this point hopefully all the correct versions of the core. 

    * In openmrs-esm-patient-management  `cd packages/esm-patient-search-app` then `yarn serve`

    * This will start a webpack dev server. Your microfrontend will be available at something like `[webpack-dev-server] Loopback: http://localhost:8081/`

8. Add to import map overrides to the app shell ([See the developer docs](http://o3-dev.docs.openmrs.org/#/getting_started/setup)). In the browser where app shell is running (`http://localhost:8080/openmrs/spa/home`):

    * Enable devtools by setting `localStorage.setItem('openmrs:devtools', true)` in your console browser

    * Open the devtools by clicking grey box in lower right of page.

    * Find 'patient-search' -> click on it to edit entry 

    * Type `8081` to set import url to "`//localhost:8081/openmrs-esm-patient-search-app.js`" (Make corrections to this based on what your port was from the previous step)

    * Refresh the page. You should see the app running

At this point you will have a local version of the core app shell running, and one of the microfrontends served locally on a different server. The app shell is then pointed to the second server thanks to the importmap override done with the help of the devtools. Now you can really start the integration effort in earnest. Let's upgrade the rest of the packages.

9. Upgrade Carbon to v11

    * Follow the upgrade guide [here](https://carbondesignsystem.com/migrating/guide/develop).

10. Upgrade React Router Dom v6

    * Follow the upgrade guide [here](https://reactrouter.com/docs/en/v6/upgrading/v5)

Congratulations! You have upgraded one microfrontend to use the latest libraries.

Repeat steps 4-8 for all packages you want to serve, upgrade, and re-integrate at the same time. `help` 
## Troubleshooting & Tips

The following commands can help you figure out what is happening when you run into trouble

* `yarn list @types/react` to see conflicting type definitions of react.

* `yarn why` to see why a particular module is loaded.

* `ls –l node_modules/@openmrs` to see which packages are symlinks or downloaded files.

* When in doubt destroy node_modules folder and rebuild by running `yarn`.

* When in doubt start from the beginning with `git status` to check you are on the right branch and `git pull` to find the latest updates.  

* `yarn upgrade` for this migration is tricky since we technically don't want the latest of the core or framework packages listed on npmjs.com. We are trying to use our own versions. This will help upgrade other packages (to within their current semver specification in package.json) if they need it, but likely you will need to re-link the esm-framework folders 

* Easy to revert all symlinks by destroying node_modules and running `yarn`
