[O3 Framework](../API.md) / FormatDateOptions

# Type Alias: FormatDateOptions

> **FormatDateOptions** = `object`

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:172](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L172)

## Properties

### calendar?

> `optional` **calendar**: `string`

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:176](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L176)

The calendar to use when formatting this date.

***

### day

> **day**: `boolean`

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:192](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L192)

Whether to include the day number

***

### locale?

> `optional` **locale**: `string`

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:180](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L180)

The locale to use when formatting this date

***

### mode

> **mode**: [`FormatDateMode`](FormatDateMode.md)

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:185](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L185)

- `standard`: "03 Feb 2022"
- `wide`:     "03 — Feb — 2022"

***

### month

> **month**: `boolean`

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:194](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L194)

Whether to include the month number

***

### noToday

> **noToday**: `boolean`

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:205](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L205)

Disables the special handling of dates that are today. If false
(the default), then dates that are today will be formatted as "Today"
in the locale language. If true, then dates that are today will be
formatted the same as all other dates.

***

### numberingSystem?

> `optional` **numberingSystem**: `string`

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:198](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L198)

The unicode numbering system to use

***

### time

> **time**: `true` \| `false` \| `"for today"`

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:190](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L190)

Whether the time should be included in the output always (`true`),
never (`false`), or only when the input date is today (`for today`).

***

### year

> **year**: `boolean`

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:196](https://github.com/NitinKumar1-1/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L196)

Whether to include the year
