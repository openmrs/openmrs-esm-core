[O3 Framework](../API.md) / FormatDateOptions

# Type Alias: FormatDateOptions

> **FormatDateOptions** = `object`

Defined in: packages/framework/esm-utils/dist/dates/date-util.d.ts:51

## Properties

### calendar?

> `optional` **calendar**: `string`

Defined in: packages/framework/esm-utils/dist/dates/date-util.d.ts:55

The calendar to use when formatting this date.

***

### day

> **day**: `boolean`

Defined in: packages/framework/esm-utils/dist/dates/date-util.d.ts:71

Whether to include the day number

***

### locale?

> `optional` **locale**: `string`

Defined in: packages/framework/esm-utils/dist/dates/date-util.d.ts:59

The locale to use when formatting this date

***

### mode

> **mode**: [`FormatDateMode`](FormatDateMode.md)

Defined in: packages/framework/esm-utils/dist/dates/date-util.d.ts:64

- `standard`: "03 Feb 2022"
- `wide`:     "03 — Feb — 2022"

***

### month

> **month**: `boolean`

Defined in: packages/framework/esm-utils/dist/dates/date-util.d.ts:73

Whether to include the month number

***

### noToday

> **noToday**: `boolean`

Defined in: packages/framework/esm-utils/dist/dates/date-util.d.ts:84

Disables the special handling of dates that are today. If false
(the default), then dates that are today will be formatted as "Today"
in the locale language. If true, then dates that are today will be
formatted the same as all other dates.

***

### numberingSystem?

> `optional` **numberingSystem**: `string`

Defined in: packages/framework/esm-utils/dist/dates/date-util.d.ts:77

The unicode numbering system to use

***

### time

> **time**: `true` \| `false` \| `"for today"`

Defined in: packages/framework/esm-utils/dist/dates/date-util.d.ts:69

Whether the time should be included in the output always (`true`),
never (`false`), or only when the input date is today (`for today`).

***

### year

> **year**: `boolean`

Defined in: packages/framework/esm-utils/dist/dates/date-util.d.ts:75

Whether to include the year
