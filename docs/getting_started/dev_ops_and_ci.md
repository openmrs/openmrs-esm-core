# Dev Ops and CI

<!-- needs improvement -->

Make changes to the code and when done, commit them upstream and make a pull request. The pull request is then reviewed and merged. The changes introduced will be automatically be deployed to the reference application.

Once everything is fine make sure to bump the version in the `package.json` (e.g., from `1.2.3` to `1.2.4` for a bugfix, or `1.2.3` to `1.3.0` if a new feature had been implemented. See [semantic versioning guidelines](https://semver.org/)).

Once enough pull requests have merged in to merit a new release, you can reach out to one of the our maintainers for help creating a new release. Following the release, an updated package will be available on NPM and ready for use in any OpenMRS instance.

Example showing release notes from a recent release in the [drugorder](https://github.com/openmrs/openmrs-esm-drugorder) microfrontend: https://github.com/openmrs/openmrs-esm-drugorder/releases/tag/v0.3.0.

## Guide for Deploying Microfrontends Continuously

Right now there are two major deployment mechanisms:

- Deploy the current version from the `master` branch in the reference app (https://openmrs-spa.org)
- Publish the NPM package(s) to be used in distributions

For the NPM package(s) we have two different tracks:

- Once `master` changed we publish a preview version using the `next` tag on NPM
- Once we create a release on GitHub we publish a package using the `latest` tag on NPM

For CI/CD purposes we use GitHub Actions. The workflow we use can be used as a blueprint to get the process as described above working.
