# Migration Guide for Core Dependencies

## Motivation

Presently, the OpenMRS 3 frontend uses core dependencies that are several years out of date. Specifically, we are looking to migrate the following dependencies to the latest available versions to be able to leverage new features, fixes, API improvements, and bundle size savings:

- React 
- React Router
- Carbon Design System
- Jest / React Testing Library / userEvent

## Preamble

* React 18 adds in concurrency, automatic render batching, and makes `<Suspense>` a first class citizen leading to **faster loading** of elements due to the decoupling of UI rendering and API fetching.
* This compounds with React Router 6 which can enable a **several times speedup** of widget load times when implemented correctly.
* Updates to Carbon v11 keep the UI modern for designers, the package and API cleanup makes it faster to use for developers, and smaller bundle sizes mean a faster UI for customers.
* Jest now supports test sharding which means our tests can run faster than ever.

## Dependencies

### React
We're currently on React 16.14 (released in October 2020) across all our repositories. React 18, released in March 2022, brought out-of-the-box improvements like automatic batching, new APIs like `startTransition`, and streaming server-side rendering with support for `Suspense`. Notably:

 - `Suspense` is now a first-class citizen. This will allow us to unblock component rendering while API calls decide to load.
 - Children are no longer implicitly declared as props of type `React.ReactNode`. They have to be declared explicitly.
 - Automatic batching is enabled by default which helps reduce the number of renders.
 - The new concurrent render means that the UI can immediately respond to user input even if it's in the middle of a large render task
. This should result in a more fluid user experience.
 - The concurrent render also adds support for reusable state so that previously rendered sections of the UI can be added back in.

