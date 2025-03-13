[@openmrs/esm-framework](../API.md) / Diagnosis

# Interface: Diagnosis

## Hierarchy

- [`OpenmrsResourceStrict`](OpenmrsResourceStrict.md)

  ↳ **`Diagnosis`**

## Table of contents

### Properties

- [auditInfo](Diagnosis.md#auditinfo)
- [certainty](Diagnosis.md#certainty)
- [diagnosis](Diagnosis.md#diagnosis)
- [display](Diagnosis.md#display)
- [encounter](Diagnosis.md#encounter)
- [formFieldNamespace](Diagnosis.md#formfieldnamespace)
- [formFieldPath](Diagnosis.md#formfieldpath)
- [links](Diagnosis.md#links)
- [patient](Diagnosis.md#patient)
- [rank](Diagnosis.md#rank)
- [resourceVersion](Diagnosis.md#resourceversion)
- [uuid](Diagnosis.md#uuid)

## Properties

### auditInfo

• `Optional` **auditInfo**: [`AuditInfo`](AuditInfo.md)

#### Inherited from

[OpenmrsResourceStrict](OpenmrsResourceStrict.md).[auditInfo](OpenmrsResourceStrict.md#auditinfo)

#### Defined in

[packages/framework/esm-api/src/types/openmrs-resource.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L16)

___

### certainty

• `Optional` **certainty**: `string`

#### Defined in

[packages/framework/esm-api/src/types/diagnosis-resource.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/diagnosis-resource.ts#L19)

___

### diagnosis

• `Optional` **diagnosis**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `coded?` | { `conceptClass`: [`ConceptClass`](ConceptClass.md) ; `datatype`: [`OpenmrsResource`](OpenmrsResource.md) ; `display?`: `string` ; `name`: [`Concept`](Concept.md) ; `uuid`: `string`  } |
| `coded.conceptClass` | [`ConceptClass`](ConceptClass.md) |
| `coded.datatype` | [`OpenmrsResource`](OpenmrsResource.md) |
| `coded.display?` | `string` |
| `coded.name` | [`Concept`](Concept.md) |
| `coded.uuid` | `string` |
| `nonCoded?` | `string` |

#### Defined in

[packages/framework/esm-api/src/types/diagnosis-resource.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/diagnosis-resource.ts#L7)

___

### display

• `Optional` **display**: `string`

#### Inherited from

[OpenmrsResourceStrict](OpenmrsResourceStrict.md).[display](OpenmrsResourceStrict.md#display)

#### Defined in

[packages/framework/esm-api/src/types/openmrs-resource.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L14)

___

### encounter

• `Optional` **encounter**: [`Encounter`](Encounter.md)

#### Defined in

[packages/framework/esm-api/src/types/diagnosis-resource.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/diagnosis-resource.ts#L18)

___

### formFieldNamespace

• `Optional` **formFieldNamespace**: `string`

#### Defined in

[packages/framework/esm-api/src/types/diagnosis-resource.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/diagnosis-resource.ts#L21)

___

### formFieldPath

• `Optional` **formFieldPath**: `string`

#### Defined in

[packages/framework/esm-api/src/types/diagnosis-resource.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/diagnosis-resource.ts#L22)

___

### links

• `Optional` **links**: [`Link`](Link.md)[]

#### Inherited from

[OpenmrsResourceStrict](OpenmrsResourceStrict.md).[links](OpenmrsResourceStrict.md#links)

#### Defined in

[packages/framework/esm-api/src/types/openmrs-resource.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L15)

___

### patient

• `Optional` **patient**: [`Patient`](Patient.md)

#### Defined in

[packages/framework/esm-api/src/types/diagnosis-resource.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/diagnosis-resource.ts#L17)

___

### rank

• `Optional` **rank**: `number`

#### Defined in

[packages/framework/esm-api/src/types/diagnosis-resource.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/diagnosis-resource.ts#L20)

___

### resourceVersion

• `Optional` **resourceVersion**: `string`

#### Inherited from

[OpenmrsResourceStrict](OpenmrsResourceStrict.md).[resourceVersion](OpenmrsResourceStrict.md#resourceversion)

#### Defined in

[packages/framework/esm-api/src/types/openmrs-resource.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L17)

___

### uuid

• **uuid**: `string`

#### Inherited from

[OpenmrsResourceStrict](OpenmrsResourceStrict.md).[uuid](OpenmrsResourceStrict.md#uuid)

#### Defined in

[packages/framework/esm-api/src/types/openmrs-resource.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/types/openmrs-resource.ts#L13)
