[O3 Framework](../API.md) / VisitReturnType

# Interface: VisitReturnType

Defined in: [packages/framework/esm-react-utils/src/useVisit.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useVisit.ts#L12)

## Properties

### activeVisit

> **activeVisit**: `null` \| [`Visit`](Visit.md)

Defined in: [packages/framework/esm-react-utils/src/useVisit.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useVisit.ts#L16)

***

### ~~currentVisit~~

> **currentVisit**: `null` \| [`Visit`](Visit.md)

Defined in: [packages/framework/esm-react-utils/src/useVisit.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useVisit.ts#L22)

#### Deprecated

"current visit" is not well defined outside of the patient chart.
Use `visitContext` in the patient chart instead.

***

### ~~currentVisitIsRetrospective~~

> **currentVisitIsRetrospective**: `boolean`

Defined in: [packages/framework/esm-react-utils/src/useVisit.ts:28](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useVisit.ts#L28)

#### Deprecated

"current visit" is not well defined outside of the patient chart.
Use `visitContext` in the patient chart instead.

***

### error

> **error**: `Error`

Defined in: [packages/framework/esm-react-utils/src/useVisit.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useVisit.ts#L13)

***

### isLoading

> **isLoading**: `boolean`

Defined in: [packages/framework/esm-react-utils/src/useVisit.ts:29](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useVisit.ts#L29)

***

### isValidating

> **isValidating**: `boolean`

Defined in: [packages/framework/esm-react-utils/src/useVisit.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useVisit.ts#L15)

***

### mutate()

> **mutate**: () => `void`

Defined in: [packages/framework/esm-react-utils/src/useVisit.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useVisit.ts#L14)

#### Returns

`void`
