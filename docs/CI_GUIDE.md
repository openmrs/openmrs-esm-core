# Guide for Deploying Microfrontends Continuously

Right now there are two major deployment mechanisms:

- Deploy the current version from the `master` branch in the reference app (https://openmrs-spa.org)
- Publish the NPM package(s) to be used in distributions

For the NPM package(s) we have two different tracks:

- Once `master` changed we publish a preview version using the `next` tag on NPM
- Once we create a release on GitHub we publish a package using the `latest` tag on NPM

For CI/CD purposes we use GitHub Actions. The workflow we use can be used as a blueprint to get the process as described above working.
