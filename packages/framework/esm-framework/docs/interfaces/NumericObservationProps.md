[O3 Framework](../API.md) / NumericObservationProps

# Interface: NumericObservationProps

Defined in: [packages/framework/esm-styleguide/src/numeric-observation/numeric-observation.component.tsx:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/numeric-observation/numeric-observation.component.tsx#L15)

## Properties

### conceptUuid?

> `optional` **conceptUuid**: `string`

Defined in: [packages/framework/esm-styleguide/src/numeric-observation/numeric-observation.component.tsx:27](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/numeric-observation/numeric-observation.component.tsx#L27)

Concept UUID to fetch reference range from

***

### interpretation?

> `optional` **interpretation**: [`OBSERVATION_INTERPRETATION`](../type-aliases/OBSERVATION_INTERPRETATION.md) \| [`ObservationInterpretation`](../type-aliases/ObservationInterpretation.md)

Defined in: [packages/framework/esm-styleguide/src/numeric-observation/numeric-observation.component.tsx:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/numeric-observation/numeric-observation.component.tsx#L23)

Pre-calculated interpretation (either ObservationInterpretation or OBSERVATION_INTERPRETATION format)

***

### label?

> `optional` **label**: `string`

Defined in: [packages/framework/esm-styleguide/src/numeric-observation/numeric-observation.component.tsx:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/numeric-observation/numeric-observation.component.tsx#L21)

Label for the observation

***

### referenceRange?

> `optional` **referenceRange**: [`ObsReferenceRanges`](ObsReferenceRanges.md)

Defined in: [packages/framework/esm-styleguide/src/numeric-observation/numeric-observation.component.tsx:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/numeric-observation/numeric-observation.component.tsx#L25)

Reference range for calculating interpretation

***

### showLabel?

> `optional` **showLabel**: `boolean`

Defined in: [packages/framework/esm-styleguide/src/numeric-observation/numeric-observation.component.tsx:35](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/numeric-observation/numeric-observation.component.tsx#L35)

Whether to show the label

***

### unit?

> `optional` **unit**: `ReactNode`

Defined in: [packages/framework/esm-styleguide/src/numeric-observation/numeric-observation.component.tsx:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/numeric-observation/numeric-observation.component.tsx#L19)

Unit of measurement

***

### value

> **value**: `string` \| `number`

Defined in: [packages/framework/esm-styleguide/src/numeric-observation/numeric-observation.component.tsx:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/numeric-observation/numeric-observation.component.tsx#L17)

The observation value to display

***

### variant?

> `optional` **variant**: `"cell"` \| `"card"`

Defined in: [packages/framework/esm-styleguide/src/numeric-observation/numeric-observation.component.tsx:33](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/numeric-observation/numeric-observation.component.tsx#L33)

Display style variant
- 'card': Card-style container with colored borders and backgrounds, typically used in header/summary views (e.g., vitals header)
- 'cell': Table cell styling with background colors, typically used in data tables (e.g., test results table). If using the cell variant inside a Carbon Table Cell, make sure to set the padding to 0.
