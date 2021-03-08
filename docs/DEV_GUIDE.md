# Developer Guide to Developing an MF and Creating a Distribution

You can find the reference application ("refapp") that is used for testing the latest bits and pieces at https://openmrs-spa.org/openmrs/spa.

## Table of Contents

<!-- toc -->

- [How do I create a new microfrontend?](#how-do-i-create-a-new-microfrontend)
- [How do I work on multiple microfrontends at the same time?](#how-do-i-work-on-multiple-microfrontends-at-the-same-time)
- [How do I create a distribution?](#how-do-i-create-a-distribution)
- [Which version of OpenMRS is required to support Microfrontends?](#which-version-of-openmrs-is-required-to-support-microfrontends)
- [Which OpenMRS modules are required by the Microfrontends framework?](#which-openmrs-modules-are-required-by-the-microfrontends-framework)

<!-- tocstop -->

## How do I create a new microfrontend?

What is the general workflow?

Clone the repository of interest (e.g. [openmrs-esm-patient chart](https://github.com/openmrs/openmrs-esm-patient-chart)):

```sh
git clone https://github.com/openmrs/openmrs-esm-patient-chart
```

Change to the cloned repository's directory and install its dependencies:

```sh
cd openmrs-esm-patient-chart
npm install
```

Start a dev server (more explanation below):

```sh
npx openmrs debug --run-project
npx openmrs debug --run-project --sources 'packages/esm-*-app/'
npx openmrs@latest
```

The first option starts the dev server for a local microfrontend. This triggers a dev server on the installed app shell and another dev server on the local microfrontend. Both will come together via the import-map making the process quite easy.

Likewise, the second option could be utilized in a monorepo where multiple microfrontends should be debugged simultaneously. The `sources` option accepts a wildcard / glob pattern for the source directory.

The last one just starts a local OpenMRS instance, which is great for demo purposes.

Make changes to the code and when done, commit them upstream and make a pull request. The pull request is then reviewed and merged. The changes introduced will be automatically be deployed to the reference application.

Once everything is fine make sure to bump the version in the `package.json` (e.g., from `1.2.3` to `1.2.4` for a bugfix, or `1.2.3` to `1.3.0` if a new feature had been implemented. See [semantic versioning guidelines](https://semver.org/)).

Once enough pull requests have merged in to merit a new release, you can reach out to one of the our maintainers for help creating a new release. Following the release, an updated package will be available on NPM and ready for use in any OpenMRS instance.

Example showing release notes from a recent release in the [drugorder](https://github.com/openmrs/openmrs-esm-drugorder) microfrontend: https://github.com/openmrs/openmrs-esm-drugorder/releases/tag/v0.3.0.

## How do I work on multiple microfrontends at the same time?

There are multiple ways of achieving this.

### Working on your local machine:

Start the first microfrontend using:

```sh
npx openmrs debug
```

With this running, additional microfrontends can be served using:

```
npx webpack-dev-server
```

The microfrontend will be served at a URL such as `http://localhost:8081/openmrs-esm-xyz.js` (where the path is the output filename as indicated in that module’s webpack config).

Now you can use the devtools displayed via the little box in the lower-right hand side of the page. Click on it and add the respective modules via their local URLs.

### Working in the reference application:

One thing to note about this case is that the OpenMRS devtools (which allow you to perform [import-map overrides](https://github.com/joeldenning/import-map-overrides) ) are not enabled by default. You might need to enable them first. To do so, open your browser's devtools panel and run the following command in the JavaScript console:

```
localStorage.setItem('openmrs:devtools', true)
```

After refreshing the page, a little box appear should in the lower-right hand corner of the page. Clicking this box should open the import map overrides panel. You can use this interface to override URLs for the JavaScript modules that are loaded in your application so that they reference locally running versions of the modules at development-time. You can then proceed with your usual local development workflow.

## How do I create a distribution?

The process for creating a distribution with OpenMRS microfrontends is as follows:

Build your app shell using:

```sh
npx openmrs build
```

Assemble your selected microfrontends / modules:

```sh
npx openmrs assemble
```

Choose a way of running the microfrontend:

1. Using the `openmrs-module-spa` backend module.
2. Using a dedicated frontend server, e.g., using an nginx Docker image.

In both cases, there are multiple command line flags available that allow you can tweak to get the right setup. If in doubt, consult the documentation, or run the commands with the `--help` flag e.g.

```sh
npx openmrs build --help
```

With the `openmrs-module-spa` backend module:

(tbd)

With a custom nginx Docker image:

(tbd)

## Which version of OpenMRS is required to support Microfrontends?

(in progress)

## Which OpenMRS modules are required by the Microfrontends framework?

(in progress)
