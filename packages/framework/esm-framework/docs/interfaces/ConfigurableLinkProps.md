[O3 Framework](../API.md) / ConfigurableLinkProps

# Interface: ConfigurableLinkProps

Defined in: [packages/framework/esm-react-utils/src/ConfigurableLink.tsx:37](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/ConfigurableLink.tsx#L37)

## Extends

- `AnchorHTMLAttributes`\<`HTMLAnchorElement`\>

## Properties

### onBeforeNavigate()?

> `optional` **onBeforeNavigate**: (`event`) => `void`

Defined in: [packages/framework/esm-react-utils/src/ConfigurableLink.tsx:43](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/ConfigurableLink.tsx#L43)

A callback to be called just before navigation occurs

#### Parameters

##### event

`MouseEvent`

#### Returns

`void`

***

### templateParams?

> `optional` **templateParams**: `TemplateParams`

Defined in: [packages/framework/esm-react-utils/src/ConfigurableLink.tsx:41](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/ConfigurableLink.tsx#L41)

A dictionary of values to interpolate into the URL, in addition to the default keys `openmrsBase` and `openmrsSpaBase`.

***

### to

> **to**: `string`

Defined in: [packages/framework/esm-react-utils/src/ConfigurableLink.tsx:39](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/ConfigurableLink.tsx#L39)

The target path or URL. Supports interpolation. See [[navigate]]
