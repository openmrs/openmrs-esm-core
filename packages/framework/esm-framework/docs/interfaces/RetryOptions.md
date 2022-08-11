[@openmrs/esm-framework](../API.md) / RetryOptions

# Interface: RetryOptions

## Table of contents

### Methods

- [getDelay](RetryOptions.md#getdelay)
- [onError](RetryOptions.md#onerror)
- [shouldRetry](RetryOptions.md#shouldretry)

## Methods

### getDelay

▸ `Optional` **getDelay**(`attempt`): `number`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `attempt` | `number` |  |

#### Returns

`number`

#### Defined in

[packages/framework/esm-utils/src/retry.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/retry.ts#L18)

___

### onError

▸ `Optional` **onError**(`e`, `attempt`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `e` | `any` |  |
| `attempt` | `number` |  |

#### Returns

`void`

#### Defined in

[packages/framework/esm-utils/src/retry.ts:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/retry.ts#L25)

___

### shouldRetry

▸ `Optional` **shouldRetry**(`attempt`): `any`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `attempt` | `number` |  |

#### Returns

`any`

#### Defined in

[packages/framework/esm-utils/src/retry.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/retry.ts#L12)
