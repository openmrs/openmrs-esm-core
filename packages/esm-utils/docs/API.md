[Back to README.md](../README.md)

# @openmrs/esm-utils

## Table of contents

### Type aliases

- [DateInput](API.md#dateinput)

### Functions

- [age](API.md#age)
- [daysIntoYear](API.md#daysintoyear)
- [isOmrsDateStrict](API.md#isomrsdatestrict)
- [isOmrsDateToday](API.md#isomrsdatetoday)
- [isSameDay](API.md#issameday)
- [toDateObjectStrict](API.md#todateobjectstrict)
- [toOmrsDateFormat](API.md#toomrsdateformat)
- [toOmrsDayDateFormat](API.md#toomrsdaydateformat)
- [toOmrsIsoString](API.md#toomrsisostring)
- [toOmrsTimeString](API.md#toomrstimestring)
- [toOmrsTimeString24](API.md#toomrstimestring24)
- [toOmrsYearlessDateFormat](API.md#toomrsyearlessdateformat)
- [translateFrom](API.md#translatefrom)

## Type aliases

### DateInput

Ƭ **DateInput**: *string* \| *number* \| Date

Defined in: [omrs-dates.ts:8](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-utils/src/omrs-dates.ts#L8)

## Functions

### age

▸ **age**(`dateString`: *string*): *string*

Gets a human readable age represention of the provided date string.

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `dateString` | *string* | The stringified date. |

**Returns:** *string*

A human-readable string version of the age.

Defined in: [age-helpers.tsx:37](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-utils/src/age-helpers.tsx#L37)

___

### daysIntoYear

▸ **daysIntoYear**(`date`: Date): *number*

Gets the number of days in the year of the given date.

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `date` | Date | The date to compute the days within the year. |

**Returns:** *number*

The number of days.

Defined in: [age-helpers.tsx:6](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-utils/src/age-helpers.tsx#L6)

___

### isOmrsDateStrict

▸ **isOmrsDateStrict**(`omrsPayloadString`: *string*): *boolean*

This function is STRICT on checking whether a date string is the openmrs format.
The format should be YYYY-MM-DDTHH:mm:ss.SSSZZ

#### Parameters:

| Name | Type |
| :------ | :------ |
| `omrsPayloadString` | *string* |

**Returns:** *boolean*

Defined in: [omrs-dates.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-utils/src/omrs-dates.ts#L16)

___

### isOmrsDateToday

▸ **isOmrsDateToday**(`date`: [*DateInput*](API.md#dateinput)): *boolean*

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `date` | [*DateInput*](API.md#dateinput) | Checks if the provided date is today. |

**Returns:** *boolean*

Defined in: [omrs-dates.ts:53](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-utils/src/omrs-dates.ts#L53)

___

### isSameDay

▸ **isSameDay**(`firstDate`: Date, `secondDate`: Date): *boolean*

Checks if two dates are representing the same day.

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `firstDate` | Date | The first date. |
| `secondDate` | Date | The second date. |

**Returns:** *boolean*

True if both are located on the same day.

Defined in: [age-helpers.tsx:23](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-utils/src/age-helpers.tsx#L23)

___

### toDateObjectStrict

▸ **toDateObjectStrict**(`omrsDateString`: *string*): Date \| ``null``

Converts the object to a date object if it is a valid ISO date time string.

#### Parameters:

| Name | Type |
| :------ | :------ |
| `omrsDateString` | *string* |

**Returns:** Date \| ``null``

Defined in: [omrs-dates.ts:60](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-utils/src/omrs-dates.ts#L60)

___

### toOmrsDateFormat

▸ **toOmrsDateFormat**(`date`: [*DateInput*](API.md#dateinput), `format?`: *string*): *string*

Formats the input as a date string. By default the format "YYYY-MMM-DD" is used.

#### Parameters:

| Name | Type | Default value |
| :------ | :------ | :------ |
| `date` | [*DateInput*](API.md#dateinput) | - |
| `format` | *string* | "YYYY-MMM-DD" |

**Returns:** *string*

Defined in: [omrs-dates.ts:112](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-utils/src/omrs-dates.ts#L112)

___

### toOmrsDayDateFormat

▸ **toOmrsDayDateFormat**(`date`: [*DateInput*](API.md#dateinput)): *string*

Formats the input as a date string using the format "DD - MMM - YYYY".

#### Parameters:

| Name | Type |
| :------ | :------ |
| `date` | [*DateInput*](API.md#dateinput) |

**Returns:** *string*

Defined in: [omrs-dates.ts:98](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-utils/src/omrs-dates.ts#L98)

___

### toOmrsIsoString

▸ **toOmrsIsoString**(`date`: [*DateInput*](API.md#dateinput), `toUTC?`: *boolean*): *string*

Formats the input as a date time string using the format "YYYY-MM-DDTHH:mm:ss.SSSZZ".

#### Parameters:

| Name | Type | Default value |
| :------ | :------ | :------ |
| `date` | [*DateInput*](API.md#dateinput) | - |
| `toUTC` | *boolean* | false |

**Returns:** *string*

Defined in: [omrs-dates.ts:71](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-utils/src/omrs-dates.ts#L71)

___

### toOmrsTimeString

▸ **toOmrsTimeString**(`date`: [*DateInput*](API.md#dateinput)): *string*

Formats the input as a time string using the format "HH:mm A".

#### Parameters:

| Name | Type |
| :------ | :------ |
| `date` | [*DateInput*](API.md#dateinput) |

**Returns:** *string*

Defined in: [omrs-dates.ts:91](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-utils/src/omrs-dates.ts#L91)

___

### toOmrsTimeString24

▸ **toOmrsTimeString24**(`date`: [*DateInput*](API.md#dateinput)): *string*

Formats the input as a time string using the format "HH:mm".

#### Parameters:

| Name | Type |
| :------ | :------ |
| `date` | [*DateInput*](API.md#dateinput) |

**Returns:** *string*

Defined in: [omrs-dates.ts:84](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-utils/src/omrs-dates.ts#L84)

___

### toOmrsYearlessDateFormat

▸ **toOmrsYearlessDateFormat**(`date`: [*DateInput*](API.md#dateinput)): *string*

Formats the input as a date string using the format "DD-MMM".

#### Parameters:

| Name | Type |
| :------ | :------ |
| `date` | [*DateInput*](API.md#dateinput) |

**Returns:** *string*

Defined in: [omrs-dates.ts:105](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-utils/src/omrs-dates.ts#L105)

___

### translateFrom

▸ **translateFrom**(`moduleName`: *string*, `key`: *string*, `fallback?`: *string*): *string*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `moduleName` | *string* |
| `key` | *string* |
| `fallback?` | *string* |

**Returns:** *string*

Defined in: [translate.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-utils/src/translate.ts#L3)