Important resources: [React 18 release notes](https://reactjs.org/blog/2022/03/29/react-v18.html) and [Migration Guide](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html).

### React Router
We're currently on React Router v5.3 (released in March 2019). React Router 6 introduces several powerful new features, as well as improved compatibility with the latest versions of React. Notably:

  - All `<Route>`s and `<Link>`s inside a `<Routes>` are relative. This leads to leaner and more predictable code in `<Route path>` and `<Link to>`.
  - Routes are chosen based on the best match instead of being traversed in order. This avoids bugs due to unreachable routes because they were defined later in the `<Switch>`
  - Routes are allowed to be nested instead of being spread out. This allows all routes to be easily seen at once. Meanwhile, nested routes can still be loaded dynamically via `React.lazy`.
  - Route children can only be nested routes; rendered elements need to go in `element`. This simplifies reading the routing structure leading to fewer bugs.
  - Switches to using React Elements instead of Components. This combined with React 18's native Suspense makes for very quick rendering.
  - Discontinued use of regex routes leads to cleaner route syntax and drops `path-to-regexp` dependency reducing bundle size.
`useNavigate` is more suspense friendly than the old `useHistory`. This provides a smoother experience when a user interaction needs to interrupt a pending route transition.

Important resources: [Migration Guide](https://reactrouter.com/en/main/upgrading/v5).

### Carbon Design System 
We're currently on Carbon v10 (released in December 2020). Carbon 11 shipped with a host of feature improvements, fixes and enhancements to the developer experience. Notably: 

 - The [Design Kit](https://carbondesignsystem.com/migrating/guide/design) has:
   - Updated concepts for Notifications, Tooltip, Tabs, Sizing, Type tokens, and Color tokens.
   - New Popover and Toggletip features.
 - The UI shell is now theme-able to support light and dark mode.
 - The [React packages](https://carbondesignsystem.com/migrating/guide/develop) have been simplified from 4 packages down to one: `@carbon/react`.
 - Sass styles are now accessible directly from `@carbon/react/scss` 
 - 90% decrease in compilation time of Styles from Carbon.
 - `size` is now consistent across all components.
 - Uses CSS Grid (2 dimensional) by default instead of flexbox grid (1 dimension). (See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Relationship_of_Grid_Layout) for more info.)
 - Same IBM Design Language. Does not require any brand-driven product redesigns.

Important resources: [Carbon v11 release notes](https://v10.carbondesignsystem.com/whats-happening/v11-release/) /  [Migration Guide](https://github.com/carbon-design-system/carbon/blob/main/docs/migration/v11.md) / [Carbon v11 announcement blog post](https://medium.com/carbondesign/carbon-v11-72ace7fac01f).

### Jest / Testing Library React / userEvent

We're currently on the following versions:

- Jest v26
- Testing Library React v10
- userEvent v12

Jest v28 introduced some long-requested features such as: 

  - Support for sharding a test run across multiple machines. Upon leveraging this feature, Jest's own test suite on CI went from about 10 minutes to 3 on Ubuntu, and on Windows from 20 minutes to 7.
  - In Jest 28, jest-environment-node will now automatically provide node and node-addons conditions, while jest-environment-jsdom will provide the browser condition.
  - The ability to customize the behavior of fake timers. 
  - A new GitHub Actions reporter, which will use annotations to print test errors inline.
  Vastly improved type annotations.

Testing Library React v13 notably adds support for React 18 and drops support for older versions of React.

userEvent v14 adds various features and fixes. Notably:

  - The new `userEvent.setup` allows you to prepare the document for interacting per user-event APIs right when you set up your test.
  - v14 introduces a new `userEvent.pointer` API that enables users to simulate the events for user interaction per touchscreen or stylus.
  - APIs in v14 now always return a promise and are therefore asynchronous. As such, they have to be await-ed.

Important resources: [Jest 28 release notes](https://jestjs.io/blog/2022/04/25/jest-28) / [Testing Library React 13 changelog](https://github.com/testing-library/react-testing-library/releases/tag/v13.0.0) / [userEvent 14 changelog](https://github.com/testing-library/user-event/releases/tag/v14.0.0).

## Strategy

Because all versions are pointing to `next` version of `esm-framework`, `openmrs`, and `webpack-config` 
we will need to manually point to a 4.0 shell. Because this is not addressable using tag syntax and the 4.0 
branch is not found on the package manager npmjs.com we need to pull the branch locally, build it into
consumable .js files and serve the .js files from the app shell. Once the shell is ready to serve the 
backbone of the app we can start to add microfrontends to it one at a time through serving those microfrontends
locally and pointing to the local server via import map. With the core and apps running on the same local
browser, we can start to integrate the modules together using the new libraries.

## Procedure

1. Get latest openmrs-esm-core branch ([4.0](https://github.com/openmrs/openmrs-esm-core/tree/main)) - This is the branch where new versions of the core libraries are specified (thanks to a prior effort by Brandon) 

2. Build the App Shell – This compiles the core source files into static webpack JS files which can be served. This will automatically bundle all of the openmrs-esm-core/packages/apps/ into a dist folder. The yarn run:shell at the end serves this app shell on 8080 and will be our main entry into the app.

  - In openmrs-esm-core: `cd packages/tooling/webpack-config` then `yarn build`

  - In openmrs-esm-core: `cd packages/tooling/openmrs` then `yarn build`

  - In openmrs-esm-core: `cd packages/shell/esm-app-shell` then `yarn build`

  - In openmrs-esm-core: `yarn run:shell`
  
  At this point there should be no errors in the terminal. The web server should start in your terminal and the app shell should load in your browser, although most of the microfrontends will be missing and should tell you this in the browser console. 

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

10. Upgrade React Router Dom to v6

    * Follow the upgrade guide [here](https://reactrouter.com/en/main/upgrading/v5)

11. Upgrade Jest to v28

12. Upgrade Testing Library React to v13

13. Upgrade userEvent to v13

Congratulations! You have upgraded one microfrontend to use the latest libraries.

Repeat steps 4-8 for all packages you want to serve, upgrade, and re-integrate at the same time.

## Troubleshooting & Tips

The following commands can help you figure out what is happening when you run into trouble:

* `yarn list @types/react` to see conflicting type definitions of react.

* `yarn why` to see why a particular module is loaded.

* `ls –l node_modules/@openmrs` to see which packages are symlinks or downloaded files.

* When in doubt destroy node_modules folder and rebuild by running `yarn`.

* When in doubt start from the beginning with `git status` to check you are on the right branch and `git pull` to find the latest updates.  

* `yarn upgrade` for this migration is tricky since we technically don't want the latest of the core or framework packages listed on npmjs.com. We are trying to use our own versions. This will help upgrade other packages (to within their current semver specification in package.json) if they need it, but likely you will need to re-link the esm-framework folders 

* Easy to revert all symlinks by destroying node_modules and running `yarn`

## Releasing a major pre-release version of esm-core

To prepare other frontend modules it is helpful to have pre-releases of new major versions.
For example, before 4.0.0 is released, 4.0.0-pre.1 is released so that frontend
module maintainers can install that version and fix everything that needs to be
fixed.

To release a version like `4.0.0-pre.5`:
1. Make sure the release branch is in good shape. `yarn` and `yarn verify`.
2. Build everything. `yarn turbo run build`.
3. Version bump. `yarn lerna version`. Select "Custom Version" and type `4.0.0-pre.5`.
4. Publish
  - In the past I have published with `yarn lerna publish from-package`. However, this
    tags the published version as `latest`, which is definitely not what you want. I have
    corrected this by manually running `npm dist-tag add @openmrs/esm-abc@3.4.0 latest`
    for everything published, which is a very annoying thing to have to do.
  - You can try doing `yarn lerna publish from-package --dist-tag=4.0`; I think `4.0` is
    a reasonable tag for this. There is no way to publish without tagging at all.
