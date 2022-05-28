# Migration Guide for React 18, Carbon v11, and React Router Dom 6

## Motivation

As of this writing the OpenMRS 3.x frontend is using Ract 16.18, Carbon v10, and Ract Router Dom v5. 
All of these are about two years old by now and many breaking changes have happened since. 

## Strategy

Because all versions are pointing to `next` version of `esm-framework`, `openmrs`, and `webpack-config` 
we will need to manually point to a 4.0 shell. Becuase this is not addressble using tag syntax and the 4.0 
branch is not found on the package manager npmjs.com we need to pull bhe branch locally, build it into
consumable .js files and serve the .js files from the app shell. Once the shell is ready to serve the 
backbone of the app we can start to add microfrontends to it one at a time through serving those microfrontends
locally and pointing to the local server via import map. With the core and apps running on the same local
browswer, we can start to integrate the modules together using the new libraries.

## Procedure

1. Get latest openmrs-esm-core branch (4.0) - This is the branch where new versions of the core libraries are specified (thanks to a prior effort by Brandon) 

2. Build the App Shell – This compiles the core source files into static webpack JS files which can be served. This will automatically bundle all of the esm-core/packages/apps/ into a dist folder. The yarn run:shell at the end serves this app shell on 8080 and will be our main entry into the app.

    * In esm-core, `cd packages/tooling/webpack-config` then `yarn build`

    * In esm-core, `cd packages/tooling/openmrs` then `yarn build`

    * In esm-core `cd packages/shell/esm-app-shell` then `yarn build`
    * In esm-core `yarn run:shell`

    * At this point there should be no errors in the terminal. The web server should start in your terminal and the app shell should load in your browswer, although most of the microfrontends will be missing and should tell you this in the browser console. 

3. Create links to all core packages (if you haven't already). This will make them available in the yarn system to do a symlink shorthand inside of node_modules 

    * In each esm-core/packages/[apps, framework, shell/esm-app-shell/, tooling] repo create a yarn link like: `yarn link`

    * This registers the link with yarn 

4. Link child package to the up-to-date esm-core. This will tell them to use the local version rather than downloading "next" from npmjs.com 

    * In esm-patient-management `yarn link @openmrs/esm-app-shell` (example of doing one at a time)

    * In esm-patient-management `yarn link @openmrs/esm-api          @openmrs/esm-config          @openmrs/esm-extensions  @openmrs/esm-globals  @openmrs/esm-react-utils  @openmrs/esm-styleguide @openmrs/esm-breadcrumbs  @openmrs/esm-error-handling  @openmrs/esm-framework   @openmrs/esm-offline  @openmrs/esm-state        @openmrs/esm-utils` (do everything at once to save time)

    * You can check that this is working by using patient-management% `ls –l node_modules@openmrs`. This should show symlinks instead of the usual directories containing the source code.

5. Copy the contents of esm-core webpack-config build files ( in `webpack-config/dist/`) to the the target repo. We need to do it this way becuase symlinks will not work with webpack config

    * Copy the files over: In esm-patient management `cp -r /path/to/esm-core/packages/tooling/webpack-config/dist/* node_modules/@openmrs/webpack-config/dist/ `

    * Point the individual mocrofrontend up to the repo's version of webpack config: Change the contents of `esm-patient-management/packages/esm-patient-search-app/webpack.config.js`  to be `module.exports = require('../../node_modules/@openmrs/webpack-config'); `

    * Using `ls -l node_modules/@openmrs` in patient-management again we should see all the previous symlinks and now `webpack-config` which is a directory instead

6. Upgrade packages within a repo 

    * Add React. In esm-patient-management: `yarn add -D -W react react-dom`
    
    * Add types. In esm-patient-management: `yarn add -D -W @types/react@latest @types/react-dom@latest @types/react-router-dom@latest`

    * Update microfrontend reference. In patient-search: `yarn add --peer react`

7. Serve the specific app you want the app shell to find. This will start another local server where this module will be active, referencing by this point hopefully all the correct versions of the core. 

    * In esm-patient-management  `cd packages/esm-patient-search-app` then `yarn serve`

    * This will start a webpack dev server. Your microfrontend will be available at something like `[webpack-dev-server] Loopback: http://localhost:8081/`

8. Add to import map overrides to the app shell (http://o3-dev.docs.openmrs.org/#/getting_started/setup). In the browser where app shell is running (http://localhost:8080/openmrs/spa/home)  

    * Enable devtools by setting `localStorage.setItem('openmrs:devtools', true)` in your console browser

    * Open the devtools by clicking grey box in lower right of page.

    * Find 'patient-search' -> click on it to edit entry 

    * Type `8081` to set import url to "//localhost:8081/openmrs-esm-patient-search-app.js" (Make correctios to this based on what your port was from the previous step)

    * Refresh the page 

 
At this point you will have a local version of the core app shell running, and one of the microfrontends served locally on a different server. The app shell is then pointed to the second server thanks to the importmap override done with the help of the devtools. 

Repeat steps 4-8 for all packages you want to serve at the same time.
