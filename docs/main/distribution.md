# Creating a Distribution

One of the reasons for choosing this kind of modularization in the frontend space is to allow maximum flexibility for creating your own distribution. That way, you can use what you find useful and drop what you don't like to see in your distribution.

This concept is transported to almost all areas including, but not limited to, the available frontend modules, the delivered app shell, and the method of serving the application.

In this section we look at some considerations when creating a distribution. Specifically, we investigate what options we provide and how you can leverage these for your use case.

## Local Build vs CI Setup

You may be tempted to clone the `openmrs-esm-core` repository for building your distribution. **Don't** do this unless you know exactly *why* you want to work against the repository. The repository is only there for *development* of the OpenMRS Frontend. It is **not** there for building distributions.

To build your own distribution a simple Node.js tool called `openmrs` was created. This allows:

- creating an import map with all resources for the contained frontend modules (`openmrs assemble`)
- build a new app shell to host frontend modules (`openmrs build`)
- start a debugging session of the shell and a frontend module (`openmrs debug`)
- start a debugging session of a frontend module in the shell (`openmrs develop`)
- starts the default app shell locally (`openmrs start`)

For creating a distribution we recommend doing two things:

1. Build the app shell (`openmrs build`) with the configuration you want to see.
2. Use `openmrs assemble` to get a custom configuration for your import map.

The import map is used to define what frontend modules are included and where these frontend modules are located.

## Customizing the Import Map

By building the app shell you'll already get a rudimentary version of an import map, which can be used for development purposes. Generally, however, you should provide your own.

An import map can also be specified as an URL. For instance, for the development instance as `dev3.openmrs.org` we have [https://spa-modules.nyc3.digitaloceanspaces.com/import-map.json](https://spa-modules.nyc3.digitaloceanspaces.com/import-map.json). The contents of this import map are updated once an update to any (official) frontend module has been pushed. Thus, while this import map may be great for development purposes, it should be considered unstable. Avoid this for your distribution or any application that should not break unexpectedly.

A custom import map can be created using the `openmrs assemble` command. If run directly the command will open a command line survey, guiding you through the different options. It will list all OpenMRS frontend modules that can be found on the NPM registry.

For CI/CD purposes we encourage you to use a configuration file `spa-build-config.json` instead. This file then defines the wanted frontend modules and configures the whole process.

The file may looks as follows:

```json
{
  "publicUrl": ".",
  "frontendModules": {
    "@openmrs/esm-patient-chart-app": "latest",
    "@openmrs/esm-patient-registration-app": "3.0.0"
  }
}
```

The `publicUrl` may be important for later. If the gathered resources are placed (and served) in the same folder as the SPA resources then `.` is good. If they are uploaded to say a CDN, then the (base) URL of the CDN should be defined.

Example:

```json
{
  "publicUrl": "https://openmrs-cdn-example.com/mf",
  "frontendModules": {
    "@openmrs/esm-patient-chart-app": "latest",
    "@openmrs/esm-patient-registration-app": "3.0.0"
  }
}
```

In this case the resulting `import-map.json` could look as follows:

```json
{
  "imports": {
    "@openmrs/esm-patient-chart-app": "https://openmrs-cdn-example.com/mf/openmrs-esm-patient-chart-app-3.2.1/openmrs-esm-patient-chart-app.js",
    "@openmrs/esm-patient-registration-app": "https://openmrs-cdn-example.com/mf/openmrs-esm-patient-registration-app-3.0.0/openmrs-esm-patient-registration-app.js"
  }
}
```

Either way the assemble command makes sure to have all assets made available properly.

## Canary vs Stable

Regarding the versioning you'll have three options:

- Go for the `latest` tag
- Go for the `next` tag
- Go for a specific (i.e., explicit) version

In general we recommend to stay on non-preview (e.g., `3.2.1`) versions. Preview versions (e.g., `3.2.1-pre.0`) are for development purposes and may not be stable.

For creating a working distribution ideally you'll stick to explicit versioning of non-preview versions. If you use `latest` then individual frontend modules may work as expected, but incompatibilities (e.g., if a certain frontend module was updated but is now incompatible to another frontend module that you also use) may then exist - making additional testing required. With an explicit version you can be sure that a working system remains as such in rebuild scenarios.
