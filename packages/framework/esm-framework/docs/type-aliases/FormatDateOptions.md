[O3 Framework](../API.md) / FormatDateOptions

# Type Alias: FormatDateOptions

> **FormatDateOptions** = `object`

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:198](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L198)

## Properties

### calendar?

> `optional` **calendar**: `string`

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:202](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L202)

The calendar to use when formatting this date.

***

### day

> **day**: `boolean`

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:218](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L218)

Whether to include the day number

***

### locale?

> `optional` **locale**: `string`

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:206](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L206)

The locale to use when formatting this date

***

### mode

> **mode**: [`FormatDateMode`](FormatDateMode.md)

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:211](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L211)

- `standard`: "03 Feb 2022"
- `wide`:     "03 — Feb — 2022"

***

### month

> **month**: `boolean`

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:220](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L220)

Whether to include the month number

***

### noToday

> **noToday**: `boolean`

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:231](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L231)

Disables the special handling of dates that are today. If false
(the default), then dates that are today will be formatted as "Today"
in the locale language. If true, then dates that are today will be
formatted the same as all other dates.

***

### numberingSystem?

> `optional` **numberingSystem**: `string`

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:224](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L224)

The unicode numbering system to use

***

### time

> **time**: `true` \| `false` \| `"for today"`

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:216](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L216)

Whether the time should be included in the output always (`true`),
never (`false`), or only when the input date is today (`for today`).

***

### year

> **year**: `boolean`

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:222](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L222)

Whether to include the year
