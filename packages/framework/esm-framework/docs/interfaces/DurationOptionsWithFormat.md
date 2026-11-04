[O3 Framework](../API.md) / DurationOptionsWithFormat

# Interface: DurationOptionsWithFormat

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:534](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L534)

## Extends

- [`DurationOptions`](DurationOptions.md)

## Properties

### formatOptions?

> `optional` **formatOptions**: `Partial`\<`ResolvedDurationFormatOptions`\>

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:536](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L536)

Options passed to Intl.DurationFormat. Defaults to { style: 'short', localeMatcher: 'lookup' }.

***

### largestUnit?

> `optional` **largestUnit**: `"auto"` \| [`DurationUnit`](../type-aliases/DurationUnit.md)

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:529](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L529)

Coarsest unit to include. Accepts 'auto' (default when smallestUnit is set),
which resolves to the largest non-zero unit or smallestUnit, whichever is greater.
Mirrors Temporal.Duration.round() behavior.

#### Inherited from

[`DurationOptions`](DurationOptions.md).[`largestUnit`](DurationOptions.md#largestunit)

***

### smallestUnit?

> `optional` **smallestUnit**: [`DurationUnit`](../type-aliases/DurationUnit.md)

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:531](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L531)

Finest unit to include. Defaults to largestUnit when largestUnit is an explicit unit, giving a single-unit result.

#### Inherited from

[`DurationOptions`](DurationOptions.md).[`smallestUnit`](DurationOptions.md#smallestunit)

***

### thresholds?

> `optional` **thresholds**: `Partial`\<`Record`\<[`DurationUnit`](../type-aliases/DurationUnit.md), `number`\>\>

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:523](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L523)

Override auto-selection thresholds. Each value is in the unit's own terms (e.g., seconds: 30 means "use seconds if < 30 seconds").

#### Inherited from

[`DurationOptions`](DurationOptions.md).[`thresholds`](DurationOptions.md#thresholds)
