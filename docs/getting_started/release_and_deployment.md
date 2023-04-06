# Continuous Integration and Releases

<!-- needs improvement -->

Distributions use frontend modules which are published as packages in NPM.
Those distributions can refer to frontend module versions by number (e.g. `3.1.0`)
or by tag (e.g. `latest`).

GitHub Actions is used to publish frontend modules from the `main` branch
to the `next` tag.
You can see the published versions of each frontend module on npmjs.com. See for example
[@openmrs/esm-login-app](https://www.npmjs.com/package/@openmrs/esm-login-app?activeTab=versions).
The [OpenMRS CI server](https://dev3.openmrs.org/openmrs/spa/login)
always shows the `next` version of all frontend modules (i.e., the latest from the
`main` branch).

You can version a frontend module by creating a release in GitHub. This will trigger
GitHub Actions to publish a new version of the package with the `latest` tag.
Write release notes that explain what's happened since the last release. See
[an example](https://github.com/openmrs/openmrs-esm-core/releases/tag/v3.1.2).

## Subscribe to Community Release Announcements
To follow the latest O3 release announcements, join [OpenMRS Slack](https://slack.openmrs.org) and subscribe to the channel [#openmrs3-releaseannouncements](https://openmrs.slack.com/archives/C052500RS0L).
