[Back to README.md](../README.md)

# @openmrs/esm-config

## Table of contents

### Enumerations

- [Type](enums/Type.md)

### Interfaces

- [Config](interfaces/Config.md)
- [ConfigObject](interfaces/ConfigObject.md)
- [ConfigSchema](interfaces/ConfigSchema.md)
- [ConfigStore](interfaces/ConfigStore.md)
- [ExtensionSlotConfig](interfaces/ExtensionSlotConfig.md)
- [ExtensionSlotConfigObject](interfaces/ExtensionSlotConfigObject.md)
- [ExtensionSlotConfigsStore](interfaces/ExtensionSlotConfigsStore.md)
- [ExtensionSlotConfigureValueObject](interfaces/ExtensionSlotConfigureValueObject.md)
- [ImplementerToolsConfigStore](interfaces/ImplementerToolsConfigStore.md)
- [NavigateOptions](interfaces/NavigateOptions.md)

### Type aliases

- [ConfigValue](API.md#configvalue)
- [ProvidedConfig](API.md#providedconfig)
- [Validator](API.md#validator)
- [ValidatorFunction](API.md#validatorfunction)

### Variables

- [implementerToolsConfigStore](API.md#implementertoolsconfigstore)
- [temporaryConfigStore](API.md#temporaryconfigstore)
- [validators](API.md#validators)

### Navigation Functions

- [interpolateString](API.md#interpolatestring)
- [isUrl](API.md#isurl)
- [isUrlWithTemplateParameters](API.md#isurlwithtemplateparameters)
- [navigate](API.md#navigate)

### Other Functions

- [defineConfigSchema](API.md#defineconfigschema)
- [getConfig](API.md#getconfig)
- [getConfigStore](API.md#getconfigstore)
- [getExtensionConfigStore](API.md#getextensionconfigstore)
- [getExtensionSlotsConfigStore](API.md#getextensionslotsconfigstore)
- [inRange](API.md#inrange)
- [processConfig](API.md#processconfig)
- [provide](API.md#provide)
- [validator](API.md#validator)

## Type aliases

### ConfigValue

Ƭ **ConfigValue**: `string` \| `number` \| `boolean` \| `void` \| `any`[] \| `object`

#### Defined in

[packages/framework/esm-config/src/types.ts:30](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/types.ts#L30)

___

### ProvidedConfig

Ƭ **ProvidedConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `config` | [`Config`](interfaces/Config.md) |
| `source` | `string` |

#### Defined in

[packages/framework/esm-config/src/types.ts:55](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/types.ts#L55)

___

### Validator

Ƭ **Validator**: (`value`: `any`) => `void` \| `string`

#### Type declaration

▸ (`value`): `void` \| `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

##### Returns

`void` \| `string`

#### Defined in

[packages/framework/esm-config/src/types.ts:62](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/types.ts#L62)

___

### ValidatorFunction

Ƭ **ValidatorFunction**: (`value`: `any`) => `boolean`

#### Type declaration

▸ (`value`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

##### Returns

`boolean`

#### Defined in

[packages/framework/esm-config/src/types.ts:60](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/types.ts#L60)

## Variables

### implementerToolsConfigStore

• `Const` **implementerToolsConfigStore**: `Store`<[`ImplementerToolsConfigStore`](interfaces/ImplementerToolsConfigStore.md)\>

#### Defined in

[packages/framework/esm-config/src/module-config/state.ts:182](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/state.ts#L182)

___

### temporaryConfigStore

• `Const` **temporaryConfigStore**: `Store`<`TemporaryConfigStore`\>

#### Defined in

[packages/framework/esm-config/src/module-config/state.ts:69](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/state.ts#L69)

___

### validators

• `Const` **validators**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `inRange` | (`min`: `number`, `max`: `number`) => [`Validator`](API.md#validator) |
| `isUrl` | [`Validator`](API.md#validator) |
| `isUrlWithTemplateParameters` | (`allowedTemplateParameters`: `string`[]) => [`Validator`](API.md#validator) |

#### Defined in

[packages/framework/esm-config/src/validators/validators.ts:57](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/validators/validators.ts#L57)

## Navigation Functions

### interpolateString

▸ **interpolateString**(`template`, `params`): `string`

Interpolates values of `params` into the `template` string.

Useful for additional template parameters in URLs.

Example usage:
```js
navigate({
 to: interpolateString(
   config.links.patientChart,
   { patientUuid: patient.uuid }
 )
});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `template` | `string` | With optional params wrapped in `${ }` |
| `params` | `object` | Values to interpolate into the string template |

#### Returns

`string`

#### Defined in

[packages/framework/esm-config/src/navigation/interpolate-string.ts:38](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/navigation/interpolate-string.ts#L38)

___

### isUrl

▸ `Const` **isUrl**(`value`): `string` \| `void`

Verifies that a string contains only the default URL template parameters.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`string` \| `void`

#### Defined in

[packages/framework/esm-config/src/validators/validators.ts:55](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/validators/validators.ts#L55)

___

### isUrlWithTemplateParameters

▸ `Const` **isUrlWithTemplateParameters**(`allowedTemplateParameters`): [`Validator`](API.md#validator)

Verifies that a string contains only the default URL template
parameters, plus any specified in `allowedTemplateParameters`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `allowedTemplateParameters` | `string`[] | To be added to `openmrsBase` and `openmrsSpaBase` |

#### Returns

[`Validator`](API.md#validator)

#### Defined in

[packages/framework/esm-config/src/validators/validators.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/validators/validators.ts#L23)

___

### navigate

▸ **navigate**(`__namedParameters`): `void`

Calls `location.assign` for non-SPA paths and [navigateToUrl](https://single-spa.js.org/docs/api/#navigatetourl) for SPA paths

Example usage:
```js
const config = getConfig();
const submitHandler = () => {
  navigate({ to: config.links.submitSuccess });
};
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`NavigateOptions`](interfaces/NavigateOptions.md) |

#### Returns

`void`

#### Defined in

[packages/framework/esm-config/src/navigation/navigate.ts:29](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/navigation/navigate.ts#L29)

___

## Other Functions

### defineConfigSchema

▸ **defineConfigSchema**(`moduleName`, `schema`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | `string` |
| `schema` | [`ConfigSchema`](interfaces/ConfigSchema.md) |

#### Returns

`void`

#### Defined in

[packages/framework/esm-config/src/module-config/module-config.ts:135](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/module-config.ts#L135)

___

### getConfig

▸ **getConfig**(`moduleName`): `Promise`<[`Config`](interfaces/Config.md)\>

A promise-based way to access the config as soon as it is fully loaded
from the import-map. If it is already loaded, resolves the config in its
present state.

In general you should use the Unistore-based API provided by
`getConfigStore`, which allows creating a subscription so that you always
have the latest config. If using React, just use `useConfig`.

This is a useful function if you need to get the config in the course
of the execution of a function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `moduleName` | `string` | The name of the module for which to look up the config |

#### Returns

`Promise`<[`Config`](interfaces/Config.md)\>

#### Defined in

[packages/framework/esm-config/src/module-config/module-config.ts:164](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/module-config.ts#L164)

___

### getConfigStore

▸ **getConfigStore**(`moduleName`): `Store`<[`ConfigStore`](interfaces/ConfigStore.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | `string` |

#### Returns

`Store`<[`ConfigStore`](interfaces/ConfigStore.md)\>

#### Defined in

[packages/framework/esm-config/src/module-config/state.ts:136](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/state.ts#L136)

___

### getExtensionConfigStore

▸ **getExtensionConfigStore**(`extensionSlotModuleName`, `attachedExtensionSlotName`, `extensionId`): `Store`<[`ConfigStore`](interfaces/ConfigStore.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionSlotModuleName` | `string` |
| `attachedExtensionSlotName` | `string` |
| `extensionId` | `string` |

#### Returns

`Store`<[`ConfigStore`](interfaces/ConfigStore.md)\>

#### Defined in

[packages/framework/esm-config/src/module-config/state.ts:166](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/state.ts#L166)

___

### getExtensionSlotsConfigStore

▸ **getExtensionSlotsConfigStore**(`moduleName`): `Store`<[`ExtensionSlotConfigsStore`](interfaces/ExtensionSlotConfigsStore.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | `string` |

#### Returns

`Store`<[`ExtensionSlotConfigsStore`](interfaces/ExtensionSlotConfigsStore.md)\>

#### Defined in

[packages/framework/esm-config/src/module-config/state.ts:157](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/state.ts#L157)

___

### inRange

▸ `Const` **inRange**(`min`, `max`): [`Validator`](API.md#validator)

Verifies that the value is between the provided minimum and maximum

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `min` | `number` | Minimum acceptable value |
| `max` | `number` | Maximum acceptable value |

#### Returns

[`Validator`](API.md#validator)

#### Defined in

[packages/framework/esm-config/src/validators/validators.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/validators/validators.ts#L9)

___

### processConfig

▸ **processConfig**(`schema`, `providedConfig`, `keyPathContext`): [`Config`](interfaces/Config.md)

Validate and interpolate defaults for `providedConfig` according to `schema`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `schema` | [`ConfigSchema`](interfaces/ConfigSchema.md) | a configuration schema |
| `providedConfig` | [`ConfigObject`](interfaces/ConfigObject.md) | an object of config values (without the top-level module name) |
| `keyPathContext` | `string` | a dot-deparated string which helps the user figure out where     the provided config came from |

#### Returns

[`Config`](interfaces/Config.md)

#### Defined in

[packages/framework/esm-config/src/module-config/module-config.ts:186](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/module-config.ts#L186)

___

### provide

▸ **provide**(`config`, `sourceName?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `config` | [`Config`](interfaces/Config.md) | `undefined` |
| `sourceName` | `string` | `"provided"` |

#### Returns

`void`

#### Defined in

[packages/framework/esm-config/src/module-config/module-config.ts:143](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/module-config.ts#L143)

___

### validator

▸ **validator**(`validationFunction`, `message`): [`Validator`](API.md#validator)

#### Parameters

| Name | Type |
| :------ | :------ |
| `validationFunction` | [`ValidatorFunction`](API.md#validatorfunction) |
| `message` | `string` |

#### Returns

[`Validator`](API.md#validator)

#### Defined in

[packages/framework/esm-config/src/validators/validator.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/validators/validator.ts#L3)
