[O3 Framework](../API.md) / Order

# Interface: Order

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L11)

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

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:62](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L62)

***

### action

> **action**: [`OrderAction`](../type-aliases/OrderAction.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L13)

***

### asNeeded

> **asNeeded**: `boolean`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L14)

***

### asNeededCondition?

> `optional` **asNeededCondition**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L15)

***

### auditInfo?

> `optional` **auditInfo**: [`AuditInfo`](AuditInfo.md)

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L16)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`auditInfo`](OpenmrsResource.md#auditinfo)

***

### autoExpireDate

> **autoExpireDate**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L16)

***

### brandName?

> `optional` **brandName**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L17)

***

### careSetting

> **careSetting**: [`OpenmrsResource`](OpenmrsResource.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L18)

***

### clinicalHistory

> **clinicalHistory**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:69](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L69)

***

### commentToFulfiller

> **commentToFulfiller**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L19)

***

### concept

> **concept**: [`Concept`](Concept.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L20)

***

### dateActivated

> **dateActivated**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L21)

***

### dateStopped?

> `optional` **dateStopped**: `null` \| `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L22)

***

### dispenseAsWritten

> **dispenseAsWritten**: `boolean`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L23)

***

### display

> **display**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:64](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L64)

#### Overrides

[`OpenmrsResource`](OpenmrsResource.md).[`display`](OpenmrsResource.md#display)

***

### dose

> **dose**: `number`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L24)

***

### doseUnits

> **doseUnits**: [`OpenmrsResource`](OpenmrsResource.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L25)

***

### dosingInstructions

> **dosingInstructions**: `null` \| `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L26)

***

### dosingType?

> `optional` **dosingType**: `"org.openmrs.FreeTextDosingInstructions"` \| `"org.openmrs.SimpleDosingInstructions"`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:27](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L27)

***

### drug

> **drug**: [`Drug`](Drug.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:28](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L28)

***

### duration

> **duration**: `number`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:29](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L29)

***

### durationUnits

> **durationUnits**: [`OpenmrsResource`](OpenmrsResource.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:30](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L30)

***

### encounter

> **encounter**: [`OpenmrsResource`](OpenmrsResource.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:31](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L31)

***

### frequency

> **frequency**: [`OpenmrsResource`](OpenmrsResource.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:32](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L32)

***

### fulfillerComment

> **fulfillerComment**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:66](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L66)

***

### fulfillerStatus

> **fulfillerStatus**: [`FulfillerStatus`](../type-aliases/FulfillerStatus.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:65](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L65)

***

### instructions?

> `optional` **instructions**: `null` \| `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:33](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L33)

***

### laterality

> **laterality**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:68](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L68)

***

### links?

> `optional` **links**: [`Link`](Link.md)[]

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L15)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`links`](OpenmrsResource.md#links)

***

### numberOfRepeats

> **numberOfRepeats**: `number`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:70](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L70)

***

### numRefills

> **numRefills**: `number`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:34](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L34)

***

### orderer

> **orderer**: `object`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:47](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L47)

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

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:35](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L35)

***

### orderReason

> **orderReason**: `null` \| [`Concept`](Concept.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:36](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L36)

***

### orderReasonNonCoded

> **orderReasonNonCoded**: `null` \| `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:37](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L37)

***

### orderType

> **orderType**: `object`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:38](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L38)

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

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:54](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L54)

***

### previousOrder

> **previousOrder**: `null` \| \{ `display`: `string`; `type`: `string`; `uuid`: `string`; \}

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:55](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L55)

***

### quantity

> **quantity**: `number`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:56](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L56)

***

### quantityUnits

> **quantityUnits**: [`OpenmrsResource`](OpenmrsResource.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:57](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L57)

***

### resourceVersion?

> `optional` **resourceVersion**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L17)

#### Inherited from

[`OpenmrsResource`](OpenmrsResource.md).[`resourceVersion`](OpenmrsResource.md#resourceversion)

***

### route

> **route**: [`OpenmrsResource`](OpenmrsResource.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:58](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L58)

***

### scheduledDate

> **scheduledDate**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:63](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L63)

***

### specimenSource

> **specimenSource**: `null` \| [`Concept`](Concept.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:67](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L67)

***

### type

> **type**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:71](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L71)

***

### urgency

> **urgency**: [`OrderUrgency`](../type-aliases/OrderUrgency.md)

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:59](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L59)

***

### uuid

> **uuid**: `string`

Defined in: [packages/framework/esm-emr-api/src/types/order-resource.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/order-resource.ts#L12)

#### Overrides

[`OpenmrsResource`](OpenmrsResource.md).[`uuid`](OpenmrsResource.md#uuid)
