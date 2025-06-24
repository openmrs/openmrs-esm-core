[O3 Framework](../API.md) / selectPreferredName

# Function: selectPreferredName()

> **selectPreferredName**(`patient`, ...`preferredNames`): `undefined` \| `HumanName`

Defined in: packages/framework/esm-utils/dist/patient-helpers.d.ts:41

Select the preferred name from the collection of names associated with a patient.

Names may be specified with a usage such as 'usual', 'official', 'nickname', 'maiden', etc.
A name with no usage specified is treated as the 'usual' name.

The chosen name will be selected according to the priority order of `preferredNames`,

## Parameters

### patient

`Patient`

The patient from whom a name will be selected.

### preferredNames

...[`NameUse`](../type-aliases/NameUse.md)[]

Optional ordered sequence of preferred name usages; defaults to 'usual' if not specified.

## Returns

`undefined` \| `HumanName`

the preferred name for the patient, or undefined if no acceptable name could be found.

## Examples

```ts
// normal use case; prefer usual name, fallback to official name
displayNameByUsage(patient, 'usual', 'official')
```

```ts
// prefer usual name over nickname, fallback to official name
displayNameByUsage(patient, 'usual', 'nickname', 'official')
```
