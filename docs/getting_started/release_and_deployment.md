# Continuous Integration and Releases

<!-- needs improvement -->

Distributions use microfrontends which are published as packages in NPM.
Those distributions can refer to microfrontend versions by number (e.g. `3.1.0`)
or by tag (e.g. `latest`).

GitHub Actions is used to publish microfrontends from the `master` branch
to the `next` tag.
You can see the published versions of each microfrontend on npmjs.com. See for example
[@openmrs/esm-login-app](https://www.npmjs.com/package/@openmrs/esm-login-app?activeTab=versions).
The [openmrs-spa.org CI server](https://openmrs-spa.org/openmrs/spa/login)
always shows the `next` version of all microfrontends (i.e., the latest from the
`master` branch).

You can version a microfrontend by creating a release in GitHub. This will trigger
GitHub Actions to publish a new version of the package with the `latest` tag.
Write release notes that explain what's happened since the last release. See
[an example](https://github.com/openmrs/openmrs-esm-core/releases/tag/v3.1.2).
