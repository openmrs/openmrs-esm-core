[Back to README.md](../README.md)

# @openmrs/esm-config

## Table of contents

### Enumerations

- [Type](enums/type.md)

### Interfaces

- [Config](interfaces/config.md)
- [ConfigObject](interfaces/configobject.md)
- [ConfigSchema](interfaces/configschema.md)
- [ConfigStore](interfaces/configstore.md)
- [ExtensionSlotConfig](interfaces/extensionslotconfig.md)
- [ExtensionSlotConfigObject](interfaces/extensionslotconfigobject.md)
- [ExtensionSlotConfigsStore](interfaces/extensionslotconfigsstore.md)
- [ExtensionSlotConfigureValueObject](interfaces/extensionslotconfigurevalueobject.md)
- [ImplementerToolsConfigStore](interfaces/implementertoolsconfigstore.md)
- [NavigateOptions](interfaces/navigateoptions.md)

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

Ƭ **ConfigValue**: *string* \| *number* \| *boolean* \| *void* \| *any*[] \| *object*

Defined in: [packages/esm-config/src/types.ts:30](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-config/src/types.ts#L30)

___

### ProvidedConfig

Ƭ **ProvidedConfig**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`config` | [*Config*](interfaces/config.md) |
`source` | *string* |

Defined in: [packages/esm-config/src/types.ts:55](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-config/src/types.ts#L55)

___

### Validator

Ƭ **Validator**: (`value`: *any*) => *void* \| *string*

#### Type declaration:

▸ (`value`: *any*): *void* \| *string*

#### Parameters:

Name | Type |
:------ | :------ |
`value` | *any* |

**Returns:** *void* \| *string*

Defined in: [packages/esm-config/src/types.ts:62](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-config/src/types.ts#L62)

___

### ValidatorFunction

Ƭ **ValidatorFunction**: (`value`: *any*) => *boolean*

#### Type declaration:

▸ (`value`: *any*): *boolean*

#### Parameters:

Name | Type |
:------ | :------ |
`value` | *any* |

**Returns:** *boolean*

Defined in: [packages/esm-config/src/types.ts:60](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-config/src/types.ts#L60)

## Variables

### implementerToolsConfigStore

• `Const` **implementerToolsConfigStore**: *Store*<[*ImplementerToolsConfigStore*](interfaces/implementertoolsconfigstore.md)\>

Defined in: [packages/esm-config/src/module-config/state.ts:188](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-config/src/module-config/state.ts#L188)

___

### temporaryConfigStore

• `Const` **temporaryConfigStore**: *Store*<TemporaryConfigStore\>

Defined in: [packages/esm-config/src/module-config/state.ts:75](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-config/src/module-config/state.ts#L75)

___

### validators

• `Const` **validators**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`inRange` | (`min`: *number*, `max`: *number*) => [*Validator*](API.md#validator) |
`isUrl` | [*Validator*](API.md#validator) |
`isUrlWithTemplateParameters` | (`allowedTemplateParameters`: *string*[]) => [*Validator*](API.md#validator) |

Defined in: [packages/esm-config/src/validators/validators.ts:57](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-config/src/validators/validators.ts#L57)

## Navigation Functions

### interpolateString

▸ **interpolateString**(`template`: *string*, `params`: *object*): *string*

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

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`template` | *string* | With optional params wrapped in `${ }`   |
`params` | *object* | Values to interpolate into the string template   |

**Returns:** *string*

Defined in: [packages/esm-config/src/navigation/interpolate-string.ts:38](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-config/src/navigation/interpolate-string.ts#L38)

___

### isUrl

▸ `Const`**isUrl**(`value`: *any*): *string* \| *void*

Verifies that a string contains only the default URL template parameters.

#### Parameters:

Name | Type |
:------ | :------ |
`value` | *any* |

**Returns:** *string* \| *void*

Defined in: [packages/esm-config/src/validators/validators.ts:55](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-config/src/validators/validators.ts#L55)

___

### isUrlWithTemplateParameters

▸ `Const`**isUrlWithTemplateParameters**(`allowedTemplateParameters`: *string*[]): [*Validator*](API.md#validator)

Verifies that a string contains only the default URL template
parameters, plus any specified in `allowedTemplateParameters`.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`allowedTemplateParameters` | *string*[] | To be added to `openmrsBase` and `openmrsSpaBase`   |

**Returns:** [*Validator*](API.md#validator)

Defined in: [packages/esm-config/src/validators/validators.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-config/src/validators/validators.ts#L23)

___

### navigate

▸ **navigate**(`__namedParameters`: [*NavigateOptions*](interfaces/navigateoptions.md)): *void*

Calls `location.assign` for non-SPA paths and [navigateToUrl](https://single-spa.js.org/docs/api/#navigatetourl) for SPA paths

Example usage:
```js
const config = getConfig();
const submitHandler = () => {
  navigate({ to: config.links.submitSuccess });
};
```

#### Parameters:

Name | Type |
:------ | :------ |
`__namedParameters` | [*NavigateOptions*](interfaces/navigateoptions.md) |

**Returns:** *void*

Defined in: [packages/esm-config/src/navigation/navigate.ts:29](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-config/src/navigation/navigate.ts#L29)

___

## Other Functions

### defineConfigSchema

▸ **defineConfigSchema**(`moduleName`: *string*, `schema`: [*ConfigSchema*](interfaces/configschema.md)): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`moduleName` | *string* |
`schema` | [*ConfigSchema*](interfaces/configschema.md) |

**Returns:** *void*

Defined in: [packages/esm-config/src/module-config/module-config.ts:216](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-config/src/module-config/module-config.ts#L216)

___

### getConfig

▸ **getConfig**(`moduleName`: *string*): *Promise*<[*Config*](interfaces/config.md)\>

A promise-based way to access the config as soon as it is fully loaded
from the import-map. If it is already loaded, resolves the config in its
present state.

In general you should use the Unistore-based API provided by
`getConfigStore`, which allows creating a subscription so that you always
have the latest config. If using React, just use `useConfig`.

This is a useful function if you need to get the config in the course
of the execution of a function.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`moduleName` | *string* | The name of the module for which to look up the config    |

**Returns:** *Promise*<[*Config*](interfaces/config.md)\>

Defined in: [packages/esm-config/src/module-config/module-config.ts:245](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-config/src/module-config/module-config.ts#L245)

___

### getConfigStore

▸ **getConfigStore**(`moduleName`: *string*): *Store*<[*ConfigStore*](interfaces/configstore.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`moduleName` | *string* |

**Returns:** *Store*<[*ConfigStore*](interfaces/configstore.md)\>

Defined in: [packages/esm-config/src/module-config/state.ts:142](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-config/src/module-config/state.ts#L142)

___

### getExtensionConfigStore

▸ **getExtensionConfigStore**(`extensionSlotModuleName`: *string*, `attachedExtensionSlotName`: *string*, `extensionId`: *string*): *Store*<[*ConfigStore*](interfaces/configstore.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`extensionSlotModuleName` | *string* |
`attachedExtensionSlotName` | *string* |
`extensionId` | *string* |

**Returns:** *Store*<[*ConfigStore*](interfaces/configstore.md)\>

Defined in: [packages/esm-config/src/module-config/state.ts:172](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-config/src/module-config/state.ts#L172)

___

### getExtensionSlotsConfigStore

▸ **getExtensionSlotsConfigStore**(`moduleName`: *string*): *Store*<[*ExtensionSlotConfigsStore*](interfaces/extensionslotconfigsstore.md)\>

#### Parameters:

Name | Type |
:------ | :------ |
`moduleName` | *string* |

**Returns:** *Store*<[*ExtensionSlotConfigsStore*](interfaces/extensionslotconfigsstore.md)\>

Defined in: [packages/esm-config/src/module-config/state.ts:163](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-config/src/module-config/state.ts#L163)

___

### inRange

▸ `Const`**inRange**(`min`: *number*, `max`: *number*): [*Validator*](API.md#validator)

Verifies that the value is between the provided minimum and maximum

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`min` | *number* | Minimum acceptable value   |
`max` | *number* | Maximum acceptable value    |

**Returns:** [*Validator*](API.md#validator)

Defined in: [packages/esm-config/src/validators/validators.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-config/src/validators/validators.ts#L9)

___

### processConfig

▸ **processConfig**(`schema`: [*ConfigSchema*](interfaces/configschema.md), `providedConfig`: [*ConfigObject*](interfaces/configobject.md), `keyPathContext`: *string*): [*Config*](interfaces/config.md)

Validate and interpolate defaults for `providedConfig` according to `schema`

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`schema` | [*ConfigSchema*](interfaces/configschema.md) | a configuration schema   |
`providedConfig` | [*ConfigObject*](interfaces/configobject.md) | an object of config values (without the top-level module name)   |
`keyPathContext` | *string* | a dot-deparated string which helps the user figure out where     the provided config came from    |

**Returns:** [*Config*](interfaces/config.md)

Defined in: [packages/esm-config/src/module-config/module-config.ts:267](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-config/src/module-config/module-config.ts#L267)

___

### provide

▸ **provide**(`config`: [*Config*](interfaces/config.md), `sourceName?`: *string*): *void*

#### Parameters:

Name | Type | Default value |
:------ | :------ | :------ |
`config` | [*Config*](interfaces/config.md) | - |
`sourceName` | *string* | "provided" |

**Returns:** *void*

Defined in: [packages/esm-config/src/module-config/module-config.ts:224](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-config/src/module-config/module-config.ts#L224)

___

### validator

▸ **validator**(`validationFunction`: [*ValidatorFunction*](API.md#validatorfunction), `message`: *string*): [*Validator*](API.md#validator)

#### Parameters:

Name | Type |
:------ | :------ |
`validationFunction` | [*ValidatorFunction*](API.md#validatorfunction) |
`message` | *string* |

**Returns:** [*Validator*](API.md#validator)

Defined in: [packages/esm-config/src/validators/validator.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-config/src/validators/validator.ts#L3)
