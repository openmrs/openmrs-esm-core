[@openmrs/esm-framework](../API.md) / Diagnosis

# Interface: Diagnosis

## Hierarchy

- `OpenmrsResource`

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
- [voided](Diagnosis.md#voided)

## Properties

### auditInfo

• `Optional` **auditInfo**: `AuditInfo`

#### Inherited from

OpenmrsResource.auditInfo

#### Defined in

packages/framework/esm-api/dist/types/openmrs-resource.d.ts:14

___

### certainty

• `Optional` **certainty**: `string`

#### Defined in

[packages/framework/esm-emr-api/src/types/diagnosis-resource.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/diagnosis-resource.ts#L19)

___

### diagnosis

• `Optional` **diagnosis**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `coded?` | { `conceptClass?`: `ConceptClass` ; `datatype?`: `OpenmrsResource` ; `display?`: `string` ; `name?`: `Concept` ; `uuid`: `string`  } |
| `coded.conceptClass?` | `ConceptClass` |
| `coded.datatype?` | `OpenmrsResource` |
| `coded.display?` | `string` |
| `coded.name?` | `Concept` |
| `coded.uuid` | `string` |
| `nonCoded?` | `string` |

#### Defined in

[packages/framework/esm-emr-api/src/types/diagnosis-resource.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/diagnosis-resource.ts#L7)

___

### display

• `Optional` **display**: `string`

#### Inherited from

OpenmrsResource.display

#### Defined in

packages/framework/esm-api/dist/types/openmrs-resource.d.ts:12

___

### encounter

• `Optional` **encounter**: [`Encounter`](Encounter.md)

#### Defined in

[packages/framework/esm-emr-api/src/types/diagnosis-resource.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/diagnosis-resource.ts#L18)

___

### formFieldNamespace

• `Optional` **formFieldNamespace**: `string`

#### Defined in

[packages/framework/esm-emr-api/src/types/diagnosis-resource.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/diagnosis-resource.ts#L21)

___

### formFieldPath

• `Optional` **formFieldPath**: `string`

#### Defined in

[packages/framework/esm-emr-api/src/types/diagnosis-resource.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/diagnosis-resource.ts#L22)

___

### links

• `Optional` **links**: `Link`[]

#### Inherited from

OpenmrsResource.links

#### Defined in

packages/framework/esm-api/dist/types/openmrs-resource.d.ts:13

___

### patient

• `Optional` **patient**: [`Patient`](Patient.md)

#### Defined in

[packages/framework/esm-emr-api/src/types/diagnosis-resource.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/diagnosis-resource.ts#L17)

___

### rank

• `Optional` **rank**: `number`

#### Defined in

[packages/framework/esm-emr-api/src/types/diagnosis-resource.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/diagnosis-resource.ts#L20)

___

### resourceVersion

• `Optional` **resourceVersion**: `string`

#### Inherited from

OpenmrsResource.resourceVersion

#### Defined in

packages/framework/esm-api/dist/types/openmrs-resource.d.ts:15

___

### uuid

• **uuid**: `string`

#### Inherited from

OpenmrsResource.uuid

#### Defined in

packages/framework/esm-api/dist/types/openmrs-resource.d.ts:11

___

### voided

• `Optional` **voided**: `boolean`

#### Defined in

[packages/framework/esm-emr-api/src/types/diagnosis-resource.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/types/diagnosis-resource.ts#L23)
