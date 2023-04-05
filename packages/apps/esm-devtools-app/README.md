# openmrs-esm-devtools

openmrs-esm-devtools is an in-browser javascript module that provides a UI for 
developers writing frontend code.

![esm-devtools](https://user-images.githubusercontent.com/1031876/81030238-f5b9d500-8e3c-11ea-81b8-6c2a4938faf2.gif)

## Purpose

The devtools allow you to override any javascript module to point to any url. 
This is useful for developing features and for debugging problems, because you 
can tell the browser to load one module from your localhost while keeping all 
other modules using the default version in the import map.

Usage is documented both below and in the
[Import Map Overrides](http://o3-dev.docs.openmrs.org/#/getting_started/setup?id=import-map-overrides)
section of the developer documentation.

## Installation / Usage

The devtools are registered as a
[single-spa application](https://single-spa.js.org/docs/building-applications/)

that creates a gray or red rectangular button near the bottom right of the 
screen. The rectangular button will only show up if you run the following 
command in the browser console:

```js
localStorage.setItem('openmrs:devtools', true)
```

Now refresh the page and you'll see the rectangle. Note that when the rectangle is 
red that it means that you have an active override.

## Implementation notes

openmrs-esm-devtools is using
[import-map-overrides](https://github.com/joeldenning/import-map-overrides) 
to accomplish this behavior. 
If you prefer using the browser console instead of a UI to manage module 
overrides, check out the documentation in that github project.
