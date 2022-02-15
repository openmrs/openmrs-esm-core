# Offline Mode

The OpenMRS 3.0 SPA solution uses [Workbox](https://developers.google.com/web/tools/workbox) to easily create an extensible service worker implementation to support offline capabilities.

There are three facets that are unique to this approach:

1. Each component (page / extension) can be marked as offline (or online) capable. By default every component is online capable, but not offline capable.
2. Each frontend module can declare certain (HTTP) calls to be cacheable.
3. Each frontend module can queue items to be processed when the application is back online.

## Registration

For instance, the following snippet shows a typical extension registration:

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

Now regarding the extension's online / offline capabilities this is equivalent to:

```js
function setupOpenMRS() {
  return {
    extensions: [
      {
        id: "foo",
        online: true,
        offline: false,
        load: getAsyncLifecycle(() => import("./foo.component")),
      },
    ],
  };
}
```

Which means that the component can be used online, but will not be available when offline. If we would want to provide offline support a simple `true` would be sufficient:

```js
function setupOpenMRS() {
  return {
    extensions: [
      {
        id: "foo",
        offline: true,
        load: getAsyncLifecycle(() => import("./foo.component")),
      },
    ],
  };
}
```

Alternatively, we might want to specify some services to be injected depending on the connectivity mode:

```js
function setupOpenMRS() {
  return {
    extensions: [
      {
        id: "foo",
        online: {
          onSave: OnlineSaveService,
        },
        offline: {
          onSave: OfflineSaveService,
        },
        load: getAsyncLifecycle(() => import("./foo.component")),
      },
    ],
  };
}
```

In this case the extension is available independent of the connectivity. In the offline case the `onSave` prop is defined to the value of a `OfflineSaveService` variable, while in the online case the same prop will be set to `OnlineSaveService`. This way the behavior of the actual component will be adjusted to the environment.

## Synchronization

When offline there are two aspects that might be handled with higher priority:

1. How to deal with items that would need to be sent to the backend right now (e.g., submitting a form)
2. How to deal with items that should have been send to the backend previously (e.g., previously submitted forms)

For (1) you can just place such items in a queue. Ideally, you'd just recognize the action either via a dedicated offline service or via the service worker (i.e., HTTP request). Either way the `queueSynchronizationItem` function from `@openmrs/esm-framework` (more specifically `@openmrs/esm-offline`) will help you to do that.

Example:

```js
queueSynchronizationItem('my-offline-data', {
  // content of item to queue
});
```

Once items are in this queue it makes sense to start thinking about (2). For this, you should register a queue processor via the `setupOfflineSync` function:

```js
function setupOpenMRS() {
  setupOfflineSync('my-offline-data', ['other-offline-data'], async item => {
    // process the item, e.g., send it to the backend
  });

  // ...
}
```

The previous snippet creates a synchronization processor for items of type `my-offline-data`. These items have a (potential) dependency to other items of type `other-offline-data`. Therefore, these items will be processed *before* the `my-offline-data` items.

## State Machine

Offline is in general a bit of a difficult topic. Most importantly, there are multiple states associated with it. Not only is the specific behavior dependent on the state of the network (online, offline), but also of the user (wants or does not want to be offline ready) and the application (already offline ready or still trying to be offline ready or updating the files required to go offline).

The following state diagram shows the different entry points and their possible transitions.

![Map of OpenMRS offline capability and state transitions](./openmrs-offline-state.png)

Importantly, the user has 5 possible entry points to the application:

- Fresh state (did not opt-in)
- Downloading assets state (did opt-in, but never finished)
- Ready state (did opt-in, no changes since last use), followed by a data sync
- Outdated state (did opt-in, changes to assets since last use)
- Offline state (did opt-in, no Internet connectivity)
