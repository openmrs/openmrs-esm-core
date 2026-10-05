[O3 Framework](../API.md) / DiagnosisTagsProps

# Interface: DiagnosisTagsProps

Defined in: [packages/framework/esm-styleguide/src/diagnosis-tags/diagnosis-tags.component.tsx:11](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/diagnosis-tags/diagnosis-tags.component.tsx#L11)

## Properties

### diagnoses

> **diagnoses**: `Pick`\<[`Diagnosis`](Diagnosis.md), `"uuid"` \| `"display"` \| `"certainty"` \| `"rank"`\>[]

Defined in: [packages/framework/esm-styleguide/src/diagnosis-tags/diagnosis-tags.component.tsx:12](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/diagnosis-tags/diagnosis-tags.component.tsx#L12)

***

### showCertainty?

> `optional` **showCertainty**: `boolean`

Defined in: [packages/framework/esm-styleguide/src/diagnosis-tags/diagnosis-tags.component.tsx:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/diagnosis-tags/diagnosis-tags.component.tsx#L18)

Mark provisional diagnoses with a leading "?". Confirmed diagnoses, and any with missing or
unknown certainty, show just the name. Off by default because diagnoses saved before
certainty was captured are stored as provisional.
