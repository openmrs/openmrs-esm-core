[O3 Framework](../API.md) / OpenmrsEventTypes

# Interface: OpenmrsEventTypes

Defined in: [packages/framework/esm-emr-api/src/events/types.ts:32](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/events/types.ts#L32)

This is the set of events supported by the custom event system

## Properties

### before-page-changed

> **before-page-changed**: `PageChanged`

Defined in: [packages/framework/esm-emr-api/src/events/types.ts:41](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/events/types.ts#L41)

The before-page-changed event is fired before the active page in the application changes

***

### started

> **started**: `never`

Defined in: [packages/framework/esm-emr-api/src/events/types.ts:37](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-emr-api/src/events/types.ts#L37)

The started event is fired once when the app started.
Listeners should use this as an opportunity to do any initialization required.
