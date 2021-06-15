# Creating a microfrontend

New microfrontends can be created from the
[openmrs-esm-template-app](https://github.com/openmrs/openmrs-esm-template-app).
You can fork that repository, or clone-and-copy it. Follow the instructions
in the README to turn it into your own microfrontend.

## Integrating into your application

Once you've created a microfrontend, you'll want to integrate it into your
application. There are two steps for doing so.

First, publish your microfrontend package to NPM. See
[Release and Deployment](../getting_started/release_and_deployment)
for more information. At the end, your package should be visible on npm.js,
like [`@openmrs/esm-login-app`](https://www.npmjs.com/package/@openmrs/esm-login-app).

Then, you'll need to integrate this package into your application.
Information about that can be found in the Implementer Documentation on
[Deployment](https://wiki.openmrs.org/display/projects/Frontend+Implementer+Documentation).
