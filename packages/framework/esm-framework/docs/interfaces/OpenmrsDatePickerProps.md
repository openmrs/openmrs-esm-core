[O3 Framework](../API.md) / OpenmrsDatePickerProps

# Interface: OpenmrsDatePickerProps

Defined in: [packages/framework/esm-styleguide/src/datepicker/openmrs-date-picker.component.tsx:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/openmrs-date-picker.component.tsx#L20)

Properties for the OpenmrsDatePicker

## Extends

- `Omit`\<`DatePickerProps`\<`CalendarDate`\>, `"className"` \| `"onChange"` \| `"defaultValue"` \| `"value"`\>
- `DatePickerBaseProps`

## Properties

### aria-describedby?

> `optional` **aria-describedby?**: `string`

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:51

Identifies the element (or elements) that describes the object.

#### Inherited from

`Omit.aria-describedby`

***

### aria-details?

> `optional` **aria-details?**: `string`

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:57

Identifies the element (or elements) that provide a detailed, extended description for the
object.

#### Inherited from

`Omit.aria-details`

***

### aria-label?

> `optional` **aria-label?**: `string`

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:41

Defines a string value that labels the current element.

#### Inherited from

`Omit.aria-label`

***

### aria-labelledby?

> `optional` **aria-labelledby?**: `string`

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:46

Identifies the element (or elements) that labels the current element.

#### Inherited from

`Omit.aria-labelledby`

***

### autoComplete?

> `optional` **autoComplete?**: `string`

Defined in: node\_modules/react-aria/dist/types/src/datepicker/useDatePicker.d.ts:11

Describes the type of autocomplete functionality the input should provide if any. See
[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefautocomplete).

#### Inherited from

`Omit.autoComplete`

***

### autoFocus?

> `optional` **autoFocus?**: `boolean`

Defined in: node\_modules/@react-types/shared/src/events.d.ts:144

Whether the element should receive focus on render.

#### Inherited from

`Omit.autoFocus`

***

### children?

> `optional` **children?**: `ChildrenOrFunction`\<`DatePickerRenderProps`\>

Defined in: node\_modules/react-aria-components/dist/types/src/utils.d.ts:142

The children of the component. A function may be provided to alter the children based on
component state.

#### Inherited from

`Omit.children`

***

### className?

> `optional` **className?**: `Argument`

Defined in: [packages/framework/esm-styleguide/src/datepicker/types.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/types.ts#L14)

Any CSS classes to add to the outer div of the date picker

#### Inherited from

`DatePickerBaseProps.className`

***

### defaultOpen?

> `optional` **defaultOpen?**: `boolean`

Defined in: node\_modules/react-stately/dist/types/src/overlays/useOverlayTriggerState.d.ts:5

Whether the overlay is open by default (uncontrolled).

#### Inherited from

`Omit.defaultOpen`

***

### defaultValue?

> `optional` **defaultValue?**: `DateInputValue`

Defined in: [packages/framework/esm-styleguide/src/datepicker/openmrs-date-picker.component.tsx:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/openmrs-date-picker.component.tsx#L25)

The default value (uncontrolled)

***

### dir?

> `optional` **dir?**: `string`

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:299

#### Inherited from

`Omit.dir`

***

### firstDayOfWeek?

> `optional` **firstDayOfWeek?**: `"sun"` \| `"mon"` \| `"tue"` \| `"wed"` \| `"thu"` \| `"fri"` \| `"sat"`

Defined in: node\_modules/react-stately/dist/types/src/datepicker/types.d.ts:61

The day that starts the week.

#### Inherited from

`Omit.firstDayOfWeek`

***

### form?

> `optional` **form?**: `string`

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:160

The `<form>` element to associate the input with.
The value of this attribute must be the id of a `<form>` in the same document.
See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#form).

#### Inherited from

`Omit.form`

***

### granularity?

> `optional` **granularity?**: `Granularity`

Defined in: node\_modules/react-stately/dist/types/src/datepicker/types.d.ts:35

Determines the smallest unit that is displayed in the date picker. By default, this is `"day"`
for dates, and `"minute"` for times.

#### Inherited from

`Omit.granularity`

***

### hidden?

> `optional` **hidden?**: `boolean`

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:301

#### Inherited from

`Omit.hidden`

***

### hideTimeZone?

> `optional` **hideTimeZone?**: `boolean`

Defined in: node\_modules/react-stately/dist/types/src/datepicker/types.d.ts:41

Whether to hide the time zone abbreviation.

#### Default

```ts
false
```

#### Inherited from

`Omit.hideTimeZone`

***

### hourCycle?

> `optional` **hourCycle?**: `12` \| `24`

Defined in: node\_modules/react-stately/dist/types/src/datepicker/types.d.ts:30

Whether to display the time in 12 or 24 hour format. By default, this is determined by the
user's locale.

#### Inherited from

`Omit.hourCycle`

***

### id?

> `optional` **id?**: `string`

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:75

The element's unique identifier. See
[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id).

#### Inherited from

`Omit.id`

***

### inert?

> `optional` **inert?**: `boolean`

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:302

#### Inherited from

`Omit.inert`

***

### invalid?

> `optional` **invalid?**: `boolean`

Defined in: [packages/framework/esm-styleguide/src/datepicker/types.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/types.ts#L16)

Whether the input value is invalid.

#### Inherited from

`DatePickerBaseProps.invalid`

***

### invalidText?

> `optional` **invalidText?**: `string`

Defined in: [packages/framework/esm-styleguide/src/datepicker/types.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/types.ts#L18)

Text to show if the input is invalid e.g. an error message

#### Inherited from

`DatePickerBaseProps.invalidText`

***

### isDateUnavailable?

> `optional` **isDateUnavailable?**: (`date`) => `boolean`

Defined in: node\_modules/react-stately/dist/types/src/datepicker/types.d.ts:20

Callback that is called for each date of the calendar. If it returns true, then the date is
unavailable.

#### Parameters

##### date

`DateValue`

#### Returns

`boolean`

#### Inherited from

`Omit.isDateUnavailable`

***

### isDisabled?

> `optional` **isDisabled?**: `boolean`

Defined in: node\_modules/@react-types/shared/src/inputs.d.ts:64

Whether the input is disabled.

#### Inherited from

`Omit.isDisabled`

***

### isInvalid?

> `optional` **isInvalid?**: `boolean`

Defined in: node\_modules/@react-types/shared/src/inputs.d.ts:25

Whether the input value is invalid.

#### Inherited from

`Omit.isInvalid`

***

### isOpen?

> `optional` **isOpen?**: `boolean`

Defined in: node\_modules/react-stately/dist/types/src/overlays/useOverlayTriggerState.d.ts:3

Whether the overlay is open by default (controlled).

#### Inherited from

`Omit.isOpen`

***

### isReadOnly?

> `optional` **isReadOnly?**: `boolean`

Defined in: node\_modules/@react-types/shared/src/inputs.d.ts:66

Whether the input can be selected but not changed by the user.

#### Inherited from

`Omit.isReadOnly`

***

### isRequired?

> `optional` **isRequired?**: `boolean`

Defined in: node\_modules/@react-types/shared/src/inputs.d.ts:23

Whether user input is required on the input before form submission.

#### Inherited from

`Omit.isRequired`

***

### ~~label?~~

> `optional` **label?**: `string` \| `ReactElement`\<`any`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [packages/framework/esm-styleguide/src/datepicker/types.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/types.ts#L23)

The label for this DatePicker element

#### Deprecated

Use labelText instead

#### Inherited from

`DatePickerBaseProps.label`

***

### labelText?

> `optional` **labelText?**: `string` \| `ReactElement`\<`any`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [packages/framework/esm-styleguide/src/datepicker/types.ts:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/types.ts#L25)

The label for this DatePicker element.

#### Inherited from

`DatePickerBaseProps.labelText`

***

### lang?

> `optional` **lang?**: `string`

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:300

#### Inherited from

`Omit.lang`

***

### light?

> `optional` **light?**: `boolean`

Defined in: [packages/framework/esm-styleguide/src/datepicker/types.ts:27](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/types.ts#L27)

'true' to use the light version.

#### Inherited from

`DatePickerBaseProps.light`

***

### maxDate?

> `optional` **maxDate?**: `DateInputValue`

Defined in: [packages/framework/esm-styleguide/src/datepicker/types.ts:29](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/types.ts#L29)

The latest date it is possible to select

#### Inherited from

`DatePickerBaseProps.maxDate`

***

### maxValue?

> `optional` **maxValue?**: `DateValue` \| `null`

Defined in: node\_modules/react-stately/dist/types/src/datepicker/types.d.ts:15

The maximum allowed date that a user may select.

#### Inherited from

`Omit.maxValue`

***

### minDate?

> `optional` **minDate?**: `DateInputValue`

Defined in: [packages/framework/esm-styleguide/src/datepicker/types.ts:31](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/types.ts#L31)

The earliest date it is possible to select. Defaults to January 1, 1793 when omitted.

#### Inherited from

`DatePickerBaseProps.minDate`

***

### minValue?

> `optional` **minValue?**: `DateValue` \| `null`

Defined in: node\_modules/react-stately/dist/types/src/datepicker/types.d.ts:13

The minimum allowed date that a user may select.

#### Inherited from

`Omit.minValue`

***

### name?

> `optional` **name?**: `string`

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:154

The name of the input element, used when submitting an HTML form. See
[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).

#### Inherited from

`Omit.name`

***

### onAnimationEnd?

> `optional` **onAnimationEnd?**: `AnimationEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:388

#### Inherited from

`Omit.onAnimationEnd`

***

### onAnimationEndCapture?

> `optional` **onAnimationEndCapture?**: `AnimationEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:389

#### Inherited from

`Omit.onAnimationEndCapture`

***

### onAnimationIteration?

> `optional` **onAnimationIteration?**: `AnimationEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:390

#### Inherited from

`Omit.onAnimationIteration`

***

### onAnimationIterationCapture?

> `optional` **onAnimationIterationCapture?**: `AnimationEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:391

#### Inherited from

`Omit.onAnimationIterationCapture`

***

### onAnimationStart?

> `optional` **onAnimationStart?**: `AnimationEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:386

#### Inherited from

`Omit.onAnimationStart`

***

### onAnimationStartCapture?

> `optional` **onAnimationStartCapture?**: `AnimationEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:387

#### Inherited from

`Omit.onAnimationStartCapture`

***

### onAuxClick?

> `optional` **onAuxClick?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:328

#### Inherited from

`Omit.onAuxClick`

***

### onAuxClickCapture?

> `optional` **onAuxClickCapture?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:329

#### Inherited from

`Omit.onAuxClickCapture`

***

### onBlur?

> `optional` **onBlur?**: (`e`) => `void`

Defined in: node\_modules/@react-types/shared/src/events.d.ts:103

Handler that is called when the element loses focus.

#### Parameters

##### e

`FocusEvent`\<`Element`\>

#### Returns

`void`

#### Inherited from

`Omit.onBlur`

***

### onChange?

> `optional` **onChange?**: (`value`) => `void`

Defined in: [packages/framework/esm-styleguide/src/datepicker/openmrs-date-picker.component.tsx:27](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/openmrs-date-picker.component.tsx#L27)

Handler that is called when the value changes.

#### Parameters

##### value

`Date` \| `null` \| `undefined`

#### Returns

`void`

***

### onChangeRaw?

> `optional` **onChangeRaw?**: (`value`) => `void`

Defined in: [packages/framework/esm-styleguide/src/datepicker/openmrs-date-picker.component.tsx:29](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/openmrs-date-picker.component.tsx#L29)

Handler that is called when the value changes. Note that this provides types from @internationalized/date.

#### Parameters

##### value

`DateValue` \| `null`

#### Returns

`void`

***

### onClick?

> `optional` **onClick?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:326

#### Inherited from

`Omit.onClick`

***

### onClickCapture?

> `optional` **onClickCapture?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:327

#### Inherited from

`Omit.onClickCapture`

***

### onContextMenu?

> `optional` **onContextMenu?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:330

#### Inherited from

`Omit.onContextMenu`

***

### onContextMenuCapture?

> `optional` **onContextMenuCapture?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:331

#### Inherited from

`Omit.onContextMenuCapture`

***

### onDoubleClick?

> `optional` **onDoubleClick?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:332

#### Inherited from

`Omit.onDoubleClick`

***

### onDoubleClickCapture?

> `optional` **onDoubleClickCapture?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:333

#### Inherited from

`Omit.onDoubleClickCapture`

***

### onFocus?

> `optional` **onFocus?**: (`e`) => `void`

Defined in: node\_modules/@react-types/shared/src/events.d.ts:101

Handler that is called when the element receives focus.

#### Parameters

##### e

`FocusEvent`\<`Element`\>

#### Returns

`void`

#### Inherited from

`Omit.onFocus`

***

### onFocusChange?

> `optional` **onFocusChange?**: (`isFocused`) => `void`

Defined in: node\_modules/@react-types/shared/src/events.d.ts:105

Handler that is called when the element's focus status changes.

#### Parameters

##### isFocused

`boolean`

#### Returns

`void`

#### Inherited from

`Omit.onFocusChange`

***

### onGotPointerCapture?

> `optional` **onGotPointerCapture?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:372

#### Inherited from

`Omit.onGotPointerCapture`

***

### onGotPointerCaptureCapture?

> `optional` **onGotPointerCaptureCapture?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:373

#### Inherited from

`Omit.onGotPointerCaptureCapture`

***

### onKeyDown?

> `optional` **onKeyDown?**: (`e`) => `void`

Defined in: node\_modules/@react-types/shared/src/events.d.ts:94

Handler that is called when a key is pressed.

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void`

#### Inherited from

`Omit.onKeyDown`

***

### onKeyUp?

> `optional` **onKeyUp?**: (`e`) => `void`

Defined in: node\_modules/@react-types/shared/src/events.d.ts:96

Handler that is called when a key is released.

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void`

#### Inherited from

`Omit.onKeyUp`

***

### onLostPointerCapture?

> `optional` **onLostPointerCapture?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:374

#### Inherited from

`Omit.onLostPointerCapture`

***

### onLostPointerCaptureCapture?

> `optional` **onLostPointerCaptureCapture?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:375

#### Inherited from

`Omit.onLostPointerCaptureCapture`

***

### onMouseDown?

> `optional` **onMouseDown?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:334

#### Inherited from

`Omit.onMouseDown`

***

### onMouseDownCapture?

> `optional` **onMouseDownCapture?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:335

#### Inherited from

`Omit.onMouseDownCapture`

***

### onMouseEnter?

> `optional` **onMouseEnter?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:336

#### Inherited from

`Omit.onMouseEnter`

***

### onMouseLeave?

> `optional` **onMouseLeave?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:337

#### Inherited from

`Omit.onMouseLeave`

***

### onMouseMove?

> `optional` **onMouseMove?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:338

#### Inherited from

`Omit.onMouseMove`

***

### onMouseMoveCapture?

> `optional` **onMouseMoveCapture?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:339

#### Inherited from

`Omit.onMouseMoveCapture`

***

### onMouseOut?

> `optional` **onMouseOut?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:340

#### Inherited from

`Omit.onMouseOut`

***

### onMouseOutCapture?

> `optional` **onMouseOutCapture?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:341

#### Inherited from

`Omit.onMouseOutCapture`

***

### onMouseOver?

> `optional` **onMouseOver?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:342

#### Inherited from

`Omit.onMouseOver`

***

### onMouseOverCapture?

> `optional` **onMouseOverCapture?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:343

#### Inherited from

`Omit.onMouseOverCapture`

***

### onMouseUp?

> `optional` **onMouseUp?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:344

#### Inherited from

`Omit.onMouseUp`

***

### onMouseUpCapture?

> `optional` **onMouseUpCapture?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:345

#### Inherited from

`Omit.onMouseUpCapture`

***

### onOpenChange?

> `optional` **onOpenChange?**: (`isOpen`) => `void`

Defined in: node\_modules/react-stately/dist/types/src/overlays/useOverlayTriggerState.d.ts:7

Handler that is called when the overlay's open state changes.

#### Parameters

##### isOpen

`boolean`

#### Returns

`void`

#### Inherited from

`Omit.onOpenChange`

***

### onPointerCancel?

> `optional` **onPointerCancel?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:364

#### Inherited from

`Omit.onPointerCancel`

***

### onPointerCancelCapture?

> `optional` **onPointerCancelCapture?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:365

#### Inherited from

`Omit.onPointerCancelCapture`

***

### onPointerDown?

> `optional` **onPointerDown?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:358

#### Inherited from

`Omit.onPointerDown`

***

### onPointerDownCapture?

> `optional` **onPointerDownCapture?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:359

#### Inherited from

`Omit.onPointerDownCapture`

***

### onPointerEnter?

> `optional` **onPointerEnter?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:366

#### Inherited from

`Omit.onPointerEnter`

***

### onPointerLeave?

> `optional` **onPointerLeave?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:367

#### Inherited from

`Omit.onPointerLeave`

***

### onPointerMove?

> `optional` **onPointerMove?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:360

#### Inherited from

`Omit.onPointerMove`

***

### onPointerMoveCapture?

> `optional` **onPointerMoveCapture?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:361

#### Inherited from

`Omit.onPointerMoveCapture`

***

### onPointerOut?

> `optional` **onPointerOut?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:370

#### Inherited from

`Omit.onPointerOut`

***

### onPointerOutCapture?

> `optional` **onPointerOutCapture?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:371

#### Inherited from

`Omit.onPointerOutCapture`

***

### onPointerOver?

> `optional` **onPointerOver?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:368

#### Inherited from

`Omit.onPointerOver`

***

### onPointerOverCapture?

> `optional` **onPointerOverCapture?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:369

#### Inherited from

`Omit.onPointerOverCapture`

***

### onPointerUp?

> `optional` **onPointerUp?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:362

#### Inherited from

`Omit.onPointerUp`

***

### onPointerUpCapture?

> `optional` **onPointerUpCapture?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:363

#### Inherited from

`Omit.onPointerUpCapture`

***

### onScroll?

> `optional` **onScroll?**: `UIEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:378

#### Inherited from

`Omit.onScroll`

***

### onScrollCapture?

> `optional` **onScrollCapture?**: `UIEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:379

#### Inherited from

`Omit.onScrollCapture`

***

### onTouchCancel?

> `optional` **onTouchCancel?**: `TouchEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:348

#### Inherited from

`Omit.onTouchCancel`

***

### onTouchCancelCapture?

> `optional` **onTouchCancelCapture?**: `TouchEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:349

#### Inherited from

`Omit.onTouchCancelCapture`

***

### onTouchEnd?

> `optional` **onTouchEnd?**: `TouchEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:350

#### Inherited from

`Omit.onTouchEnd`

***

### onTouchEndCapture?

> `optional` **onTouchEndCapture?**: `TouchEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:351

#### Inherited from

`Omit.onTouchEndCapture`

***

### onTouchMove?

> `optional` **onTouchMove?**: `TouchEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:352

#### Inherited from

`Omit.onTouchMove`

***

### onTouchMoveCapture?

> `optional` **onTouchMoveCapture?**: `TouchEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:353

#### Inherited from

`Omit.onTouchMoveCapture`

***

### onTouchStart?

> `optional` **onTouchStart?**: `TouchEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:354

#### Inherited from

`Omit.onTouchStart`

***

### onTouchStartCapture?

> `optional` **onTouchStartCapture?**: `TouchEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:355

#### Inherited from

`Omit.onTouchStartCapture`

***

### onTransitionCancel?

> `optional` **onTransitionCancel?**: `TransitionEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:394

#### Inherited from

`Omit.onTransitionCancel`

***

### onTransitionCancelCapture?

> `optional` **onTransitionCancelCapture?**: `TransitionEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:395

#### Inherited from

`Omit.onTransitionCancelCapture`

***

### onTransitionEnd?

> `optional` **onTransitionEnd?**: `TransitionEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:396

#### Inherited from

`Omit.onTransitionEnd`

***

### onTransitionEndCapture?

> `optional` **onTransitionEndCapture?**: `TransitionEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:397

#### Inherited from

`Omit.onTransitionEndCapture`

***

### onTransitionRun?

> `optional` **onTransitionRun?**: `TransitionEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:398

#### Inherited from

`Omit.onTransitionRun`

***

### onTransitionRunCapture?

> `optional` **onTransitionRunCapture?**: `TransitionEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:399

#### Inherited from

`Omit.onTransitionRunCapture`

***

### onTransitionStart?

> `optional` **onTransitionStart?**: `TransitionEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:400

#### Inherited from

`Omit.onTransitionStart`

***

### onTransitionStartCapture?

> `optional` **onTransitionStartCapture?**: `TransitionEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:401

#### Inherited from

`Omit.onTransitionStartCapture`

***

### onWheel?

> `optional` **onWheel?**: `WheelEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:382

#### Inherited from

`Omit.onWheel`

***

### onWheelCapture?

> `optional` **onWheelCapture?**: `WheelEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:383

#### Inherited from

`Omit.onWheelCapture`

***

### pageBehavior?

> `optional` **pageBehavior?**: `PageBehavior`

Defined in: node\_modules/react-stately/dist/types/src/datepicker/types.d.ts:57

Controls the behavior of paging. Pagination either works by advancing the visible page by
visibleDuration (default) or one unit of visibleDuration.

#### Default

```ts
visible
```

#### Inherited from

`Omit.pageBehavior`

***

### placeholderValue?

> `optional` **placeholderValue?**: `CalendarDate` \| `null`

Defined in: node\_modules/react-stately/dist/types/src/datepicker/types.d.ts:25

A placeholder date that influences the format of the placeholder shown when no value is
selected. Defaults to today's date at midnight.

#### Inherited from

`Omit.placeholderValue`

***

### render?

> `optional` **render?**: `DOMRenderFunction`\<`"div"`, `DatePickerRenderProps`\>

Defined in: node\_modules/react-aria-components/dist/types/src/utils.d.ts:208

Overrides the default DOM element with a custom render function.
This allows rendering existing components with built-in styles and behaviors
such as router links, animation libraries, and pre-styled components.

Requirements:

- You must render the expected element type (e.g. if `<button>` is expected, you cannot render an
  `<a>`).
- Only a single root DOM element can be rendered (no fragments).
- You must pass through props and ref to the underlying DOM element, merging with your own prop
  as appropriate.

#### Inherited from

`Omit.render`

***

### short?

> `optional` **short?**: `boolean`

Defined in: [packages/framework/esm-styleguide/src/datepicker/openmrs-date-picker.component.tsx:33](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/openmrs-date-picker.component.tsx#L33)

'true' to use the short version.

***

### shouldCloseOnSelect?

> `optional` **shouldCloseOnSelect?**: `boolean` \| (() => `boolean`)

Defined in: node\_modules/react-stately/dist/types/src/datepicker/useDatePickerState.d.ts:13

Determines whether the date picker popover should close automatically when a date is selected.

#### Default

```ts
true
```

#### Inherited from

`Omit.shouldCloseOnSelect`

***

### shouldForceLeadingZeros?

> `optional` **shouldForceLeadingZeros?**: `boolean`

Defined in: node\_modules/react-stately/dist/types/src/datepicker/types.d.ts:46

Whether to always show leading zeros in the month, day, and hour fields.
By default, this is determined by the user's locale.

#### Inherited from

`Omit.shouldForceLeadingZeros`

***

### size?

> `optional` **size?**: `"sm"` \| `"md"` \| `"lg"`

Defined in: [packages/framework/esm-styleguide/src/datepicker/openmrs-date-picker.component.tsx:31](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/openmrs-date-picker.component.tsx#L31)

Specifies the size of the input. Currently supports either `sm`, `md`, or `lg` as an option

***

### slot?

> `optional` **slot?**: `string` \| `null`

Defined in: node\_modules/react-aria-components/dist/types/src/utils.d.ts:172

A slot name for the component. Slots allow the component to receive props from a parent
component. An explicit `null` value indicates that the local props completely override all
props received from a parent.

#### Inherited from

`Omit.slot`

***

### style?

> `optional` **style?**: `StyleOrFunction`\<`DatePickerRenderProps`\>

Defined in: node\_modules/react-aria-components/dist/types/src/utils.d.ts:132

The inline [style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) for the
element. A function may be provided to compute the style based on component state.

#### Inherited from

`Omit.style`

***

### suppressHydrationWarning?

> `optional` **suppressHydrationWarning?**: `boolean`

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:309

A React-only flag that suppresses the warning React normally logs when an element's
server-rendered content doesn't match the client render during hydration. See [React
docs](https://react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors).

#### Inherited from

`Omit.suppressHydrationWarning`

***

### translate?

> `optional` **translate?**: `"yes"` \| `"no"`

Defined in: node\_modules/@react-types/shared/src/dom.d.ts:303

#### Inherited from

`Omit.translate`

***

### validate?

> `optional` **validate?**: (`value`) => `true` \| `ValidationError` \| `null` \| `undefined`

Defined in: node\_modules/@react-types/shared/src/inputs.d.ts:42

A function that returns an error message if a given value is invalid.
Validation errors are displayed to the user when the form is submitted
if `validationBehavior="native"`. For realtime validation, use the `isInvalid`
prop instead.

#### Parameters

##### value

`CalendarDate`

#### Returns

`true` \| `ValidationError` \| `null` \| `undefined`

#### Inherited from

`Omit.validate`

***

### validationBehavior?

> `optional` **validationBehavior?**: `"native"` \| `"aria"`

Defined in: node\_modules/react-aria-components/dist/types/src/utils.d.ts:191

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

> `optional` **value?**: `DateInputValue`

Defined in: [packages/framework/esm-styleguide/src/datepicker/openmrs-date-picker.component.tsx:35](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-styleguide/src/datepicker/openmrs-date-picker.component.tsx#L35)

The value (controlled)
