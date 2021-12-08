# How the Extension System Works

For the extension system to work four things exist:

1. A generic component model with a defined lifecycle and loading mechanism
2. A way to define where extensions should be placed (so called "slot")
3. A way to define an extension coupling it to (1)
4. A configuration for assigning available extensions from (3) to slots (2)

Let's look at these four things.

## Behind the Scenes

For (1) the parcel mechanism of single-spa is used.

For (2) you can use the `registerExtensionSlot` function together with `renderExtension`. For frameworks such as React helper components may exist (e.g., `ExtensionSlot`).

For (3) you can define an extension in the return value from the `setupOpenMRS` function. An example for this:

```js
function setupOpenMRS() {
  return {
    extensions: [
      {
        id: "foo",
        load: getAsyncLifecycle(() => import("./foo.component")),
      },
    ],
  };
}
```

As a shorthand for (4) you could already specify a target slot via the `slot` property in the previous code snippet. Without that convenience way you'd still be able to register it programmatically using `attach`:

```js
// attaches an extension "foo" to a slot "foo-slot"
attach('foo-slot', 'foo');
```

Generally, though this is either done at initialization time as a default, or explicitly via a user-provided configuration. The only exception can be found with "dynamic" (or "special") slots. One example in this area is the workspace of the patient chart frontend module.

## Extensions and Slots

 An extension can be in any of the following four states with respect to an extension slot:
 - _attached_ (set via code using `attach` and `detach`)
 - _configured_ (set via configuration using: `add` and `remove`)
 - _assigned_ (computed from attached and configured)
 - _connected_ (computed from assigned using connectivity and online / offline)

## Rendering

Extensions are rendered by following their exported lifecycle functions. The `getAsyncLifecycle` function from `@openmrs/esm-react-utils` is a convenience layer that already exports these lifecycle functions wired together with `single-spa-react`.

In a nutshell:

1. When the component should be rendered the `load` function is evaluated - in case of a `Promise` (via the asynchronously loaded `import` function) this first waits for the component to be available
2. The component is placed into its lifecycle functions provided by `single-spa-react`
3. The lifecycle functions `bootstrap`. `mount`. `unmount`, and `update` are exported

These lifecycle functions are not magic - theoretically you could write them on your own, however, since the single-spa ecosystem already provides convenience wrappers such as `single-spa-react` for many frameworks we don't recommend it.

To actually render also two more things need to be considered:

1. Does the extension render in offline or online mode, and which mode is the browser in?
2. What properties should be passed to the component which is rendered?

The answer to (1) is found in `navigator.onLine`. Only if `offline` was set to `true` or some object the component renders in offline mode. Likewise, if `online: false` was supplied the component will not render in online mode.

The answer to (2) are the `meta` properties along with the extension's context (e.g., what slot it is rendered to) and its injected services. The injected services are defined via `online` or `offline`. In case of `true` no services are injected. In case of an object the provided key-value pairs are interpreted as services, which should be injected depending on the connectivity case.
