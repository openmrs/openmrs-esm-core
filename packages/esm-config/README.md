# openmrs-esm-module-config

[![Build Status](https://travis-ci.com/openmrs/openmrs-esm-module-config.svg?branch=master)](https://travis-ci.com/openmrs/openmrs-esm-module-config)
[![npm: openmrs/esm-module-config](https://img.shields.io/npm/v/@openmrs/esm-module-config)](https://www.npmjs.com/package/@openmrs/esm-module-config)

## What is this?

This is the configuration library for
[OpenMRS Microfrontends](https://wiki.openmrs.org/display/projects/Frontend+-+SPA+and+Microfrontends).
It makes configurability easier for developers and configuring easier for
implementers.

## Contents

<!-- toc -->

- [What does an OpenMRS frontend configuration file look like?](#what-does-an-openmrs-frontend-configuration-file-look-like)
- [How do I configure my OpenMRS implementation?](#how-do-i-configure-my-openmrs-implementation)
- [I'm developing an ESM module. How do I make it configurable?](#im-developing-an-esm-module-how-do-i-make-it-configurable)
- [API](#api)
- [Contributing & Development](#contributing--development)

<!-- tocstop -->

## What does an OpenMRS frontend configuration file look like?

OpenMRS frontend configuration files are JSON files containing module names as top-level elements. All configuration elements are optional. The available configuration elements for each module should be documented in the module's wiki page.

Here's an example!

```json
{
  "@openmrs/esm-login-app": {
    "logo": {
      "src": "https://pbs.twimg.com/media/C1w_czvWgAAWONL.jpg"
    }
  },
  "@openmrs/esm-home-app": {
    "buttons": {
      "enabled": false
    }
  }
}
```

Alternatively you can provide your config file as a Javascript file.
It will look just about the same, but with some magic words at the beginning:

```js
exports = {};
exports.default = {
  "@openmrs/esm-login-app": {
    logo: {
      src: "https://pbs.twimg.com/media/C1w_czvWgAAWONL.jpg"
    }
  },
  "@openmrs/esm-home-app": {
    buttons: {
      enabled: false
    }
  }
}
```

## How do I configure my OpenMRS implementation?

There are two methods for doing so.

### The Simple Way

Upload your configuration file and add its URL to
your import map as a module named **config-file**. If you are serving your
microfrontends from your OpenMRS server, you can simply add your config
file to your server's `frontend/` directory. Your import map will then look like

```json
{
  "imports": {
    "config-file": "/openmrs/frontend/config.js[on]"
  }
}
```

### The Flexible Way *(under construction)*

*Due to [RFC-26](https://github.com/openmrs/openmrs-rfc-frontend/blob/master/text/0026-activation-distribution.md)
this method will not work as described with 
[openmrs-module-spa](https://github.com/openmrs/openmrs-module-spa)
after 
[1.0.6](https://github.com/openmrs/openmrs-rfc-frontend/blob/master/text/0026-activation-distribution.md).
Please hang tight while we work out how to support hierarchal config files
in the new architecture.*

This method requires you have an
[esm-root-config override](https://wiki.openmrs.org/display/projects/openmrs-esm-root-config).
This allows you to have multiple configuration files, which will be
merged together in an order that you specify. You add your configuration
files to your root override module, import them, and provide them to
esm-module-config. All this must happen before you register your applications.

Example code:

```js
import { provide } from "@openmrs/esm-module-config";

import pihConfig from "./pih-config.json";
import pihMexicoConfig from "./pih-mexico-config.json";

provide(pihConfig);
provide(pihMexicoConfig);
```

All provided configs will be merged, with elements provided by later calls
to provide taking priority. The import map config file, `config-file`, will
also be merged, and will take the lowest priority. In the above example,
configuration elements in `pih-mexico-config.json` will take priority over
those in `pih-config.json`.

You can break up your configuration files into hierarchies, or per module, or per groups of modules.

## I'm developing an ESM module. How do I make it configurable?

You should use this module, esm-module-config, to make your modules configurable.

Start by `npm install --save @openmrs/esm-module-config`. This is a runtime
dependency, so it should be included in your webpack `externals`.

The main task is to create a config schema for your module. The config schema
is what tells `esm-module-config` what configuration files should look like,
including defaults and validations.

### Designing a schema

You'll probably start with some idea of what you want configs for your module
to look like. Try and put yourself in the implementer's shoes an imagine what
features they will expect to be configurable, and what they might expect the
configuration property to be called. Assume they don't know anything about
the internal workings of your module.

By way of example, let's say we're building a module for a virtual provider
functionality at a very futuristic hospital. Maybe we want an implementer to
be able to write the following in their config file:

```json
"@openmrs/esm-hologram-doctor": {
  "hologram": {
    "color": true
  },
  "virtualProvider": {
    "name": {
      "given": ["Qui", "Gon"]
    }
  },
  "robots": [
    { "name": "R2-D2", "homeworld": "Naboo" },
    { "name": "BB-8", "homeworld": "Hosnian Prime" }
  ]
}
```

In the following section, we'll see how to write a config schema that supports these config elements.

### Defining a schema

We'll start with just that first nested config element from above, `hologram.color`. We must provide defaults for all of the values—in OpenMRS Microfrontends, all configuration is optional.

```js
import { defineConfigSchema, validators, validator } from "@openmrs/esm-module-config"

defineConfigSchema("@openmrs/esm-hologram-doctor", {
  hologram: {
    color: {
      default: false,
      validators: [validators.isBoolean],
      description: "Whether the cologram supports color display."
    }
  }
}
```

Note that each configuration element should have an object for a value, and
that this object must define the default for that element. Do not do this:

```js
❌ // This is wrong!
❌ defineConfigSchema("@openmrs/esm-hologram-doctor",
❌  hologram: {
❌   salutation: "Some friendly default salutation! ? this is wrong!"
❌ })
```

The following names are reserved and cannot be used as config keys:
`default`, `validators`, `description`, and `arrayElements`. Doing so
will result in undefined behavior. Do not do this:

```js
❌ // Don't do this!
❌ defineConfigSchema("@openmrs/esm-hologram-doctor",
❌  hologram: {
❌    salutation: {
❌      default: {
❌        default: "Greetings ? this is bad don't do it"
❌ }}})
```

#### Validators

You should provide validators for your configuration elements wherever possible.
This reduces the probability that implementers using your module will have
hard-to-debug runtime errors. It gives you, the module developer, the opportunity
to provide implementers with very helpful explanations about why their configuration
on't work.

```js
robot: {
  name: {
    default: "R2D2",
    validators: [
      validators.isString,
      validator(n => /\d/.test(n), "Robots must have numbers in their names")
    ]
  }
}
```

(Note that this piece of schema is not part of our above example. It only supports
a single robot, whereas we need to allow the implementer to provide an array of robots).

A validator can be created using the `validator` function, as above.

The first argument is a function that takes the config value as its only argument.
If the function returns something
[truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), validation passes.
If the function
returns something [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy),
an error is thrown with the second argument as an explanation.

You can even validate nested objects:

```js
colorPicker: {
  options: { default: ["black", "red"] }
  initial: { default: "black" },
  validators: [
    validator(o => o.options.includes(o.initial),
      "initial must be one of the options")
  ]
}
```

For convenience, some common validators are provided out of the box. See the
[API / validators](#const-validators).

#### Arrays

You can accept and validate arrays, and arrays containing objects, in your
configuration schema. This is configured with the `arrayElements` parameter. For
example, a schema which would accept an array of strings:

```js
virtualProvider: {
  name: {
    given: {
      default: ["Obi", "Wan"]
      arrayElements: {
        validators: [validators.isString]
      }
    }
  }
}
```

Here is an example of a schema that expects an array of objects structured in a particular way.

```js
robots: {
  default: [
    { name: "R2-D2", homeworld: "Naboo" },
    { name: "C-3PO", homeworld: "Tatooine" }
  ],
  arrayElements: {
    name: { validators: [robotNameValidator] },
    homeworld: {
      default: null  // not required
      validators: [validators.isString]
    }
  }
}
```

This schema will require that any objects in the robots array must only have
the keys `name` and `homeworld`.

#### Freeform objects

In unusual scenarios you might want to accept an object without
validating its keys. To do this, you can specify the config element 
like a normal non-object element.

```js
beepsPerRobot: {
  default: {
    "R2-D2": 4,
    "C-3P0": 0
  },
  validators: [  // you can (and should) still run validators
    validators.isObject,
    validator(o => Object.values(o).every(Number.isInteger),
      "robot beeps must be integers")
  ]
}
```

### Using config values

#### The generic way

The config is fetched asynchronously using `getConfig(moduleName)`. Continuing the
above example, we would have something like

```js
import { getConfig } from "@openmrs/esm-module-config"

async function doctorGreeting() {
  const config = await getConfig("@openmrs/esm-hologram-doctor")
  return "Hello, my name is Dr. " + config.virtualProvider.name.family
}
```

The content of config will be pulled from the config files, falling back to
the defaults for configuration elements for which no values have been provided.

#### React support

A React Hook is provided to hide the asynchronicity of config loading. The
`moduleName`provided to the
[openmrs react root decorator](https://github.com/openmrs/openmrs-react-root-decorator)
is used to look up the configuration elsewhere in the application.

```js
export default openmrsRootDecorator({
  featureName: "hologram doctor",
  moduleName: "@openmrs/esm-hologram-doctor"
})(Root)
```

You can then get the config tree as an object using the `useConfig` React hook.

```js
import { useConfig } from "@openmrs/esm-module-config"

export default function DoctorGreeting() {
  const config = useConfig()
  const greeting = "Hello, my name is Dr. " + config.virtualProvider.name.family
  return <div>{greeting}</div>
}
```

The content of config will be pulled from the config files, falling back to the
defaults for configuration elements for which no values have been provided.

#### Support in other frameworks (Angular, Vue, Svelte, etc.)

This hasn't been implemented yet, but we would like to implement it! See "Contributing"

# API

<!-- API -->

### Variables

* [ModuleNameContext](README.md#const-modulenamecontext)

### Navigation Functions

* [ConfigurableLink](README.md#configurablelink)
* [interpolateString](README.md#interpolatestring)
* [navigate](README.md#navigate)

### Other Functions

* [defineConfigSchema](README.md#defineconfigschema)
* [getConfig](README.md#getconfig)
* [processConfig](README.md#processconfig)
* [provide](README.md#provide)
* [useConfig](README.md#useconfig)
* [validator](README.md#validator)

### Object literals

* [validators](README.md#const-validators)

## Variables

### `Const` ModuleNameContext

• **ModuleNameContext**: *Context‹null | string›* = React.createContext<string | null>(null)

*Defined in [react-hook/react-hook.tsx:4](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/react-hook/react-hook.tsx#L4)*

## Navigation Functions

###  ConfigurableLink

▸ **ConfigurableLink**(`__namedParameters`: object): *Element‹›*

*Defined in [navigation/react-configurable-link.tsx:13](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/navigation/react-configurable-link.tsx#L13)*

A React link component which calls [navigate](README.md#navigate) when clicked

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Description |
------ | ------ | ------ |
`children` | any | Inline elements within the link |
`otherProps` | otherProps | Any other valid props for an <a> tag except `href` and `onClick` |
`to` | string | The target path or URL. Supports interpolation. See [navigate](README.md#navigate) |

**Returns:** *Element‹›*

___

###  interpolateString

▸ **interpolateString**(`template`: string, `params`: object): *string*

*Defined in [navigation/interpolate-string.ts:38](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/navigation/interpolate-string.ts#L38)*

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

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`template` | string | With optional params wrapped in `${ }` |
`params` | object | Values to interpolate into the string template |

**Returns:** *string*

___

###  navigate

▸ **navigate**(`__namedParameters`: object): *void*

*Defined in [navigation/navigate.ts:24](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/navigation/navigate.ts#L24)*

Calls `location.assign` for non-SPA paths and [navigateToUrl](https://single-spa.js.org/docs/api/#navigatetourl) for SPA paths

Example usage:
```js
const config = getConfig();
const submitHandler = () => {
  navigate({ to: config.links.submitSuccess });
};
```

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Description |
------ | ------ | ------ |
`to` | string | The target path or URL. Supports templating with 'openmrsBase' and 'openmrsSpaBase'. For example, `${openmrsSpaBase}/home` will resolve to `/openmrs/spa/home` for implementations using the standard OpenMRS and SPA base paths. |

**Returns:** *void*

___

## Other Functions

###  defineConfigSchema

▸ **defineConfigSchema**(`moduleName`: string, `schema`: ConfigSchema): *void*

*Defined in [module-config/module-config.ts:13](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/module-config/module-config.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`moduleName` | string |
`schema` | ConfigSchema |

**Returns:** *void*

___

###  getConfig

▸ **getConfig**(`moduleName`: string): *Promise‹ConfigObject›*

*Defined in [module-config/module-config.ts:22](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/module-config/module-config.ts#L22)*

**Parameters:**

Name | Type |
------ | ------ |
`moduleName` | string |

**Returns:** *Promise‹ConfigObject›*

___

###  processConfig

▸ **processConfig**(`schema`: ConfigSchema, `providedConfig`: ConfigObject, `keyPathContext`: string): *any*

*Defined in [module-config/module-config.ts:35](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/module-config/module-config.ts#L35)*

Validate and interpolate defaults for `providedConfig` according to `schema`

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`schema` | ConfigSchema | a configuration schema |
`providedConfig` | ConfigObject | an object of config values (without the top-level module name) |
`keyPathContext` | string | a dot-deparated string which helps the user figure out where     the provided config came from  |

**Returns:** *any*

___

###  provide

▸ **provide**(`config`: Config): *void*

*Defined in [module-config/module-config.ts:18](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/module-config/module-config.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`config` | Config |

**Returns:** *void*

___

###  useConfig

▸ **useConfig**(): *any*

*Defined in [react-hook/react-hook.tsx:8](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/react-hook/react-hook.tsx#L8)*

**Returns:** *any*

___

###  validator

▸ **validator**(`validationFunction`: ValidatorFunction, `message`: String): *Validator*

*Defined in [validators/validator.ts:1](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/validators/validator.ts#L1)*

**Parameters:**

Name | Type |
------ | ------ |
`validationFunction` | ValidatorFunction |
`message` | String |

**Returns:** *Validator*

## Object literals

### `Const` validators

### ▪ **validators**: *object*

*Defined in [validators/validators.ts:58](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/validators/validators.ts#L58)*

###  isBoolean

• **isBoolean**: *function*

*Defined in [validators/validators.ts:60](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/validators/validators.ts#L60)*

#### Type declaration:

▸ (`value`: any): *void | String*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

###  isNumber

• **isNumber**: *function*

*Defined in [validators/validators.ts:65](https://github.com/mddubey/openmrs-esm-module-config/blob/190bb7f/src/validators/validators.ts#L65)*

#### Type declaration:

▸ (`value`: any): *void | String*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

###  isObject

• **isObject**: *function*

*Defined in [validators/validators.ts:62](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/validators/validators.ts#L62)*

#### Type declaration:

▸ (`value`: any): *void | String*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

###  isString

• **isString**: *function*

*Defined in [validators/validators.ts:59](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/validators/validators.ts#L59)*

#### Type declaration:

▸ (`value`: any): *void | String*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

###  isUrl

• **isUrl**: *function*

*Defined in [validators/validators.ts:63](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/validators/validators.ts#L63)*

#### Type declaration:

▸ (`value`: any): *void | String*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

###  isUrlWithTemplateParameters

• **isUrlWithTemplateParameters**: *isUrlWithTemplateParameters*

*Defined in [validators/validators.ts:64](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/validators/validators.ts#L64)*

###  isUuid

• **isUuid**: *function*

*Defined in [validators/validators.ts:61](https://github.com/openmrs/openmrs-esm-module-config/blob/master/src/validators/validators.ts#L61)*

#### Type declaration:

▸ (`value`: any): *void | String*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |
<!-- ENDAPI -->

## Contributing & Development

PRs welcome! See
[OpenMRS Microfrontends RFC-20](https://github.com/openmrs/openmrs-rfc-frontend/blob/master/text/0020-contributing-guidelines.md#contributing-guidelines)
for guidelines about contributing.

[Setup local development environment for OpenMRS SPA](https://wiki.openmrs.org/display/projects/Setup+local+development+environment+for+OpenMRS+SPA).

Maintainer: Brandon Istenes (bistenes@pih.org)
