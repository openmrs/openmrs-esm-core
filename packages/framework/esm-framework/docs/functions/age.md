[O3 Framework](../API.md) / age

# Function: age()

> **age**(`birthDate`, `currentDate?`): `null` \| `string`

Defined in: packages/framework/esm-utils/dist/age-helpers.d.ts:12

Gets a human readable and locale supported representation of a person's age, given their birthDate,
The representation logic follows the guideline here:
https://webarchive.nationalarchives.gov.uk/ukgwa/20160921162509mp_/http://systems.digital.nhs.uk/data/cui/uig/patben.pdf
(See Tables 7 and 8)

## Parameters

### birthDate

The birthDate. If birthDate is null, returns null.

`undefined` | `null` | `string` | `number` | `Date` | `Dayjs`

### currentDate?

Optional. If provided, calculates the age of the person at the provided currentDate (instead of now).

`null` | `string` | `number` | `Date` | `Dayjs`

## Returns

`null` \| `string`

A human-readable string version of the age.
