# Breadcrumbs

Like many systems, OpenMRS uses navigation breadcrumbs to help the user keep track of their place in the UI. Frontend modules can register these breadcrumbs using the `registerBreadCrumbs` function exported by `@openmrs/esm-framework`. For instance, the following snippet registers a simple breadcrumb for a page:

```ts
import { registerBreadcrumb } from "@openmrs/esm-framework";

function setupOpenmrs() {
  registerBreadcrumb({
    path: `${window.spaBase}/myPage`,
    title: "My Great Page"
  });

  return {
    // usual return object
  }
}
```

The breadcrumb will be displayed to the user as "My Great Page".

Breadcrumbs are usually part of a hierarchy of pages, e.g., where one page is a sub-page of another. For this case, you can use the `parent` property to tell the framework what should be the parent breadcrumb for this breadcrumb. For instance, here's a relatively simple breadcrumb setup for a page with some subpages:

```ts
import { registerBreadcrumbs } from "@openmrs/esm-framework";

function setupOpenmrs() {
  registerBreadcrumbs([
    {
      path: `${window.spaBase}/myPage`,
      title: "My Great Page"
    },
    {
      path: `${window.spaBase}/myPage/subpage1`,
      title: "Subpage 1",
      parent: `${window.spaBase}/myPage`
    },
    {
      path: `${window.spaBase}/myPage/subpage2`,
      title: "Subpage 2",
      parent: `${window.spaBase}/myPage`
    }
  ]);

  return {
    // usual return object
  }
}
```
