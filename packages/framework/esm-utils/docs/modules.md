[@openmrs/esm-utils](API.md) / Exports

# @openmrs/esm-utils

## Table of contents

### Type aliases

- [DateInput](modules.md#dateinput)

### Functions

- [age](modules.md#age)
- [daysIntoYear](modules.md#daysintoyear)
- [isOmrsDateStrict](modules.md#isomrsdatestrict)
- [isOmrsDateToday](modules.md#isomrsdatetoday)
- [isSameDay](modules.md#issameday)
- [isVersionSatisfied](modules.md#isversionsatisfied)
- [toDateObjectStrict](modules.md#todateobjectstrict)
- [toOmrsDateFormat](modules.md#toomrsdateformat)
- [toOmrsDayDateFormat](modules.md#toomrsdaydateformat)
- [toOmrsIsoString](modules.md#toomrsisostring)
- [toOmrsTimeString](modules.md#toomrstimestring)
- [toOmrsTimeString24](modules.md#toomrstimestring24)
- [toOmrsYearlessDateFormat](modules.md#toomrsyearlessdateformat)
- [translateFrom](modules.md#translatefrom)

## Type aliases

### DateInput

Ƭ **DateInput**: `string` \| `number` \| `Date`

#### Defined in

[omrs-dates.ts:8](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L8)

## Functions

### age

▸ **age**(`dateString`): `string`

Gets a human readable age represention of the provided date string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dateString` | `string` | The stringified date. |

#### Returns

`string`

A human-readable string version of the age.

#### Defined in

[age-helpers.tsx:37](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/age-helpers.tsx#L37)

___

### daysIntoYear

▸ **daysIntoYear**(`date`): `number`

Gets the number of days in the year of the given date.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `date` | `Date` | The date to compute the days within the year. |

#### Returns

`number`

The number of days.

#### Defined in

[age-helpers.tsx:6](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/age-helpers.tsx#L6)

___

### isOmrsDateStrict

▸ **isOmrsDateStrict**(`omrsPayloadString`): `boolean`

This function is STRICT on checking whether a date string is the openmrs format.
The format should be YYYY-MM-DDTHH:mm:ss.SSSZZ

#### Parameters

| Name | Type |
| :------ | :------ |
| `omrsPayloadString` | `string` |

#### Returns

`boolean`

#### Defined in

[omrs-dates.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L16)

___

### isOmrsDateToday

▸ **isOmrsDateToday**(`date`): `boolean`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `date` | [DateInput](modules.md#dateinput) | Checks if the provided date is today. |

#### Returns

`boolean`

#### Defined in

[omrs-dates.ts:53](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L53)

___

### isSameDay

▸ **isSameDay**(`firstDate`, `secondDate`): `boolean`

Checks if two dates are representing the same day.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `firstDate` | `Date` | The first date. |
| `secondDate` | `Date` | The second date. |

#### Returns

`boolean`

True if both are located on the same day.

#### Defined in

[age-helpers.tsx:23](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/age-helpers.tsx#L23)

___

### isVersionSatisfied

▸ **isVersionSatisfied**(`requiredVersion`, `installedVersion`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `requiredVersion` | `string` |
| `installedVersion` | `string` |

#### Returns

`boolean`

#### Defined in

[version.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/version.ts#L3)

___

### toDateObjectStrict

▸ **toDateObjectStrict**(`omrsDateString`): `Date` \| ``null``

Converts the object to a date object if it is a valid ISO date time string.

#### Parameters

| Name | Type |
| :------ | :------ |
| `omrsDateString` | `string` |

#### Returns

`Date` \| ``null``

#### Defined in

[omrs-dates.ts:60](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L60)

___

### toOmrsDateFormat

▸ **toOmrsDateFormat**(`date`, `format?`): `string`

Formats the input as a date string. By default the format "YYYY-MMM-DD" is used.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `date` | [DateInput](modules.md#dateinput) | `undefined` |
| `format` | `string` | "YYYY-MMM-DD" |

#### Returns

`string`

#### Defined in

[omrs-dates.ts:112](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L112)

___

### toOmrsDayDateFormat

▸ **toOmrsDayDateFormat**(`date`): `string`

Formats the input as a date string using the format "DD - MMM - YYYY".

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | [DateInput](modules.md#dateinput) |

#### Returns

`string`

#### Defined in

[omrs-dates.ts:98](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L98)

___

### toOmrsIsoString

▸ **toOmrsIsoString**(`date`, `toUTC?`): `string`

Formats the input as a date time string using the format "YYYY-MM-DDTHH:mm:ss.SSSZZ".

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `date` | [DateInput](modules.md#dateinput) | `undefined` |
| `toUTC` | `boolean` | false |

#### Returns

`string`

#### Defined in

[omrs-dates.ts:71](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L71)

___

### toOmrsTimeString

▸ **toOmrsTimeString**(`date`): `string`

Formats the input as a time string using the format "HH:mm A".

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | [DateInput](modules.md#dateinput) |

#### Returns

`string`

#### Defined in

[omrs-dates.ts:91](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L91)

___

### toOmrsTimeString24

▸ **toOmrsTimeString24**(`date`): `string`

Formats the input as a time string using the format "HH:mm".

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | [DateInput](modules.md#dateinput) |

#### Returns

`string`

#### Defined in

[omrs-dates.ts:84](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L84)

___

### toOmrsYearlessDateFormat

▸ **toOmrsYearlessDateFormat**(`date`): `string`

Formats the input as a date string using the format "DD-MMM".

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | [DateInput](modules.md#dateinput) |

#### Returns

`string`

#### Defined in

[omrs-dates.ts:105](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/omrs-dates.ts#L105)

___

### translateFrom

▸ **translateFrom**(`moduleName`, `key`, `fallback?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | `string` |
| `key` | `string` |
| `fallback?` | `string` |

#### Returns

`string`

#### Defined in

[translate.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-utils/src/translate.ts#L3)
