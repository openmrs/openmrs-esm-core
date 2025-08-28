[O3 Framework](../API.md) / PersonAttribute

# Interface: PersonAttribute

Defined in: [packages/framework/esm-api/src/types/person-resource.ts:4](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L4)

Superclass for all Openmrs Resources, with strict typings.
If the subclass does not have all attributes (including optional ones)
accounted for, use OpenmrsResource instead.

## Extends

- [`OpenmrsResourceStrict`](OpenmrsResourceStrict.md)

## Properties

### attributeType?

> `optional` **attributeType**: [`OpenmrsResource`](OpenmrsResource.md)

Defined in: [packages/framework/esm-api/src/types/person-resource.ts:5](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L5)

***

### auditInfo?

> `optional` **auditInfo**: [`AuditInfo`](AuditInfo.md)

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L16)

#### Inherited from

[`OpenmrsResourceStrict`](OpenmrsResourceStrict.md).[`auditInfo`](OpenmrsResourceStrict.md#auditinfo)

***

### display?

> `optional` **display**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L14)

#### Inherited from

[`OpenmrsResourceStrict`](OpenmrsResourceStrict.md).[`display`](OpenmrsResourceStrict.md#display)

***

### links?

> `optional` **links**: [`Link`](Link.md)[]

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L15)

#### Inherited from

[`OpenmrsResourceStrict`](OpenmrsResourceStrict.md).[`links`](OpenmrsResourceStrict.md#links)

***

### resourceVersion?

> `optional` **resourceVersion**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L17)

#### Inherited from

[`OpenmrsResourceStrict`](OpenmrsResourceStrict.md).[`resourceVersion`](OpenmrsResourceStrict.md#resourceversion)

***

### uuid

> **uuid**: `string`

Defined in: [packages/framework/esm-api/src/types/openmrs-resource.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L13)

#### Inherited from

[`OpenmrsResourceStrict`](OpenmrsResourceStrict.md).[`uuid`](OpenmrsResourceStrict.md#uuid)

***

### value?

> `optional` **value**: `string`

Defined in: [packages/framework/esm-api/src/types/person-resource.ts:6](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L6)

***

### voided?

> `optional` **voided**: `boolean`

Defined in: [packages/framework/esm-api/src/types/person-resource.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/person-resource.ts#L7)
