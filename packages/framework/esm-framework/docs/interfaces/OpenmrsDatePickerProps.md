[@openmrs/esm-framework](../API.md) / OpenmrsDatePickerProps

# Interface: OpenmrsDatePickerProps

Properties for the OpenmrsDatePicker

## Hierarchy

- `Omit`<`DatePickerProps`<`CalendarDate`\>, ``"className"`` \| ``"onChange"`` \| ``"defaultValue"`` \| ``"value"``\>

  ↳ **`OpenmrsDatePickerProps`**

## Table of contents

### Properties

- [aria-describedby](OpenmrsDatePickerProps.md#aria-describedby)
- [aria-details](OpenmrsDatePickerProps.md#aria-details)
- [aria-label](OpenmrsDatePickerProps.md#aria-label)
- [aria-labelledby](OpenmrsDatePickerProps.md#aria-labelledby)
- [autoFocus](OpenmrsDatePickerProps.md#autofocus)
- [children](OpenmrsDatePickerProps.md#children)
- [className](OpenmrsDatePickerProps.md#classname)
- [defaultOpen](OpenmrsDatePickerProps.md#defaultopen)
- [defaultValue](OpenmrsDatePickerProps.md#defaultvalue)
- [granularity](OpenmrsDatePickerProps.md#granularity)
- [hideTimeZone](OpenmrsDatePickerProps.md#hidetimezone)
- [hourCycle](OpenmrsDatePickerProps.md#hourcycle)
- [id](OpenmrsDatePickerProps.md#id)
- [invalid](OpenmrsDatePickerProps.md#invalid)
- [invalidText](OpenmrsDatePickerProps.md#invalidtext)
- [isDisabled](OpenmrsDatePickerProps.md#isdisabled)
- [isInvalid](OpenmrsDatePickerProps.md#isinvalid)
- [isOpen](OpenmrsDatePickerProps.md#isopen)
- [isReadOnly](OpenmrsDatePickerProps.md#isreadonly)
- [isRequired](OpenmrsDatePickerProps.md#isrequired)
- [label](OpenmrsDatePickerProps.md#label)
- [labelText](OpenmrsDatePickerProps.md#labeltext)
- [light](OpenmrsDatePickerProps.md#light)
- [maxDate](OpenmrsDatePickerProps.md#maxdate)
- [maxValue](OpenmrsDatePickerProps.md#maxvalue)
- [minDate](OpenmrsDatePickerProps.md#mindate)
- [minValue](OpenmrsDatePickerProps.md#minvalue)
- [name](OpenmrsDatePickerProps.md#name)
- [pageBehavior](OpenmrsDatePickerProps.md#pagebehavior)
- [placeholderValue](OpenmrsDatePickerProps.md#placeholdervalue)
- [short](OpenmrsDatePickerProps.md#short)
- [shouldCloseOnSelect](OpenmrsDatePickerProps.md#shouldcloseonselect)
- [shouldForceLeadingZeros](OpenmrsDatePickerProps.md#shouldforceleadingzeros)
- [size](OpenmrsDatePickerProps.md#size)
- [slot](OpenmrsDatePickerProps.md#slot)
- [style](OpenmrsDatePickerProps.md#style)
- [validationBehavior](OpenmrsDatePickerProps.md#validationbehavior)
- [value](OpenmrsDatePickerProps.md#value)

### Methods

- [isDateUnavailable](OpenmrsDatePickerProps.md#isdateunavailable)
- [onBlur](OpenmrsDatePickerProps.md#onblur)
- [onChange](OpenmrsDatePickerProps.md#onchange)
- [onChangeRaw](OpenmrsDatePickerProps.md#onchangeraw)
- [onFocus](OpenmrsDatePickerProps.md#onfocus)
- [onFocusChange](OpenmrsDatePickerProps.md#onfocuschange)
- [onKeyDown](OpenmrsDatePickerProps.md#onkeydown)
- [onKeyUp](OpenmrsDatePickerProps.md#onkeyup)
- [onOpenChange](OpenmrsDatePickerProps.md#onopenchange)
- [validate](OpenmrsDatePickerProps.md#validate)

## Properties

### aria-describedby

• `Optional` **aria-describedby**: `string`

Identifies the element (or elements) that describes the object.

#### Inherited from

Omit.aria-describedby

#### Defined in

node_modules/@react-types/shared/src/dom.d.ts:40

___

### aria-details

• `Optional` **aria-details**: `string`

Identifies the element (or elements) that provide a detailed, extended description for the object.

#### Inherited from

Omit.aria-details

#### Defined in

node_modules/@react-types/shared/src/dom.d.ts:45

___

### aria-label

• `Optional` **aria-label**: `string`

Defines a string value that labels the current element.

#### Inherited from

Omit.aria-label

#### Defined in

node_modules/@react-types/shared/src/dom.d.ts:30

___

### aria-labelledby

• `Optional` **aria-labelledby**: `string`

Identifies the element (or elements) that labels the current element.

#### Inherited from

Omit.aria-labelledby

#### Defined in

node_modules/@react-types/shared/src/dom.d.ts:35

___

### autoFocus

• `Optional` **autoFocus**: `boolean`

Whether the element should receive focus on render.

#### Inherited from

Omit.autoFocus

#### Defined in

node_modules/@react-types/shared/src/events.d.ts:116

___

### children

• `Optional` **children**: `ReactNode` \| (`values`: `DatePickerRenderProps` & { `defaultChildren`: `ReactNode`  }) => `ReactNode`

The children of the component. A function may be provided to alter the children based on component state.

#### Inherited from

Omit.children

#### Defined in

node_modules/react-aria-components/dist/types.d.ts:54

___

### className

• `Optional` **className**: `Argument`

Any CSS classes to add to the outer div of the date picker

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/index.tsx:82](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/index.tsx#L82)

___

### defaultOpen

• `Optional` **defaultOpen**: `boolean`

Whether the overlay is open by default (uncontrolled).

#### Inherited from

Omit.defaultOpen

#### Defined in

node_modules/@react-types/overlays/src/index.d.ts:112

___

### defaultValue

• `Optional` **defaultValue**: [`DateInputValue`](../API.md#dateinputvalue)

The default value (uncontrolled)

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/index.tsx:84](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/index.tsx#L84)

___

### granularity

• `Optional` **granularity**: `Granularity`

Determines the smallest unit that is displayed in the date picker. By default, this is `"day"` for dates, and `"minute"` for times.

#### Inherited from

Omit.granularity

#### Defined in

node_modules/@react-types/datepicker/src/index.d.ts:52

___

### hideTimeZone

• `Optional` **hideTimeZone**: `boolean`

Whether to hide the time zone abbreviation.

**`default`** false

#### Inherited from

Omit.hideTimeZone

#### Defined in

node_modules/@react-types/datepicker/src/index.d.ts:57

___

### hourCycle

• `Optional` **hourCycle**: ``12`` \| ``24``

Whether to display the time in 12 or 24 hour format. By default, this is determined by the user's locale.

#### Inherited from

Omit.hourCycle

#### Defined in

node_modules/@react-types/datepicker/src/index.d.ts:50

___

### id

• `Optional` **id**: `string`

The element's unique identifier. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id).

#### Inherited from

Omit.id

#### Defined in

node_modules/@react-types/shared/src/dom.d.ts:62

___

### invalid

• `Optional` **invalid**: `boolean`

Whether the input value is invalid.

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/index.tsx:86](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/index.tsx#L86)

___

### invalidText

• `Optional` **invalidText**: `string`

Text to show if the input is invalid e.g. an error message

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/index.tsx:88](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/index.tsx#L88)

___

### isDisabled

• `Optional` **isDisabled**: `boolean`

Whether the input is disabled.

#### Inherited from

Omit.isDisabled

#### Defined in

node_modules/@react-types/shared/src/inputs.d.ts:60

___

### isInvalid

• `Optional` **isInvalid**: `boolean`

Whether the input value is invalid.

#### Inherited from

Omit.isInvalid

#### Defined in

node_modules/@react-types/shared/src/inputs.d.ts:25

___

### isOpen

• `Optional` **isOpen**: `boolean`

Whether the overlay is open by default (controlled).

#### Inherited from

Omit.isOpen

#### Defined in

node_modules/@react-types/overlays/src/index.d.ts:110

___

### isReadOnly

• `Optional` **isReadOnly**: `boolean`

Whether the input can be selected but not changed by the user.

#### Inherited from

Omit.isReadOnly

#### Defined in

node_modules/@react-types/shared/src/inputs.d.ts:62

___

### isRequired

• `Optional` **isRequired**: `boolean`

Whether user input is required on the input before form submission.

#### Inherited from

Omit.isRequired

#### Defined in

node_modules/@react-types/shared/src/inputs.d.ts:23

___

### label

• `Optional` **label**: `string` \| `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\>

The label for this DatePicker element

**`deprecated`** Use labelText instead

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/index.tsx:93](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/index.tsx#L93)

___

### labelText

• `Optional` **labelText**: `string` \| `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\>

The label for this DatePicker element.

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/index.tsx:95](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/index.tsx#L95)

___

### light

• `Optional` **light**: `boolean`

'true' to use the light version.

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/index.tsx:97](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/index.tsx#L97)

___

### maxDate

• `Optional` **maxDate**: [`DateInputValue`](../API.md#dateinputvalue)

The latest date it is possible to select

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/index.tsx:99](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/index.tsx#L99)

___

### maxValue

• `Optional` **maxValue**: `DateValue`

The maximum allowed date that a user may select.

#### Inherited from

Omit.maxValue

#### Defined in

node_modules/@react-types/datepicker/src/index.d.ts:44

___

### minDate

• `Optional` **minDate**: [`DateInputValue`](../API.md#dateinputvalue)

The earliest date it is possible to select

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/index.tsx:101](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/index.tsx#L101)

___

### minValue

• `Optional` **minValue**: `DateValue`

The minimum allowed date that a user may select.

#### Inherited from

Omit.minValue

#### Defined in

node_modules/@react-types/datepicker/src/index.d.ts:42

___

### name

• `Optional` **name**: `string`

The name of the input element, used when submitting an HTML form. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).

#### Inherited from

Omit.name

#### Defined in

node_modules/@react-types/shared/src/dom.d.ts:130

___

### pageBehavior

• `Optional` **pageBehavior**: `PageBehavior`

Controls the behavior of paging. Pagination either works by advancing the visible page by visibleDuration (default) or one unit of visibleDuration.

**`default`** visible

#### Inherited from

Omit.pageBehavior

#### Defined in

node_modules/@react-types/datepicker/src/index.d.ts:74

___

### placeholderValue

• `Optional` **placeholderValue**: `CalendarDate`

A placeholder date that influences the format of the placeholder shown when no value is selected. Defaults to today's date at midnight.

#### Inherited from

Omit.placeholderValue

#### Defined in

node_modules/@react-types/datepicker/src/index.d.ts:48

___

### short

• `Optional` **short**: `boolean`

'true' to use the short version.

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/index.tsx:109](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/index.tsx#L109)

___

### shouldCloseOnSelect

• `Optional` **shouldCloseOnSelect**: `boolean` \| () => `boolean`

Determines whether the date picker popover should close automatically when a date is selected.

**`default`** true

#### Inherited from

Omit.shouldCloseOnSelect

#### Defined in

node_modules/@react-stately/datepicker/dist/types.d.ts:12

___

### shouldForceLeadingZeros

• `Optional` **shouldForceLeadingZeros**: `boolean`

Whether to always show leading zeros in the month, day, and hour fields.
By default, this is determined by the user's locale.

#### Inherited from

Omit.shouldForceLeadingZeros

#### Defined in

node_modules/@react-types/datepicker/src/index.d.ts:62

___

### size

• `Optional` **size**: ``"sm"`` \| ``"md"`` \| ``"lg"``

Specifies the size of the input. Currently supports either `sm`, `md`, or `lg` as an option

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/index.tsx:107](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/index.tsx#L107)

___

### slot

• `Optional` **slot**: ``null`` \| `string`

A slot name for the component. Slots allow the component to receive props from a parent component.
An explicit `null` value indicates that the local props completely override all props received from a parent.

#### Inherited from

Omit.slot

#### Defined in

node_modules/react-aria-components/dist/types.d.ts:71

___

### style

• `Optional` **style**: `CSSProperties` \| (`values`: `DatePickerRenderProps` & { `defaultStyle`: `CSSProperties`  }) => `CSSProperties`

The inline [style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) for the element. A function may be provided to compute the style based on component state.

#### Inherited from

Omit.style

#### Defined in

node_modules/react-aria-components/dist/types.d.ts:48

___

### validationBehavior

• `Optional` **validationBehavior**: ``"native"`` \| ``"aria"``

Whether to use native HTML form validation to prevent form submission
when the value is missing or invalid, or mark the field as required
or invalid via ARIA.

**`default`** 'native'

#### Inherited from

Omit.validationBehavior

#### Defined in

node_modules/react-aria-components/dist/types.d.ts:82

___

### value

• `Optional` **value**: [`DateInputValue`](../API.md#dateinputvalue)

The value (controlled)

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/index.tsx:111](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/index.tsx#L111)

## Methods

### isDateUnavailable

▸ `Optional` **isDateUnavailable**(`date`): `boolean`

Callback that is called for each date of the calendar. If it returns true, then the date is unavailable.

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | `DateValue` |

#### Returns

`boolean`

#### Inherited from

Omit.isDateUnavailable

#### Defined in

node_modules/@react-types/datepicker/src/index.d.ts:46

___

### onBlur

▸ `Optional` **onBlur**(`e`): `void`

Handler that is called when the element loses focus.

#### Parameters

| Name | Type |
| :------ | :------ |
| `e` | `FocusEvent`<`Target`, `Element`\> |

#### Returns

`void`

#### Inherited from

Omit.onBlur

#### Defined in

node_modules/@react-types/shared/src/events.d.ts:81

___

### onChange

▸ `Optional` **onChange**(`value`): `void`

Handler that is called when the value changes.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `undefined` \| ``null`` \| `Date` |

#### Returns

`void`

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/index.tsx:103](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/index.tsx#L103)

___

### onChangeRaw

▸ `Optional` **onChangeRaw**(`value`): `void`

Handler that is called when the value changes. Note that this provides types from @internationalized/date.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | ``null`` \| `DateValue` |

#### Returns

`void`

#### Defined in

[packages/framework/esm-styleguide/src/datepicker/index.tsx:105](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/index.tsx#L105)

___

### onFocus

▸ `Optional` **onFocus**(`e`): `void`

Handler that is called when the element receives focus.

#### Parameters

| Name | Type |
| :------ | :------ |
| `e` | `FocusEvent`<`Target`, `Element`\> |

#### Returns

`void`

#### Inherited from

Omit.onFocus

#### Defined in

node_modules/@react-types/shared/src/events.d.ts:79

___

### onFocusChange

▸ `Optional` **onFocusChange**(`isFocused`): `void`

Handler that is called when the element's focus status changes.

#### Parameters

| Name | Type |
| :------ | :------ |
| `isFocused` | `boolean` |

#### Returns

`void`

#### Inherited from

Omit.onFocusChange

#### Defined in

node_modules/@react-types/shared/src/events.d.ts:83

___

### onKeyDown

▸ `Optional` **onKeyDown**(`e`): `void`

Handler that is called when a key is pressed.

#### Parameters

| Name | Type |
| :------ | :------ |
| `e` | `KeyboardEvent` |

#### Returns

`void`

#### Inherited from

Omit.onKeyDown

#### Defined in

node_modules/@react-types/shared/src/events.d.ts:72

___

### onKeyUp

▸ `Optional` **onKeyUp**(`e`): `void`

Handler that is called when a key is released.

#### Parameters

| Name | Type |
| :------ | :------ |
| `e` | `KeyboardEvent` |

#### Returns

`void`

#### Inherited from

Omit.onKeyUp

#### Defined in

node_modules/@react-types/shared/src/events.d.ts:74

___

### onOpenChange

▸ `Optional` **onOpenChange**(`isOpen`): `void`

Handler that is called when the overlay's open state changes.

#### Parameters

| Name | Type |
| :------ | :------ |
| `isOpen` | `boolean` |

#### Returns

`void`

#### Inherited from

Omit.onOpenChange

#### Defined in

node_modules/@react-types/overlays/src/index.d.ts:114

___

### validate

▸ `Optional` **validate**(`value`): `undefined` \| ``null`` \| ``true`` \| `ValidationError`

A function that returns an error message if a given value is invalid.
Validation errors are displayed to the user when the form is submitted
if `validationBehavior="native"`. For realtime validation, use the `isInvalid`
prop instead.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` |

#### Returns

`undefined` \| ``null`` \| ``true`` \| `ValidationError`

#### Inherited from

Omit.validate

#### Defined in

node_modules/@react-types/shared/src/inputs.d.ts:41
