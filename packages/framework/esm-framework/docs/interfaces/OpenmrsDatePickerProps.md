[@openmrs/esm-framework](../API.md) / OpenmrsDatePickerProps

# Interface: OpenmrsDatePickerProps

## Table of contents

### Properties

- [carbonOptions](OpenmrsDatePickerProps.md#carbonoptions)
- [dateFormat](OpenmrsDatePickerProps.md#dateformat)
- [defaultValue](OpenmrsDatePickerProps.md#defaultvalue)
- [disabled](OpenmrsDatePickerProps.md#disabled)
- [id](OpenmrsDatePickerProps.md#id)
- [invalid](OpenmrsDatePickerProps.md#invalid)
- [invalidText](OpenmrsDatePickerProps.md#invalidtext)
- [labelText](OpenmrsDatePickerProps.md#labeltext)
- [maxDate](OpenmrsDatePickerProps.md#maxdate)
- [minDate](OpenmrsDatePickerProps.md#mindate)
- [readonly](OpenmrsDatePickerProps.md#readonly)
- [value](OpenmrsDatePickerProps.md#value)

### Methods

- [onChange](OpenmrsDatePickerProps.md#onchange)

## Properties

### carbonOptions

• `Optional` **carbonOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `className?` | `string` |
| `datePickerType?` | ``"simple"`` \| ``"single"`` |
| `light?` | `boolean` |
| `onClose?` | `Function` |
| `onOpen?` | `Function` |
| `pickerInputStyle?` | `CSSProperties` |
| `pickerShellStyle?` | `CSSProperties` |
| `placeholder?` | `string` |
| `warn?` | `boolean` |
| `warnText?` | `string` |

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx:27](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx#L27)

___

### dateFormat

• `Optional` **dateFormat**: `string`

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx#L23)

___

### defaultValue

• `Optional` **defaultValue**: `string` \| `Date`

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx#L19)

___

### disabled

• `Optional` **disabled**: `boolean`

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx:26](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx#L26)

___

### id

• **id**: `string`

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx#L14)

___

### invalid

• `Optional` **invalid**: `boolean`

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx#L24)

___

### invalidText

• `Optional` **invalidText**: `string`

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx#L25)

___

### labelText

• **labelText**: `string` \| `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\>

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx#L15)

___

### maxDate

• `Optional` **maxDate**: `string` \| `Date`

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx#L21)

___

### minDate

• `Optional` **minDate**: `string` \| `Date`

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx#L20)

___

### readonly

• `Optional` **readonly**: `boolean`

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx#L22)

___

### value

• `Optional` **value**: `string` \| `Date`

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx#L17)

## Methods

### onChange

▸ **onChange**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `Date` |

#### Returns

`void`

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/openmrs/openmrs-date-picker.component.tsx#L16)
