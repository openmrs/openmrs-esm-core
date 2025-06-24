[O3 Framework](../API.md) / navigate

# Function: navigate()

> **navigate**(`to`): `void`

Defined in: [packages/framework/esm-navigation/src/navigation/navigate.ts:49](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-navigation/src/navigation/navigate.ts#L49)

Calls `location.assign` for non-SPA paths and [navigateToUrl](https://single-spa.js.org/docs/api/#navigatetourl) for SPA paths

#### Example usage:
```js
@example
const config = useConfig();
const submitHandler = () => {
  navigate({ to: config.links.submitSuccess });
};
```

#### Example behavior::
```js
@example
navigate({ to: "/some/path" }); // => window.location.assign("/some/path")
navigate({ to: "https://single-spa.js.org/" }); // => window.location.assign("https://single-spa.js.org/")
navigate({ to: "${openmrsBase}/some/path" }); // => window.location.assign("/openmrs/some/path")
navigate({ to: "/openmrs/spa/foo/page" }); // => navigateToUrl("/openmrs/spa/foo/page")
navigate({ to: "${openmrsSpaBase}/bar/page" }); // => navigateToUrl("/openmrs/spa/bar/page")
navigate({ to: "/${openmrsSpaBase}/baz/page" }) // => navigateToUrl("/openmrs/spa/baz/page")
navigate({ to: "https://o3.openmrs.org/${openmrsSpaBase}/qux/page" }); // => navigateToUrl("/openmrs/spa/qux/page")
  if `window.location.origin` == "https://o3.openmrs.org", else will use window.location.assign
```

## Parameters

### to

[`NavigateOptions`](../interfaces/NavigateOptions.md)

The target path or URL. Supports templating with 'openmrsBase', 'openmrsSpaBase',
and any additional template parameters defined in `templateParams`.
For example, `${openmrsSpaBase}/home` will resolve to `/openmrs/spa/home`
for implementations using the standard OpenMRS and SPA base paths.
If `templateParams` contains `{ foo: "bar" }`, then the URL `${openmrsBase}/${foo}`
will become `/openmrs/bar`.

## Returns

`void`
