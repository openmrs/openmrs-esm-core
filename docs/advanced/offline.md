# Offline Mode

The OpenMRS 3.0 SPA solution uses [Workbox](https://developers.google.com/web/tools/workbox) to easily create an extensible service worker implementation to support offline capabilities.

There are three facettes that are unique to this approach:

1. Each component (page / extension) can be marked as offline (or online) capable. By default every component is online capable, but not offline capable.
2. Each microfrontend can declare certain (HTTP) calls to be cachable.
3. Each microfrontend can queue items to be processed when the application is back online.

(tbd)
