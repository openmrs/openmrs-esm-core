# Creating a Frontend Module

New frontend modules can be created from the
[openmrs-esm-template-app](https://github.com/openmrs/openmrs-esm-template-app).
You can fork that repository, or clone-and-copy it. Follow the instructions
in the README to turn it into your own frontend module.

## The `index.ts` file

All frontend modules have an `index.ts` as an
[entry point](https://webpack.js.org/concepts/entry-points/).
See the [example](https://github.com/openmrs/openmrs-esm-template-app/blob/master/src/index.ts)
in openmrs-esm-template-app.

This file is loaded by the app shell and must have a specific structure.
It must have three exports:
`setupOpenMRS`, `backendDependencies`, and `importTranslation`.

### The `setupOpenMRS` function

This function is called when the application is first starting up. The
app shell loads the `index.ts` files for all the ESMs and then executes
the `setupOpenMRS` function for each of them. The `setupOpenMRS` function
should only do the following four things:

- define the [configuration schema](config.md)
- register [breadcrumbs](breadcrumbs.md)
- set up [offline support](offline.md)
- return an object specifying the frontend module's pages and extensions

#### The `setupOpenMRS` return object

This is an object with two top-level keys, both optional: `pages` and `extensions`.
Here is an example which uses all of the possible keys.

```typescript
  const options =
    featureName: 'Hello World',
    moduleName: '@openmrs/esm-hello-world',
  };

  return {
    pages: [
      {
        // load (required): tells the app shell how to load the
        //   frontend module content
        load: getAsyncLifecycle(() => import('./hello'), options),
        // route (required): a string, RegEx, function, or array of any of the
        //   above, which will be used to determine when to load the
        //   frontend module content. It will be matched against the URL path.
        route: 'hello',
        // order (optional): a number which specifies the order in which the
        // page should be loaded in the application. The default is 1. This
        // is generally only needed if you need to specify the DOM position
        // of your page; for example, if it is a navbar and needs to be at the
        // top, you might use order 0.
        order: 2,
        // `online`, `offline`, and `resources` are described in the offline
        //   support documentation. All are optional.
        online: { allowSayingHelloBack: true },
        offline: { allowSayingHelloBack: false },
        resources: { greeting: fetchGreetingOffline }
      },
    ],
    // To understand the `extensions` section, please see the extensions
    // documentation and the offline documentation.
    extensions: [
      {
        id: 'greeting-bot',
        slot: 'bot-slot',
        load: getAsyncLifecycle(() => import('./greeting-bot'), options),
        online: true,
        offline: true,
      },
    ]
  };
```

#### Creating a page

Creating a page is a simple matter of creating the page as an application
in your framework of choice and then adding a loader to the `pages` array.
For example, you can create a React application as the default export
of a file `goodbye.tsx`. See
[`hello.tsx`](https://github.com/openmrs/openmrs-esm-template-app/blob/master/src/hello.tsx)
for reference. You could then add this as a page to the application:

```typescript
    pages: [
      {
        load: getAsyncLifecycle(() => import('./hello'), options),
        route: 'hello',
      },
      {
        load: getAsyncLifecycle(() => import('./goodbye'), options),
        route: 'goodbye'
      }
    ],
```

### The `backendDependencies` object

This is an object that tells the frontend application what OpenMRS server modules
the frontend module depends on, and what versions. If these dependencies are not
met, administrators will be alerted.

### The `importTranslation` function

This is required for translations to work. It tells the frontend application
how to load translation strings. The boilerplate which you will find in
[openmrs-esm-template-app](https://github.com/openmrs/openmrs-esm-template-app/blob/master/src/index.ts)
is almost certainly what you want. Note that the first argument to
`require.context` is a directory, `../translations`.
That directory must exist at that location relative to the `index.ts` file.

## Integrating into your application

Once you've created a frontend module, you'll want to integrate it into your
application. There are two steps for doing so.

First, publish your frontend module package to NPM. See
[Release and Deployment](../getting_started/release_and_deployment.md)
for more information. At the end, your package should be visible on npm.js,
like [`@openmrs/esm-login-app`](https://www.npmjs.com/package/@openmrs/esm-login-app).

Then, you'll need to integrate this package into your application.
Information about that can be found in the Implementer Documentation on
[Deployment](https://wiki.openmrs.org/display/projects/3.x+Implementer+Documentation).
