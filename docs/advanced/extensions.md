# Advanced Extensions and Slots

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

Generally, though this is either done at initialization time as a default, or explicitly via a user-provided configuration. The only exception can be found with "dynamic" (or "special") slots. One example in this area is the workspace of the patient chart microfrontend.

## Rendering

(tbd)
