[O3 Framework](../API.md) / Order

# Interface: Order

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L19)

Superclass for all Openmrs Resources, with strict typings.
If the subclass does not have all attributes (including optional ones)
accounted for, use OpenmrsResource instead.

## Extends

- [`OpenmrsResource`](OpenmrsResource.md)

## Indexable

\[`anythingElse`: `string`\]: `any`

## Properties

### accessionNumber

> **accessionNumber**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:70](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L70)

***

### action

> **action**: [`OrderAction`](../type-aliases/OrderAction.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L21)

***

### asNeeded

> **asNeeded**: `boolean`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L22)

***

### asNeededCondition?

> `optional` **asNeededCondition**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L23)

***

### auditInfo?

> `optional` **auditInfo**: [`AuditInfo`](AuditInfo.md)

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L16)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`auditInfo`](OpenmrsResource.md#auditinfo)

***

### autoExpireDate

> **autoExpireDate**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L24)

***

### brandName?

> `optional` **brandName**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L25)

***

### careSetting

> **careSetting**: [`OpenmrsResource`](OpenmrsResource.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L26)

***

### clinicalHistory

> **clinicalHistory**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:77](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L77)

***

### commentToFulfiller

> **commentToFulfiller**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:27](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L27)

***

### concept

> **concept**: [`Concept`](Concept.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:28](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L28)

***

### dateActivated

> **dateActivated**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:29](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L29)

***

### dateStopped?

> `optional` **dateStopped**: `null` \| `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:30](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L30)

***

### dispenseAsWritten

> **dispenseAsWritten**: `boolean`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:31](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L31)

***

### display

> **display**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:72](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L72)

#### Overrides

[`OpenmrsResource`](OpenmrsResource.md).[`display`](OpenmrsResource.md#display)

***

### dose

> **dose**: `number`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:32](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L32)

***

### doseUnits

> **doseUnits**: [`OpenmrsResource`](OpenmrsResource.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:33](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L33)

***

### dosingInstructions

> **dosingInstructions**: `null` \| `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:34](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L34)

***

### dosingType?

> `optional` **dosingType**: `"org.openmrs.FreeTextDosingInstructions"` \| `"org.openmrs.SimpleDosingInstructions"`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:35](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L35)

***

### drug

> **drug**: [`Drug`](Drug.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:36](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L36)

***

### duration

> **duration**: `number`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:37](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L37)

***

### durationUnits

> **durationUnits**: [`OpenmrsResource`](OpenmrsResource.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:38](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L38)

***

### encounter

> **encounter**: [`OpenmrsResource`](OpenmrsResource.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:39](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L39)

***

### frequency

> **frequency**: [`OpenmrsResource`](OpenmrsResource.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:40](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L40)

***

### fulfillerComment

> **fulfillerComment**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:74](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L74)

***

### fulfillerStatus

> **fulfillerStatus**: [`FulfillerStatus`](../type-aliases/FulfillerStatus.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:73](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L73)

***

### instructions?

> `optional` **instructions**: `null` \| `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:41](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L41)

***

### laterality

> **laterality**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:76](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L76)

***

### links?

> `optional` **links**: [`Link`](Link.md)[]

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L15)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`links`](OpenmrsResource.md#links)

***

### numberOfRepeats

> **numberOfRepeats**: `number`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:78](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L78)

***

### numRefills

> **numRefills**: `number`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:42](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L42)

***

### orderer

> **orderer**: `object`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:55](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L55)

#### display

> **display**: `string`

#### person

> **person**: `object`

##### person.display

> **display**: `string`

#### uuid

> **uuid**: `string`

***

### orderNumber

> **orderNumber**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:43](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L43)

***

### orderReason

> **orderReason**: `null` \| [`Concept`](Concept.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:44](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L44)

***

### orderReasonNonCoded

> **orderReasonNonCoded**: `null` \| `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:45](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L45)

***

### orderType

> **orderType**: `object`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:46](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L46)

#### conceptClasses

> **conceptClasses**: `any`[]

#### description

> **description**: `string`

#### display

> **display**: `string`

#### name

> **name**: `string`

#### parent

> **parent**: `null` \| `string`

#### retired

> **retired**: `boolean`

#### uuid

> **uuid**: `string`

***

### patient

> **patient**: [`OpenmrsResource`](OpenmrsResource.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:62](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L62)

***

### previousOrder

> **previousOrder**: `null` \| \{ `display`: `string`; `type`: `string`; `uuid`: `string`; \}

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:63](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L63)

***

### quantity

> **quantity**: `number`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:64](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L64)

***

### quantityUnits

> **quantityUnits**: [`OpenmrsResource`](OpenmrsResource.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:65](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L65)

***

### resourceVersion?

> `optional` **resourceVersion**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L17)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`resourceVersion`](OpenmrsResource.md#resourceversion)

***

### route

> **route**: [`OpenmrsResource`](OpenmrsResource.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:66](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L66)

***

### scheduledDate

> **scheduledDate**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:71](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L71)

***

### specimenSource

> **specimenSource**: `null` \| [`Concept`](Concept.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:75](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L75)

***

### type

> **type**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:79](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L79)

***

### urgency

> **urgency**: [`OrderUrgency`](../type-aliases/OrderUrgency.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:67](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L67)

***

### uuid

> **uuid**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L20)

#### Overrides

[`OpenmrsResource`](OpenmrsResource.md).[`uuid`](OpenmrsResource.md#uuid)
