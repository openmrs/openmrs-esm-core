# Developer Guide to Developing an MF and Creating a Distribution

You can find the reference application ("refapp") that is used for testing the latest bits and pieces at https://openmrs-spa.org/openmrs/spa.

## Table of Contents

<!-- toc -->

- [How do I create a distribution?](#how-do-i-create-a-distribution)

<!-- tocstop -->

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
