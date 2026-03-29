[O3 Framework](../API.md) / DurationOptions

# Interface: DurationOptions

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:495](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L495)

## Extended by

- [`DurationOptionsWithFormat`](DurationOptionsWithFormat.md)

## Properties

### largestUnit?

> `optional` **largestUnit**: `"auto"` \| [`DurationUnit`](../type-aliases/DurationUnit.md)

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:503](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L503)

Coarsest unit to include. Accepts 'auto' (default when smallestUnit is set),
which resolves to the largest non-zero unit or smallestUnit, whichever is greater.
Mirrors Temporal.Duration.round() behavior.

***

### smallestUnit?

> `optional` **smallestUnit**: [`DurationUnit`](../type-aliases/DurationUnit.md)

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:505](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L505)

Finest unit to include. Defaults to largestUnit when largestUnit is an explicit unit, giving a single-unit result.

***

### thresholds?

> `optional` **thresholds**: `Partial`\<`Record`\<[`DurationUnit`](../type-aliases/DurationUnit.md), `number`\>\>

Defined in: [packages/framework/esm-utils/src/dates/date-util.ts:497](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/dates/date-util.ts#L497)

Override auto-selection thresholds. Each value is in the unit's own terms (e.g., seconds: 30 means "use seconds if < 30 seconds").
