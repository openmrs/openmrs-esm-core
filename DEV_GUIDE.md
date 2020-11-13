# Developer Guide to Developing an MF and Creating a Distribution

You can find the reference application (“refapp”) that is used for testing the latest bits and pieces at https://openmrs-spa.org/openmrs/spa.

## Table of Contents

<!-- toc -->

- [How do I create a new microfrontend?](#how-do-i-create-a-new-microfrontend)
- [How do I work on multiple microfrontends at the same time?](#how-do-i-work-on-multiple-microfrontends-at-the-same-time)
- [How do I create a distribution?](#how-do-i-create-a-distribution)

<!-- tocstop -->


## How do I create a new microfrontend?

What is the general workflow?

Clone the repository of interest
git clone https://github.com/openmrs/openmrs-esm-patient-chart 

Make sure that you installed the dependencies (in the repository’s directory)
npm install

Start a dev server:
```
npx openmrs debug --run-project
npx openmrs@latest
```

Modify the code (e.g., in VS Code)

Commit code and create a PR

PR is reviewed and merged. This will be available on the reference application first

Once everything is fine make sure to update the version in the package.json (e.g., from 1.2.3 to 1.2.4 if its a bugfix, or 1.2.3 to 1.3.0 if a new feature had been implemented)

Repeat 4) and 5); then have somebody to create a new release on GitHub incl. correct release notes

The package is now available on NPM and can be used in any OpenMRS instance

Example for release notes: https://github.com/openmrs/openmrs-esm-drugorder/releases/tag/v0.3.0


## How do I work on multiple microfrontends at the same time?
There are multiple ways; on your machine and using the reference application.

Local machine:

After starting the first one with npx openmrs debug, additional microfrontends can be served using npx webpack-dev-server. The microfrontend will be served at a URL like http://localhost:8081/openmrs-esm-xyz.js (the path is the output filename shown in that module’s webpack config).

Now you can use the devtools displayed via the little box in the lower-right hand side of the page. Click on it and add the respective modules via their local URLs.

Refapp:

In the reference application the devtools are not always loaded. Instead, they need to be enabled first. To enable the devtools, open your browser’s developer tools, and in the Javascript console run 

```
localStorage.setItem('openmrs:devtools', true)
```

After refreshing the page, you will see a little box appear in the lower-right hand side of the page. This will open an interface you can use to add or override entries of the import map. Rest is as on the local machine.


## How do I create a distribution?

For creating a new distribution using the OpenMRS microfrontends the following steps should be followed.

Build your app shell using
npx openmrs build

Assemble your selected microfrontends / modules to be used
npx openmrs assemble

Select a way of running the frontend
Using the “openmrs-module-spa” backend module
Using a dedicated frontend server, e.g., using an nginx Docker image

For (1) and (2) there are multiple command line flags to set the right options. If in doubt consult the documentation. A quick way to see what is possible is to run these commands with the --help flag, e.g.,

npx openmrs build --help

With the openmrs-module-spa backend module:

(tbd)

With a custom nginx Docker image:

(tbd)
