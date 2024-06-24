[@openmrs/esm-framework](../API.md) / OpenmrsDatePickerProps

# Interface: OpenmrsDatePickerProps

## Table of contents

### Properties

- [className](OpenmrsDatePickerProps.md#classname)
- [defaultValue](OpenmrsDatePickerProps.md#defaultvalue)
- [label](OpenmrsDatePickerProps.md#label)
- [light](OpenmrsDatePickerProps.md#light)
- [maxDate](OpenmrsDatePickerProps.md#maxdate)
- [minDate](OpenmrsDatePickerProps.md#mindate)
- [short](OpenmrsDatePickerProps.md#short)
- [size](OpenmrsDatePickerProps.md#size)
- [value](OpenmrsDatePickerProps.md#value)

### Methods

- [isDateUnavailable](OpenmrsDatePickerProps.md#isdateunavailable)
- [onChange](OpenmrsDatePickerProps.md#onchange)

## Properties

### className

• `Optional` **className**: `Argument`

Any CSS classes to add to the outer div of the date picker

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/index.tsx:52](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/index.tsx#L52)

___

### defaultValue

• `Optional` **defaultValue**: [`DateInputValue`](../API.md#dateinputvalue)

The default value (uncontrolled)

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/index.tsx:56](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/index.tsx#L56)

___

### label

• `Optional` **label**: `string`

The label for this DatePicker element

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/index.tsx:65](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/index.tsx#L65)

___

### light

• `Optional` **light**: `boolean`

'true' to use the light version.

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/index.tsx:69](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/index.tsx#L69)

___

### maxDate

• `Optional` **maxDate**: [`DateInputValue`](../API.md#dateinputvalue)

The latest date it is possible to select

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/index.tsx:73](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/index.tsx#L73)

___

### minDate

• `Optional` **minDate**: [`DateInputValue`](../API.md#dateinputvalue)

The earliest date it is possible to select

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/index.tsx:77](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/index.tsx#L77)

___

### short

• `Optional` **short**: `boolean`

'true' to use the short version.

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/index.tsx:89](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/index.tsx#L89)

___

### size

• `Optional` **size**: ``"sm"`` \| ``"md"`` \| ``"lg"``

Specifies the size of the input. Currently supports either `sm`, `md`, or `lg` as an option.

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/index.tsx:85](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/index.tsx#L85)

___

### value

• `Optional` **value**: [`DateInputValue`](../API.md#dateinputvalue)

The value (controlled)

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/index.tsx:93](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/index.tsx#L93)

## Methods

### isDateUnavailable

▸ `Optional` **isDateUnavailable**(`date`): `boolean`

A callback that can be used to implement arbitrary logic to mark certain dates as
unavailable to be selected.

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | `DateValue` |

#### Returns

`boolean`

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/index.tsx:61](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/index.tsx#L61)

___

### onChange

▸ `Optional` **onChange**(`date`): `void`

Handler that is called when the value changes

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | `DateValue` |

#### Returns

`void`

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/index.tsx:81](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/index.tsx#L81)
