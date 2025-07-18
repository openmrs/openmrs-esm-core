[O3 Framework](../API.md) / useVisit

# Function: useVisit()

> **useVisit**(`patientUuid`, `representation`): [`VisitReturnType`](../interfaces/VisitReturnType.md)

Defined in: [packages/framework/esm-react-utils/src/useVisit.ts:42](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useVisit.ts#L42)

This React hook returns visit information if the patient UUID is not null. There are
potentially two relevant visits at a time: "active" and "current".

The active visit is the most recent visit without an end date. The presence of an active
visit generally means that the patient is in the facility.

The current visit is the active visit, unless a retrospective visit has been selected.
If there is no active visit and no selected retrospective visit, then there is no
current visit. If there is no active visit but there is a retrospective visit, then
the retrospective visit is the current visit. `currentVisitIsRetrospective` tells you
whether the current visit is a retrospective visit.

The active visit and current visit require two separate API calls. `error` contains
the error from either one, if there is an error. `isValidating` is true if either
API call is in progress. `mutate` refreshes the data from both API calls.

## Parameters

### patientUuid

`string`

Unique patient identifier `string`

### representation

`string` = `defaultVisitCustomRepresentation`

The custom representation of the visit

## Returns

[`VisitReturnType`](../interfaces/VisitReturnType.md)
