[O3 Framework](../API.md) / OpenmrsDateRangePickerProps

# Interface: OpenmrsDateRangePickerProps

Defined in: [packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx:32](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx#L32)

## Extends

- `Omit`\<`DateRangePickerProps`\<`CalendarDate`\>, `"className"` \| `"onChange"` \| `"defaultValue"` \| `"value"`\>

## Properties

### allowsNonContiguousRanges?

> `optional` **allowsNonContiguousRanges**: `boolean`

Defined in: node\_modules/@react-types/datepicker/src/index.d.ts:91

When combined with `isDateUnavailable`, determines whether non-contiguous ranges,
i.e. ranges containing unavailable dates, may be selected.

#### Inherited from

`Omit.allowsNonContiguousRanges`

***

### aria-describedby?

> `optional` **aria-describedby**: `string`

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:40

Identifies the element (or elements) that describes the object.

#### Inherited from

`Omit.aria-describedby`

***

### aria-details?

> `optional` **aria-details**: `string`

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:45

Identifies the element (or elements) that provide a detailed, extended description for the object.

#### Inherited from

`Omit.aria-details`

***

### aria-label?

> `optional` **aria-label**: `string`

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:30

Defines a string value that labels the current element.

#### Inherited from

`Omit.aria-label`

***

### aria-labelledby?

> `optional` **aria-labelledby**: `string`

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:35

Identifies the element (or elements) that labels the current element.

#### Inherited from

`Omit.aria-labelledby`

***

### autoFocus?

> `optional` **autoFocus**: `boolean`

Defined in: node\_modules/@react-types/shared/src/events.d.ts:128

Whether the element should receive focus on render.

#### Inherited from

`Omit.autoFocus`

***

### children?

> `optional` **children**: `ReactNode` \| (`values`) => `ReactNode`

Defined in: node\_modules/react-aria-components/dist/types.d.ts:53

The children of the component. A function may be provided to alter the children based on component state.

#### Inherited from

`Omit.children`

***

### className?

> `optional` **className**: `Argument`

Defined in: [packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx:35](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx#L35)

Any CSS classes to add to the outer div of the date picker

***

### defaultOpen?

> `optional` **defaultOpen**: `boolean`

Defined in: node\_modules/@react-types/overlays/src/index.d.ts:112

Whether the overlay is open by default (uncontrolled).

#### Inherited from

`Omit.defaultOpen`

***

### defaultValue?

> `optional` **defaultValue**: \[`DateInputValue`, `DateInputValue`\]

Defined in: [packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx:37](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx#L37)

The default value (uncontrolled)

***

### endName?

> `optional` **endName**: `string`

Defined in: node\_modules/@react-types/datepicker/src/index.d.ts:99

The name of the end date input element, used when submitting an HTML form. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).

#### Inherited from

`Omit.endName`

***

### firstDayOfWeek?

> `optional` **firstDayOfWeek**: `"sun"` \| `"mon"` \| `"tue"` \| `"wed"` \| `"thu"` \| `"fri"` \| `"sat"`

Defined in: node\_modules/@react-types/datepicker/src/index.d.ts:78

The day that starts the week.

#### Inherited from

`Omit.firstDayOfWeek`

***

### granularity?

> `optional` **granularity**: `Granularity`

Defined in: node\_modules/@react-types/datepicker/src/index.d.ts:52

Determines the smallest unit that is displayed in the date picker. By default, this is `"day"` for dates, and `"minute"` for times.

#### Inherited from

`Omit.granularity`

***

### hideTimeZone?

> `optional` **hideTimeZone**: `boolean`

Defined in: node\_modules/@react-types/datepicker/src/index.d.ts:57

Whether to hide the time zone abbreviation.

#### Default

```ts
false
```

#### Inherited from

`Omit.hideTimeZone`

***

### hourCycle?

> `optional` **hourCycle**: `12` \| `24`

Defined in: node\_modules/@react-types/datepicker/src/index.d.ts:50

Whether to display the time in 12 or 24 hour format. By default, this is determined by the user's locale.

#### Inherited from

`Omit.hourCycle`

***

### id?

> `optional` **id**: `string`

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:62

The element's unique identifier. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id).

#### Inherited from

`Omit.id`

***

### invalid?

> `optional` **invalid**: `boolean`

Defined in: [packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx:39](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx#L39)

Whether the input value is invalid.

***

### invalidText?

> `optional` **invalidText**: `string`

Defined in: [packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx:41](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx#L41)

Text to show if the input is invalid e.g. an error message

***

### isDateUnavailable()?

> `optional` **isDateUnavailable**: (`date`) => `boolean`

Defined in: node\_modules/@react-types/datepicker/src/index.d.ts:46

Callback that is called for each date of the calendar. If it returns true, then the date is unavailable.

#### Parameters

##### date

`DateValue`

#### Returns

`boolean`

#### Inherited from

`Omit.isDateUnavailable`

***

### isDisabled?

> `optional` **isDisabled**: `boolean`

Defined in: node\_modules/@react-types/shared/src/inputs.d.ts:60

Whether the input is disabled.

#### Inherited from

`Omit.isDisabled`

***

### isInvalid?

> `optional` **isInvalid**: `boolean`

Defined in: node\_modules/@react-types/shared/src/inputs.d.ts:25

Whether the input value is invalid.

#### Inherited from

`Omit.isInvalid`

***

### isOpen?

> `optional` **isOpen**: `boolean`

Defined in: node\_modules/@react-types/overlays/src/index.d.ts:110

Whether the overlay is open by default (controlled).

#### Inherited from

`Omit.isOpen`

***

### isReadOnly?

> `optional` **isReadOnly**: `boolean`

Defined in: node\_modules/@react-types/shared/src/inputs.d.ts:62

Whether the input can be selected but not changed by the user.

#### Inherited from

`Omit.isReadOnly`

***

### isRequired?

> `optional` **isRequired**: `boolean`

Defined in: node\_modules/@react-types/shared/src/inputs.d.ts:23

Whether user input is required on the input before form submission.

#### Inherited from

`Omit.isRequired`

***

### ~~label?~~

> `optional` **label**: `string` \| `ReactElement`\<`any`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx:46](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx#L46)

The label for this DatePicker element

#### Deprecated

Use labelText instead

***

### labelText?

> `optional` **labelText**: `string` \| `ReactElement`\<`any`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx:48](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx#L48)

The label for this DatePicker element.

***

### light?

> `optional` **light**: `boolean`

Defined in: [packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx:50](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx#L50)

'true' to use the light version.

***

### maxDate?

> `optional` **maxDate**: `DateInputValue`

Defined in: [packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx:52](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx#L52)

The latest date it is possible to select

***

### maxValue?

> `optional` **maxValue**: `null` \| `DateValue`

Defined in: node\_modules/@react-types/datepicker/src/index.d.ts:44

The maximum allowed date that a user may select.

#### Inherited from

`Omit.maxValue`

***

### minDate?

> `optional` **minDate**: `DateInputValue`

Defined in: [packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx:54](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx#L54)

The earliest date it is possible to select

***

### minValue?

> `optional` **minValue**: `null` \| `DateValue`

Defined in: node\_modules/@react-types/datepicker/src/index.d.ts:42

The minimum allowed date that a user may select.

#### Inherited from

`Omit.minValue`

***

### onBlur()?

> `optional` **onBlur**: (`e`) => `void`

Defined in: node\_modules/@react-types/shared/src/events.d.ts:87

Handler that is called when the element loses focus.

#### Parameters

##### e

`FocusEvent`\<`Element`\>

#### Returns

`void`

#### Inherited from

`Omit.onBlur`

***

### onChange()?

> `optional` **onChange**: (`value`) => `void`

Defined in: [packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx:56](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx#L56)

Handler that is called when the value changes.

#### Parameters

##### value

\[`undefined` \| `null` \| `Date`, `undefined` \| `null` \| `Date`\]

#### Returns

`void`

***

### onChangeRaw()?

> `optional` **onChangeRaw**: (`value`) => `void`

Defined in: [packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx:58](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx#L58)

Handler that is called when the value changes. Note that this provides types from @internationalized/date.

#### Parameters

##### value

`null` | `DateRange`

#### Returns

`void`

***

### onFocus()?

> `optional` **onFocus**: (`e`) => `void`

Defined in: node\_modules/@react-types/shared/src/events.d.ts:85

Handler that is called when the element receives focus.

#### Parameters

##### e

`FocusEvent`\<`Element`\>

#### Returns

`void`

#### Inherited from

`Omit.onFocus`

***

### onFocusChange()?

> `optional` **onFocusChange**: (`isFocused`) => `void`

Defined in: node\_modules/@react-types/shared/src/events.d.ts:89

Handler that is called when the element's focus status changes.

#### Parameters

##### isFocused

`boolean`

#### Returns

`void`

#### Inherited from

`Omit.onFocusChange`

***

### onKeyDown()?

> `optional` **onKeyDown**: (`e`) => `void`

Defined in: node\_modules/@react-types/shared/src/events.d.ts:78

Handler that is called when a key is pressed.

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void`

#### Inherited from

`Omit.onKeyDown`

***

### onKeyUp()?

> `optional` **onKeyUp**: (`e`) => `void`

Defined in: node\_modules/@react-types/shared/src/events.d.ts:80

Handler that is called when a key is released.

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void`

#### Inherited from

`Omit.onKeyUp`

***

### onOpenChange()?

> `optional` **onOpenChange**: (`isOpen`) => `void`

Defined in: node\_modules/@react-types/overlays/src/index.d.ts:114

Handler that is called when the overlay's open state changes.

#### Parameters

##### isOpen

`boolean`

#### Returns

`void`

#### Inherited from

`Omit.onOpenChange`

***

### pageBehavior?

> `optional` **pageBehavior**: `PageBehavior`

Defined in: node\_modules/@react-types/datepicker/src/index.d.ts:74

Controls the behavior of paging. Pagination either works by advancing the visible page by visibleDuration (default) or one unit of visibleDuration.

#### Default

```ts
visible
```

#### Inherited from

`Omit.pageBehavior`

***

### placeholderValue?

> `optional` **placeholderValue**: `null` \| `CalendarDate`

Defined in: node\_modules/@react-types/datepicker/src/index.d.ts:48

A placeholder date that influences the format of the placeholder shown when no value is selected. Defaults to today's date at midnight.

#### Inherited from

`Omit.placeholderValue`

***

### shouldCloseOnSelect?

> `optional` **shouldCloseOnSelect**: `boolean` \| () => `boolean`

Defined in: node\_modules/@react-stately/datepicker/dist/types.d.ts:171

Determines whether the date picker popover should close automatically when a date is selected.

#### Default

```ts
true
```

#### Inherited from

`Omit.shouldCloseOnSelect`

***

### shouldForceLeadingZeros?

> `optional` **shouldForceLeadingZeros**: `boolean`

Defined in: node\_modules/@react-types/datepicker/src/index.d.ts:62

Whether to always show leading zeros in the month, day, and hour fields.
By default, this is determined by the user's locale.

#### Inherited from

`Omit.shouldForceLeadingZeros`

***

### slot?

> `optional` **slot**: `null` \| `string`

Defined in: node\_modules/react-aria-components/dist/types.d.ts:70

A slot name for the component. Slots allow the component to receive props from a parent component.
An explicit `null` value indicates that the local props completely override all props received from a parent.

#### Inherited from

`Omit.slot`

***

### startName?

> `optional` **startName**: `string`

Defined in: node\_modules/@react-types/datepicker/src/index.d.ts:95

The name of the start date input element, used when submitting an HTML form. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).

#### Inherited from

`Omit.startName`

***

### style?

> `optional` **style**: `CSSProperties` \| (`values`) => `undefined` \| `CSSProperties`

Defined in: node\_modules/react-aria-components/dist/types.d.ts:47

The inline [style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) for the element. A function may be provided to compute the style based on component state.

#### Inherited from

`Omit.style`

***

### validate()?

> `optional` **validate**: (`value`) => `undefined` \| `null` \| `true` \| `ValidationError`

Defined in: node\_modules/@react-types/shared/src/inputs.d.ts:41

A function that returns an error message if a given value is invalid.
Validation errors are displayed to the user when the form is submitted
if `validationBehavior="native"`. For realtime validation, use the `isInvalid`
prop instead.

#### Parameters

##### value

`RangeValue`

#### Returns

`undefined` \| `null` \| `true` \| `ValidationError`

#### Inherited from

`Omit.validate`

***

### validationBehavior?

> `optional` **validationBehavior**: `"native"` \| `"aria"`

Defined in: node\_modules/react-aria-components/dist/types.d.ts:81

Whether to use native HTML form validation to prevent form submission
when the value is missing or invalid, or mark the field as required
or invalid via ARIA.

#### Default

```ts
'native'
```

#### Inherited from

`Omit.validationBehavior`

***

### value?

> `optional` **value**: \[`DateInputValue`, `DateInputValue`\]

Defined in: [packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx:60](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/date-range/date-range-picker.component.tsx#L60)

The value (controlled)
